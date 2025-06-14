import { OverworldScene } from './overworld.js';
import { Scene } from './scene.js';

let currentScene = null;

function changeScene(newScene) {
  currentScene = newScene;
  currentScene.start();
}

class BattleScene extends Scene {
  start() {
    console.log("⚔️ Entered battle scene");

    document.body.innerHTML = '';

    const battleMessage = document.createElement("h2");
    battleMessage.textContent = "A wild enemy appears!";
    document.body.appendChild(battleMessage);

    const endBtn = document.createElement("button");
    endBtn.textContent = "End Battle";
    endBtn.onclick = () => {
      changeScene(new OverworldScene(changeScene));
    };
    document.body.appendChild(endBtn);
  }
}

class TitleScene extends Scene {
  start() {
    console.log("Title screen loaded");
    const title = document.createElement("h2");
    title.textContent = "Press Enter to Start";
    document.body.innerHTML = '';
    document.body.appendChild(title);

    document.addEventListener("keydown", handleStart);
  }
}

function handleStart(e) {
  if (e.key === "Enter") {
    document.removeEventListener("keydown", handleStart);
    changeScene(new OverworldScene(changeScene));
  }
}

function gameLoop() {
  if (currentScene && typeof currentScene.update === "function") {
    currentScene.update();
  }
  requestAnimationFrame(gameLoop);
}

window.onload = () => {
  changeScene(new TitleScene());
  gameLoop();
};
