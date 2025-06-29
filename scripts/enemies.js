export const enemyData = {
  slime: {
    name: "Wild Slime",
    maxHp: 20,
    attack: 1,
    defense: 2,
    image: "slime.png",
    xpReward: 6,
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
    maxHp: 16,
    attack: 2,
    defense: .5,
    image: "goblin.jpg",
    xpReward: 8,
    maxEnergy: 10,
    energy: 10,
    regen: 3,
    moves: [
      { name: "Punch", power: 1, cost: 2 },
      { name: "claw", power: 2, cost: 3 },
      { name: "Headbutt", power: 12, cost: 8 }]
  },
  TheAlmighty: {
    name: "The Allmighty",
    maxHp: 25,
    attack: 2,
    defense: 0.5,
    image: "almighty.png",
    xpReward: 1000,
    maxEnergy: 20,
    energy: 20,
    regen: 2.5,
    moves: [
      { name: "chin", power: 2, cost: 2 },
      { name: "headbutt", power: 5, cost: 6 },
      { name: "ether", power: 12, cost: 8 }
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