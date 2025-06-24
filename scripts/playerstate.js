// playerState.js
export const player = {
  name: "Trainer",
  hp: 100,
  maxHp: 100,
  energy: 50,
  maxEnergy: 50,
  regen: 5, // amount regained per turn
  attack: 15,
  defense: 5,
  level: 1,
  xp: 0,
  moves: [
    { name: "Slash", power: 12, cost: 3 },
    { name: "Fireball", power: 25, cost: 15 },
    { name: "murder", power: 1000, cost: 50}, // we'll skip logic for now
  ]
};

export function getXpForNextLevel(level) {
  return 20 + (level - 1) * 15; // You can tune this curve later
}
