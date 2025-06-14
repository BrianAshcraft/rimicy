import { Scene } from './scene.js';
import { OverworldScene } from './overworld.js';

export class BattleScene extends Scene {
  constructor(changeSceneCallback) {
    super();
    this.changeScene = changeSceneCallback;
  }

  start() {
    console.log("⚔️ Entered battle scene");

    document.body.innerHTML = '';

    const battleMessage = document.createElement("h2");
    battleMessage.textContent = "A wild enemy appears!";
    document.body.appendChild(battleMessage);

    const endBtn = document.createElement("button");
    endBtn.textContent = "End Battle";
    endBtn.onclick = () => {
      this.changeScene(new OverworldScene(this.changeScene));
    };
    document.body.appendChild(endBtn);
  }
}
