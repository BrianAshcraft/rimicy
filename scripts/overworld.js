import { Scene } from './scene.js';

export class OverworldScene extends Scene {
  constructor() {
  super();

  this.tileTypes = {
    0: { name: "wall", color: "red", passable: false },
    1: { name: "floor", color: "#444", passable: true },
    2: { name: "grass", color: "green", passable: true },
    3: { name: "water", color: "blue", passable: false }
  };

  this.tileSize = 16;
  this.screenWidth = 15;
  this.screenHeight = 10;

  this.map = null;

  this.canvas = null;
  this.ctx = null;
  this.tileSize = 16;

this.player = {
  x: 1,
  y: 1,
  size: 14,       // ✅ fits inside a 16x16 tile
  speed: 4,
  moving: false,
  moveProgress: 0,
  dx: 0,
  dy: 0
};


  this.keys = {};
}


  async start() {
  console.log("Overworld started");

  // Load the map
  const res = await fetch("data/start-town.json");
  const data = await res.json();
  this.map = data.tiles;

console.log("Map loaded:", this.map); // Add this line

  // Set up canvas
  this.canvas = document.createElement("canvas");
  this.canvas.width = this.screenWidth * this.tileSize;
  this.canvas.height = this.screenHeight * this.tileSize;

  document.body.innerHTML = '';
  document.body.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");

  // Handle keyboard input
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

    const tile = (map[mapY] && map[mapY][mapX]) ?? 1; // default to floor if out of bounds
    const tileType = this.tileTypes[tile] || this.tileTypes[1];

    this.ctx.fillStyle = tileType.color;
    this.ctx.fillRect(
      col * tileSize,
      row * tileSize,
      tileSize,
      tileSize
    );
  }
}

  // Draw player
  const offsetX = player.moving ? -player.dx * (tileSize - player.moveProgress) : 0;
const offsetY = player.moving ? -player.dy * (tileSize - player.moveProgress) : 0;

const screenX = (Math.floor(this.screenWidth / 2) * tileSize) + offsetX + 4;
const screenY = (Math.floor(this.screenHeight / 2) * tileSize) + offsetY + 4;

this.ctx.fillStyle = "#0ff";
this.ctx.fillRect(
  screenX,
  screenY,
  player.size,
  player.size
);

}
}


