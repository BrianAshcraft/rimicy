import { enemyData } from './enemies.js';
import { startBattleWithEnemy } from './battle.js';
import { setGameState } from './main.js';
import { getXpForNextLevel } from './playerstate.js';
import { player, savePlayerData, loadPlayerData } from './playerstate.js';

let map = null;
let tileTypes = {};
let tileImages = {};

let keys = {};
let canvas = null;
let ctx = null;
let menuOpen = false;
let selectedMenuIndex = 0;
let inStatsView = false;
let currentMap = "start-town2";
let npcs = [];

let overworldKeyHandler = null;

const tileSize = 64;
const screenWidth = 15;
const screenHeight = 10;

export function startOverworld() {
  tileTypes = {
    0: { name: "wall", color: "red", passable: false, image: "wall.png" },
    1: { name: "floor", color: "#444", passable: true, image: "safegrass.png" },
    2: { name: "grass", color: "green", passable: true, image: "grass.png" },
    3: { name: "water", color: "blue", passable: false, image: "water.png" },
    4: { name: "tree", color: "blue", passable: false, image: "tree.png" },
    5: { name: "shop", color: "blue", passable: false, image: "shop.png" },
    6: { name: "center", color: "pink", passable: true, image: "center.png" },
    7: { name: "sign", color: "white", passable: false, image: "sign.png" },
    8: { name: "cave", color: "gray", passable: true, image: "cave.png" },
    9: { name: "vert-path", color: "gray", passable: true, image: "vert-path.png" },
    10: { name: "hor-path", color: "gray", passable: true, image: "hori-path.png" },
    11: { name: "exit-door", color: "pink", passable: true, image: "exit-door.png" },
    12: { name: "floor", color: "#222", passable: true, image: "indoor-floor.png" }
  };

  player.targetX = player.x;
  player.targetY = player.y;

  player.x = 10;
  player.y = 10;
  player.dx = 0;
  player.dy = 0;
  player.size = 28;
  player.speed = 4;
  player.moving = false;
  player.moveProgress = 0;

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
  player.image.src = "assets/trainer2.png";

  if (overworldKeyHandler) {
    window.removeEventListener("keydown", overworldKeyHandler);
  }

  overworldKeyHandler = function(e) {
    if (inStatsView) {
      if (e.key === "Escape") {
        inStatsView = false;
      }
      return;
    }

    if (menuOpen) {
      if (e.key === "ArrowUp") {
        selectedMenuIndex = (selectedMenuIndex - 1 + 4) % 4;
      } else if (e.key === "ArrowDown") {
        selectedMenuIndex = (selectedMenuIndex + 1) % 4;
      } else if (e.key === "Enter") {
        const selectedOption = ["Items", "Stats", "Save", "Options"][selectedMenuIndex];
        if (selectedOption === "Stats") {
          inStatsView = true;
        } else if (selectedOption === "Save") {
          savePlayerData();
          alert("Game saved!");
        }
      } else if (e.key === "Escape") {
        menuOpen = false;
      }
      return;
    }

    if (e.key === "m") {
      menuOpen = !menuOpen;
      selectedMenuIndex = 0;
      return;
    }

    keys[e.key] = true;
  };

  window.addEventListener("keydown", overworldKeyHandler);
  window.addEventListener("keyup", e => keys[e.key] = false);

  const savedMap = loadPlayerData() || "start-town2";

fetch(`data/${savedMap}.json`)
  .then(res => res.json())
  .then(data => {
    map = data.tiles;
    currentMap = savedMap;
    player.targetX = player.x;
    player.targetY = player.y;
    npcs = loadNpcsForMap(savedMap);
  });

}

export function updateOverworld() {
  if (!map) return;

if (keys["e"]) {
  for (const npc of npcs) {
    const dx = Math.abs(player.x - npc.x);
    const dy = Math.abs(player.y - npc.y);
    if ((dx === 1 && dy === 0) || (dy === 1 && dx === 0)) {
      npc.interaction();
      keys["e"] = false;
      break;
    }
  }
}

// Movement input
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
    player.x = tx;
    player.y = ty;

    // Special tile triggers
    if (tile === 2 && Math.random() < 0.15) {
      const types = Object.keys(enemyData);
      const chosen = types[Math.floor(Math.random() * types.length)];
      const enemy = { ...enemyData[chosen] };
      startBattleWithEnemy(enemy);
    } else if (tile === 6 && currentMap === "start-town2") {
      loadMap("center-interior", 9, 10);
    } else if (tile === 11 && currentMap === "center-interior") {
      loadMap("start-town2", 12, 15);
    }

    // Stop held movement
    keys["ArrowUp"] = false;
    keys["ArrowDown"] = false;
    keys["ArrowLeft"] = false;
    keys["ArrowRight"] = false;
  }
}
}



function loadMap(mapName, startX, startY) {
  fetch(`data/${mapName}.json`)
    .then(res => res.json())
    .then(data => {
      map = data.tiles;
      currentMap = mapName;
      player.x = startX;
      player.y = startY;
      player.targetX = startX;
      player.targetY = startY;
      player.dx = 0;
      player.dy = 0;
      player.moving = false;
      player.moveProgress = 0;
      keys = {};
      npcs = loadNpcsForMap(mapName);

    });
}

function loadNpcsForMap(mapName) {
  if (mapName === "center-interior") {
    return [
      {
        name: "Nurse",
        x: 6,
        y: 9,
        sprite: "nurse.png",
        interaction: () => {
          alert("You look like you could use some restoration. Let me help you.");
          player.hp = player.maxHp;
          player.energy = player.maxEnergy;
        }
      }
    ];
  }
  return []; // no NPCs for other maps yet
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

for (const npc of npcs) {
  const nx = npc.x - camX;
  const ny = npc.y - camY;
  const img = new Image();
  img.src = `assets/${npc.sprite}`;
  ctx.drawImage(img, nx * tileSize, ny * tileSize, tileSize, tileSize);
}


  if (player.image?.complete) {
    ctx.drawImage(player.image, px, py, tileSize, tileSize);
  } else {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(px, py, player.size, player.size);
  }

  if (menuOpen) {
    const menuX = canvas.width - 240;
    const menuY = 40;
    const menuWidth = 200;
    const menuHeight = 220;
    const menuOptions = ["Items", "Stats", "Save", "Options"];

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

    ctx.fillStyle = "white";
    ctx.font = "18px monospace";
    menuOptions.forEach((option, i) => {
      const y = menuY + 40 + i * 40;
      ctx.fillStyle = i === selectedMenuIndex ? "#0ff" : "white";
      ctx.fillText(option, menuX + 20, y);
    });

    if (inStatsView) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.fillStyle = "white";
      ctx.font = "18px monospace";

      const lines = [
        `Name: ${player.name}`,
        `Level: ${player.level}`,
        `XP: ${player.xp} / ${getXpForNextLevel(player.level)}`,
        `HP: ${player.hp} / ${player.maxHp}`,
        `Energy: ${player.energy} / ${player.maxEnergy}`,
        `Attack: ${player.attack}`,
        `Defense: ${player.defense}`,
        `Crit Chance: ${(player.critChance * 100).toFixed(1)}%`,
        `Regen: ${player.regen}`
      ];

      lines.forEach((line, i) => {
        ctx.fillText(line, 60, 80 + i * 30);
      });

      ctx.fillStyle = "#aaa";
      ctx.fillText("Press Esc to go back", 60, canvas.height - 50);
    }
  }
}
