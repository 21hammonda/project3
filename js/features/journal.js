// /js/features/journal.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { applyPaletteToDiv } from "./journal-paint.js";
import { on } from "../core/events.js";


import { openStickerPicker } from "./journal-stickers.js";
import { openPalettePopup } from "./journal-paint.js";
import { startPhotoFlow } from "./journal-photos.js";

export let journal = [];
let page = 0;
const PER = 3;

//INIT
export function initJournal() {
  journal = activeUser.journal || [];
  activeUser.journal = journal;

  // nav
  document.getElementById("prevJournalPage").addEventListener("click", prev);
  document.getElementById("nextJournalPage").addEventListener("click", next);

  // tools
  document.getElementById("addStickerBtn").addEventListener("click", enterStickerMode);
  document.getElementById("paintBtn").addEventListener("click", enterPaintMode);
  document.getElementById("photoBtn").addEventListener("click", enterPhotoMode);

  renderJournalPage();
}

//PAGE NAVIGATION
function prev() {
  if (page > 0) page--;
  renderJournalPage();
}

function next() {
  if ((page + 1) * PER < journal.length) page++;
  renderJournalPage();
}

//RENDER PAGE
export function renderJournalPage() {
  // keep in sync
  journal = activeUser.journal || [];

  const container = document.getElementById("journalEntries");
  container.innerHTML = "";

  const start = page * PER;
  const items = journal.slice(start, start + PER);

  document.getElementById("journalPageNumber").textContent = `Page ${page + 1}`;

  items.forEach((entry, idx) => {
    const index = start + idx;

    const div = document.createElement("div");
    div.className = "journal-entry";
    div.dataset.entryIndex = index;

    div.innerHTML = `
      <div class="journal-entry-header">${entry.date} — ${entry.distance} mi</div>
      <div class="journal-entry-meta">
        ${entry.time !== "---" ? "Time: " + entry.time : ""}
        ${entry.temp ? " • Temp: " + entry.temp + "°F" : ""}
        ${entry.shoe !== "---" ? " • Shoes: " + entry.shoe : ""}
      </div>

      <div class="journal-entry-body">${entry.notes}</div>

      <div class="journal-entry-stickers">
        ${(entry.stickers || [])
          .map(f => `<img src="images/stickers/${f}" class="journal-sticker">`)
          .join("")}
      </div>

      <div class="journal-entry-photos">
        ${(entry.photos || [])
          .map(src => `<img src="${src}" class="journal-photo">`)
          .join("")}
      </div>
    `;

    if (entry.palette) {
      applyPaletteToDiv(div, entry.palette);
    }

    container.appendChild(div);
  });
}

//PALETTE APPLY UTIL
function applyPalette(div, pal) {
  div.style.background = pal.bg;
  div.querySelector(".journal-entry-header").style.color = pal.header;
  div.querySelector(".journal-entry-meta").style.color = pal.meta;
  div.querySelector(".journal-entry-body").style.color = pal.body;
}

//MODE EXIT (clears all listeners)
function exitModes() {
  document.querySelectorAll(".journal-entry").forEach(div => {
    // remove all listeners
    const clean = div.cloneNode(true);  
    div.replaceWith(clean);
  });
}

//PHOTO MODE
function enterPhotoMode() {
  alert("Click an entry to add a photo.");
  document.querySelectorAll(".journal-entry").forEach(div => {
    div.classList.add("entry-select-mode");
    div.addEventListener("click", photoTarget);
  });
}

function photoTarget(e) {
  const idx = Number(e.currentTarget.dataset.entryIndex);
  exitModes();
  // handled in /journal-photos.js
  startPhotoFlow(idx);   
}

//STICKER MODE
function enterStickerMode() {
  alert("Click an entry to add a sticker.");
  document.querySelectorAll(".journal-entry").forEach(div => {
    div.classList.add("entry-select-mode");
    div.addEventListener("click", stickerTarget);
  });
}

function stickerTarget(e) {
  const idx = Number(e.currentTarget.dataset.entryIndex);
  exitModes();
  // handled in /journal-stickers.js
  openStickerPicker(idx);  
}

//PAINT MODE
function enterPaintMode() {
  alert("Click an entry to customize its colors.");
  document.querySelectorAll(".journal-entry").forEach(div => {
    div.classList.add("entry-select-mode");
    div.addEventListener("click", paintTarget);
  });
}

function paintTarget(e) {
  const idx = Number(e.currentTarget.dataset.entryIndex);
  exitModes();
  // handled in /journal-paint.js
  openPalettePopup(idx);  
}

on("runs:changed", () => renderJournalPage());
