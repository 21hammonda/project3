// js/features/weeklyChart.js
import { activeUser } from "../core/state.js";
import { on } from "../core/events.js";

let currentWeekStart = getWeekStart(new Date());

// HELPERS

function getWeekStart(d) {
  const date = new Date(d);
  const day = date.getDay();
  // Monday-start logic
  const diff = (day + 6) % 7; 
  date.setDate(date.getDate() - diff);
  date.setHours(0,0,0,0);
  return date;
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function colorForPace(p) {
  if (p == null) return "#cccccc";
  if (p <= 8) return "#ff7070";
  if (p <= 10) return "#ffd56b";
  return "#7fbfff";
}

function getWeekRunsByDay(weekStart) {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    days.push({ date: dayDate, runs: [] });
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  (activeUser.runs || []).forEach(r => {
    if (!r.date) return;
    const date = new Date(r.date);

    if (date >= weekStart && date < weekEnd) {
      const idx = Math.floor((date - weekStart) / (24*60*60*1000));
      if (idx >= 0 && idx < 7) days[idx].runs.push(r);
    }
  });

  return days;
}

//  RENDER --

// export function initWeeklyChart() {
//   document.getElementById("prevWeekBtn").addEventListener("click", () => {
//     currentWeekStart.setDate(currentWeekStart.getDate() - 7);
//     renderWeekChart();
//   });

//   document.getElementById("nextWeekBtn").addEventListener("click", () => {
//     currentWeekStart.setDate(currentWeekStart.getDate() + 7);
//     renderWeekChart();
//   });

//   document.getElementById("weekDateInput").addEventListener("change", e => {
//     if (!e.target.value) return;
//     const d = new Date(e.target.value + "T00:00:00");
//     currentWeekStart = getWeekStart(d);
//     renderWeekChart();
//   });

//   renderWeekChart();
// }
export function initWeeklyChart() {

  // Week navigation buttons
  document.getElementById("prevWeekBtn").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekChart();
  });

  document.getElementById("nextWeekBtn").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekChart();
  });

  document.getElementById("weekDateInput").addEventListener("change", e => {
    if (!e.target.value) return;
    const d = new Date(e.target.value + "T00:00:00");
    currentWeekStart = getWeekStart(d);
    renderWeekChart();
  });

  // THE IMPORTANT PART — LISTEN FOR RUN ADDED
  on("runs:changed", () => {
    // Keep current week the same, just re-render
    renderWeekChart();
  });

  // Initial plotting
  renderWeekChart();

  //added in listener
  on("runs:changed", () => {
    renderWeekChart();
  });
}


function renderWeekChart() {
  const svg = d3.select("#mileageChart");
  const tooltip = d3.select("#tooltip");

  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  // Compute week data
  const days = getWeekRunsByDay(currentWeekStart);
  const display = days.map(d => ({
    date: d.date,
    runs: d.runs,
    total: d.runs.reduce((a,b)=>a + (b.distance || 0), 0)
  }));

  const maxMiles = d3.max(display.map(d => d.total)) || 1;

  // Update week label
  const weekLabel = document.getElementById("weekLabel");
  const start = currentWeekStart;
  const end = new Date(currentWeekStart);
  end.setDate(start.getDate() + 6);

  const fmt = new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric"});
  weekLabel.textContent = `Week of ${fmt.format(start)} – ${fmt.format(end)}`;

  document.getElementById("weekDateInput").value = formatDate(start);

  //  SCALES 
  const dayFmt = d3.timeFormat("%a");

  const x = d3.scaleBand()
    .domain(display.map(d => dayFmt(d.date)))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, maxMiles])
    .range([height - margin.bottom, margin.top])
    .nice();

  //  AXES 
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  //  STACKED BARS 
  const dayGroups = svg.append("g")
    .selectAll("g")
    .data(display)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x(dayFmt(d.date))},0)`);

  dayGroups.each(function(d) {
    let g = d3.select(this);
    let cumulative = 0;

    d.runs.forEach(r => {
      const dist = r.distance || 0;
      if (dist <= 0) return;

      const top = cumulative + dist;

      g.append("rect")
        .attr("x", 0)
        .attr("y", y(top))
        .attr("width", x.bandwidth())
        .attr("height", y(cumulative) - y(top))
        .attr("fill", colorForPace(r.pace))
        .on("mouseenter", (event) => {
          tooltip
            .html(`
              <strong>${new Date(r.date).toLocaleDateString()}</strong><br>
              Distance: ${r.distance} mi<br>
              Pace: ${r.pace ? r.pace.toFixed(2) : "—"}<br>
              Temp: ${r.temp || "---"}<br>
              Shoe: ${r.shoe || "---"}
            `)
            .classed("hidden", false);
        })
        .on("mousemove", (event) => {
          // space between cursor + tooltip horizontally
          const offsetX = 14;  
          // space vertically
          const offsetY = 14;  
        
          tooltip
            .style("left", (event.pageX + offsetX) + "px")
            .style("top", (event.pageY + offsetY) + "px");
        })
        .on("mouseleave", () => tooltip.classed("hidden", true));

      cumulative = top;
    });
  });

  //  TOTAL MILE LABELS 
  svg.append("g")
    .selectAll("text")
    .data(display)
    .enter()
    .append("text")
    .attr("x", d => x(dayFmt(d.date)) + x.bandwidth()/2)
    .attr("y", d => y(d.total) - 4)
    .attr("text-anchor","middle")
    .style("font-size","10px")
    .text(d => d.total > 0 ? d.total.toFixed(1) : "");
}
