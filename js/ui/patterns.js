// js/ui/patterns.js
import { activeUser } from "../core/state.js";

function patternSVG(type, color) {
  switch (type) {
    case "dots":
      return `<svg width="16" height="16"><circle cx="8" cy="8" r="2" fill="${color}"/></svg>`;
    case "grid":
      return `<svg width="16" height="16"><rect width="16" height="16" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
    case "crosshatch":
      return `<svg width="16" height="16"><path d="M0 0 L16 16 M16 0 L0 16" stroke="${color}" stroke-width="1"/></svg>`;
    case "diagonal":
      return `<svg width="16" height="16"><path d="M0 16 L16 0" stroke="${color}" stroke-width="2"/></svg>`;
    case "bricks":
      return `<svg width="24" height="24">
          <rect width="24" height="24" fill="none" stroke="${color}" stroke-width="1"/>
          <line x1="0" y1="12" x2="24" y2="12" stroke="${color}" stroke-width="1"/>
          <line x1="12" y1="0" x2="12" y2="12" stroke="${color}" stroke-width="1"/>
        </svg>`;
    default:
      return "";
  }
}

// export function applyPattern() {
//   const desktop = document.getElementById("desktop");
//   const type = activeUser.theme.pattern;
//   const color = activeUser.theme.patternColor;

//   if (type === "none") {
//     desktop.style.backgroundImage = "none";
//     return;
//   }

//   const svg = patternSVG(type, color);
//   const encoded = encodeURIComponent(svg)
//     .replace(/"/g, "%22")
//     .replace(/'/g, "%27");

//   desktop.style.backgroundImage =
//     `url("data:image/svg+xml,${encoded}")`;
//   desktop.style.backgroundSize = "16px 16px";
// }

export function applyPattern() {
  const overlay = document.getElementById("desktopPatternOverlay");
  const type = activeUser.theme.pattern;
  const color = activeUser.theme.patternColor;

  if (type === "none") {
    overlay.style.backgroundImage = "none";
    return;
  }

  const svg = patternSVG(type, color);
  const encoded = encodeURIComponent(svg)
    .replace(/"/g, "%22")
    .replace(/'/g, "%27");

  overlay.style.backgroundImage = `url("data:image/svg+xml,${encoded}")`;
  overlay.style.backgroundSize = "16px 16px";

}
