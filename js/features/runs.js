// js/features/runs.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { emit } from "../core/events.js";


// INIT

export function initRuns() {
  if (!activeUser.runs) activeUser.runs = [];

  // Convert saved dates back into Date objects
  activeUser.runs = activeUser.runs.map(r => ({
    ...r,
    date: r.date ? new Date(r.date) : null
  }));

  // Hook up add button
  const btn = document.getElementById("addLogEntry");
  if (btn) btn.addEventListener("click", addRun);

  renderLatestOnly();
}


// ADD RUN ENTRY

function addRun() {
  const dateStr = document.getElementById("logDate").value;
  const distanceStr = document.getElementById("logDistance").value;
  const time = document.getElementById("logTime").value || "---";
  const temp = document.getElementById("logTemp").value || "";
  const shoe = document.getElementById("logShoeSelect").value || "---";
  const notes = document.getElementById("logNotes").value || "---";

  const distance = parseFloat(distanceStr) || 0;
  const date = dateStr ? new Date(dateStr) : null;
  const pace = computePace(time, distance);

  
  // 1. Save into activeUser.runs
  
  const runObj = { date, distance, time, temp, shoe, notes, pace };

  activeUser.runs.push(runObj);

  
  // 2. Update Shoes mileage
  
  if (!activeUser.shoes) activeUser.shoes = {};

  if (shoe !== "---" && distance > 0) {
    activeUser.shoes[shoe] = (activeUser.shoes[shoe] || 0) + distance;
    emit("shoes:changed");
  }
  

  
  // 3. Add to Journal (top of list)
  
  if (!activeUser.journal) activeUser.journal = [];

  activeUser.journal.unshift({
    date: dateStr || "---",
    distance: distanceStr || "0",
    time,
    temp,
    shoe,
    notes,
    stickers: [],
    photos: []
  });

  
  // 4. Save + Notify
  
  saveActiveUser();
  emit("runs:changed");

  
  // 5. Re-render UI pieces
  
  renderLatestOnly();
  updateShoesTable();
  updateJournalPage();
  updateWeeklyChart();

  
  // 6. Congrats Popup
  
  showCongratsPopup(distance);

  
  // 7. Reset form
  
  document.getElementById("logDate").value = "";
  document.getElementById("logDistance").value = "";
  document.getElementById("logTime").value = "";
  document.getElementById("logTemp").value = "";
  document.getElementById("logNotes").value = "";
  document.getElementById("logShoeSelect").value = "";
}


// DAILY LOG (LATEST ONLY)

export function renderLatestOnly() {
  const body = document.getElementById("logTableBody");
  body.innerHTML = "";

  const r = activeUser.runs?.slice(-1)[0];
  if (!r) return;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${r.date ? r.date.toLocaleDateString() : "---"}</td>
    <td>${r.distance}</td>
    <td>${r.time}</td>
    <td>${r.temp ? r.temp + "°F" : "---"}</td>
    <td>${r.shoe}</td>
    <td>${r.notes}</td>
  `;

  body.appendChild(row);
}


// UTILS

function computePace(time, dist) {
  if (!time || time === "---" || dist <= 0) return null;
  const [m,s] = time.split(":").map(Number);
  return (m + s/60) / dist;
}


// HELPERS I MUST HAVE IN OTHER FILES


function updateShoesTable() {
  // shoes.js already renders automatically on "runs:changed"
  const evt = new Event("runs:changed");
  document.dispatchEvent(evt);
}

function updateJournalPage() {
  // journal.js already listens to runs:changed OR exposes a function
  if (window.renderJournalPage) window.renderJournalPage();
}

function updateWeeklyChart() {
  if (window.drawChart) window.drawChart();
}

function showCongratsPopup(distance) {
  if (!window.showCongratsWindow) return;
  showCongratsWindow(distance);
}
