import { player } from './playerstate.js';
import { getXpForNextLevel } from './playerstate.js';

let waitingForKey = false;
let pendingCallback = null;

export function injectSetGameState(fn) {
  setGameStateFunc = fn;
}


let inAttackMenu = false;
let enemyImg = new Image();
let currentEnemy = null;
let battleText = '';
let waitingForInput = true;
let setGameStateFunc = null;
let backgroundImg = new Image();
backgroundImg.src = 'assets/battle-bg.png'; // adjust if named differently
let playerImg = new Image();
playerImg.src = 'assets/player-backsprite.png'; // Make sure this image exists



export function startBattleWithEnemy(enemy) {
  enemyImg = new Image();
  enemyImg.src = `assets/${enemy.image}`;

  currentEnemy = {
    ...enemy,
    hp: enemy.maxHp,
    energy: enemy.maxEnergy
  };

  battleText = `A wild ${currentEnemy.name} appears!`;
  waitingForInput = true;

  window.addEventListener('keydown', handleBattleInput);
  setGameStateFunc('battle');
}


function waitForKey(callback) {
  waitingForKey = true;
  pendingCallback = () => {
    waitingForKey = false;
    waitingForInput = true; // ✅ always restore input flow
    if (callback) callback();
  };
}



function checkLevelUp() {
  const xpNeeded = getXpForNextLevel(player.level);
  while (player.xp >= xpNeeded) {
    player.xp -= xpNeeded;
    player.level += 1;
    player.maxHp += 10;
    player.hp = player.maxHp;
    player.attack += 2;
    player.defense += 1;
    player.maxEnergy += 5;
    player.energy = player.maxEnergy;
    battleText = `You leveled up to Lv.${player.level}!`;
  }
}


function handleBattleInput(e) {
  if (waitingForKey) {
    waitingForKey = false;
    if (pendingCallback) {
      pendingCallback();
      pendingCallback = null;
    }
    return;
  }

  if (!waitingForInput) return;

  if (!inAttackMenu) {
    if (e.key === '1') {
      inAttackMenu = true;
    } else if (e.key === '2') {
      window.removeEventListener('keydown', handleBattleInput);
      setGameStateFunc('overworld');
    }
  } else {
    const index = parseInt(e.key) - 1;
    const move = player.moves[index];
    if (move) {
      inAttackMenu = false;
      waitingForInput = false;
      performPlayerAttack(move);
    }
  }
}


function performPlayerAttack(move) {
  if (player.energy < move.cost) {
    battleText = `Not enough energy to use ${move.name}!`;
    inAttackMenu = false;
    return;
  }

  player.energy -= move.cost;

  // Crit logic
  const isCrit = Math.random() < (player.critChance + (move.critBonus || 0));
  const baseDamage = player.attack + move.power - currentEnemy.defense;
  const dmg = Math.max(0, isCrit ? Math.floor(baseDamage * player.critMultiplier) : baseDamage);

  currentEnemy.hp -= dmg;

  battleText = `You used ${move.name}! ${isCrit ? 'Critical hit! ' : ''}It dealt ${dmg} damage!`;

  // Enemy defeated
  if (currentEnemy.hp <= 0) {
    player.xp += currentEnemy.xpReward;
    checkLevelUp();
    battleText = `${currentEnemy.name} defeated! +${currentEnemy.xpReward} XP`;

    waitForKey(() => {
      window.removeEventListener('keydown', handleBattleInput);
      setGameStateFunc('overworld');
    });

    return;
  }

  // Enemy survives
  waitForKey(() => {
    performEnemyAttack();
  });
  console.log(`Enemy HP: ${currentEnemy.hp}/${currentEnemy.maxHp}`);

}




function performEnemyAttack() {
  // Regen energy
  currentEnemy.energy = Math.min(currentEnemy.maxEnergy, currentEnemy.energy + currentEnemy.regen);
  console.log(`[Enemy Turn] ${currentEnemy.name} Energy: ${currentEnemy.energy} / ${currentEnemy.maxEnergy}`);
  // Pick a move the enemy can afford
  const availableMoves = currentEnemy.moves.filter(m => m.cost <= currentEnemy.energy);
  
  if (availableMoves.length === 0) {
    battleText = `${currentEnemy.name} is out of energy!`;
    waitForKey(() => {
      waitingForInput = true;
    });
    return;
  }

  // Pick a random usable move
  const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  currentEnemy.energy -= move.cost;

  const dmg = Math.max(0, move.power - player.defense);
  player.hp -= dmg;

  battleText = `${currentEnemy.name} used ${move.name} and dealt ${dmg} damage!`;

  if (player.hp <= 0) {
    battleText = 'You lost...';
    waitForKey(() => {
      window.removeEventListener('keydown', handleBattleInput);
      setGameStateFunc('title');
    });
  } else {
    // ✅ Regenerate energy on player's next turn
    player.energy = Math.min(player.maxEnergy, player.energy + player.regen);
    waitForKey(() => {
      waitingForInput = true;
    });
  }
console.log(`Player HP: ${player.hp}/${player.maxHp}`);

}




export function updateBattle() {
  // Nothing dynamic for now
}

export function drawBattle(ctx) {
  ctx.clearRect(0, 0, 960, 640);

  // Background
  if (backgroundImg.complete) {
    const textboxHeight = 160;
const backgroundHeight = 640 - textboxHeight;

ctx.drawImage(backgroundImg, 0, 0, 960, backgroundHeight);

  } else {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 960, 640);
  }

  // Enemy sprite
  if (enemyImg.complete) {
    ctx.drawImage(enemyImg, 580, 100, 200, 200);
  }
  // Player sprite
  if (playerImg.complete) {
    ctx.drawImage(playerImg, 40, 280, 160, 160); // Adjust coords/size as needed
  }


  // Enemy name and level
ctx.fillStyle = 'white';
ctx.font = '18px monospace';
ctx.fillText(`${currentEnemy.name}`, 580, 90); // top-right area

// Player name and level (hardcoded for now)
ctx.fillText(`XP: ${player.xp} / ${getXpForNextLevel(player.level)}`, 220, 410);

ctx.fillText(`${player.name} Lv.${player.level}`, 220, 450); // above player
ctx.font = '16px monospace';
ctx.fillText(`HP: ${Math.max(0, player.hp)} / ${player.maxHp}`, 220, 470);
ctx.fillStyle = '#00c3ff'; // blue for energy
ctx.fillText(`Energy: ${player.energy} / ${player.maxEnergy}`, 220, 430);
// Text box dimensions
const boxMargin = 20;
const boxHeight = 140;
const boxY = 640 - boxHeight - boxMargin; // canvas height = 640

ctx.fillStyle = 'rgba(184, 184, 184, 0.6)';
ctx.strokeStyle = 'white';
ctx.lineWidth = 3;

ctx.beginPath();
ctx.roundRect(boxMargin, boxY, 960 - boxMargin * 2, boxHeight, 12);
ctx.fill();
ctx.stroke();

// Text inside box
ctx.fillStyle = 'black';
ctx.font = '20px monospace';
ctx.fillText(battleText, boxMargin + 20, boxY + 40);
if (!inAttackMenu) {
  ctx.fillText('1. Attack   2. Run', 40, boxY + 100);
} else {
  player.moves.forEach((move, index) => {
  const affordable = player.energy >= move.cost;
  ctx.fillStyle = affordable ? 'white' : '#888';
  ctx.fillText(`${index + 1}. ${move.name} (${move.cost} EN)`, 40, boxY + 80 + index * 30);
});



}}
