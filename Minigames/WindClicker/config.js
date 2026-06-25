
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
      text: "Les éoliennes modernes sont capables de produire suffisamment d'énergie pour alimenter 1 000 foyers par an."
    },
    {
      threshold: 500,
      text: "Les pales des grandes éoliennes peuvent atteindre 80 à 90 mètres de long. C'est plus long que l'aile d'un Boeing 747 !"
    },
    {
      threshold: 1500,
      text: " L'énergie éolienne est l'un des secteurs qui connaît la plus forte croissance au monde. En 2023, sa puissance mondiale a dépassé les 1 000 gigawatts."
    },
	{
      threshold: 5000,
      text: "Les éoliennes offshore (en mer) sont plus efficaces que celles situées à terre. Le vent en mer est constant et le bruit ne dérange pas les gens."
    },
    {
      threshold: 15000,
      text: "En 20 ans de fonctionnement, une éolienne permettra d'éviter le rejet d'environ 30 000 tonnes de CO₂ — ce qui équivaut à planter 1,5 million d'arbres."
    },
    {
      threshold: 50000,
      text: "Les pays de la mer du Nord — le Danemark et les Pays-Bas — produisent déjà plus de 50 % de leur électricité grâce à l'énergie éolienne !"
    }
  ]

};
