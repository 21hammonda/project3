// js/features/shoes.js
import { activeUser } from "../core/state.js";
import { saveActiveUser } from "../core/storage.js";
import { on } from "../core/events.js";



export function initShoes() {
  // Safety: ensure we have an object of shoes
  if (!activeUser.shoes || typeof activeUser.shoes !== "object") {
    activeUser.shoes = {};
  }

  // Wait until the DOM is painted
  requestAnimationFrame(() => {
    const addBtn = document.getElementById("addShoeMileage");
    const tableBody = document.getElementById("shoeTableBody");

    // If the tab isn't visible yet, exit silently
    if (!addBtn || !tableBody) {
      console.warn("shoes.js: Shoes tab not ready yet.");
      return;
    }

    addBtn.addEventListener("click", addShoeMileage);
    renderShoes();
  });
}

function addShoeMileage() {
  const nameEl = document.getElementById("shoeName");
  const milesEl = document.getElementById("shoeMiles");

  // safety
  if (!nameEl || !milesEl) return; 

  const name = nameEl.value.trim();
  const miles = Number(milesEl.value || 0);

  if (!name) {
    alert("Shoe name required.");
    return;
  }

  // Create or update shoe
  if (!activeUser.shoes[name]) activeUser.shoes[name] = 0;
  activeUser.shoes[name] += miles;

  saveActiveUser();
  renderShoes();
}

function renderShoes() {
  const tbody = document.getElementById("shoeTableBody");
  const select = document.getElementById("logShoeSelect");

  // prevent crashing
  if (!tbody || !select) return; 

  //  TABLE 
  tbody.innerHTML = "";

  Object.entries(activeUser.shoes).forEach(([name, miles]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td>${miles.toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });

  //  DROPDOWN 
  select.innerHTML = `<option value="">-- Select Shoe --</option>`;

  Object.keys(activeUser.shoes).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

on("runs:changed", () => renderShoes());
