(function () {
  "use strict";

  //DOM
  const $energyCount   = document.getElementById("energy-count");
  const $energyUnit    = document.getElementById("energy-unit");
  const $goalName      = document.getElementById("goal-name");
  const $goalBarFill   = document.getElementById("goal-bar-fill");
  const $goalLabel     = document.getElementById("goal-label");
  const $instruction   = document.getElementById("instruction");
  const $physicsText   = document.getElementById("physics-text");
  const $sunWrap        = document.getElementById("sun-wrap");
  const $photonLayer    = document.getElementById("photon-layer");
  const $cellsRow        = document.getElementById("cells-row");
  const $scene           = document.getElementById("scene");

  const $goalOverlay      = document.getElementById("goal-overlay");
  const $goalPopupIcon    = document.getElementById("goal-popup-icon");
  const $goalPopupTitle   = document.getElementById("goal-popup-title");
  const $goalPopupText    = document.getElementById("goal-popup-text");
  const $goalPopupClose   = document.getElementById("goal-popup-close");

  const $finalOverlay  = document.getElementById("final-overlay");
  const $finalIcon     = document.getElementById("final-icon");
  const $finalTitle    = document.getElementById("final-title");
  const $finalText     = document.getElementById("final-text");

  // state
  const state = {
    energy: 0,
    goalIndex: 0,        // Index of the current (next) goal in CONFIG.goals
    finished: false,
    paused: false         // Clicks are ignored during pop-up
  };

  // Use texts
  $instruction.textContent = CONFIG.texts.instruction;
  $energyUnit.textContent  = CONFIG.texts.energyUnit;
  $goalLabel.textContent   = CONFIG.texts.goalLabel;
  $physicsText.textContent = CONFIG.texts.physicsText;

  // Cell render
  const cellEls = [];
  function renderCells() {
    $cellsRow.innerHTML = "";
    for (let i = 0; i < CONFIG.cellCount; i++) {
      const cell = document.createElement("div");
      cell.className = "solar-cell";
      cell.innerHTML = `<div class="cell-flash"></div><div class="cell-electron">e⁻</div>`;
      $cellsRow.appendChild(cell);
      cellEls.push(cell);
    }
  }

  // HUD refresh (Kinda laggy??)
  function updateGoalHUD() {
    if (state.goalIndex >= CONFIG.goals.length) {
      $goalName.textContent = "C'est prêt !";
      $goalBarFill.style.width = "100%";
      return;
    }
    const goal = CONFIG.goals[state.goalIndex];
    const prevThreshold = state.goalIndex === 0 ? 0 : CONFIG.goals[state.goalIndex - 1].threshold;
    const progress = Math.min(1, (state.energy - prevThreshold) / (goal.threshold - prevThreshold));

    $goalName.innerHTML = `${goal.emoji || ""} ${goal.name}`;
    $goalBarFill.style.width = (progress * 100) + "%";
  }

  function updateEnergyHUD() {
    $energyCount.textContent = Math.floor(state.energy).toLocaleString("fr-FR");
  }

  // Click on sun
  $sunWrap.addEventListener("click", () => {
    if (state.paused || state.finished) return;
    for (let i = 0; i < CONFIG.photon.photonsPerClick; i++) {
      setTimeout(() => launchPhoton(), i * CONFIG.photon.spreadDelayMs);
    }
    $sunWrap.classList.add("pulse");
    setTimeout(() => $sunWrap.classList.remove("pulse"), 250);
  });

  // Launching one photone
  function launchPhoton() {
    const sceneRect   = $scene.getBoundingClientRect();
    const sunRect      = $sunWrap.getBoundingClientRect();
    const targetCell   = cellEls[Math.floor(Math.random() * cellEls.length)];
    const cellRect      = targetCell.getBoundingClientRect();

    const startX = sunRect.left + sunRect.width / 2 - sceneRect.left;
    const startY = sunRect.top  + sunRect.height/ 2 - sceneRect.top;
    const endX   = cellRect.left + cellRect.width / 2 - sceneRect.left;
    const endY   = cellRect.top  + 10 - sceneRect.top;
    const photon = document.createElement("div");
    photon.className = "photon";
    photon.textContent = "✦";
    photon.style.left = startX + "px";
    photon.style.top  = startY + "px";
    $photonLayer.appendChild(photon);

    // Small deviation
    const wobbleX = (Math.random() - 0.5) * 40;

    requestAnimationFrame(() => {
      photon.style.transition = `transform ${CONFIG.photon.flightDurationMs}ms cubic-bezier(0.45,0,0.55,1), opacity 200ms ease ${CONFIG.photon.flightDurationMs - 150}ms`;
      photon.style.transform = `translate(${endX - startX + wobbleX}px, ${endY - startY}px)`;
    });

    setTimeout(() => {
      photon.remove();
      onPhotonHit(targetCell);
    }, CONFIG.photon.flightDurationMs);
  }

  // Photone hits the cell
  function onPhotonHit(cellEl) {
    if (state.finished) return;

    // Visual cell response
    cellEl.classList.add("hit");
    const flash = cellEl.querySelector(".cell-flash");
    flash.classList.add("flash-active");
    setTimeout(() => {
      cellEl.classList.remove("hit");
      flash.classList.remove("flash-active");
    }, 350);

    // Elec spawn
    spawnElectron(cellEl);

    // Adding energy 
    state.energy += CONFIG.photon.energyPerPhoton;
    updateEnergyHUD();
    checkGoals();
    updateGoalHUD();
  }

  // Cell anim again
  function spawnElectron(cellEl) {
    const e = document.createElement("div");
    e.className = "flying-electron";
    e.textContent = "e⁻";
    cellEl.appendChild(e);
    requestAnimationFrame(() => {
      e.style.transform = `translateY(-${28 + Math.random()*14}px) scale(1.2)`;
      e.style.opacity = "0";
    });
    setTimeout(() => e.remove(), 500);
  }

  // We check if the goal is reached
  function checkGoals() {
    if (state.goalIndex >= CONFIG.goals.length) return;
    const goal = CONFIG.goals[state.goalIndex];
    if (state.energy >= goal.threshold) {
      state.paused = true;
      showGoalPopup(goal);
    }
  }

  function showGoalPopup(goal) {
    $goalPopupIcon.textContent = goal.emoji || "🎯";
    $goalPopupTitle.textContent = goal.popupTitle;
    $goalPopupText.textContent  = goal.popupText;
    $goalOverlay.classList.remove("hidden");
  }

  $goalPopupClose.addEventListener("click", () => {
    $goalOverlay.classList.add("hidden");
    state.goalIndex++;
    state.paused = false;

    if (state.goalIndex >= CONFIG.goals.length) {
      state.finished = true;
      showFinal();
    }
    updateGoalHUD();
  });

  function showFinal() {
    $finalIcon.textContent  = CONFIG.final.icon;
    $finalTitle.textContent = CONFIG.final.title;
    $finalText.textContent  = CONFIG.final.text;
    setTimeout(() => $finalOverlay.classList.remove("hidden"), 300);
  }

  //Visualisation
  renderCells();
  updateEnergyHUD();
  updateGoalHUD();

})();
