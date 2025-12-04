// /js/features/journal-paint.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { journal, renderJournalPage } from "./journal.js";
import { journalPalettes } from "./palette-colors.js";

// Called when user clicks an entry after choosing the paintbrush.
export function openPalettePopup(entryIndex) {
  const popup = document.getElementById("palettePopup");
  const grid = document.getElementById("paletteOptions");

  grid.innerHTML = "";
  popup.classList.remove("hidden");

  journalPalettes.forEach((palette, i) => {
    const option = document.createElement("div");
    option.className = "palette-option";
    option.dataset.index = i;

    option.innerHTML = `
      <div class="palette-swatch">
        <div style="background:${palette.bg}"></div>
        <div style="background:${palette.header}"></div>
        <div style="background:${palette.meta}"></div>
        <div style="background:${palette.body}"></div>
      </div>
      <span class="palette-name">${palette.name}</span>
    `;

    option.addEventListener("click", () => {
      document
        .querySelectorAll(".palette-option")
        .forEach(p => p.classList.remove("selected"));

      option.classList.add("selected");
    });

    grid.appendChild(option);
  });

  // Connect buttons
  document.getElementById("applyPaletteBtn").onclick = () => {
    const sel = document.querySelector(".palette-option.selected");
    if (!sel) return;

    const palette = journalPalettes[sel.dataset.index];

    journal[entryIndex].palette = palette;
    activeUser.journal = journal;
    saveActiveUser();
    renderJournalPage();

    popup.classList.add("hidden");
  };

  document.getElementById("cancelPaletteBtn").onclick = () =>
    popup.classList.add("hidden");
}

// Applied during renderJournalPage()
export function applyPaletteToDiv(div, palette) {
  if (!palette) return;

  div.style.backgroundColor = palette.bg;

  div.querySelector(".journal-entry-header").style.color = palette.header;
  div.querySelector(".journal-entry-meta").style.color = palette.meta;
  div.querySelector(".journal-entry-body").style.color = palette.body;
}
