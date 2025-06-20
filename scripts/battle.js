import { Scene } from './scene.js';
import { OverworldScene } from './overworld.js';
import { player } from './playerstate.js';
import { getXpForNextLevel } from './playerstate.js';


export class BattleScene extends Scene {
  constructor(changeSceneCallback, enemy) {
    super();
    this.changeScene = changeSceneCallback;
    this.player = player;
    this.enemy = structuredClone(enemy);

    // Bind the method once to ensure correct `this` context
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    document.body.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.width = 960;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = true;
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    document.body.appendChild(this.canvas);


    // Register input
    window.removeEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keydown", this.handleKeyDown);

    // Load images...
    this.background = new Image();
    this.background.src = 'assets/battle-bg.png';

    this.playerSprite = new Image();
    this.playerSprite.src = 'assets/player-backsprite.png';

    this.enemySprite = new Image();
    this.enemySprite.src = `assets/${this.enemy.image}`;

    requestAnimationFrame(() => this.draw());
  }

  // ⬇️⬇️⬇️ Put this OUTSIDE of start(), below the other methods ⬇️⬇️⬇️
  handleKeyDown(e) {
    if (e.key === "1") {
      console.log("⚔️ Player chose to attack");
      this.playerAttack();
    } else if (e.key === "2") {
      console.log("🏃 Player chose to run");
      this.changeScene(new OverworldScene(this.changeScene));
    }
  }

  playerAttack() {
    console.log("Player attacks!");
    // ... damage logic
  }

  enemyAttack() {
    console.log("Enemy attacks!");
    // ... damage logic
  }


draw() {
  const ctx = this.ctx;
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // Background
  if (this.background.complete) {
    ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Player back sprite
  if (this.playerSprite.complete) {
    ctx.drawImage(this.playerSprite, 120, 350, 128, 128);
  }

  // Enemy front sprite
  if (this.enemySprite.complete) {
    ctx.drawImage(this.enemySprite, 730, 180, 128, 128);
  }

  // Draw HP bars and names
this.ctx.fillStyle = 'black';
  ctx.font = '16px monospace';
  ctx.fillText(this.player.name, 80, 330);
  ctx.fillText(`${this.player.hp} / ${this.player.maxHp}`, 80, 370);
  ctx.fillText(this.enemy.name, 680, 100);
  ctx.fillText(`${this.enemy.hp} / ${this.enemy.maxHp}`, 680, 140);
  ctx.fillText(`Level: ${this.player.level}`, 100, 480);
  ctx.fillText(`XP: ${this.player.xp}`, 100, 510);



  // Draw menu box
// Draw menu box pinned to bottom
const menuBoxHeight = 120;
const menuY = this.canvas.height - menuBoxHeight;

ctx.fillStyle = 'black';
ctx.fillRect(0, menuY, this.canvas.width, menuBoxHeight);

ctx.strokeStyle = 'white';
ctx.strokeRect(0, menuY, this.canvas.width, menuBoxHeight);

// Menu options
ctx.fillStyle = 'white';
ctx.font = '28px monospace';
ctx.fillText("1. Attack    2. Run", 40, menuY + 70);


  requestAnimationFrame(() => this.draw());
}


  updateBattleText() {
  this.ctx.fillStyle = 'white';
  this.ctx.font = '16px monospace';
  this.ctx.fillText(this.player.name, 80, 330);
  this.ctx.fillText(`${this.player.hp} / ${this.player.maxHp}`, 80, 370);
  this.ctx.fillText(this.enemy.name, 680, 100);
  this.ctx.fillText(`${this.enemy.hp} / ${this.enemy.maxHp}`, 680, 140);
}


  playerAttack() {
  const damage = Math.max(0, this.player.attack - this.enemy.defense);
  this.enemy.hp -= damage;
  if (this.enemy.hp < 0) this.enemy.hp = 0;

  if (this.enemy.hp <= 0) {
  const earned = this.enemy.xpReward || 0;
  this.player.xp += earned;

  let levelUp = false;

    while (this.player.xp >= getXpForNextLevel(this.player.level)) {
      this.player.xp -= getXpForNextLevel(this.player.level);
      this.player.level++;
      levelUp = true;
      this.player.maxHp += 10;
      this.player.attack += 2;
      this.player.defense += 1;

    }

    let message = `${this.enemy.name} was defeated!\nYou gained ${earned} XP.`;
    if (levelUp) {
      message += `\n🎉 You leveled up to level ${this.player.level}!`;
    }

    alert(message);
    this.changeScene(new OverworldScene(this.changeScene));
  }
  }


  enemyAttack() {
  const damage = Math.max(0, this.enemy.attack - this.player.defense);
  this.player.hp -= damage;
  if (this.player.hp < 0) this.player.hp = 0;

  this.updateBattleText();

  if (this.player.hp <= 0) {
    alert("You were defeated...");
    this.changeScene(new OverworldScene(this.changeScene));
  }
}
}