(function () {
  "use strict";

  const boardEl = document.getElementById("board");
  const extractBtn = document.getElementById("extractBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const prizesBtn = document.getElementById("prizesBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const fullScreenBtn = document.getElementById("fullScreenBtn");
  const currentValueEl = document.getElementById("currentValue");
  const previousValueEl = document.getElementById("previousValue");

  /**
   * State
   */
  const TOTAL = 90;
  const numbers = Array.from({ length: TOTAL }, (_, i) => i + 1);
  let called = new Set();
  let current = null;
  let previousStack = [];
  let isAnimating = false;
  const ANIMATION_MS = 500;
  const ANIM_HTML =
    '<img src="./assets/estrazione.gif" alt="Estrazione in corso" class="estrazione-gif">';

  let smorfia = null;

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
    if (isAnimating) {
      currentValueEl.innerHTML = ANIM_HTML;
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
    current = null;
    isAnimating = true;
    updateDisplays();

    // After animation, pick and show new number
    setTimeout(() => {
      const n = pickRandomRemaining();
      isAnimating = false;
      if (n == null) {
        updateDisplays();
        return;
      }
      called.add(n);
      current = n;
      markCalled(n);
      saveStateToCookie();
      updateDisplays();
    }, ANIMATION_MS);
  }

  // Save and load state from cookies
  function saveStateToCookie() {
    const state = {
      called: Array.from(called),
      current,
      previousStack,
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
      // Mark called numbers (after board is built)
      for (const n of called) markCalled(n);
      updateDisplays();
    } catch (e) {}
  }

  /** Build board */
  function buildBoard() {
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= TOTAL; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = cellId(i);
      cell.textContent = String(i);
      cell.setAttribute("role", "gridcell");
      frag.appendChild(cell);
    }
    boardEl.appendChild(frag);
  }

  /** Menu handlers */
  function initMenu() {
    newGameBtn.addEventListener("click", newGame);
    extractBtn.addEventListener("click", extractNumber);
    fullScreenBtn.addEventListener("click", toggleFullscreen);
    prizesBtn.addEventListener("click", () => {
      alert(
        "Calcolo premi non disponibile: servono le cartelle dei giocatori."
      );
    });
    aboutBtn.addEventListener("click", () => {
      alert(
        "Tombola – semplice tabellone 1–90.\n\nFunzioni:\n• Nuova partita: azzera estrazioni e tabellone.\n• Estrai numero: estrae un numero non ancora chiamato.\n• Calcola premi: placeholder (richiede cartelle per i premi).\n\nmany thanks to Peter Boccia"
      );
    });
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
