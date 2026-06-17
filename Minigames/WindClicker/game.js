// ============================================================
//  GAME.JS — игровая логика (не трогай, если не уверен)
// ============================================================

(function () {
  "use strict";

  // ---------- Состояние игры ----------
  const state = {
    energy: 0,
    totalEarned: 0,
    passiveRate: 0,
    clickBonus: 0,
    shownFacts: new Set(),
    upgrades: {}     // { id: { bought, currentCost } }
  };

  // ---------- DOM-ссылки ----------
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

  // ---------- Инициализация улучшений ----------
  CONFIG.upgrades.forEach(u => {
    state.upgrades[u.id] = { bought: 0, currentCost: u.cost };
  });

  // ---------- Рендер карточек улучшений ----------
  function renderUpgrades() {
    $upgList.innerHTML = "";
    CONFIG.upgrades.forEach(u => {
      const s = state.upgrades[u.id];
      const maxed = u.maxBuys > 0 && s.bought >= u.maxBuys;
      const affordable = state.energy >= s.currentCost && !maxed;

      const card = document.createElement("div");
      card.className = "upg-card" + (affordable ? " can-buy" : "") + (maxed ? " maxed" : "");
      card.dataset.id = u.id;

      // иконка: сначала пробуем картинку, потом emoji
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
          ${maxed ? "МАКС." : `${fmt(Math.ceil(s.currentCost))} ⚡`}
        </div>`;

      if (!maxed) {
        card.addEventListener("click", () => buyUpgrade(u.id));
      }

      $upgList.appendChild(card);
    });
  }

  // ---------- Покупка улучшения ----------
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

  // ---------- Клик по ветряку ----------
  function handleClick() {
    const gained = CONFIG.baseClickEnergy + state.clickBonus;
    state.energy     += gained;
    state.totalEarned+= gained;
    spinBlade();
    checkFacts();
    updateUI();
    renderUpgrades();

    // всплывашка "+N"
    showFloatText("+" + gained + " ⚡");
  }

  // ---------- Вращение пропеллера ----------
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
    // Заглушка
    const ph = document.getElementById("ph-blade");
    if (ph) {
      ph.classList.add("spinning-emoji");
      setTimeout(() => ph.classList.remove("spinning-emoji"), 600);
    }
  }

  // Пассивная анимация пропеллера пропорционально скорости
  function updatePassiveSpin() {
    if (passiveSpinInterval) clearInterval(passiveSpinInterval);
    if (state.passiveRate > 0 && $blade) {
      const rpm = Math.min(state.passiveRate * 0.5, 8); // cap
      const dur = Math.max(0.5, 4 / rpm);
      $blade.style.animationDuration = dur + "s";
      $blade.classList.add("passive-spin");
    }
  }

  // ---------- Пассивный доход ----------
  setInterval(() => {
    if (state.passiveRate > 0) {
      state.energy      += state.passiveRate;
      state.totalEarned += state.passiveRate;
      checkFacts();
      updateUI();
      renderUpgrades();
    }
  }, CONFIG.tickIntervalMs);

  // ---------- Факты ----------
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

  // ---------- Обновление HUD ----------
  function updateUI() {
    $energy.textContent  = fmt(Math.floor(state.energy));
    $rate.textContent    = fmt(state.passiveRate);
    $clickVal.textContent = CONFIG.baseClickEnergy + state.clickBonus;
  }

  // ---------- Форматирование чисел ----------
  function fmt(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  }

  // ---------- Всплывающий текст ----------
  function showFloatText(text) {
    const el = document.createElement("div");
    el.className = "float-text";
    el.textContent = text;
    const rect = $turbine.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2 + window.scrollX) + "px";
    el.style.top  = (rect.top  + window.scrollY - -150) + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  // ---------- Навесить клик ----------
  $turbine.addEventListener("click", handleClick);

  // ---------- Первый рендер ----------
  updateUI();
  renderUpgrades();
  updatePassiveSpin();

})();
