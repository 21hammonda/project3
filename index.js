
// USER ACCOUNT STORAGE
// ---------------------------------------------------------------------
let activeUser = null;
let activeUserEmail = null;

function loadAllUsers() {
  return JSON.parse(localStorage.getItem("runnerlog_users") || "{}");
}

function saveAllUsers(users) {
  localStorage.setItem("runnerlog_users", JSON.stringify(users));
}

// Fake hash — simple base64
function hashPassword(pw) {
  return btoa(pw);
}



// --------------------------------------------------------------------------------------------
// LOGIN LOGIC
// form, screen, TABS, SUBMIT
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

// or signup?
let loginMode = "login";

loginTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    loginTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loginMode = tab.dataset.mode;

    if (loginMode === "login") {
      signupOnlyFields.forEach(el => el.classList.add("hidden"));
      loginTitle.textContent = "Sign In";
      loginSubtitle.textContent = "Log your miles, track your races, and relive every season.";
      loginSubmitBtn.textContent = "Sign In";
      loginHint.textContent = "Username: adalen, Password: runner1";
    } else {
      signupOnlyFields.forEach(el => el.classList.remove("hidden"));
      loginTitle.textContent = "Create Account";
      loginSubtitle.textContent = "Set up your RunnerLog95 account for this device.";
      loginSubmitBtn.textContent = "Create Account";
      loginHint.textContent = "Include at least 1 number and 1 letter.";
    }
  });
});

// loginForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = document.getElementById("runnerEmail").value.trim();
//   const username = document.getElementById("runnerName").value.trim() || "Runner";
//   const password = document.getElementById("runnerPassword").value;
//   const confirmPassword = document.getElementById("runnerPasswordConfirm")?.value;

//   const users = loadAllUsers();

//   if (loginMode === "signup") {
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     if (users[email]) {
//       alert("Account already exists!");
//       return;
//     }

//     users[email] = {
//       username,
//       passwordHash: hashPassword(password),

//       runs: [],
//       journal: [],
//       shoes: {},
//       races: []
//     };

//     saveAllUsers(users);
//   }

//   // LOGIN mode
//   if (!users[email]) {
//     alert("Account doesn't exist. Try creating an account.");
//     return;
//   }

//   if (users[email].passwordHash !== hashPassword(password)) {
//     alert("Incorrect password.");
//     return;
//   }

//   // Load this user into memory
//   activeUser = users[email];

//   // Update UI
//   runnerNameSpan.textContent = activeUser.username;
//   document.getElementById("sidebarUsername").textContent = activeUser.username;

//   // Load user data
//   loadUserDataIntoUI();

//   loginScreen.classList.add("hidden");
//   desktop.classList.remove("hidden");
// });

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("runnerEmail").value.trim();
  const username = document.getElementById("runnerName").value.trim() || "Runner";
  const password = document.getElementById("runnerPassword").value;
  const confirmPassword = document.getElementById("runnerPasswordConfirm")?.value;

  const users = loadAllUsers();

  // ----------------------------------------------
  // SIGNUP MODE

  if (loginMode === "signup") {
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (users[email]) {
      alert("Account already exists!");
      return;
    }

    users[email] = {
      username,
      passwordHash: hashPassword(password),

      runs: [],
      journal: [],
      shoes: {},
      races: []
    };

    saveAllUsers(users);
    alert("Account created! Please sign in.");
    return;
  }

  // ----------------------------------------------
  // LOGIN MODE 

  if (!users[email]) {
    alert("Account doesn't exist. Create an account first.");
    return;
  }

  if (users[email].passwordHash !== hashPassword(password)) {
    alert("Incorrect password.");
    return;
  }

  // SUCCESSFUL LOGIN
  activeUser = users[email];
  activeUserEmail = email;

  runnerNameSpan.textContent = activeUser.username;
  document.getElementById("sidebarUsername").textContent = activeUser.username;

  loadUserDataIntoUI();

  loginScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
});






// -----------------------
// CLOCK + DATE
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


// ---------------------------------------------------------------------
// THEME CONTROLS
const desktopColorInput = document.getElementById("desktopColor");
const windowColorInput = document.getElementById("windowColor");
const accentColorInput = document.getElementById("accentColor");

desktopColorInput.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--desktop-bg", e.target.value);
});

windowColorInput.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--window-bg", e.target.value);
});

accentColorInput.addEventListener("input", (e) => {
  document.documentElement.style.setProperty("--accent-color", e.target.value);
});

// ---------------------------------------------------------------------
// MACPAINT-STYLE PATTERN BACKGROUND

const patternSelect = document.getElementById("patternSelect");
const patternColorInput = document.getElementById("patternColor");

// Pattern SVG generators (tiny backgrounds)
function patternSVG(type, color) {
  switch (type) {
    case "dots":
      return `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="2" fill="${color}" />
        </svg>
      `;

    case "grid":
      return `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" fill="none" stroke="${color}" stroke-width="1"/>
        </svg>
      `;

    case "crosshatch":
      return `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L16 16 M16 0 L0 16" stroke="${color}" stroke-width="1"/>
        </svg>
      `;

    case "diagonal":
      return `
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 16 L16 0" stroke="${color}" stroke-width="2"/>
        </svg>
      `;

    case "bricks":
      return `
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" fill="none" stroke="${color}" stroke-width="1"/>
          <line x1="0" y1="12" x2="24" y2="12" stroke="${color}" stroke-width="1"/>
          <line x1="12" y1="0" x2="12" y2="12" stroke="${color}" stroke-width="1"/>
        </svg>
      `;

    default:
      return "";
  }
}

function applyPattern() {
  const pat = patternSelect.value;
  const col = patternColorInput.value;

  if (pat === "none") {
    document.querySelector(".desktop").style.backgroundImage = "none";
    return;
  }

  const svg = patternSVG(pat, col);
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");

  document.querySelector(".desktop").style.backgroundImage =
    `url("data:image/svg+xml,${encoded}")`;
  document.querySelector(".desktop").style.backgroundSize = "16px 16px";
}

// Update on user input
patternSelect.addEventListener("change", applyPattern);
patternColorInput.addEventListener("input", applyPattern);


// -----------------------
// DRAGGABLE WINDOWS

let zCounter = 10;

function makeWindowDraggable(winEl) {
  const titleBar = winEl.querySelector(".window-titlebar");
  if (!titleBar) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    zCounter++;
    winEl.style.zIndex = zCounter;
    offsetX = e.clientX - winEl.offsetLeft;
    offsetY = e.clientY - winEl.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    winEl.style.left = (e.clientX - offsetX) + "px";
    winEl.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

document.querySelectorAll(".window").forEach(makeWindowDraggable);


// ---------------------------------------------------------------------
// MINIMIZE / CLOSE WINDOWS

document.querySelectorAll(".app-window").forEach((winEl) => {
  const minBtn = winEl.querySelector(".win-min");
  const closeBtn = winEl.querySelector(".win-close");

  if (minBtn) {
    minBtn.addEventListener("click", () => {
      if (winEl.style.display === "none") {
        winEl.style.display = "block";
        zCounter++;
        winEl.style.zIndex = zCounter;
      } else {
        winEl.style.display = "none";
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      winEl.style.display = "none";
    });
  }
});

// Launch from Control Panel
document.querySelectorAll(".cp-launch").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const winEl = document.getElementById(targetId);
    if (!winEl) return;
    winEl.style.display = "block";
    zCounter++;
    winEl.style.zIndex = zCounter;
  });
});


// ---------------------------------------------------------------------
// DATA: SHOES

// { shoeName: miles }
const shoes = {}; 

const shoeTableBody = document.getElementById("shoeTableBody");
const addShoeBtn = document.getElementById("addShoeMileage");
const logShoeSelect = document.getElementById("logShoeSelect");

function renderShoes() {
  // Update table
  shoeTableBody.innerHTML = "";
  Object.keys(shoes).forEach(name => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${shoes[name].toFixed(1)} mi</td>
    `;
    shoeTableBody.appendChild(row);
  });

  // Update log dropdown
  const currentValue = logShoeSelect.value;
  logShoeSelect.innerHTML = `<option value="">-- Select Shoe --</option>`;
  Object.keys(shoes).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    logShoeSelect.appendChild(opt);
  });
  // Try to preserve previous selection if possible
  if (currentValue && shoes[currentValue] !== undefined) {
    logShoeSelect.value = currentValue;
  }
}

// Add / update shoe from Shoe window
addShoeBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("shoeName");
  const milesInput = document.getElementById("shoeMiles");

  const name = nameInput.value.trim();
  const milesVal = parseFloat(milesInput.value);

  if (!name) return;

  if (!isNaN(milesVal)) {
    if (!shoes[name]) {
      shoes[name] = 0;
    }
    shoes[name] += milesVal;
  } else if (!shoes[name]) {
    // If no miles given but shoe doesn't exist, initialize to 0
    shoes[name] = 0;
  }

  renderShoes();
  nameInput.value = "";
  milesInput.value = "";
});


// RUN LOG + JOURNAL + CONGRATS

// Journal pagination
let journalEntriesData = []; 
let journalPage = 0;
const ENTRIES_PER_PAGE = 3;


function renderJournalPage() {
  const container = document.getElementById("journalEntries");
  container.innerHTML = "";

  const start = journalPage * ENTRIES_PER_PAGE;
  const end = start + ENTRIES_PER_PAGE;
  const pageEntries = journalEntriesData.slice(start, end);

  const pageLabel = document.getElementById("journalPageNumber");
  pageLabel.textContent = `Page ${journalPage + 1}`;

  pageEntries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "journal-entry";

    div.innerHTML = `
      <div class="journal-entry-header">
        ${entry.date || "Untitled Run"} — ${entry.distance || "0"} mi
      </div>
      <div class="journal-entry-meta">
        ${entry.time !== "---" ? `Time: ${entry.time}` : ""}
        ${entry.temp ? ` • Temp: ${entry.temp}°F` : ""}
        ${entry.shoe !== "---" ? ` • Shoes: ${entry.shoe}` : ""}
      </div>
      <div class="journal-entry-body">
        ${entry.notes}
      </div>
    `;

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

document.getElementById("addStickerBtn").addEventListener("click", () => {
  journalTool = "sticker";
  alert("Sticker tool activated (feature)");
});

document.getElementById("paintBtn").addEventListener("click", () => {
  journalTool = "paint";
  alert("Paint tool activated (feature)");
});

document.getElementById("photoBtn").addEventListener("click", () => {
  journalTool = "photo";
  alert("Photo tool activated (feature)");
});


// All runs, used for weekly graph
// { date: Date, distance: Number, timeStr: String, pace: Number | null, temp: Number | null, shoe: String }
const runs = [];

// WEEKLY GRAPH (D3) -------------------------------------

// Start with the current week (Monday–Sunday)
let currentWeekStart = getWeekStart(new Date());

function getWeekStart(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun, 1 Mon, ...
  // Make Monday the first day of the week
  const diff = (day + 6) % 7; // how many days since Monday
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateYYYYMMDD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Build data for the 7 days of a given week
function getWeekData(weekStart) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    days.push({
      date: dayDate,
      totalMiles: 0,
      paceSum: 0,
      paceCount: 0,
      avgPace: null
    });
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  runs.forEach(run => {
    if (!run.date) return;
    if (run.date >= weekStart && run.date < weekEnd) {
      const dayIndex = Math.floor(
        (run.date - weekStart) / (24 * 60 * 60 * 1000)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        const day = days[dayIndex];
        day.totalMiles += run.distance;
        if (run.pace != null) {
          day.paceSum += run.pace;
          day.paceCount += 1;
        }
      }
    }
  });

  days.forEach(day => {
    if (day.paceCount > 0) {
      // minutes per mile
      day.avgPace = day.paceSum / day.paceCount; 
    }
  });

  return days;
}

// Simple color scale based on pace (min/mi)
function colorForPace(pace) {
  if (pace == null) return "#cccccc"; // no data
  if (pace <= 8) return "#ff7070";      // fast
  if (pace <= 10) return "#ffd56b";     // medium
  return "#7fbfff";                     // easier / slower
}


const logTableBody = document.getElementById("logTableBody");
const addLogEntryBtn = document.getElementById("addLogEntry");
const journalEntries = document.getElementById("journalEntries");

const congratsWindow = document.getElementById("congratsWindow");
const congratsImage = document.getElementById("congratsImage");

// Center a window in the viewport
function centerWindow(winEl) {
  // Make sure it has layout
  const width = winEl.offsetWidth || 320;
  const height = winEl.offsetHeight || 200;
  const x = (window.innerWidth - width) / 2;
  const y = (window.innerHeight - height) / 2;
  winEl.style.left = x + "px";
  winEl.style.top = y + "px";
}

// Show congrats popup with appropriate image
function showCongratsWindow(distance) {
  if (isNaN(distance) || distance <= 0) return;

  let imgSrc;
  if (distance >= 3.0 && distance <= 3.19) {
    // 5k special image
    imgSrc = "images/5k-congrats.png";
  } else {
    // Random generic congrats
    const idx = Math.floor(Math.random() * 9) + 1; // 1–9
    imgSrc = `images/congrats${idx}.png`;
  }

  congratsImage.src = imgSrc;
  congratsWindow.style.display = "block";
  zCounter++;
  congratsWindow.style.zIndex = zCounter;
  centerWindow(congratsWindow);
}

// Parse "HH:MM" or "MM:SS" into total minutes
function parseTimeToMinutes(timeStr) {
    if (!timeStr) return NaN;
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 2) {
      const [a, b] = parts;
      if (isNaN(a) || isNaN(b)) return NaN;
      // Heuristic: if "MM:SS", treat as minutes:seconds; if "HH:MM", still fine.
      return a + b / 60;
    }
    const asNum = Number(timeStr);
    return isNaN(asNum) ? NaN : asNum;
}
  

addLogEntryBtn.addEventListener("click", () => {
    const date = document.getElementById("logDate").value || "---";
    const distanceStr = document.getElementById("logDistance").value;
    const distance = distanceStr ? parseFloat(distanceStr) : NaN;
    const time = document.getElementById("logTime").value || "---";
    const tempStr = document.getElementById("logTemp").value;
    const shoeName = logShoeSelect.value || "---";
    const notes = document.getElementById("logNotes").value || "---";
  
    // Add to log table
    // const row = document.createElement("tr");
    // row.innerHTML = `
    //   <td>${date}</td>
    //   <td>${distanceStr || "---"}</td>
    //   <td>${time}</td>
    //   <td>${tempStr ? tempStr + "°F" : "---"}</td>
    //   <td>${shoeName}</td>
    //   <td>${notes}</td>
    // `;
    // logTableBody.appendChild(row);
    // Replace log table with only the newest entry
    // clear all existing rows
    logTableBody.innerHTML = "";  

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${date}</td>
      <td>${distanceStr || "---"}</td>
      <td>${time}</td>
      <td>${tempStr ? tempStr + "°F" : "---"}</td>
      <td>${shoeName}</td>
      <td>${notes}</td>
    `;

    logTableBody.appendChild(row);

  
    // Update shoe mileage if appropriate
    if (shoeName !== "---" && !isNaN(distance)) {
      if (!shoes[shoeName]) {
        shoes[shoeName] = 0;
      }
      shoes[shoeName] += distance;
      renderShoes();
    }
  
    // Compute pace (minutes per mile)
    let pace = null;
    if (!isNaN(distance) && distance > 0 && time !== "---") {
      const minutes = parseTimeToMinutes(time);
      if (!isNaN(minutes) && minutes > 0) {
        pace = minutes / distance; // min/mi
      }
    }
  
    // Convert date string to Date object for weekly graph
    let runDateObj = null;
    if (date !== "---" && !isNaN(Date.parse(date))) {
      // force midnight local time
      runDateObj = new Date(date + "T00:00:00");
    }
  
    // Save run for weekly graph
    if (runDateObj && !isNaN(distance) && distance > 0) {
      runs.push({
        date: runDateObj,
        distance,
        timeStr: time,
        pace,
        temp: tempStr ? parseFloat(tempStr) : null,
        shoe: shoeName === "---" ? "" : shoeName
      });
    }

    // Save entry into journal data
    journalEntriesData.unshift({
      date,
      distance: distanceStr,
      time,
      temp: tempStr,
      shoe: shoeName,
      notes
    });

    // Always jump to the most recent page
    journalPage = 0;
    // Re-render current journal page
    renderJournalPage();



    //adding to save this to active user!!!!!!!!
    // Save to active user
    activeUser.runs = runs;
    activeUser.journal = journalEntriesData;
    activeUser.shoes = shoes;
    activeUser.races = loadRacesTable();
    saveActiveUser();


    function saveActiveUser() {
      const users = loadAllUsers();
      // find the email of current user
      const email = document.getElementById("runnerEmail").value.trim();
      users[email] = activeUser;
      saveAllUsers(users);
    }
    
    function loadUserDataIntoUI() {
      // Load shoes
      Object.assign(shoes, activeUser.shoes);
      renderShoes();
    
      // Load runs
      runs.length = 0;
      runs.push(...activeUser.runs);
    
      // Load journal
      journalEntriesData.length = 0;
      journalEntriesData.push(...activeUser.journal);
      renderJournalPage();
    
      // Load weekly graph
      renderWeekChart(currentWeekStart);
    
      // Load races
      loadRacesIntoUI();
    }

    





  
    // Show congrats popup
    if (!isNaN(distance) && distance > 0) {
      showCongratsWindow(distance);
    }
  
    // Re-render weekly graph since data changed
    renderWeekChart(currentWeekStart);
  
    // Clear form
    document.getElementById("logDate").value = "";
    document.getElementById("logDistance").value = "";
    document.getElementById("logTime").value = "";
    document.getElementById("logTemp").value = "";
    document.getElementById("logNotes").value = "";
    logShoeSelect.value = "";
});
  

  function renderWeekChart(weekStart) {
    const svg = d3.select("#mileageChart");
    if (svg.empty()) return;
  
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  
    // Get per-day runs and totals
    const days = getWeekRunsByDay(weekStart);
    const displayDays = days.map(d => {
      const total = d.runs.reduce((sum, r) => sum + r.distance, 0);
      return {
        date: d.date,
        runs: d.runs,
        totalMiles: total
      };
    });
  
    const dayTotals = displayDays.map(d => d.totalMiles);
    const maxMiles = d3.max(dayTotals) || 1;
  
    // Update week label + date input
    const weekLabelEl = document.getElementById("weekLabel");
    const weekDateInput = document.getElementById("weekDateInput");
  
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(weekStart.getDate() + 6);
  
    const formatterLong = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric"
    });
  
    weekLabelEl.textContent =
      "Week of " +
      formatterLong.format(weekStart) +
      " – " +
      formatterLong.format(endOfWeek);
  
    weekDateInput.value = formatDateYYYYMMDD(weekStart);
  
    // Clear old chart
    svg.selectAll("*").remove();
  
    const dayFormat = d3.timeFormat("%a"); // Sun, Mon, ...
  
    const x = d3
      .scaleBand()
      .domain(displayDays.map(d => dayFormat(d.date)))
      .range([margin.left, width - margin.right])
      .padding(0.2);
  
    const y = d3
      .scaleLinear()
      .domain([0, maxMiles])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    // Axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(5);
  
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "11px");
  
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "11px");
  
    // Stacked bars: one group per day, one rect per run
    const dayGroups = svg
      .append("g")
      .selectAll("g.day-group")
      .data(displayDays)
      .enter()
      .append("g")
      .attr("class", "day-group")
      .attr("transform", d => `translate(${x(dayFormat(d.date))},0)`);
  
    dayGroups.each(function (d) {
      const g = d3.select(this);
      let cumulative = 0; // miles already stacked from bottom
  
      d.runs.forEach(run => {
        const dist = run.distance || 0;
        if (dist <= 0) return;
  
        const top = cumulative + dist;
        g.append("rect")
          .attr("x", 0)
          .attr("y", y(top))
          .attr("width", x.bandwidth())
          .attr("height", y(cumulative) - y(top))
          .attr("fill", colorForPace(run.pace));
  
        cumulative += dist;
      });
  
      // Optional: if no runs, you could show a faint "empty" bar or leave blank
    });
  
    // Mileage labels on top of total bars
    svg
      .append("g")
      .selectAll("text.miles-label")
      .data(displayDays)
      .enter()
      .append("text")
      .attr("class", "miles-label")
      .attr("x", d => x(dayFormat(d.date)) + x.bandwidth() / 2)
      .attr("y", d => y(d.totalMiles) - 4)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => (d.totalMiles > 0 ? d.totalMiles.toFixed(1) : ""));
  }
  

// Group runs by day for a given week
function getWeekRunsByDay(weekStart) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      dayDate.setHours(0, 0, 0, 0);
      days.push({
        date: dayDate,
        runs: [] // will fill below
      });
    }
  
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
  
    runs.forEach(run => {
      if (!run.date) return;
      if (run.date >= weekStart && run.date < weekEnd) {
        const dayIndex = Math.floor(
          (run.date - weekStart) / (24 * 60 * 60 * 1000)
        );
        if (dayIndex >= 0 && dayIndex < 7) {
          days[dayIndex].runs.push(run);
        }
      }
    });
  
    return days;
  }
  
  
// Week navigation controls
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const weekDateInputEl = document.getElementById("weekDateInput");

if (prevWeekBtn && nextWeekBtn && weekDateInputEl) {
  prevWeekBtn.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekChart(currentWeekStart);
  });

  nextWeekBtn.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekChart(currentWeekStart);
  });

  weekDateInputEl.addEventListener("change", () => {
    if (!weekDateInputEl.value) return;
    const chosen = new Date(weekDateInputEl.value + "T00:00:00");
    currentWeekStart = getWeekStart(chosen);
    renderWeekChart(currentWeekStart);
  });
}

// Initial render when page loads (after D3 is available)
renderWeekChart(currentWeekStart);



// -----------------------
// RACE TRACKER FUNCTIONALITY


const raceTableBody = document.getElementById("raceTableBody");
const addRaceBtn = document.getElementById("addRace");

addRaceBtn.addEventListener("click", () => {
  const name = document.getElementById("raceName").value.trim() || "---";
  const date = document.getElementById("raceDate").value.trim() || "---";
  const goal = document.getElementById("raceGoal").value.trim() || "---";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${date}</td>
    <td>${goal}</td>
  `;
  raceTableBody.appendChild(row);

  document.getElementById("raceName").value = "";
  document.getElementById("raceDate").value = "";
  document.getElementById("raceGoal").value = "";
});
