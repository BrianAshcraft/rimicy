import { Scene } from './scene.js';
import { OverworldScene } from './overworld.js';
import { player } from './playerstate.js';

export class BattleScene extends Scene {
  constructor(changeSceneCallback, enemy) {
    super();
    this.changeScene = changeSceneCallback;

    this.player = player;           // shared player state
    this.enemy = structuredClone(enemy); // fresh copy of enemy so we don't mutate global definitions
  }

  start() {
  document.body.innerHTML = '';

  this.canvas = document.createElement('canvas');
  this.canvas.width = 480;
  this.canvas.height = 320;
  this.ctx = this.canvas.getContext('2d');
  this.ctx.imageSmoothingEnabled = false;

  document.body.appendChild(this.canvas);
  window.addEventListener("keydown", this.handleKeyDown);

  // Load background and sprites
  this.background = new Image();
  this.background.src = 'assets/battle-bg.png'; // Provide this asset

  this.playerSprite = new Image();
  this.playerSprite.src = 'assets/player-backsprite.png'; // Provide this asset

  this.enemySprite = new Image();
  this.enemySprite.src = 'assets/slime.png'; // or whatever matches the enemy

  // Create a loop
  requestAnimationFrame(() => this.draw());
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
    ctx.drawImage(this.playerSprite, 50, 180, 64, 64);
  }

  // Enemy front sprite
  if (this.enemySprite.complete) {
    ctx.drawImage(this.enemySprite, 300, 60, 64, 64);
  }

  // Draw HP bars and names
  ctx.fillStyle = 'white';
  ctx.font = '16px monospace';
  ctx.fillText(this.player.name, 40, 170);
  ctx.fillText(`${this.player.hp} / ${this.player.maxHp}`, 40, 190);
  ctx.fillText(this.enemy.name, 300, 50);
  ctx.fillText(`${this.enemy.hp} / ${this.enemy.maxHp}`, 300, 70);

  // Draw menu box
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 240, this.canvas.width, 80);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(0, 240, this.canvas.width, 80);
  ctx.fillStyle = 'white';
  ctx.fillText("1. Attack    2. Run", 20, 270);

  requestAnimationFrame(() => this.draw());
}


  updateBattleText() {
    this.hpDisplay.innerHTML = `
      <p><strong>${this.player.name}</strong>: ${this.player.hp} / ${this.player.maxHp} HP</p>
      <p><strong>${this.enemy.name}</strong>: ${this.enemy.hp} / ${this.enemy.maxHp} HP</p>
    `;
  }

  playerAttack() {
    const damage = Math.max(0, this.player.attack - this.enemy.defense);
    this.enemy.hp -= damage;
    if (this.enemy.hp < 0) this.enemy.hp = 0;

    this.updateBattleText();

    if (this.enemy.hp <= 0) {
      alert(`${this.enemy.name} was defeated!`);
      this.changeScene(new OverworldScene(this.changeScene));
    } else {
      setTimeout(() => this.enemyAttack(), 500);
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
    handleKeyDown = (e) => {
  if (e.key === "1") {
    this.playerAttack();  // Perform attack
  } else if (e.key === "2") {
    this.changeScene(new OverworldScene(this.changeScene));  // Run away
  }
};

  }
}
