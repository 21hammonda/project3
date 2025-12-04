// /js/features/journal-photos.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { journal, renderJournalPage } from "./journal.js";

export function startPhotoFlow(entryIndex) {
  const input = document.getElementById("photoInput");

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (!journal[entryIndex].photos) journal[entryIndex].photos = [];
      journal[entryIndex].photos.push(reader.result);

      activeUser.journal = journal;
      saveActiveUser();
      renderJournalPage();
    };

    reader.readAsDataURL(file);
    input.value = "";
  };

  input.click();
}
