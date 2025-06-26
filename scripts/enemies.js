export const enemyData = {
  slime: {
    name: "Wild Slime",
    maxHp: 60,
    attack: 4,
    defense: 2,
    image: "slime.png",
    xpReward: 15,
    maxEnergy: 10,
    energy: 10,
    regen: 3,
    moves: [
      { name: "Punch", power: 5, cost: 2 },
      { name: "Kick", power: 8, cost: 5 },
      { name: "Headbutt", power: 12, cost: 8 }
    ]
  },
  goblin: {
    name: "Wild Goblin",
    maxHp: 40,
    attack: 6,
    defense: 1,
    image: "goblin.jpg",
    xpReward: 19,
    maxEnergy: 10,
    energy: 10,
    regen: 3,
    moves: [
      { name: "Punch", power: 5, cost: 2 },
      { name: "Kick", power: 8, cost: 5 },
      { name: "Headbutt", power: 12, cost: 8 }]
  },
  TheAlmighty: {
    name: "The Allmighty",
    maxHp: 700,
    attack: 12,
    defense: 0.5,
    image: "almighty.png",
    xpReward: 1000,
    maxEnergy: 10,
    energy: 10,
    regen: 3,
    moves: [
      { name: "Punch", power: 5, cost: 2 },
      { name: "Kick", power: 8, cost: 5 },
      { name: "Headbutt", power: 12, cost: 8 }
    ]
  },
};

export function createEnemy(name, hp, atk, def, xp, image, moves, energy = 20, regen = 5) {
  return {
    name,
    hp,
    maxHp: hp,
    attack: atk,
    defense: def,
    xpReward: xp,
    image,
    energy,
    maxEnergy: energy,
    regen,
    moves
  };
}