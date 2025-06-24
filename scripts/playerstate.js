// playerState.js
export const player = {
  name: "Trainer",
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  regen: 5, // amount regained per turn
  attack: 1,
  defense: 1,
  level: 1,
  xp: 0,
  moves: [
    { name: "Slash", power: 12, cost: 3, critBonus: 0.45 },
    { name: "Fireball", power: 25, cost: 15, critBonus: 0.10 },
    { name: "murder", power: 1000, cost: 50, critBonus: 0.05}, // we'll skip logic for now
  ],
  critChance: 0.15, // 15% chance
  critMultiplier: 1.5,

};

export function getXpForNextLevel(level) {
  return 20 + (level - 1) * 15; // You can tune this curve later
}


export function savePlayerData() {
  localStorage.setItem("save_player", JSON.stringify(player));
}

export function loadPlayerData() {
  const data = localStorage.getItem("save_player");
  if (data) {
    const loaded = JSON.parse(data);
    Object.assign(player, loaded);
  }
}
