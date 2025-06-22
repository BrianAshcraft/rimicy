export const enemies = {
  slime: {
    name: "Wild Slime",
    maxHp: 60,
    attack: 10,
    defense: 2,
    image: "slime.png",
    xpReward: 5,
  },
  goblin: {
    name: "Wild Goblin",
    maxHp: 80,
    attack: 12,
    defense: 3,
    image: "goblin.jpg",
    xpReward: 9,
  },
  TheAlmighty: {
    name: "The Allmighty",
    maxHp: 700,
    attack: 12,
    defense: 0.5,
    image: "almighty.png",
    xpReward: 1000,
  }
};

export function createEnemy(type) {
  const base = enemies[type];
  if (!base) throw new Error(`Unknown enemy type: ${type}`);

  return {
    name: base.name,
    maxHp: base.maxHp,
    hp: base.maxHp,
    attack: base.attack,
    defense: base.defense,
    image: base.image,
    xpReward: base.xpReward,
    type: type // optional, helps track what was spawned
  };
}
