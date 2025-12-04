// js/ui/tabs.js

export function initTrainingTabs() {
    const windowEl = document.getElementById("trainingHubWindow");
    if (!windowEl) return;
  
    const tabButtons = windowEl.querySelectorAll(".tab-btn");
    const tabContents = windowEl.querySelectorAll(".tab-content");
  
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabId = btn.dataset.tab;
  
        // clear all
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
  
        // activate clicked
        btn.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });
  }
  