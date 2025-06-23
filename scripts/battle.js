import { player } from './playerstate.js';
export function injectSetGameState(fn) {
  setGameStateFunc = fn;
}

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

  currentEnemy = { ...enemy }; // fresh copy
  battleText = `A wild ${currentEnemy.name} appears!`;
  waitingForInput = true;

  window.addEventListener('keydown', handleBattleInput);
  setGameStateFunc('battle');
}


function handleBattleInput(e) {
  if (!waitingForInput) return;

  if (e.key === '1') {
    waitingForInput = false;
    performPlayerAttack();
  } else if (e.key === '2') {
  window.removeEventListener('keydown', handleBattleInput);
  setGameStateFunc('overworld');
  }
}

function performPlayerAttack() {
  const dmg = Math.max(0, player.attack - currentEnemy.defense);
  currentEnemy.hp -= dmg;
  battleText = `You dealt ${dmg} damage!`;

  if (currentEnemy.hp <= 0) {
    player.xp += currentEnemy.xpReward;
    battleText = `${currentEnemy.name} defeated! +${currentEnemy.xpReward} XP`;
    setTimeout(() => {
      window.removeEventListener('keydown', handleBattleInput);
      setGameStateFunc('overworld')    }, 1000);
    return;
  }

  setTimeout(() => {
    performEnemyAttack();
  }, 500);
}

function performEnemyAttack() {
  const dmg = Math.max(0, currentEnemy.attack - player.defense);
  player.hp -= dmg;
  battleText = `${currentEnemy.name} hits for ${dmg} damage!`;

  if (player.hp <= 0) {
    battleText = 'You lost...';
    setTimeout(() => {
      window.removeEventListener('keydown', handleBattleInput);
      gameState = 'title';
    }, 1000);
  } else {
    waitingForInput = true;
  }
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
ctx.fillText(`${player.name} Lv.${player.level}`, 220, 450); // above player

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
ctx.fillText('1. Attack   2. Run', boxMargin + 20, boxY + 90);

}

