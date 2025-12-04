import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { renderJournalPage } from "./journal.js";
import { paletteOptions } from "./palette-colors.js";

export function openPalettePopup(entryIndex) {
  const popup = document.getElementById("palettePopup");
  popup.classList.remove("hidden");

  const list = document.getElementById("paletteOptions");
  list.innerHTML = "";

  paletteOptions.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "palette-option";

    const swatch = document.createElement("div");
    swatch.className = "palette-swatch";
    swatch.innerHTML = `
      <div style="background:${p.bg}"></div>
      <div style="background:${p.header}"></div>
      <div style="background:${p.tape}"></div>
    `;

    div.appendChild(swatch);

    div.addEventListener("click", () => {
      applyPalette(entryIndex, p);
      closePalettePopup();
    });

    list.appendChild(div);
  });
}

export function closePalettePopup() {
  document.getElementById("palettePopup").classList.add("hidden");
}

export function applyPalette(entryIndex, palette) {
  activeUser.journal[entryIndex].palette = palette;
  saveActiveUser();
  renderJournalPage();
}

export function applyPaletteToDiv(div, palette) {
  div.style.background = palette.bg;
  div.querySelector(".journal-entry-header").style.color = palette.header;
  div.style.setProperty("--tape-color", palette.tape);
}
