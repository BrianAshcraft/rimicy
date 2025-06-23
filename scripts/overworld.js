import { enemyData, createEnemy } from './enemies.js';
import { startBattleWithEnemy } from './battle.js';
import { updateBattle, drawBattle, injectSetGameState } from './battle.js';
import { setGameState } from './main.js';

let map = null;
let tileTypes = {};
let tileImages = {};
let player = {};
let keys = {};
let canvas = null;
let ctx = null;

const tileSize = 64;
const screenWidth = 15;
const screenHeight = 10;

export function startOverworld() {
  tileTypes = {
    0: { name: "wall", color: "red", passable: false, image: "wall.png" },
    1: { name: "floor", color: "#444", passable: true, image: "safegrass.png" },
    2: { name: "grass", color: "green", passable: true, image: "grass.png" },
    3: { name: "water", color: "blue", passable: false, image: "water.png" },
  };

  player = {
    x: 10,
    y: 10,
    size: 28,
    speed: 4,
    moving: false,
    moveProgress: 0,
    dx: 0,
    dy: 0
  };

  keys = {};
  tileImages = {};

  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  for (const [id, tile] of Object.entries(tileTypes)) {
    const img = new Image();
    img.src = `assets/${tile.image}`;
    tileImages[id] = img;
  }

  player.image = new Image();
  player.image.src = "assets/trainer.png";

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  fetch("data/start-town.json")
    .then(res => res.json())
    .then(data => {
      map = data.tiles;
    });
}

export function updateOverworld() {
  if (!map) return;

  if (!player.moving) {
    let dx = 0;
    let dy = 0;
    if (keys["ArrowUp"]) dy = -1;
    else if (keys["ArrowDown"]) dy = 1;
    else if (keys["ArrowLeft"]) dx = -1;
    else if (keys["ArrowRight"]) dx = 1;

    if (dx || dy) {
      const tx = player.x + dx;
      const ty = player.y + dy;
      const tile = map?.[ty]?.[tx];
      if (tile !== undefined && tileTypes[tile]?.passable) {
        player.dx = dx;
        player.dy = dy;
        player.targetX = tx;
        player.targetY = ty;
        player.moving = true;
        player.moveProgress = 0;
      }
    }
  }

  if (player.moving) {
    player.moveProgress += player.speed;
    if (player.moveProgress >= tileSize) {
      player.x = player.targetX;
      player.y = player.targetY;
      player.moving = false;

      const tile = map[player.y][player.x];
      if (tile === 2 && Math.random() < 0.15) {
        const types = Object.keys(enemyData);
        const chosen = types[Math.floor(Math.random() * types.length)];
        const enemy = createEnemy(chosen);
        startBattleWithEnemy(enemy); // handled in battle.js, sets gameState = "battle"
      }
    }
  }
}

export function drawOverworld(ctx) {
  if (!map) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const camX = Math.max(0, Math.min(player.x - Math.floor(screenWidth / 2), map[0].length - screenWidth));
  const camY = Math.max(0, Math.min(player.y - Math.floor(screenHeight / 2), map.length - screenHeight));

  for (let row = 0; row < screenHeight; row++) {
    for (let col = 0; col < screenWidth; col++) {
      const mx = camX + col;
      const my = camY + row;
      const tileId = (map[my] && map[my][mx]) ?? 1;
      const img = tileImages[tileId];

      if (img?.complete) {
        ctx.drawImage(img, col * tileSize, row * tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = tileTypes[tileId]?.color || "#999";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }
  }

  const offsetX = player.moving ? -player.dx * (tileSize - player.moveProgress) : 0;
  const offsetY = player.moving ? -player.dy * (tileSize - player.moveProgress) : 0;
  const px = Math.floor(screenWidth / 2) * tileSize + offsetX;
  const py = Math.floor(screenHeight / 2) * tileSize + offsetY;

  if (player.image?.complete) {
    ctx.drawImage(player.image, px, py, tileSize, tileSize);
  } else {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(px, py, player.size, player.size);
  }
}
