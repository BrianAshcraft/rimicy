import { Scene } from './scene.js';
import { BattleScene } from './battle.js';
import { enemies } from './enemies.js';


export class OverworldScene extends Scene {
constructor(changeSceneCallback) {
  super();

  this.changeScene = changeSceneCallback; // ✅ store the scene switcher

  this.tileTypes = {
    0: { name: "wall", color: "red", passable: false, image: "wall.png"},
    1: { name: "floor", color: "#444", passable: true, image: "safegrass.png" },
    2: { name: "grass", color: "green", passable: true, image: "grass.png" },
    3: { name: "water", color: "blue", passable: false }
  };



  this.tileSize = 64;
  this.screenWidth = 15;
  this.screenHeight = 10;

  this.map = null;

  this.canvas = null;
  this.ctx = null;


this.player = {
  x: 10,
  y: 10,
  size: 28,       // ✅ fits inside a 16x16 tile
  speed: 4,
  moving: false,
  moveProgress: 0,
  dx: 0,
  dy: 0
};


  this.keys = {};

  this.battling = false;
  this.fading = false;
  this.fadeOpacity = 0;

  this.inBattle = false;

}


async start() {
  const res = await fetch("data/start-town.json");
  const data = await res.json();
  this.map = data.tiles;

  // Set up canvas
// Set up canvas with new tileSize
this.canvas = document.createElement("canvas"); // ← missing line
this.canvas.width = this.screenWidth * this.tileSize;
this.canvas.height = this.screenHeight * this.tileSize;


const existingCanvas = document.querySelector('canvas');
if (existingCanvas) existingCanvas.remove();
document.body.appendChild(this.canvas);
this.ctx = this.canvas.getContext("2d");

// Scale up visually without smoothing
this.ctx.imageSmoothingEnabled = false;
this.canvas.style.width = this.canvas.width * 2 + "px";
this.canvas.style.height = this.canvas.height * 2 + "px";


this.tileImages = {};
for (const [id, tile] of Object.entries(this.tileTypes)) {
  const img = new Image();
  img.src = `assets/${tile.image}`;
  this.tileImages[id] = img;
}

// 🔁 NEW: Load player sprite
this.playerImage = new Image();
this.playerImage.src = "assets/trainer.png";
this.playerImage.onload = () => console.log("✅ Player sprite loaded.");
this.playerImage.onerror = () => console.error("❌ Failed to load player sprite.");


  window.addEventListener("keydown", e => this.keys[e.key] = true);
  window.addEventListener("keyup", e => this.keys[e.key] = false);
}



  update() {
  if (!this.map) return;

  const { tileSize, keys, player, map } = this;

  if (!player.moving) {
    let dx = 0;
    let dy = 0;

    if (keys["ArrowUp"]) dy = -1;
    else if (keys["ArrowDown"]) dy = 1;
    else if (keys["ArrowLeft"]) dx = -1;
    else if (keys["ArrowRight"]) dx = 1;

    if (dx !== 0 || dy !== 0) {
  const targetX = player.x + dx;
  const targetY = player.y + dy;

  // Check if target tile is within bounds
  if (
    targetY >= 0 && targetY < map.length &&
    targetX >= 0 && targetX < map[0].length &&
    map[targetY][targetX] !== 0 // 0 is a wall
  ) {
    player.targetX = targetX;
    player.targetY = targetY;
    player.moving = true;
    player.moveProgress = 0;
    player.dx = dx;
    player.dy = dy;
  }
}

  }

  // Animate movement
  if (player.moving) {
    player.moveProgress += player.speed;
    const moveDone = player.moveProgress >= tileSize;

    if (moveDone) {
  player.x = player.targetX;
  player.y = player.targetY;
  player.moving = false;

  const tile = map[player.y][player.x];
  if (tile === 2 && !this.inBattle) {
  console.log("🌿 Wild battle triggered!");
  this.inBattle = true;

  const enemyToFight = enemies.slime;

  setTimeout(() => {
    this.changeScene(new BattleScene(this.changeScene, enemies.slime));

  }, 100);
}


}

  }

  // Drawing
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // Draw tiles
  let camX = player.x - Math.floor(this.screenWidth / 2);
let camY = player.y - Math.floor(this.screenHeight / 2);

// Clamp to map bounds
camX = Math.max(0, Math.min(camX, this.map[0].length - this.screenWidth));
camY = Math.max(0, Math.min(camY, this.map.length - this.screenHeight));


for (let row = 0; row < this.screenHeight; row++) {
  for (let col = 0; col < this.screenWidth; col++) {
    const mapX = camX + col;
    const mapY = camY + row;

    const tile = (map[mapY] && map[mapY][mapX]) ?? 1;
    const tileType = this.tileTypes[tile] || this.tileTypes[1];

    const img = this.tileImages[tile];

    if (img?.complete && img.naturalWidth > 0) {
      this.ctx.drawImage(
        img,
        col * tileSize,
        row * tileSize,
        tileSize,
        tileSize
      );
    } else {
      this.ctx.fillStyle = tileType.color;
      this.ctx.fillRect(
        col * tileSize,
        row * tileSize,
        tileSize,
        tileSize
      );
    }
  }
}

// ✅ Draw the player after all tiles are drawn
  const offsetX = player.moving ? -player.dx * (tileSize - player.moveProgress) : 0;
  const offsetY = player.moving ? -player.dy * (tileSize - player.moveProgress) : 0;

  const screenX = (Math.floor(this.screenWidth / 2) * tileSize) + offsetX + 4;
  const screenY = (Math.floor(this.screenHeight / 2) * tileSize) + offsetY + 4;

  if (this.playerImage?.complete && this.playerImage.naturalWidth > 0) {
  this.ctx.drawImage(
    this.playerImage,
    screenX,
    screenY,
    tileSize,
    tileSize
  );
} else {
  this.ctx.fillStyle = "#0ff";
  this.ctx.fillRect(
    screenX,
    screenY,
    player.size,
    player.size
  );
}

}
}
