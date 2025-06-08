let currentScene = null;

function changeScene(newScene) {
  currentScene = newScene;
  currentScene.start();
}

// Base structure for a scene
class Scene {
  start() {
    console.log("Scene started");
  }

  update() {
    // Runs every frame
  }
}

// Create a test scene
class TitleScene extends Scene {
  start() {
    console.log("Title screen loaded");
    const title = document.createElement("h2");
    title.textContent = "Press Enter to Start";
    document.body.appendChild(title);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        alert("Game would begin!");
      }
    });
  }
}

// Game loop
function gameLoop() {
  if (currentScene && typeof currentScene.update === "function") {
    currentScene.update();
  }
  requestAnimationFrame(gameLoop);
}

// Start the game
window.onload = () => {
  changeScene(new TitleScene());
  gameLoop();
};
