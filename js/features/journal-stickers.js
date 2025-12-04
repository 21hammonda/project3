// /js/features/journal-stickers.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { journal, renderJournalPage } from "./journal.js";

export function openStickerPicker(entryIndex) {
  const picker = document.getElementById("stickerPicker");
  const grid = document.getElementById("stickerGrid");

  grid.innerHTML = "";

  const stickerFiles = [
    "sticker-catheart.gif", "sticker-dance.gif", "sticker-doghappy.gif",
    "sticker-dogthumbsup.gif", "sticker-fire.gif", "sticker-hamstersad.gif",
    "sticker-happyrain.gif", "sticker-pig.gif", "sticker-rainbow.gif",
    "sticker-rainsad.gif", "sticker-scaredcat.gif", "sticker-sun.gif",
    "sticker-thunderstorm.gif", "sticker-brokenheart.gif", "sticker-bug.gif",
    "sticker-dora.gif", "sticker-eevee.gif", "sticker-ghibli.gif",
    "sticker-heart.gif", "sticker-pikachu.gif", "sticker-superman.gif"
  ];

  stickerFiles.forEach(file => {
    const img = document.createElement("img");
    img.src = `images/stickers/${file}`;
    img.className = "sticker-option";
    img.dataset.file = file;

    img.addEventListener("click", () => {
      if (!journal[entryIndex].stickers) journal[entryIndex].stickers = [];
      journal[entryIndex].stickers.push(file);

      activeUser.journal = journal;
      saveActiveUser();
      renderJournalPage();

      picker.classList.add("hidden");
    });

    grid.appendChild(img);
  });

  picker.classList.remove("hidden");

  document.getElementById("closeStickerPicker").onclick = () => {
    picker.classList.add("hidden");
  };
}
