// js/ui/windows.js
import { activeUser } from "../core/state.js";
import { incrementZ } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";

// INIT DRAG + RESIZE + BUTTON CONTROLS
export function initWindowDragging() {
  document.querySelectorAll(".app-window").forEach(win => {
    makeWindowDraggable(win);
    makeWindowResizable(win);
    attachWindowButtons(win);
  });
}

// DRAGGING
export function makeWindowDraggable(win) {
  const bar = win.querySelector(".window-titlebar");
  if (!bar) return;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  bar.addEventListener("mousedown", (e) => {
    dragging = true;
    win.style.zIndex = incrementZ();
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    win.style.left = e.clientX - offsetX + "px";
    win.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    if (dragging) saveWindowState(win);
    dragging = false;
  });
}

// RESIZING
export function makeWindowResizable(win) {
  const resizer = win.querySelector(".window-resizer");
  if (!resizer) return;

  let resizing = false;
  let startX, startY, startW, startH;

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    resizing = true;

    const box = win.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = box.width;
    startH = box.height;

    win.style.zIndex = incrementZ();
  });

  document.addEventListener("mousemove", (e) => {
    if (!resizing) return;

    win.style.width = Math.max(startW + (e.clientX - startX), 260) + "px";
    win.style.height = Math.max(startH + (e.clientY - startY), 150) + "px";
  });

  document.addEventListener("mouseup", () => {
    if (resizing) saveWindowState(win);
    resizing = false;
  });
}

// BUTTON CONTROLS
function attachWindowButtons(win) {
  const closeBtn = win.querySelector(".win-close");
  const minBtn = win.querySelector(".win-min");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      win.style.display = "none";
      activeUser.windowState[win.id].open = false;
      saveActiveUser();
    });
  }

  if (minBtn) {
    minBtn.addEventListener("click", () => {
      if (win.style.display === "none") {
        win.style.display = "block";
        win.style.zIndex = incrementZ();
      } else {
        win.style.display = "none";
        activeUser.windowState[win.id].open = false;
        saveActiveUser();
      }
      saveWindowState(win);
    });
  }
}

// SAVE STATE
// export function saveWindowState(win) {
//   if (!activeUser) return;

//   if (!activeUser.windowState) activeUser.windowState = {};

//   const rect = win.getBoundingClientRect();

//   activeUser.windowState[win.id] = {
//     left: rect.left,
//     top: rect.top,
//     width: rect.width,
//     height: rect.height,
//     open: win.style.display !== "none"
//   };

//   saveActiveUser();
// }
export function saveWindowState(win) {
  if (!activeUser) return;

  // Only save if window is currently visible
  if (win.style.display === "none") return;

  const rect = win.getBoundingClientRect();

  if (!activeUser.windowState) {
    activeUser.windowState = {};
  }

  activeUser.windowState[win.id] = {
    left: win.style.left || rect.left + "px",
    top: win.style.top || rect.top + "px",
    width: win.style.width || rect.width + "px",
    height: win.style.height || rect.height + "px",
    open: true
  };

  saveActiveUser();
}


// RESTORE STATE
// export function restoreWindows() {
//   if (!activeUser || !activeUser.windowState) return;

//   Object.entries(activeUser.windowState).forEach(([id, state]) => {
//     const win = document.getElementById(id);
//     if (!win) return;

//     win.style.left = state.left + "px";
//     win.style.top = state.top + "px";
//     win.style.width = state.width + "px";
//     win.style.height = state.height + "px";

//     win.style.display = state.open ? "block" : "none";
//   });
// }
export function restoreWindows() {
  if (!activeUser || !activeUser.windowState) return;

  Object.entries(activeUser.windowState).forEach(([id, state]) => {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.left = state.left || "260px";
    win.style.top = state.top || "120px";
    win.style.width = state.width || "420px";
    win.style.height = state.height || "260px";

    win.style.display = state.open ? "block" : "none";
  });
}





// // js/ui/windows.js
// import { activeUser } from "../core/state.js";
// import { incrementZ } from "../core/state.js";
// import { saveActiveUser } from "../core/storage.js";

// export function initWindowDragging() {
//   document.querySelectorAll(".app-window").forEach(makeWindowDraggable);
//   document.querySelectorAll(".app-window").forEach(makeWindowResizable);
// }

// export function makeWindowDraggable(win) {
//   const bar = win.querySelector(".window-titlebar");
//   let dragging = false;
//   let offsetX = 0;
//   let offsetY = 0;

//   bar.addEventListener("mousedown", (e) => {
//     dragging = true;
//     win.style.zIndex = incrementZ();
//     offsetX = e.clientX - win.offsetLeft;
//     offsetY = e.clientY - win.offsetTop;
//   });

//   document.addEventListener("mousemove", (e) => {
//     if (!dragging) return;
//     win.style.left = e.clientX - offsetX + "px";
//     win.style.top = e.clientY - offsetY + "px";
//   });

//   document.addEventListener("mouseup", () => {
//     if (dragging) saveWindowState(win);
//     dragging = false;
//   });
// }

// export function makeWindowResizable(win) {
//   const resizer = win.querySelector(".window-resizer");
//   if (!resizer) return;

//   let resizing = false;
//   let startX, startY, startW, startH;

//   resizer.addEventListener("mousedown", (e) => {
//     e.preventDefault();
//     resizing = true;

//     const box = win.getBoundingClientRect();
//     startX = e.clientX;
//     startY = e.clientY;
//     startW = box.width;
//     startH = box.height;

//     win.style.zIndex = incrementZ();
//   });

//   document.addEventListener("mousemove", (e) => {
//     if (!resizing) return;
//     win.style.width = Math.max(startW + (e.clientX - startX), 260) + "px";
//     win.style.height = Math.max(startH + (e.clientY - startY), 150) + "px";
//   });

//   document.addEventListener("mouseup", () => {
//     if (resizing) saveWindowState(win);
//     resizing = false;
//   });
// }

// export function saveWindowState(win) {
//   if (!activeUser) return;

//   const rect = win.getBoundingClientRect();
//   if (!activeUser.windowState) activeUser.windowState = {};

//   activeUser.windowState[win.id] = {
//     left: rect.left,
//     top: rect.top,
//     width: rect.width,
//     height: rect.height,
//     open: win.style.display !== "none",
//   };

//   saveActiveUser();
// }

// export function restoreWindows() {
//   if (!activeUser || !activeUser.windowState) return;

//   Object.entries(activeUser.windowState).forEach(([id, state]) => {
//     const win = document.getElementById(id);
//     if (!win) return;

//     win.style.left = state.left + "px";
//     win.style.top = state.top + "px";
//     win.style.width = state.width + "px";
//     win.style.height = state.height + "px";
//     win.style.display = state.open ? "block" : "none";
//   });
// }
