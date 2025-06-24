export const enemyData = {
  slime: {
    name: "Wild Slime",
    maxHp: 60,
    attack: 4,
    defense: 2,
    image: "slime.png",
    xpReward: 15,
  },
  goblin: {
    name: "Wild Goblin",
    maxHp: 40,
    attack: 6,
    defense: 1,
    image: "goblin.jpg",
    xpReward: 19,
  },
  TheAlmighty: {
    name: "The Allmighty",
    maxHp: 700,
    attack: 12,
    defense: 0.5,
    image: "almighty.png",
    xpReward: 1000,
  },
};

export function createEnemy(type) {
  const base = enemyData[type];
  if (!base) throw new Error(`Unknown enemy type: ${type}`);

  return {
    name: base.name,
    maxHp: base.maxHp,
    hp: base.maxHp,
    attack: base.attack,
    defense: base.defense,
    image: base.image,
    xpReward: base.xpReward,
    type: type
  };
}
