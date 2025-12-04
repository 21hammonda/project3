// js/ui/theme.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { applyPattern } from "./patterns.js";

// WIN95 COLOR PALETTE (same as your old index.js)
const win95Palette = [
  "#000000", "#808080", "#C0C0C0", "#FFFFFF",
  "#800000", "#FF0000", "#808000", "#FFFF00",
  "#008000", "#00FF00", "#008080", "#00FFFF",
  "#000080", "#0000FF", "#800080", "#FF00FF",
  "#804000", "#FF8000", "#408000", "#80FF00",
  "#004000", "#00FF80", "#004080", "#0080FF",
  "#400080", "#8000FF", "#FF0080", "#FF8080",
  "#8080FF", "#80FFFF", "#80FF80", "#FFFF80"
];

// build the little color squares inside Desktop/Window/Accent grids
function buildColorGrid(gridEl, cssVarName, themeKey) {
  if (!gridEl) return;

  win95Palette.forEach(color => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.background = color;

    swatch.addEventListener("click", () => {
      document.documentElement.style.setProperty(cssVarName, color);

      // activeUser.theme[themeKey] = color;
      // themeKey is now "--desktop-bg"
      activeUser.theme[themeKey] = color; 
      saveActiveUser();
    });

    gridEl.appendChild(swatch);
  });
}

// Apply theme values from activeUser on login
// export function setupTheme() {
//   if (!activeUser || !activeUser.theme) return;

//   // Apply CSS vars
//   document.documentElement.style.setProperty("--desktop-bg", activeUser.theme["desktopColor"] || "#008080");
//   document.documentElement.style.setProperty("--window-bg", activeUser.theme["windowColor"] || "#e0e0e0");
//   document.documentElement.style.setProperty("--accent-color", activeUser.theme["accentColor"] || "#000080");

//   // Rebuild color grids
//   buildColorGrid(document.getElementById("desktopColorGrid"), "--desktop-bg", "desktopColor");
//   buildColorGrid(document.getElementById("windowColorGrid"), "--window-bg", "windowColor");
//   buildColorGrid(document.getElementById("accentColorGrid"), "--accent-color", "accentColor");

//   // Apply pattern
//   applyPattern();
// }
export function setupTheme() {
  if (!activeUser) return;

  // MIGRATE OLD KEYS -> NEW KEYS
  const t = activeUser.theme || {};

  // if user still has old keys, convert them
  if (t.desktopColor) {
    t["--desktop-bg"] = t.desktopColor;
    delete t.desktopColor;
  }
  if (t.windowColor) {
    t["--window-bg"] = t.windowColor;
    delete t.windowColor;
  }
  if (t.accentColor) {
    t["--accent-color"] = t.accentColor;
    delete t.accentColor;
  }

  // ensure required defaults
  t["--desktop-bg"] = t["--desktop-bg"] || "#008080";
  t["--window-bg"] = t["--window-bg"] || "#e0e0e0";
  t["--accent-color"] = t["--accent-color"] || "#000080";
  t.pattern = t.pattern || "none";
  t.patternColor = t.patternColor || "#ffffff";

  activeUser.theme = t;
  saveActiveUser();

  // Build color grids
  buildColorGrid(document.getElementById("desktopColorGrid"), "--desktop-bg", "--desktop-bg");
  buildColorGrid(document.getElementById("windowColorGrid"), "--window-bg", "--window-bg");
  buildColorGrid(document.getElementById("accentColorGrid"), "--accent-color", "--accent-color");

  // Apply background pattern
  applyPattern();
}


// Theme controls (pattern changes, etc.)
export function initThemeControls() {
  const patternSelect = document.getElementById("patternSelect");
  const patternColor = document.getElementById("patternColor");

  patternSelect.addEventListener("change", () => {
    activeUser.theme.pattern = patternSelect.value;
    saveActiveUser();
    applyPattern();
  });

  patternColor.addEventListener("input", () => {
    activeUser.theme.patternColor = patternColor.value;
    saveActiveUser();
    applyPattern();
  });
}
