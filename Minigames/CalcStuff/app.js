(function () {
  "use strict";

  // DOM links
  const $title       = document.getElementById("app-title");
  const $subtitle    = document.getElementById("app-subtitle");
  const $toggles      = document.getElementById("source-toggles");
  const $slider       = document.getElementById("energy-slider");
  const $sliderLabel  = document.getElementById("slider-label");
  const $sliderValue  = document.getElementById("slider-value");
  const $sliderEquiv  = document.getElementById("slider-equivalent");
  const $barsContainer= document.getElementById("bars-container");
  const $chartNote    = document.getElementById("chart-note");
  const $summaryText  = document.getElementById("summary-text");
  const $footerText   = document.getElementById("footer-text");
  const $zigzag       = document.getElementById("chart-break-zigzag");

  // state
  const state = {
    enabled: {},   // { sourceId: true/false }
  };

  CONFIG.sources.forEach(s => {
    state.enabled[s.id] = s.enabledByDefault !== false;
  });

  // use texts from config file
  function applyTexts() {
    $title.textContent = CONFIG.texts.title;
    $subtitle.textContent = CONFIG.texts.subtitle;
    $chartNote.textContent = CONFIG.texts.chartNote;
    $footerText.textContent = CONFIG.texts.footerText;
  }

  // checkbox render
  function renderToggles() {
    $toggles.innerHTML = "";
    CONFIG.sources.forEach(s => {
      const wrap = document.createElement("label");
      wrap.className = "toggle-pill" + (state.enabled[s.id] ? " active" : "");
      wrap.style.setProperty("--pill-color", s.color);

      wrap.innerHTML = `
        <input type="checkbox" ${state.enabled[s.id] ? "checked" : ""} data-id="${s.id}" />
        <span class="toggle-icon">
          <img src="${s.icon}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'"/>
          <span class="toggle-emoji" style="display:none">${s.emoji}</span>
        </span>
        <span class="toggle-name">${s.name}</span>
      `;

      const checkbox = wrap.querySelector("input");
      checkbox.addEventListener("change", (e) => {
        state.enabled[s.id] = e.target.checked;
        wrap.classList.toggle("active", e.target.checked);
        renderChart();
      });

      $toggles.appendChild(wrap);
    });
  }

  //Poisition to kWh
  // Quadratic interpolation: it's easier to select small values precisely
  function sliderToKwh(pos) {
    const { min, max, minKwh, maxKwh } = CONFIG.slider;
    const t = (pos - min) / (max - min);           // 0..1
    const eased = Math.pow(t, 2.4);                  // square curve
    return Math.round(minKwh + eased * (maxKwh - minKwh));
  }

  // Eqivalent text
  function getEquivalentText(kwh) {
    const item = CONFIG.slider.equivalents.find(e => kwh <= e.upTo);
    return item ? item.text : "";
  }

  // NUmber format
  function fmt(n) {
    return n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  }

  // Bar height
  function kgToBarHeight(kg) {
    const { breakAfterKg, compressionRatio, maxBarHeightPx } = CONFIG.chart;
    let px;
    if (kg <= breakAfterKg) {
      px = (kg / breakAfterKg) * (maxBarHeightPx * 0.55);
    } else {
      const extra = kg - breakAfterKg;
      // Log stuff
      const compressedExtra = Math.log10(1 + extra / compressionRatio) * (maxBarHeightPx * 0.18);
      px = (maxBarHeightPx * 0.55) + compressedExtra;
    }
    return Math.min(px, maxBarHeightPx);
  }

  // Graph render
  function renderChart() {
    const pos = Number($slider.value);
    const kwh = sliderToKwh(pos);

    $sliderValue.textContent = fmt(kwh);
    $sliderEquiv.textContent = getEquivalentText(kwh);

    const activeSources = CONFIG.sources.filter(s => state.enabled[s.id]);

    // CO2 Count for each source
    const data = activeSources.map(s => {
      const kg = (s.gPerKwh * kwh) / 1000;
      return { ...s, kg };
    });

    const maxKg = Math.max(...data.map(d => d.kg), 0.001);
    const anyAboveBreak = maxKg > CONFIG.chart.breakAfterKg;
    $zigzag.classList.toggle("hidden", !anyAboveBreak);
    $chartNote.classList.toggle("hidden", !anyAboveBreak);

    $barsContainer.innerHTML = "";

    if (data.length === 0) {
      $barsContainer.innerHTML = `<p class="empty-msg">Choisis au moins une source d'énergie parmi celles ci-dessus️</p>`;
      $summaryText.textContent = "";
      return;
    }

    data.forEach(d => {
      const heightPx = kgToBarHeight(d.kg);

      const col = document.createElement("div");
      col.className = "bar-col";

      col.innerHTML = `
        <div class="bar-value">${fmt(d.kg)} kg</div>
        <div class="bar-track">
          <div class="bar-fill" style="height:0px; background:${d.color};"></div>
        </div>
        <div class="bar-icon">
          <img src="${d.icon}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'"/>
          <span style="display:none">${d.emoji}</span>
        </div>
        <div class="bar-label">${d.name}</div>
      `;

      $barsContainer.appendChild(col);

      // Growth anim
      requestAnimationFrame(() => {
        const fill = col.querySelector(".bar-fill");
        fill.style.height = heightPx + "px";
      });
    });

    renderSummary(data);
  }

  // results
  function renderSummary(data) {
    if (data.length < 2) {
      $summaryText.textContent = data.length === 1
        ? `${data[0].name}: ${fmt(data[0].kg)} kg de CO₂ par unité d'énergie injectée.`
        : "";
      return;
    }
    const max = data.reduce((a, b) => a.kg > b.kg ? a : b);
    const min = data.reduce((a, b) => a.kg < b.kg ? a : b);
    if (min.kg <= 0) { $summaryText.textContent = ""; return; }

    const ratio = max.kg / min.kg;
    const diffKg = max.kg - min.kg;

    const templates = CONFIG.summaryTemplates
      .filter(t => ratio >= t.minRatio)
      .sort((a, b) => b.minRatio - a.minRatio);
    const template = templates[0] || CONFIG.summaryTemplates[0];

    $summaryText.textContent = template.text
      .replace("{ratio}", fmt(Math.round(ratio)))
      .replace("{kg}", fmt(diffKg));
  }

  // slider
  $slider.min = CONFIG.slider.min;
  $slider.max = CONFIG.slider.max;
  $slider.value = CONFIG.slider.default;
  $slider.addEventListener("input", renderChart);

  // initialisation
  applyTexts();
  renderToggles();
  renderChart();

})();
