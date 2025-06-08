import { Scene } from './scene.js';

export class OverworldScene extends Scene {
  constructor() {
    super();
    this.tileSize = 32;
    this.map = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.canvas = null;
    this.ctx = null;
    this.player = {
  x: 1,
  y: 1,
  size: 24,
  speed: 4,       // Higher = faster movement animation
  moving: false,
  moveProgress: 0,
  dx: 0,
  dy: 0
};

    this.keys = {};
  }

  start() {
    console.log("Overworld started");

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.map[0].length * this.tileSize;
    this.canvas.height = this.map.length * this.tileSize;

    document.body.innerHTML = '';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup", e => this.keys[e.key] = false);
  }

  update() {
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
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      const tile = map[row][col];
      this.ctx.fillStyle = tile === 0 ? "#222" : "#444";
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

  this.ctx.fillStyle = "#0ff";
  this.ctx.fillRect(
    (player.x * tileSize) + offsetX + 4,
    (player.y * tileSize) + offsetY + 4,
    player.size,
    player.size
  );
}
}