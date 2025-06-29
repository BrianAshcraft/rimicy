// playerState.js
export const player = {
  name: "Trainer",
  hp: 50,
  maxHp: 50,
  energy: 30,
  maxEnergy: 50,
  regen: 3, // amount regained per turn
  attack: 1.5,
  defense: 1,
  level: 1,
  xp: 0,
  moves: [
    { name: "punch", power: 1, cost: 2, critBonus: 0.10 },
    { name: "tackle", power: 5, cost: 8, critBonus: 0.10 },
    { name: "murder", power: 1000, cost: 50, critBonus: 0.05}, 
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
