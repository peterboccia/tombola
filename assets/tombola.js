(function () {
  "use strict";

  const boardEl = document.getElementById("board");
  const extractBtn = document.getElementById("extractBtn");
  const currentValueEl = document.getElementById("currentValue");

  /**
   * State
   */
  const TOTAL = 90;
  const numbers = Array.from({ length: TOTAL }, (_, i) => i + 1);
  let called = new Set();
  let current = null;
  let previousStack = [];
  let isAnimating = false;
  let ANIMATION_MS = 500;
  const ANIM_HTML =
    '<img src="./assets/estrazione-clean.gif" alt="Estrazione in corso" class="estrazione-gif">';

  let smorfia = null;

  /**
   * Speech synthesis setup
   */

  // Speech synthesis for number and description
  function speakNumberAndDescription(n) {
    if (!vocalSynthEnabled || !window.speechSynthesis) return;
    let text = `${n}`;
    // const info = getSmorfiaInfo(n);
    // if (info) {
    //   if (info.napoletano) text += `. ${info.napoletano}`;
    //   if (info.significato) text += `. ${info.significato}`;
    // }
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "it-IT";
    window.speechSynthesis.cancel(); // Stop any previous speech
    window.speechSynthesis.speak(utter);
  }

  function getSmorfiaInfo(n) {
    if (!smorfia) return null;
    return smorfia.find((e) => e.numero === n);
  }

  /** Fullscreen helpers */
  function isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
  }

  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
  }

  function toggleFullscreen() {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  /** Utility */
  function pickRandomRemaining() {
    const remaining = numbers.filter((n) => !called.has(n));
    if (remaining.length === 0) return null;
    const idx = Math.floor(Math.random() * remaining.length);
    return remaining[idx];
  }

  function cellId(n) {
    return `cell-${n}`;
  }

  function markCalled(n) {
    const el = document.getElementById(cellId(n));
    if (el) el.classList.add("called");
  }

  // Evidenzia la cella dell'ultimo numero chiamato
  function highlightCurrent(n) {
    for (let i = 1; i <= TOTAL; i++) {
      const el = document.getElementById(cellId(i));
      if (el) el.classList.remove("highlight");
    }
    if (n) {
      const el = document.getElementById(cellId(n));
      if (el) el.classList.add("highlight");
    }
  }

  function unmarkAll() {
    for (let i = 1; i <= TOTAL; i++) {
      const el = document.getElementById(cellId(i));
      if (el) el.classList.remove("called");
    }
  }

  function adjustPreviousListHeight() {
    // Set max-height of the previous-list based on its parent .display height
    const previousDisplay = document.getElementById("previousDisplay");
    const previousList = document.getElementById("previousList");
    if (previousDisplay && previousList) {
      const parentHeight = previousDisplay.clientHeight;
      previousList.style.maxHeight = Math.max(0, parentHeight - 50) + "px";
    }
  }

  function updateDisplays() {
    // Previous numbers (from second-last to first)
    const previousListEl = document.getElementById("previousList");
    if (previousListEl) {
      if (previousStack.length === 0) {
        previousListEl.innerHTML = '<div class="previous-empty">–</div>';
      } else {
        previousListEl.innerHTML = previousStack
          .map((n) => {
            const info = getSmorfiaInfo(n);
            return `<div class="previous-item">
            <span class="numero-estratto">${n}</span>
            ${
              info
                ? `<span class="smorfia-napoletano">${info.napoletano}</span>`
                : ""
            }
          </div>`;
          })
          .join("");
      }
      // Update max-height after every update
      setTimeout(adjustPreviousListHeight, 0);
    }
    // Aggiorna highlight
    highlightCurrent(current);
    if (isAnimating) {
      currentValueEl.innerHTML = ANIM_HTML;
      // Applica dissolvenza
      const img = currentValueEl.querySelector(".estrazione-gif");
      if (img) {
        img.classList.add("fade-in");
      }
    } else {
      if (current) {
        const info = getSmorfiaInfo(current);
        if (info && info.napoletano) {
          currentValueEl.innerHTML = `${current}<br /><span class="smorfia-napoletano">${info.napoletano}</span>`;
        } else {
          currentValueEl.textContent = String(current);
        }
      } else {
        currentValueEl.textContent = "–";
      }
    }
    extractBtn.disabled = isAnimating || called.size >= TOTAL;
    extractBtn.innerHTML =
      called.size >= TOTAL
        ? "Tutti estratti"
        : isAnimating
        ? "Estrazione…"
        : "Estrai numero <small>(Spazio)</small>";
  }

  /** Actions */
  async function newGame() {
    const confirmed = await window.showModal({
      title: "Nuova partita",
      message:
        "Sei sicuro di voler iniziare una nuova partita?\n\nAttenzione: Tutti i progressi andranno persi!",
      confirmText: "Sì",
      cancelText: "No",
    });
    if (!confirmed) return;
    called = new Set();
    current = null;
    previousStack = [];
    isAnimating = false;
    unmarkAll();
    saveStateToCookie();
    updateDisplays();
  }

  function extractNumber() {
    if (isAnimating || called.size >= TOTAL) return;
    // Stack: add current to the top if it exists
    if (current != null) previousStack.unshift(current);
    // Rimuovi highlight dal precedente
    highlightCurrent(null);
    current = null;
    isAnimating = true;
    updateDisplays();

    // After animation, pick and show new number
    setTimeout(() => {
      const n = pickRandomRemaining();
      speakNumberAndDescription(n);
      setTimeout(() => {
        isAnimating = false;
        if (n == null) {
          updateDisplays();
          return;
        }
        called.add(n);
        current = n;
        markCalled(n);
        highlightCurrent(n);
        saveStateToCookie();
        updateDisplays();
      }, 100);
    }, ANIMATION_MS);
  }

  // Save and load state from cookies
  function saveStateToCookie() {
    const state = {
      called: Array.from(called),
      current,
      previousStack,
      animationMs: ANIMATION_MS,
    };
    document.cookie =
      "tombolaState=" +
      encodeURIComponent(JSON.stringify(state)) +
      "; path=/; max-age=2592000";
  }

  function loadStateFromCookie() {
    const match = document.cookie.match(/(?:^|; )tombolaState=([^;]*)/);
    if (!match) return;
    try {
      const state = JSON.parse(decodeURIComponent(match[1]));
      called = new Set(state.called || []);
      current = state.current || null;
      previousStack = state.previousStack || [];
      if (typeof state.animationMs === "number") {
        ANIMATION_MS = state.animationMs;
      }
      // Mark called numbers (after board is built)
      for (const n of called) markCalled(n);
      updateDisplays();
    } catch (e) {}
  }

  /** Build board */
  function buildBoard() {
    const frag = document.createDocumentFragment();

    const emptyCell = document.createElement("div");
    emptyCell.className = "empty";

    for (let i = 1; i <= TOTAL; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = cellId(i);
      cell.textContent = String(i);
      cell.setAttribute("role", "gridcell");
      frag.appendChild(cell);

      // Add an empty span after every multiple of 5 to create the cartella spacing
      if (i % 10 === 5) {
        frag.appendChild(emptyCell.cloneNode());
      } else if (i % 30 === 0 && i !== TOTAL) {
        for (let j = 0; j < 11; j++) {
          frag.appendChild(emptyCell.cloneNode());
        }
      }
    }
    boardEl.appendChild(frag);
  }

  /** Settings modal management **/
  let vocalSynthEnabled = localStorage.getItem("vocalSynthEnabled") !== "false";

  async function showSettingsModal() {
    // create the content of the modal
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "12px";
    // Label
    const label = document.createElement("label");
    label.textContent = "Durata animazione estrazione (ms):";
    label.htmlFor = "animationMsInput";
    // Slider
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "5000";
    input.step = "25";
    input.value = String(ANIMATION_MS);
    input.id = "animationMsInput";
    // Number display
    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = input.value + " ms";
    input.addEventListener("input", () => {
      valueDisplay.textContent = input.value + " ms";
    });
    // Wrapper
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.appendChild(input);
    row.appendChild(valueDisplay);
    container.appendChild(label);
    container.appendChild(row);

    // Vocal synth toggle
    const synthRow = document.createElement("div");
    synthRow.style.display = "flex";
    synthRow.style.alignItems = "center";
    synthRow.style.gap = "8px";
    const synthLabel = document.createElement("label");
    synthLabel.textContent = "Sintesi vocale abilitata:";
    synthLabel.htmlFor = "vocalSynthToggle";
    const synthToggle = document.createElement("input");
    synthToggle.type = "checkbox";
    synthToggle.id = "vocalSynthToggle";
    synthToggle.checked = vocalSynthEnabled;
    synthRow.appendChild(synthLabel);
    synthRow.appendChild(synthToggle);
    container.appendChild(synthRow);

    // Show modal
    const result = await window.showModalHtml({
      title: "Impostazioni",
      content: container,
      confirmText: "Salva",
      cancelText: "Annulla",
    });
    // update ANIMATION_MS and vocalSynthEnabled in case of confirm
    if (result) {
      ANIMATION_MS = parseInt(input.value, 10);
      vocalSynthEnabled = synthToggle.checked;
      localStorage.setItem(
        "vocalSynthEnabled",
        vocalSynthEnabled ? "true" : "false"
      );
      saveStateToCookie();
    }
  }

  /** Menu handlers */
  function initMenu() {
    // button to start new game
    document.getElementById("newGameBtn")?.addEventListener("click", newGame);
    // button to extract number
    extractBtn.addEventListener("click", extractNumber);
    // button to toggle fullscreen
    document
      .getElementById("fullScreenBtn")
      ?.addEventListener("click", toggleFullscreen);
    // button to calculate prizes (placeholder)
    document.getElementById("prizesBtn")?.addEventListener("click", () => {
      alert(
        "Calcolo premi non disponibile: servono le cartelle dei giocatori."
      );
    });
    // button to show about info
    document.getElementById("aboutBtn")?.addEventListener("click", () => {
      alert(
        "Tombola – semplice tabellone 1–90.\n\nFunzioni:\n• Nuova partita: azzera estrazioni e tabellone.\n• Estrai numero: estrae un numero non ancora chiamato.\n• Calcola premi: placeholder (richiede cartelle per i premi).\n\nmany thanks to Peter Boccia"
      );
    });
    // button to switch theme
    document.getElementById("switchThemeBtn")?.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
    // button to show settings modal
    document
      .getElementById("settingsBtn")
      ?.addEventListener("click", showSettingsModal);
    // Spacebar triggers extractNumber
    window.addEventListener("keydown", function (e) {
      if (
        e.code === "Space" &&
        !isAnimating &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        extractNumber();
      }
    });
  }

  /** Init */
  function init() {
    // Get the latest stored theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
    }

    // Pre-warm speech synthesis engine
    if (window.speechSynthesis) {
      const warmupUtter = new window.SpeechSynthesisUtterance("");
      warmupUtter.lang = "it-IT";
      window.speechSynthesis.speak(warmupUtter);
      window.speechSynthesis.cancel();
    }

    // Load Smorfia data
    fetch("./assets/smorfia.json")
      .then((r) => r.json())
      .then((data) => {
        smorfia = data;
        loadStateFromCookie();
      });
    buildBoard();
    initMenu();
    updateDisplays();
    window.addEventListener("resize", adjustPreviousListHeight);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
