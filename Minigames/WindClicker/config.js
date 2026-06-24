
const CONFIG = {

  // Clicking

  baseClickEnergy: 1,          // basic energy gain per click
  spinDuration: 1200,          // blade spinning interval


  // Passive generation rate
  tickIntervalMs: 1000,        // passive energy gain speed

  // УЛУЧШЕНИЯ
  // Каждое улучшение — объект:
  //   id          — unique id
  //   name        — button name
  //   description — button description
  //   cost        — energy cost
  //   icon        — path to the 64x64 PNG icon
  //   emoji       — backup symbol if got no icon
  //   effect      — upgrade effect:
  //       { type: "click",   value: N }   → +N of energy to each click
  //       { type: "passive", value: N }   → +N energy each second constantly
  //       { type: "speed",   value: N }   → blades spin faster (just visual stuff)
  //   maxBuys     — how many times we can buy the ugrade (0 is infinite)
  //   costGrowth  — cost multiplier after each buy (if 1 = doesnt multiply)
  // ----------------------------------------------------------
  upgrades: [
    {
      id: "better_blades",
      name: "Long blades",
      description: "+2 ⚡ per click",
      cost: 10,
      icon: "images/upg_blades.png",
      emoji: "🪁",
      effect: { type: "click", value: 2 },
      maxBuys: 5,
      costGrowth: 1.6
    },
    {
      id: "gearbox",
      name: "Gearbox",
      description: "+1 ⚡/sec",
      cost: 25,
      icon: "images/upg_gear.png",
      emoji: "⚙️",
      effect: { type: "passive", value: 1 },
      maxBuys: 0,
      costGrowth: 1.8
    },
    {
      id: "auto_rotate",
      name: "Auto rotation",
      description: "+3 ⚡/sec",
      cost: 100,
      icon: "images/upg_auto.png",
      emoji: "🔄",
      effect: { type: "passive", value: 3 },
      maxBuys: 0,
      costGrowth: 2.0
    },
    {
      id: "turbine_farm",
      name: "Turbine farm",
      description: "+10 ⚡/sec",
      cost: 500,
      icon: "images/upg_farm.png",
      emoji: "🏭",
      effect: { type: "passive", value: 10 },
      maxBuys: 0,
      costGrowth: 2.2
    },
    {
      id: "super_click",
      name: "Super click",
      description: "+10 ⚡ per click",
      cost: 200,
      icon: "images/upg_super.png",
      emoji: "⚡",
      effect: { type: "click", value: 10 },
      maxBuys: 3,
      costGrowth: 3.0
    }
  ],


  // Facts. Shown when player reaches certain points amount
  // threshold — how much energy we need to reach
  // text      — facts text

  facts: [
    {
      threshold: 50,
      text: "First commercial wind turbine was installed in Denmark in 1891!"
    },
    {
      threshold: 200,
      text: "Modern wind turbines are able to generate enough energy to provide energy to a 1000 houses per year."
    },
    {
      threshold: 500,
      text: "Blades of large turbines reach up to 80-90 meters in length. This is larger than a Boeing 747 wing!"
    },
    {
      threshold: 1500,
      text: " Wind energy is one of the fast growing (ПЕРЕВЕДИ ОТРАСЛЬ) in world. In 2023, their global power has surpassed 1 000 gigawatt."
    },
	{
      threshold: 5000,
      text: "Offshore turbines (in sea) are more effective than the ones on land. The wind in the sea is constant and the noise does not bother people."
    },
    {
      threshold: 15000,
      text: "Один ветрогенератор за 20 лет своей службы сэкономит выброс ~30 000 тонн CO₂ — это как посадить 1,5 миллиона деревьев."
    },
    {
      threshold: 50000,
      text: "Страны Северного моря — Дания, Германия, Нидерланды — уже производят более 50% своей электроэнергии из ветра!"
    }
  ]

};
