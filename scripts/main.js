// main.js — using gameState instead of scene system

import { startOverworld, updateOverworld, drawOverworld } from './overworld.js';
import { updateBattle, drawBattle, injectSetGameState } from './battle.js';


let gameState = 'title'; // 'title' | 'overworld' | 'battle'
export function setGameState(state) {
  gameState = state;
}
let canvas, ctx;

window.onload = () => {
  injectSetGameState(setGameState);
  setupCanvas();
  setupTitleScreen();
  gameLoop();
};

function setupCanvas() {
  document.body.innerHTML = '';
  canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 640;
  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function setupTitleScreen() {
  const title = document.createElement("h2");
  title.textContent = "Press Enter to Start";
  title.style.position = "absolute";
  title.style.top = "50%";
  title.style.left = "50%";
  title.style.transform = "translate(-50%, -50%)";
  title.style.color = "white";
  title.style.fontFamily = "monospace";
  title.style.zIndex = 1000;
  document.body.appendChild(title);

  function handleStart(e) {
    if (e.key === "Enter") {
      document.removeEventListener("keydown", handleStart);
      title.remove();
      gameState = "overworld";
      startOverworld(); // init overworld state
    }
  }

  document.addEventListener("keydown", handleStart);
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (gameState === "overworld") {
    updateOverworld();
    drawOverworld(ctx);
  } else if (gameState === "battle") {
    updateBattle();
    drawBattle(ctx);
  }
}
