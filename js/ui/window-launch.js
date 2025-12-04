// js/ui/window-launch.js
import { incrementZ } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { activeUser } from "../core/state.js";

export function initWindowLaunchers() {
  document.querySelectorAll(".app-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.target;
      const win = document.getElementById(id);
      if (!win) return;

      win.style.display = "block";
      win.style.zIndex = incrementZ();

      // save open state
      if (!activeUser.windowState) activeUser.windowState = {};
      if (!activeUser.windowState[id]) activeUser.windowState[id] = {};

      activeUser.windowState[id].open = true;
      saveActiveUser();
    });
  });
}
