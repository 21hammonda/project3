// js/core/init.js

import { showBootScreen } from "./boot.js";
import { setupLogin } from "./login.js";
import { on } from "./events.js";
import { activeUser } from "./state.js";
import { activeUsername } from "./state.js";

import { setupTheme, initThemeControls } from "../ui/theme.js";
import { restoreWindows, initWindowDragging } from "../ui/windows.js";
import { startClocks } from "../ui/clock.js";
import { initWindowLaunchers } from "../ui/window-launch.js";


import { initRuns } from "../features/runs.js";
import { initJournal } from "../features/journal.js";
import { initShoes } from "../features/shoes.js";
import { initRaces } from "../features/races.js";
import { initWeeklyChart } from "../features/weeklyChart.js";
import { initTrainingTabs } from "../ui/tabs.js";


// INITIAL LOAD (before login)
window.addEventListener("DOMContentLoaded", () => {
  showBootScreen();
  setupLogin();
  startClocks();

  // Window dragging should work even before login
  initWindowDragging();
});

// ON LOGIN
on("user:login", () => {

  // UPDATE USERNAME IN UI
  document.getElementById("sidebarUsername").textContent = activeUsername;
  document.querySelector(".runner-name").textContent = activeUsername;


  // ENSURE THEME EXISTS
  if (!activeUser.theme) {
    activeUser.theme = {
      "--desktop-bg": "#008080",
      "--window-bg": "#e0e0e0",
      "--accent-color": "#000080",
      pattern: "none",
      patternColor: "#ffffff"
    };
  }

  // THEME 
  setupTheme();
  initThemeControls();

  // FEATURES 
  // initRuns();
  // initShoes();
  // initJournal();
  // initRaces();
  // initWeeklyChart();

  // WINDOWS
  initWindowLaunchers();
  restoreWindows();

  // Delay feature inits so DOM is fully available
  requestAnimationFrame(() => {
    initRuns();
    initShoes();
    initJournal();
    initRaces();
    initWeeklyChart();
    restoreWindows();
    initTrainingTabs();
  });
});

