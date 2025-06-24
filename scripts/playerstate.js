// playerState.js
export const player = {
  name: "Trainer",
  hp: 100,
  maxHp: 100,
  attack: 15,
  defense: 5,
  level: 1,
  xp: 0,
  moves: [
    { name: "Slash", power: 12 },
    { name: "Fireball", power: 18 },
    { name: "murder", power: 1000 }, // we'll skip logic for now
  ]
};

export function getXpForNextLevel(level) {
  return 20 + (level - 1) * 15; // You can tune this curve later
}
