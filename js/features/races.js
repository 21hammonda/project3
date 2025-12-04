// js/features/races.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";

export function initRaces() {
  if (!activeUser.races) activeUser.races = [];

  const addBtn = document.getElementById("addRace");
  const tableBody = document.getElementById("raceTableBody");

  // If the HTML isn't ready yet, exit safely
  if (!addBtn || !tableBody) {
    console.warn("races.js: HTML not loaded yet.");
    return;
  }

  addBtn.addEventListener("click", addRace);
  renderRaces();
}

function addRace() {
  const name = document.getElementById("raceName").value.trim();
  const date = document.getElementById("raceDate").value;
  const goal = document.getElementById("raceGoal").value.trim();

  if (!name || !date || !goal) {
    alert("Please fill all race fields.");
    return;
  }

  activeUser.races.push({ name, date, goal });
  saveActiveUser();
  renderRaces();
}

function renderRaces() {
  const table = document.getElementById("raceTableBody");
  if (!table) return;

  table.innerHTML = "";

  activeUser.races.forEach(r => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${r.name}</td>
      <td>${r.date}</td>
      <td>${r.goal}</td>
    `;

    table.appendChild(row);
  });
}




// import { activeUser } from "../core/state.js";
// import { saveActiveUser } from "../core/storage.js";

// export function initRaces() {
//   if (!activeUser.races) activeUser.races = [];
//   document.getElementById("addRaceBtn").addEventListener("click", addRace);
//   renderRaces();
// }

// function addRace() {
//   const name = document.getElementById("raceName").value.trim();
//   const dist = parseFloat(document.getElementById("raceDistance").value);
//   const time = document.getElementById("raceTime").value.trim();

//   if (!name || !dist || !time) return alert("Fill all fields.");

//   activeUser.races.push({ name, dist, time });
//   saveActiveUser();
//   renderRaces();
// }

// function renderRaces() {
//   const list = document.getElementById("raceList");
//   list.innerHTML = "";

//   activeUser.races.forEach(r => {
//     const li = document.createElement("li");
//     li.textContent = `${r.name} — ${r.dist} mi — ${r.time}`;
//     list.appendChild(li);
//   });
// }
