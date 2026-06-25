const CONFIG = {

  // Titles
  texts: {
    title: "Quelle quantité de CO₂ se cache dans ton électricité ?",
    subtitle: "Déplace le curseur et compare les sources d'énergie en temps réel",
    sliderLabelPrefix: "Il faut de l'énergie :",
    sliderUnit: "kWh",
    chartNote: "(!!!) La partie de l'échelle située au-dessus de cette marque a été compressée (voir le tracé en zigzag), sans quoi le charbon et le gaz n'auraient pas pu figurer sur le même graphique que l'éolien et le solaire — tant l'écart est important.",
    footerText: "Data: Average life-cycle metrics (IPCC, NREL)"
  },

  // Slider
  slider: {
    min: 0,
    max: 100,            // notional “steps” of the slider (not directly in kWh)
    default: 20,
    // Function to convert the slider position (0–100) to kWh.
    // Default: quadratic scaling, to make it easy to move
    // both at the beginning (small houses) and at the end (factories).
    // min kWh and max kWh are set here:
    minKwh: 100,
    maxKwh: 2_000_000,

    // Tooltips below the slider based on the kWh range
    // You can add or change as many lines as you like.
    equivalents: [
      { upTo: 1000,      text: "≈ consommation mensuelle d'un foyer" },
      { upTo: 12000,     text: "≈ consommation annuelle d'un foyer" },
      { upTo: 150000,    text: "≈ consommation annuelle d'un immeuble collectif" },
      { upTo: 5000000,   text: "≈ la consommation annuelle d'une petite usine" },
      { upTo: Infinity,  text: "≈ la consommation annuelle de tout un quartier de la ville" }
    ]
  },


  // gPerKwh — grams of CO2 equivalent per 1 kWh (life cycle, averaged data)
  // color    — bar color (hex)
  // icon     — path to your icon image (optional, ~48x48px)
  // emoji    — fallback symbol if no image is available
  // enabledByDefault — whether to display when the page loads
  
  sources: [
    {
      id: "coal",
      name: "Charbon",
      gPerKwh: 820,
      color: "#3a3a3a",
      icon: "images/icon_coal.png",
      emoji: "⚫",
      enabledByDefault: true
    },
    {
      id: "gas",
      name: "Gaz naturel",
      gPerKwh: 490,
      color: "#b07a3e",
      icon: "images/icon_gas.png",
      emoji: "🔥",
      enabledByDefault: true
    },
    {
      id: "wind",
      name: "Le vent",
      gPerKwh: 12,
      color: "#2d9e5f",
      icon: "images/icon_wind.png",
      emoji: "🌬️",
      enabledByDefault: true
    },
    {
      id: "solar",
      name: "Le soleil",
      gPerKwh: 41,
      color: "#e0a51c",
      icon: "images/icon_solar.png",
      emoji: "☀️",
      enabledByDefault: true
    }
  ],


  // SCALE WITH A BREAK (break axis)
  // breakAfter — the value (in kg CO2) at which the scale “compresses”
  // compressionRatio — the factor by which everything above breakAfter is compressed
  //   (visually, not in terms of data—the data remains accurate in the legend)

  chart: {
    breakAfterKg: 50,        // kg of CO2 — after that, the height decreases
    compressionRatio: 12,    // how many times “slower” does the upper part grow
    maxBarHeightPx: 380
  },


  // SUMMARY PHRASES (below the graph)
  // One random/appropriate phrase is displayed depending on
  // how many times worse the selected source is compared to the best one.
  // {ratio} and {kg} are automatically replaced with calculated values.

  summaryTemplates: [
    { minRatio: 0,   text: "Parmi les sources sélectionnées, la différence en termes d'émissions de CO₂ s'élève à {ratio}×." },
    { minRatio: 5,   text: "La source la plus « polluante » émet {ratio} fois plus de CO₂ que la plus propre parmi celles sélectionnées, soit une différence de {kg} kg par unité d'énergie consommée." },
    { minRatio: 20,  text: "La différence est énorme : {ratio} fois plus de CO₂ — cela représente {kg} kg d'émissions supplémentaires, simplement parce qu'on a choisi une autre source d'énergie." },
    { minRatio: 50,  text: "Quel contraste : {ratio}× plus d'émissions. Pour produire la même quantité d'énergie, les combustibles fossiles « coûtent » à la planète {kg} kg de CO₂ supplémentaires." }
  ]

};
