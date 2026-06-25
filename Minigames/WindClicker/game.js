
(function () {
  "use strict";

  //Game state
  const state = {
    energy: 0,
    totalEarned: 0,
    passiveRate: 0,
    clickBonus: 0,
    shownFacts: new Set(),
    upgrades: {}     // { id: { bought, currentCost } }
  };

  //DOM-links
  const $energy   = document.getElementById("energy-count");
  const $rate     = document.getElementById("rate-display");
  const $clickVal = document.getElementById("click-energy");
  const $blade    = document.getElementById("blade-img");
  const $ph       = document.getElementById("turbine-placeholder");
  const $turbine  = document.getElementById("turbine-wrap");
  const $upgList  = document.getElementById("upgrades-list");
  const $overlay  = document.getElementById("fact-overlay");
  const $factText = document.getElementById("fact-text");
  const $factClose= document.getElementById("fact-close");

  //Upgrade init
  CONFIG.upgrades.forEach(u => {
    state.upgrades[u.id] = { bought: 0, currentCost: u.cost };
  });

  //Upgrade render
  function renderUpgrades() {
    $upgList.innerHTML = "";
    CONFIG.upgrades.forEach(u => {
      const s = state.upgrades[u.id];
      const maxed = u.maxBuys > 0 && s.bought >= u.maxBuys;
      const affordable = state.energy >= s.currentCost && !maxed;

      const card = document.createElement("div");
      card.className = "upg-card" + (affordable ? " can-buy" : "") + (maxed ? " maxed" : "");
      card.dataset.id = u.id;

      //First we try the image, else we use emoji
      const iconHtml = `
        <div class="upg-icon">
          <img src="${u.icon}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
          <span class="upg-emoji" style="display:none">${u.emoji}</span>
        </div>`;

      const boughtLabel = u.maxBuys > 0
        ? `${s.bought}/${u.maxBuys}`
        : `×${s.bought}`;

      card.innerHTML = `
        ${iconHtml}
        <div class="upg-info">
          <strong>${u.name}</strong>
          <span class="upg-desc">${u.description}</span>
          <span class="upg-bought">Куплено: ${boughtLabel}</span>
        </div>
        <div class="upg-cost">
          ${maxed ? "MAX." : `${fmt(Math.ceil(s.currentCost))} ⚡`}
        </div>`;

      if (!maxed) {
        card.addEventListener("click", () => buyUpgrade(u.id));
      }

      $upgList.appendChild(card);
    });
  }

  //Buying upggrades
  function buyUpgrade(id) {
    const u = CONFIG.upgrades.find(x => x.id === id);
    const s = state.upgrades[id];
    if (state.energy < s.currentCost) return;
    if (u.maxBuys > 0 && s.bought >= u.maxBuys) return;

    state.energy -= s.currentCost;
    s.bought++;
    s.currentCost = Math.ceil(u.cost * Math.pow(u.costGrowth, s.bought));

    if (u.effect.type === "click")   state.clickBonus  += u.effect.value;
    if (u.effect.type === "passive") state.passiveRate += u.effect.value;

    updateUI();
    renderUpgrades();
  }

  //Click on turbbine
  function handleClick() {
    const gained = CONFIG.baseClickEnergy + state.clickBonus;
    state.energy     += gained;
    state.totalEarned+= gained;
    spinBlade();
    checkFacts();
    updateUI();
    renderUpgrades();

    //"+N" popup
    showFloatText("+" + gained + " ⚡");
  }

  // Turbine spin
  let spinTimeout = null;
  let passiveSpinInterval = null;

  function spinBlade() {
    if ($blade) {
      $blade.classList.remove("spinning");
      void $blade.offsetWidth; // reflow
      $blade.classList.add("spinning");
      clearTimeout(spinTimeout);
      spinTimeout = setTimeout(() => $blade.classList.remove("spinning"), CONFIG.spinDuration);
    }
    //Placeholder
    const ph = document.getElementById("ph-blade");
    if (ph) {
      ph.classList.add("spinning-emoji");
      setTimeout(() => ph.classList.remove("spinning-emoji"), 600);
    }
  }

  //Passive spinning stuff
  function updatePassiveSpin() {
    if (passiveSpinInterval) clearInterval(passiveSpinInterval);
    if (state.passiveRate > 0 && $blade) {
      const rpm = Math.min(state.passiveRate * 0.5, 8); // cap
      const dur = Math.max(0.5, 4 / rpm);
      $blade.style.animationDuration = dur + "s";
      $blade.classList.add("passive-spin");
    }
  }

  //Passive income (Wish i had one)
  setInterval(() => {
    if (state.passiveRate > 0) {
      state.energy      += state.passiveRate;
      state.totalEarned += state.passiveRate;
      checkFacts();
      updateUI();
      renderUpgrades();
    }
  }, CONFIG.tickIntervalMs);

  //Facts
  let factQueue = [];
  let showingFact = false;

  function checkFacts() {
    CONFIG.facts.forEach(f => {
      if (!state.shownFacts.has(f.threshold) && state.totalEarned >= f.threshold) {
        state.shownFacts.add(f.threshold);
        factQueue.push(f.text);
      }
    });
    if (!showingFact && factQueue.length > 0) showNextFact();
  }

  function showNextFact() {
    if (factQueue.length === 0) { showingFact = false; return; }
    showingFact = true;
    $factText.textContent = factQueue.shift();
    $overlay.classList.remove("hidden");
  }

  $factClose.addEventListener("click", () => {
    $overlay.classList.add("hidden");
    setTimeout(showNextFact, 400);
  });

  //HUD update
  function updateUI() {
    $energy.textContent  = fmt(Math.floor(state.energy));
    $rate.textContent    = fmt(state.passiveRate);
    $clickVal.textContent = CONFIG.baseClickEnergy + state.clickBonus;
  }

  //Number formatting
  function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  }

  //Floating text
  function showFloatText(text) {
    const el = document.createElement("div");
    el.className = "float-text";
    el.textContent = text;
    const rect = $turbine.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2 + window.scrollX) + "px";
    el.style.top  = (rect.top  + window.scrollY - 10) + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  //Click handling stuff
  $turbine.addEventListener("click", handleClick);

  //First rendering process
  updateUI();
  renderUpgrades();
  updatePassiveSpin();

})();
