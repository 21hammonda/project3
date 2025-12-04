/* USER ACCOUNT STORAGE */

let activeUser = null; 
let activeUsername = null;

function loadAllUsers() {
    return JSON.parse(localStorage.getItem("runnerlog_users") || "{}");
}

function saveAllUsers(users) {
    localStorage.setItem("runnerlog_users", JSON.stringify(users));
}

function hashPassword(pw) {
    return btoa(pw);
}

/* LOGIN / SIGNUP SYSTEM */

const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const desktop = document.getElementById("desktop");
const runnerNameSpan = document.querySelector(".runner-name");

const loginTabs = document.querySelectorAll(".login-tab");
const signupOnlyFields = document.querySelectorAll(".signup-only");
const loginTitle = document.getElementById("loginTitle");
const loginSubtitle = document.getElementById("loginSubtitle");
const loginHint = document.getElementById("loginHint");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

let loginMode = "login"; // or "signup"

loginTabs.forEach(tab => {
    tab.addEventListener("click", () => {
    loginTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loginMode = tab.dataset.mode;

    if (loginMode === "login") {
        signupOnlyFields.forEach(el => el.classList.add("hidden"));
        loginTitle.textContent = "Sign In";
        loginSubtitle.textContent = "Log your miles, track your races, relive every season.";
        loginSubmitBtn.textContent = "Sign In";
        loginHint.textContent = "Enter your username + password.";
    } else {
        signupOnlyFields.forEach(el => el.classList.remove("hidden"));
        loginTitle.textContent = "Create Account";
        loginSubtitle.textContent = "Set up your RunnerLog account for this device.";
        loginSubmitBtn.textContent = "Create Account";
        loginHint.textContent = "Email optional; username must be unique.";
    }
    });
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("runnerName").value.trim();
    const email = document.getElementById("runnerEmail").value.trim() || "";
    const password = document.getElementById("runnerPassword").value;
    const confirmPassword = document.getElementById("runnerPasswordConfirm")?.value;

    if (!username) {
    alert("Username is required.");
    return;
    }

    const users = loadAllUsers();
   
    /* SIGNUP MODE ----------------------- */
    if (loginMode === "signup") {
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    if (users[username]) {
        alert("That username already exists.");
        return;
    }

    users[username] = {
        username,
        email,
        passwordHash: hashPassword(password),
        runs: [],
        journal: [],
        shoes: {},
        races: [],
        theme: {
            desktopColor: "#008080",
            windowColor: "#e0e0e0",
            accentColor: "#000080",
            pattern: "none",
            patternColor: "#ffffff"
        },
        windowState: {}
    };

    saveAllUsers(users);
    alert("Account created! Please sign in.");
    return;
    }

    /* LOGIN MODE ----------------------- */
    if (!users[username]) {
    alert("Account not found.");
    return;
    }

    if (users[username].passwordHash !== hashPassword(password)) {
    alert("Incorrect password.");
    return;
    }

    /* Successful login */
    activeUser = users[username];
    activeUsername = username;

    runnerNameSpan.textContent = activeUser.username;
    document.getElementById("sidebarUsername").textContent = activeUser.username;

    loadUserDataIntoUI();

    loginScreen.classList.add("hidden");
    desktop.classList.remove("hidden");
});

/* SAVE ACTIVE USER (AUTOMATICALLY) */

function saveActiveUser() {
    if (!activeUsername) return;
    const users = loadAllUsers();

    users[activeUsername] = {
    ...activeUser,
    runs: [...activeUser.runs],
    journal: [...activeUser.journal],
    shoes: { ...activeUser.shoes },
    races: [...activeUser.races],
    theme: { ...activeUser.theme }
    };

    saveAllUsers(users);
}
   
/* LOAD USER DATA INTO UI */
   
function loadUserDataIntoUI() {
    /*  Load Theme  */
    document.documentElement.style.setProperty("--desktop-bg", activeUser.theme.desktopColor);
    document.documentElement.style.setProperty("--window-bg", activeUser.theme.windowColor);
    document.documentElement.style.setProperty("--accent-color", activeUser.theme.accentColor);

    // desktopColorInput.value = activeUser.theme.desktopColor;
    // windowColorInput.value = activeUser.theme.windowColor;
    // accentColorInput.value = activeUser.theme.accentColor;

    patternSelect.value = activeUser.theme.pattern;
    patternColorInput.value = activeUser.theme.patternColor;
    applyPattern();

    /*  Load Shoes  */
    Object.assign(shoes, activeUser.shoes);
    renderShoes();

    /*  Load Runs  */
    // runs.length = 0;
    // runs.push(...activeUser.runs);
    /* Load Runs */
    runs.length = 0;
    activeUser.runs.forEach(r => {
        runs.push({
            ...r,
            date: r.date ? new Date(r.date) : null  // ← CRITICAL FIX
        });
    });


    /*  Load Journal  */
    journalEntriesData.length = 0;
    journalEntriesData.push(...activeUser.journal);
    
    // Ensure backward compatibility: every entry has stickers + photos arrays
    journalEntriesData.forEach(entry => {
        if (!entry.stickers) entry.stickers = [];
        if (!entry.photos) entry.photos = []; 
    });

    journalPage = 0;
    renderJournalPage();

    /*  Load Races  
    and then weekly graph?*/
    renderRaces();

    /*  Weekly Graph  */
    renderWeekChart(currentWeekStart);

    // loading data in ui
    restoreWindowState();
}
   

function restoreWindowState() {
    const states = activeUser.windowState || {};
  
    document.querySelectorAll(".app-window").forEach(win => {
      const id = win.id;
  
      if (states[id]) {
        const s = states[id];
  
        // Set visibility
        win.style.display = s.open ? "block" : "none";
  
        // Restore position
        win.style.left = s.left + "px";
        win.style.top = s.top + "px";
  
        // Optional width/height:
        if (s.width)  win.style.width = s.width + "px";
        if (s.height) win.style.height = s.height + "px";
      }
    });
}
  



/* CLOCK + DATE */

function updateClock() {
    const clockEl = document.getElementById("taskbarClock");
    const dateEl = document.getElementById("todayDate");
    const now = new Date();

    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

    clockEl.textContent = timeStr;
    dateEl.textContent = `Date: ${dateStr}`;
}
setInterval(updateClock, 1000);
updateClock();


// WIN95 ANALOG CLOCK ----------------------------------------------------
function updateAnalogClock() {
    const now = new Date();
  
    const hr = now.getHours() % 12;
    const min = now.getMinutes();
    const sec = now.getSeconds();
  
    const hrDeg = (hr + min / 60) * 30;     // 360 / 12
    const minDeg = (min + sec / 60) * 6;   // 360 / 60
    const secDeg = sec * 6;
  
    document.querySelector(".hour-hand").style.transform = `translate(-50%, -100%) rotate(${hrDeg}deg)`;
    document.querySelector(".minute-hand").style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
    document.querySelector(".second-hand").style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
}
  
setInterval(updateAnalogClock, 1000);
updateAnalogClock();
  

/* THEME CONTROLS (AUTO-SAVE!) */

// const desktopColorInput = document.getElementById("desktopColor");
// const windowColorInput = document.getElementById("windowColor");
// const accentColorInput = document.getElementById("accentColor");

// desktopColorInput.addEventListener("input", e => {
//     document.documentElement.style.setProperty("--desktop-bg", e.target.value);
//     activeUser.theme.desktopColor = e.target.value;
//     saveActiveUser();
// });

// windowColorInput.addEventListener("input", e => {
//     document.documentElement.style.setProperty("--window-bg", e.target.value);
//     activeUser.theme.windowColor = e.target.value;
//     saveActiveUser();
// });

// accentColorInput.addEventListener("input", e => {
//     document.documentElement.style.setProperty("--accent-color", e.target.value);
//     activeUser.theme.accentColor = e.target.value;
//     saveActiveUser();
// });




const journalPalettes = [
    {
      name: "Sky Blue",
      bg: "#d7ecff",
      header: "#003366",
      meta: "#265a88",
      body: "#001f33"
    },
    {
      name: "Cream + Coffee",
      bg: "#fdf6e3",
      header: "#6b4b30",
      meta: "#856d51",
      body: "#473120"
    },
    {
      name: "Mint Fresh",
      bg: "#e5fff4",
      header: "#005c4b",
      meta: "#1d7a67",
      body: "#003b30"
    },
    {
      name: "Lilac Dream",
      bg: "#f3e8ff",
      header: "#4b2a88",
      meta: "#6142a1",
      body: "#2e1758"
    },
    {
      name: "Sunset Peach",
      bg: "#ffe9d9",
      header: "#a04716",
      meta: "#c56938",
      body: "#5f260f"
    }
  ];
  

// colors for the windows 95 palette muahaha
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
  
function buildColorGrid(gridEl, themeKey) {
    win95Palette.forEach(color => {
      const swatch = document.createElement("div");
      swatch.className = "color-swatch";
      swatch.style.background = color;
  
      swatch.addEventListener("click", () => {
        document.documentElement.style.setProperty(`--${themeKey}`, color);
        activeUser.theme[themeKey] = color;
        saveActiveUser();
      });
  
      gridEl.appendChild(swatch);
    });
}

// swatch.addEventListener("click", () => {
//     gridEl.querySelectorAll(".color-swatch")
//           .forEach(s => s.classList.remove("selected"));
  
//     swatch.classList.add("selected");
  
//     document.documentElement.style.setProperty(`--${themeKey}`, color);
//     activeUser.theme[themeKey] = color;
//     saveActiveUser();
// });
  

buildColorGrid(document.getElementById("desktopColorGrid"), "desktop-bg");
buildColorGrid(document.getElementById("windowColorGrid"), "window-bg");
buildColorGrid(document.getElementById("accentColorGrid"), "accent-color");




/* PATTERN BACKGROUNDS (MACPAINT STYLE) */

const patternSelect = document.getElementById("patternSelect");
const patternColorInput = document.getElementById("patternColor");

// function patternSVG(type, color) {
//     switch (type) {
//     case "dots":
//         return `<svg width="16" height="16"><circle cx="8" cy="8" r="2" fill="${color}"/></svg>`;
//     case "grid":
//         return `<svg width="16" height="16"><rect width="16" height="16" fill="none" stroke="${color}"/></svg>`;
//     case "crosshatch":
//         return `<svg width="16" height="16"><path d="M0 0 L16 16 M16 0 L0 16" stroke="${color}"/></svg>`;
//     case "diagonal":
//         return `<svg width="16" height="16"><path d="M0 16 L16 0" stroke="${color}"/></svg>`;
//     case "bricks":
//         return `<svg width="24" height="24"><rect width="24" height="24" fill="none" stroke="${color}"/><line x1="0" y1="12" x2="24" y2="12" stroke="${color}"/><line x1="12" y1="0" x2="12" y2="12" stroke="${color}"/></svg>`;
//     default:
//         return "";
//     }
// }
function patternSVG(type, color) {
    switch (type) {
  
      case "dots":
        return `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="4" fill="${color}" />
                </svg>`;
  
      case "grid":
        return `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0 H32 V32 H0 Z" stroke="${color}" stroke-width="2"/>
                  <path d="M0 16 H32 M16 0 V32" stroke="${color}" stroke-width="2"/>
                </svg>`;
  
      case "crosshatch":
        return `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0 L32 32 M32 0 L0 32" stroke="${color}" stroke-width="3"/>
                </svg>`;
  
      case "diagonal":
        return `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 32 L32 0" stroke="${color}" stroke-width="3"/>
                </svg>`;
  
      case "bricks":
        return `<svg width="48" height="24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="24" fill="none" stroke="${color}" stroke-width="2"/>
                  <line x1="0" y1="12" x2="48" y2="12" stroke="${color}" stroke-width="2"/>
                  <line x1="24" y1="0" x2="24" y2="12" stroke="${color}" stroke-width="2"/>
                </svg>`;
  
      default:
        return "";
    }
  }
  
   
// function applyPattern() {
//     const type = patternSelect.value;
//     const col = patternColorInput.value;

//     if (type === "none") {
//     document.querySelector(".desktop").style.backgroundImage = "none";
//     activeUser.theme.pattern = "none";
//     saveActiveUser();
//     return;
//     }

//     const encoded = encodeURIComponent(patternSVG(type, col));
//     document.querySelector(".desktop").style.backgroundImage = `url("data:image/svg+xml,${encoded}")`;
//     document.querySelector(".desktop").style.backgroundSize = "16px 16px";

//     activeUser.theme.pattern = type;
//     activeUser.theme.patternColor = col;
//     saveActiveUser();
// }
// function applyPattern() {
//     const type = patternSelect.value;
//     const col = patternColorInput.value;
  
//     const desktopEl = document.getElementById("desktop");
  
//     if (!desktopEl) return; // safety
  
//     // No pattern selected → remove image
//     if (type === "none") {
//       desktopEl.style.backgroundImage = "none";
//       desktopEl.style.backgroundSize = "";
  
//       activeUser.theme.pattern = "none";
//       activeUser.theme.patternColor = col;
//       saveActiveUser();
//       return;
//     }
  
//     // Build SVG pattern
//     const svgRaw = patternSVG(type, col);
//     const encoded = encodeURIComponent(svgRaw)
//       .replace(/'/g, "%27")
//       .replace(/"/g, "%22");
  
//     // Apply pattern image
//     desktopEl.style.backgroundImage = `url("data:image/svg+xml,${encoded}")`;
//     desktopEl.style.backgroundSize = "16px 16px";
//     desktopEl.style.backgroundRepeat = "repeat";
  
//     // Save theme
//     activeUser.theme.pattern = type;
//     activeUser.theme.patternColor = col;
//     saveActiveUser();
// }
// function applyPattern() {
//     const type = patternSelect.value;
//     const col = patternColorInput.value;
  
//     if (!activeUser.theme) activeUser.theme = {};
  
//     if (type === "none") {
//       document.documentElement.style.setProperty("--desktop-pattern", "none");
  
//       activeUser.theme.pattern = "none";
//       activeUser.theme.patternColor = col;
//       saveActiveUser();
//       return;
//     }
  
//     const svgRaw = patternSVG(type, col);
//     const encoded = encodeURIComponent(svgRaw)
//       .replace(/'/g, "%27")
//       .replace(/"/g, "%22");
  
//     const url = `url("data:image/svg+xml,${encoded}")`;
  
//     // trying indstead of inline style, SET A CSS VARIABLE
//     document.documentElement.style.setProperty("--desktop-pattern", url);
  
//     activeUser.theme.pattern = type;
//     activeUser.theme.patternColor = col;
//     saveActiveUser();
// }
// function applyPattern() {
//     const type = patternSelect.value;
//     const col = patternColorInput.value;
  
//     const desktopEl = document.getElementById("desktop");
  
//     if (!desktopEl) return;
  
//     // No pattern
//     if (type === "none") {
//       desktopEl.style.backgroundImage = "none";
  
//       activeUser.theme.pattern = "none";
//       activeUser.theme.patternColor = col;
//       saveActiveUser();
//       return;
//     }
  
//     // Build SVG pattern string
//     const svgRaw = patternSVG(type, col);
  
//     // Encode safely for data URI
//     const encoded = encodeURIComponent(svgRaw)
//       .replace(/'/g, "%27")
//       .replace(/"/g, "%22");
  
//     const url = `url("data:image/svg+xml,${encoded}")`;
  
//     // Apply directly as inline CSS — NOT as a variable!
//     desktopEl.style.backgroundImage = url;
//     desktopEl.style.backgroundRepeat = "repeat";
//     desktopEl.style.backgroundSize = "16px 16px";
  
//     // Save theme
//     activeUser.theme.pattern = type;
//     activeUser.theme.patternColor = col;
//     saveActiveUser();
// }

function applyPattern() {
    const desktopEl = document.getElementById("desktop");
    if (!desktopEl) return;
  
    const type = patternSelect.value;
    const col = patternColorInput.value;
  
    if (type === "none") {
      desktopEl.style.backgroundImage = "none";
      activeUser.theme.pattern = "none";
      activeUser.theme.patternColor = col;
      saveActiveUser();
      return;
    }
  
    const svg = patternSVG(type, col);
  
    // Correct, safe encoding
    const encoded =
      encodeURIComponent(svg)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
  
    desktopEl.style.backgroundImage =
      `url("data:image/svg+xml,${encoded}")`;
    desktopEl.style.backgroundRepeat = "repeat";
    desktopEl.style.backgroundSize = "16px 16px";
  
    activeUser.theme.pattern = type;
    activeUser.theme.patternColor = col;
    saveActiveUser();
  }
  
  

patternSelect.addEventListener("change", applyPattern);
patternColorInput.addEventListener("input", applyPattern);



// logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
    if (!activeUser) return;
  
    saveActiveUser();  // ensure nothing is lost
  
    // Hide all app windows
    document.querySelectorAll(".app-window").forEach(w => w.style.display = "none");
  
    // Hide desktop
    desktop.classList.add("hidden");
  
    // Show login
    loginScreen.classList.remove("hidden");
  
    // Reset active user
    activeUser = null;
    activeUsername = null;
});
  
// saving windows state function
function saveWindowState(winEl) {
    if (!activeUser) return;
  
    const rect = winEl.getBoundingClientRect();
  
    if (!activeUser.windowState) activeUser.windowState = {};
  
    activeUser.windowState[winEl.id] = {
      open: winEl.style.display !== "none",
      left: parseInt(winEl.style.left) || rect.left,
      top: parseInt(winEl.style.top) || rect.top,
      width: rect.width,
      height: rect.height
    };
  
    saveActiveUser();
}
  


/* DRAGGABLE WINDOWS */

// let zCounter = 10;

// function makeWindowDraggable(winEl) {
//     const bar = winEl.querySelector(".window-titlebar");
//     if (!bar) return;

//     let dragging = false;
//     let offsetX = 0;
//     let offsetY = 0;

//     bar.addEventListener("mousedown", e => {
//     dragging = true;
//     zCounter++;
//     winEl.style.zIndex = zCounter;
//     offsetX = e.clientX - winEl.offsetLeft;
//     offsetY = e.clientY - winEl.offsetTop;
//     });

//     document.addEventListener("mousemove", e => {
//     if (!dragging) return;
//     winEl.style.left = (e.clientX - offsetX) + "px";
//     winEl.style.top = (e.clientY - offsetY) + "px";
//     });

//     // document.addEventListener("mouseup", () => (dragging = false));
//     document.addEventListener("mouseup", () => {
//         if (dragging) saveWindowState(winEl);
//         dragging = false;
//     });
      
// }

// document.querySelectorAll(".window").forEach(makeWindowDraggable);

/* DRAGGABLE WINDOWS — FIXED VERSION */

let zCounter = 10;

let draggingWin = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

/* Attach drag handles */
function makeWindowDraggable(winEl) {
    const bar = winEl.querySelector(".window-titlebar");
    if (!bar) return;

    bar.addEventListener("mousedown", (e) => {
        draggingWin = winEl;

        zCounter++;
        winEl.style.zIndex = zCounter;

        dragOffsetX = e.clientX - winEl.offsetLeft;
        dragOffsetY = e.clientY - winEl.offsetTop;
    });
}

/* Global listeners — NOT per window */
document.addEventListener("mousemove", (e) => {
    if (!draggingWin) return;

    draggingWin.style.left = (e.clientX - dragOffsetX) + "px";
    draggingWin.style.top = (e.clientY - dragOffsetY) + "px";
});

document.addEventListener("mouseup", () => {
    if (draggingWin) {
        saveWindowState(draggingWin); // save position
    }
    draggingWin = null;
});

/* Apply to all windows once */
document.querySelectorAll(".window").forEach(makeWindowDraggable);


/* WINDOW MINIMIZE / CLOSE */

document.querySelectorAll(".app-window").forEach(winEl => {
    const minBtn = winEl.querySelector(".win-min");
    const closeBtn = winEl.querySelector(".win-close");

    if (minBtn) {
        minBtn.addEventListener("click", () => {
            winEl.style.display = (winEl.style.display === "none" ? "block" : "none");
            if (winEl.style.display === "block") {
            zCounter++;
            winEl.style.zIndex = zCounter;
            }
            saveWindowState(winEl);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            winEl.style.display = "none";
            saveWindowState(winEl);
        });
    }
});
   
/* Launch windows */
document.querySelectorAll(".cp-launch").forEach(btn => {
    btn.addEventListener("click", () => {
    const win = document.getElementById(btn.dataset.target);
    win.style.display = "block";
    zCounter++;
    win.style.zIndex = zCounter;
    });
});
   
// APP TILE TOGGLE OPEN/CLOSE ------------------------------------------
document.querySelectorAll(".app-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.target;
      const win = document.getElementById(id);
      if (!win) return;
  
      // toggle
      if (win.style.display === "none" || win.style.display === "") {
        win.style.display = "block";
        zCounter++;
        win.style.zIndex = zCounter;
      } else {
        win.style.display = "none";
      }
      saveWindowState(win);
    });
});
  

// -----------------------
// TRAINING HUB TABS
// -----------------------
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
  
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
  
      document.querySelectorAll(".tab-content").forEach(c => {
        c.classList.remove("active");
      });
  
      document.getElementById(tab).classList.add("active");
    });
  });
  



// ADDING PHOTOS IN RUNNING LOG
document.getElementById("photoBtn").addEventListener("click", () => {
    journalTool = "photo";
    alert("Click an entry to attach a photo.");

    const entries = document.querySelectorAll(".journal-entry");

    entries.forEach((el, index) => {
        el.classList.add("entry-select-mode");
        el.dataset.entryIndex = index;
        el.addEventListener("click", onEntryPhotoTarget);
    });
});



/* SHOES */

const shoes = {};
const shoeTableBody = document.getElementById("shoeTableBody");
const addShoeBtn = document.getElementById("addShoeMileage");
const logShoeSelect = document.getElementById("logShoeSelect");

function renderShoes() {
    shoeTableBody.innerHTML = "";
    Object.keys(shoes).forEach(name => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${shoes[name].toFixed(1)} mi</td>`;
    shoeTableBody.appendChild(row);
    });

    logShoeSelect.innerHTML = `<option value="">-- Select Shoe --</option>`;
    Object.keys(shoes).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    logShoeSelect.appendChild(opt);
    });
}
   
addShoeBtn.addEventListener("click", () => {
    const name = document.getElementById("shoeName").value.trim();
    const milesVal = parseFloat(document.getElementById("shoeMiles").value);

    if (!name) return;

    if (!isNaN(milesVal)) {
    shoes[name] = (shoes[name] || 0) + milesVal;
    } else if (!shoes[name]) {
    shoes[name] = 0;
    }

    activeUser.shoes = shoes;
    saveActiveUser();
    renderShoes();

    document.getElementById("shoeName").value = "";
    document.getElementById("shoeMiles").value = "";
});
   
/* JOURNAL (PAGINATED) */

let journalEntriesData = [];
let journalPage = 0;
const ENTRIES_PER_PAGE = 3;

function renderJournalPage() {
    const container = document.getElementById("journalEntries");
    container.innerHTML = "";

    const start = journalPage * ENTRIES_PER_PAGE;
    const end = start + ENTRIES_PER_PAGE;

    const entries = journalEntriesData.slice(start, end);

    document.getElementById("journalPageNumber").textContent =
    `Page ${journalPage + 1}`;

    entries.forEach((e, idxOnPage) => {
        const realIndex = start + idxOnPage;
    
        const div = document.createElement("div");
        div.className = "journal-entry";
        // FIX FOR EACH DIV
        div.dataset.entryIndex = realIndex;
    
        div.className = "journal-entry";
        div.innerHTML = `
            <div class="journal-entry-header">${e.date} — ${e.distance} mi</div>
            <div class="journal-entry-meta">
                ${e.time !== "---" ? "Time: " + e.time : ""}
                ${e.temp ? " • Temp: " + e.temp + "°F" : ""}
                ${e.shoe !== "---" ? " • Shoes: " + e.shoe : ""}
            </div>

            <div class="journal-entry-body">${e.notes}</div>

            <div class="journal-entry-stickers">
                ${
                (e.stickers || [])
                    .map(file => `<img src="images/stickers/${file}" class="journal-sticker">`)
                    .join("")
                }
            </div>
            <div class="journal-entry-photos">
                ${
                    (e.photos || [])
                        .map(src => `<img src="${src}" class="journal-photo">`)
                        .join("")
                }
            </div>

            `;

        // APPLY PALETTE (if entry has one)
        if (e.palette) {
            div.style.background = e.palette.bg;

            const header = div.querySelector(".journal-entry-header");
            const meta = div.querySelector(".journal-entry-meta");
            const body = div.querySelector(".journal-entry-body");

            if (header) header.style.color = e.palette.header;
            if (meta) meta.style.color = e.palette.meta;
            if (body) body.style.color = e.palette.body;
        }

        container.appendChild(div);
    });
}

document.getElementById("prevJournalPage").addEventListener("click", () => {
    if (journalPage > 0) {
    journalPage--;
    renderJournalPage();
    }
});

document.getElementById("nextJournalPage").addEventListener("click", () => {
    if ((journalPage + 1) * ENTRIES_PER_PAGE < journalEntriesData.length) {
    journalPage++;
    renderJournalPage();
    }
});
   

let journalTool = "none";

// document.getElementById("addStickerBtn").addEventListener("click", () => {
//     journalTool = "sticker";
//     alert("this is where the user can add stickers to their entry");
// });
document.getElementById("addStickerBtn").addEventListener("click", () => {
    enterStickerPlacementMode();
});
  


document.getElementById("paintBtn").addEventListener("click", () => {
    journalTool = "paint";
    alert("Click an entry to customize its colors.");
  
    document.querySelectorAll(".journal-entry")
      .forEach(el => {
        el.classList.add("entry-select-mode");
        el.addEventListener("click", onEntryPaintTarget);
      });
});
  
function exitPaintMode() {
    document.querySelectorAll(".journal-entry").forEach(el => {
      el.classList.remove("entry-select-mode");
      el.removeEventListener("click", onEntryPaintTarget);
    });
  
    journalTool = "none";
}
  
let paletteTargetIndex = null;

function onEntryPaintTarget(e) {
  const index = Number(e.currentTarget.dataset.entryIndex);
  paletteTargetIndex = index;

  exitPaintMode();
  openPalettePopup(index);
}

// palette popup
function openPalettePopup(entryIndex) {
    const popup = document.getElementById("palettePopup");
    const grid = document.getElementById("paletteOptions");
  
    grid.innerHTML = "";
  
    journalPalettes.forEach((p, i) => {
      const option = document.createElement("div");
      option.className = "palette-option";
      option.dataset.index = i;
  
      option.innerHTML = `
        <div class="palette-swatch">
          <div style="background:${p.bg}"></div>
          <div style="background:${p.header}"></div>
          <div style="background:${p.meta}"></div>
          <div style="background:${p.body}"></div>
        </div>
      `;
  
      option.addEventListener("click", () => {
        document.querySelectorAll(".palette-option")
          .forEach(x => x.classList.remove("selected"));
        option.classList.add("selected");
      });
  
      grid.appendChild(option);
    });
  
    popup.classList.remove("hidden");
}

// applying the palette to the entry?
document.getElementById("applyPaletteBtn").addEventListener("click", () => {
    const selected = document.querySelector(".palette-option.selected");
    if (!selected) return;
  
    const palette = journalPalettes[selected.dataset.index];
  
    // saving to entry!!!
    journalEntriesData[paletteTargetIndex].palette = palette;
  
    activeUser.journal = journalEntriesData;
    saveActiveUser();
  
    renderJournalPage();
  
    document.getElementById("palettePopup").classList.add("hidden");
});

// cancel button on palette popup
document.getElementById("cancelPaletteBtn").addEventListener("click", () => {
    document.getElementById("palettePopup").classList.add("hidden");
});
  

function exitPhotoPlacementMode() {
    const entries = document.querySelectorAll(".journal-entry");

    entries.forEach(el => {
        el.classList.remove("entry-select-mode");
        el.removeEventListener("click", onEntryPhotoTarget);
    });

    journalTool = "none";
}

function onEntryPhotoTarget(e) {
    const index = Number(e.currentTarget.dataset.entryIndex);

    exitPhotoPlacementMode();
    openPhotoInput(index);
}

function openPhotoInput(entryIndex) {
    const input = document.getElementById("photoInput");

    // Once file is selected
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            // Ensure array exists
            if (!journalEntriesData[entryIndex].photos) {
                journalEntriesData[entryIndex].photos = [];
            }

            journalEntriesData[entryIndex].photos.push(reader.result);

            activeUser.journal = journalEntriesData;
            saveActiveUser();
            renderJournalPage();
        };

        reader.readAsDataURL(file);

        // reset file input so selecting same photo twice still works
        input.value = "";
    };

    input.click();
}



// STCIKER MODE LOGIC
function enterStickerPlacementMode() {
    journalTool = "sticker";
  
    const entries = document.querySelectorAll(".journal-entry");
  
    entries.forEach((el, index) => {
      el.classList.add("entry-select-mode");
    //   el.dataset.entryIndex = index;
      el.addEventListener("click", onEntryStickerTarget);
    });
  
    alert("Click an entry to add a sticker.");
}
  
function exitStickerPlacementMode() {
    const entries = document.querySelectorAll(".journal-entry");
  
    entries.forEach(el => {
      el.classList.remove("entry-select-mode");
      el.removeEventListener("click", onEntryStickerTarget);
    });
  
    journalTool = "none";
}
  
function onEntryStickerTarget(e) {
    const index = Number(e.currentTarget.dataset.entryIndex);
    exitStickerPlacementMode();
    openStickerPicker(index);
}
  

// populate sticker grid and set up sticker
const stickerFiles = [
    "sticker-catheart.gif",
    "sticker-dance.gif",
    "sticker-doghappy.gif",
    "sticker-dogthumbsup.gif",
    "sticker-fire.gif",
    "sticker-hamstersad.gif",
    "sticker-happyrain.gif",
    "sticker-pig.gif",
    "sticker-rainbow.gif",
    "sticker-rainsad.gif",
    "sticker-scaredcat.gif",
    "sticker-sun.gif",
    "sticker-thunderstorm.gif",
    "sticker-brokenheart.gif",
    "sticker-bug.gif",
    "sticker-dora.gif",
    "sticker-eevee.gif",
    "sticker-ghibli.gif",
    "sticker-heart.gif",
    "sticker-pikachu.gif",
    "sticker-superman.gif"
];
  
function openStickerPicker(entryIndex) {
    const picker = document.getElementById("stickerPicker");
    const grid = document.getElementById("stickerGrid");
  
    grid.innerHTML = "";
  
    stickerFiles.forEach(file => {
      const img = document.createElement("img");
      img.src = `images/stickers/${file}`;
      img.dataset.file = file;
  
      img.addEventListener("click", () => {
        // journalEntriesData[entryIndex].stickers.push(file);
        if (!journalEntriesData[entryIndex].stickers) {
            journalEntriesData[entryIndex].stickers = [];
        }
        
        journalEntriesData[entryIndex].stickers.push(file);
        
        activeUser.journal = journalEntriesData;
        saveActiveUser();
        renderJournalPage();
        picker.classList.add("hidden");
      });
  
      grid.appendChild(img);
    });
  
    picker.classList.remove("hidden");
}
  
document.getElementById("closeStickerPicker")
    .addEventListener("click", () => {
      document.getElementById("stickerPicker").classList.add("hidden");
});
  



// document.getElementById()


/* DAILY LOG + AUTO-SAVE + CONGRATS
    */

const runs = [];
const logTableBody = document.getElementById("logTableBody");
const addLogEntryBtn = document.getElementById("addLogEntry");

const congratsWindow = document.getElementById("congratsWindow");
const congratsImage = document.getElementById("congratsImage");

function centerWindow(win) {
    const w = win.offsetWidth || 320;
    const h = win.offsetHeight || 200;
    win.style.left = (window.innerWidth - w) / 2 + "px";
    win.style.top = (window.innerHeight - h) / 2 + "px";
}

function showCongratsWindow(distance) {
    if (isNaN(distance) || distance <= 0) return;

    let imgSrc;
    if (distance >= 3 && distance <= 3.19) imgSrc = "images/5k-congrats.png";
    else {
    const n = Math.floor(Math.random() * 9) + 1;
    imgSrc = `images/congrats${n}.png`;
    }

    congratsImage.src = imgSrc;
    congratsWindow.style.display = "block";
    zCounter++;
    congratsWindow.style.zIndex = zCounter;
    centerWindow(congratsWindow);
}

function parseTimeToMinutes(t) {
    if (!t) return NaN;
    const parts = t.split(":").map(Number);
    if (parts.length === 2) return parts[0] + parts[1] / 60;
    const num = Number(t);
    return isNaN(num) ? NaN : num;
}

addLogEntryBtn.addEventListener("click", () => {
    const date = document.getElementById("logDate").value || "---";
    const distanceStr = document.getElementById("logDistance").value;
    const distance = parseFloat(distanceStr) || 0;
    const time = document.getElementById("logTime").value || "---";
    const temp = document.getElementById("logTemp").value || "";
    const shoeName = logShoeSelect.value || "---";
    const notes = document.getElementById("logNotes").value || "---";

    /* Show newest-only log entry */
    logTableBody.innerHTML = "";
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${date}</td>
    <td>${distanceStr || "---"}</td>
    <td>${time}</td>
    <td>${temp ? temp + "°F" : "---"}</td>
    <td>${shoeName}</td>
    <td>${notes}</td>
    `;
    logTableBody.appendChild(row);

    /* Update shoes */
    if (shoeName !== "---" && distance > 0) {
    shoes[shoeName] = (shoes[shoeName] || 0) + distance;
    activeUser.shoes = shoes;
    renderShoes();
    }

    /* Add to runs */
    if (date !== "---" && distance > 0) {
    const runDate = new Date(date + "T00:00:00");
    const pace = time !== "---" ? parseTimeToMinutes(time) / distance : null;

    runs.push({
        date: runDate,
        distance,
        timeStr: time,
        pace,
        temp: temp ? parseFloat(temp) : null,
        shoe: shoeName === "---" ? "" : shoeName
    });

    activeUser.runs = runs;
    }

    /* Add to journal */
    journalEntriesData.unshift({
        date,
        distance: distanceStr,
        time,
        temp,
        shoe: shoeName,
        notes,
        stickers: [],
        photos: []
    });

    activeUser.journal = journalEntriesData;

    journalPage = 0;
    renderJournalPage();

    /* Auto-save */
    saveActiveUser();

    /* Congrats popup */
    showCongratsWindow(distance);

    /* Weekly chart refresh */
    renderWeekChart(currentWeekStart);

    /* Clear form */
    document.getElementById("logDate").value = "";
    document.getElementById("logDistance").value = "";
    document.getElementById("logTime").value = "";
    document.getElementById("logTemp").value = "";
    document.getElementById("logNotes").value = "";
    logShoeSelect.value = "";
});
   
/* WEEKLY GRAPH (STACKED BAR, PACE COLORS) */

let currentWeekStart = getWeekStart(new Date());

function getWeekStart(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day + 6) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0,0,0,0);
    return date;
}

function formatDateYYYYMMDD(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function colorForPace(pace) {
    if (pace == null) return "#cccccc";
    if (pace <= 8) return "#ff7070";
    if (pace <= 10) return "#ffd56b";
    return "#7fbfff";
}

function getWeekRunsByDay(weekStart) {
    const days = [];
    for (let i=0; i<7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate()+i);
    days.push({ date: dayDate, runs: [] });
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate()+7);

    runs.forEach(r => {
    if (!r.date) return;
    if (r.date >= weekStart && r.date < weekEnd) {
        const idx = Math.floor((r.date - weekStart)/(24*60*60*1000));
        if (idx >= 0 && idx < 7) days[idx].runs.push(r);
    }
    });

    return days;
}

function renderWeekChart(weekStart) {
    const svg = d3.select("#mileageChart");
    if (svg.empty()) return;

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top:20, right:20, bottom:40, left:40 };

    const days = getWeekRunsByDay(weekStart);
    const display = days.map(d => ({
    date: d.date,
    runs: d.runs,
    total: d.runs.reduce((a,b)=>a+b.distance, 0)
    }));

    const maxMiles = d3.max(display.map(d => d.total)) || 1;

    const weekLabel = document.getElementById("weekLabel");
    const weekInput = document.getElementById("weekDateInput");
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate()+6);

    const fmt = new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric"});
    weekLabel.textContent = `Week of ${fmt.format(weekStart)} – ${fmt.format(end)}`;
    weekInput.value = formatDateYYYYMMDD(weekStart);

    svg.selectAll("*").remove();

    const dayFmt = d3.timeFormat("%a");

    const x = d3.scaleBand()
    .domain(display.map(d => dayFmt(d.date)))
    .range([margin.left, width-margin.right])
    .padding(0.2);

    const y = d3.scaleLinear()
    .domain([0, maxMiles])
    .range([height-margin.bottom, margin.top])
    .nice();

    svg.append("g")
    .attr("transform",`translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size","11px");

    svg.append("g")
    .attr("transform",`translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text")
    .style("font-size","11px");

    const dayGroups = svg.append("g")
    .selectAll("g.day")
    .data(display)
    .enter()
    .append("g")
    .attr("transform",d=>`translate(${x(dayFmt(d.date))},0)`);

    dayGroups.each(function(d){
    const g = d3.select(this);
    let cumulative = 0;

    d.runs.forEach(r => {
        const dist = r.distance;
        if (dist <= 0) return;
        const top = cumulative + dist;

        // g.append("rect")
        // .attr("x",0)
        // .attr("y",y(top))
        // .attr("width",x.bandwidth())
        // .attr("height",y(cumulative)-y(top))
        // .attr("fill",colorForPace(r.pace));
        const tooltip = d3.select("#tooltip");

        g.append("rect")
        .attr("x", 0)
        .attr("y", y(top))
        .attr("width", x.bandwidth())
        .attr("height", y(cumulative) - y(top))
        .attr("fill", colorForPace(r.pace))
        .on("mouseenter", (event) => {
            const paceStr = r.pace ? r.pace.toFixed(2) + " min/mi" : "No pace";
            const shoeStr = r.shoe || "---";
            const tempStr = r.temp != null ? `${r.temp}°F` : "---";
            const dateStr = r.date.toLocaleDateString();
            const timeStr = r.timeStr || "---";

            tooltip
                .html(`
                <strong>${dateStr}</strong><br>
                Distance: ${r.distance} mi<br>
                Pace: ${paceStr}<br>
                Time: ${timeStr}<br>
                Temp: ${tempStr}<br>
                Shoes: ${shoeStr}
                `)
                .classed("hidden", false);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", event.pageX + 12 + "px")
                    .style("top", event.pageY - 20 + "px");
        })
        .on("mouseleave", () => {
            tooltip.classed("hidden", true);
        });


        cumulative += dist;
    });
});

    svg.append("g")
    .selectAll("text.miles")
    .data(display)
    .enter()
    .append("text")
    .attr("class","miles")
    .attr("x",d=>x(dayFmt(d.date))+x.bandwidth()/2)
    .attr("y",d=>y(d.total)-4)
    .attr("text-anchor","middle")
    .style("font-size","10px")
    .text(d=>d.total>0 ? d.total.toFixed(1) : "");
}

/* Week navigation */
document.getElementById("prevWeekBtn").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate()-7);
    renderWeekChart(currentWeekStart);
});

document.getElementById("nextWeekBtn").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate()+7);
    renderWeekChart(currentWeekStart);
});

document.getElementById("weekDateInput").addEventListener("change", e => {
    if (!e.target.value) return;
    const d = new Date(e.target.value+"T00:00:00");
    currentWeekStart = getWeekStart(d);
    renderWeekChart(currentWeekStart);
});

renderWeekChart(currentWeekStart);

/* RACE TRACKER (SAVED PER USER) */

const raceTableBody = document.getElementById("raceTableBody");
const addRaceBtn = document.getElementById("addRace");

function renderRaces() {
    raceTableBody.innerHTML = "";
    activeUser.races.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${r.name}</td>
        <td>${r.date}</td>
        <td>${r.goal}</td>
    `;
    raceTableBody.appendChild(row);
    });
}

addRaceBtn.addEventListener("click", () => {
    const name = document.getElementById("raceName").value.trim() || "---";
    const date = document.getElementById("raceDate").value.trim() || "---";
    const goal = document.getElementById("raceGoal").value.trim() || "---";

    const entry = { name, date, goal };

    activeUser.races.push(entry);
    saveActiveUser();

    renderRaces();

    document.getElementById("raceName").value = "";
    document.getElementById("raceDate").value = "";
    document.getElementById("raceGoal").value = "";
});

function makeWindowResizable(winEl) {
    const resizer = winEl.querySelector(".window-resizer");
    if (!resizer) return;

    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        // prevents drag conflict!!!!!!
        e.stopPropagation(); 

        resizing = true;
        startX = e.clientX;
        startY = e.clientY;

        // current size
        const rect = winEl.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;

        // bring to front
        zCounter++;                     
        winEl.style.zIndex = zCounter;
    });

    document.addEventListener("mousemove", (e) => {
        if (!resizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        // enforce min size
        winEl.style.width = Math.max(newWidth, 260) + "px";
        winEl.style.height = Math.max(newHeight, 150) + "px";
    });

    document.addEventListener("mouseup", () => {
        if (resizing) saveWindowState(winEl);
        resizing = false;
    });
}

// document.querySelectorAll(".window").forEach(makeWindowDraggable);
// document.querySelectorAll(".window").forEach(makeWindowResizable);
