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

    const title = document.createElement("h2");
    title.textContent = `${this.enemy.name} appeared!`;
    document.body.appendChild(title);

    this.hpDisplay = document.createElement("div");
    this.updateBattleText();
    document.body.appendChild(this.hpDisplay);

    const btnAttack = document.createElement("button");
    btnAttack.textContent = "Attack";
    btnAttack.onclick = () => this.playerAttack();
    document.body.appendChild(btnAttack);

    const btnRun = document.createElement("button");
    btnRun.textContent = "Run";
    btnRun.onclick = () => this.changeScene(new OverworldScene(this.changeScene));
    document.body.appendChild(btnRun);
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
  }
}
