const CONFIG = {

  // Texts
  texts: {
    instruction: "☀️ Clique sur le soleil pour lancer les photons",
    energyUnit: "J",
    goalLabel: "Objectif :",
    physicsText: "Un photon pénètre dans la cellule → il éjecte un électron → l'électron génère un courant électrique"
  },

  // Photones
  photon: {
    energyPerPhoton: 4,     // сколько Дж даёт один долетевший фотон
    flightDurationMs: 900,  // время полёта фотона от солнца до панели
    photonsPerClick: 3,     // сколько фотонов вылетает за один клик по солнцу
    spreadDelayMs: 90       // задержка между вылетом фотонов в одном клике
  },

  // Panel cell
  cellCount: 5,   // Customize the amoubnt of cells (better 3-5)


  // GOALS - Consecutive Energy Thresholds
  // threshold - how much total energy (J) needs to be accumulated
  // name      - short name of the target (displayed in the HUD)
  // icon      - path to the image (optional, ~64x64px)
  // emoji     - alternative character
  // popupTitle / popupText - popup text when the target is reached
  goals: [
    {
      threshold: 40,
      name: "Une ampoule",
      icon: "images/goal_bulb.png",
      emoji: "💡",
      popupTitle: "Une ampoule s'est allumée !",
      popupText: "Cette énergie suffit à faire s'allumer une ampoule classique pendant quelques secondes. Continue : le prochain objectif est plus ambitieux !"
    },
    {
      threshold: 150,
      name: "Maison",
      icon: "images/goal_house.png",
      emoji: "🏠",
      popupTitle: "Toute la maison est alimentée en électricité !",
      popupText: "L'énergie stockée suffirait à alimenter une petite maison pendant une courte période."
    },
    {
      threshold: 400,
      name: "Quartier",
      icon: "images/goal_district.png",
      emoji: "🏙️",
      popupTitle: "Tout un quartier !",
      popupText: "Cela suffirait à alimenter tout un quartier. Voilà à quoi ressemble l'ampleur de l'énergie solaire lorsque des centaines de panneaux sont regroupés."
    }
  ],

  // Final screen
  final: {
    icon: "🌍",
    title: "C'est à peu près ainsi que fonctionne le fonctionnement interne d'un panneau solaire",
    text: "D’un seul photon à l’énergie nécessaire pour alimenter tout un quartier : c’est exactement ainsi que fonctionnent les centrales solaires dans la réalité, mais à une échelle bien plus grande."
  }

};
