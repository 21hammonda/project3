export function startClocks() {
    updateDigital();
    updateAnalog();
    setInterval(updateDigital, 1000);
    setInterval(updateAnalog, 1000);
  }
  
  function updateDigital() {
    const el = document.getElementById("taskbarClock");
    if (!el) return;
  
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  
  function updateAnalog() {
    const now = new Date();
    const hr = now.getHours() % 12;
    const min = now.getMinutes();
    const sec = now.getSeconds();
  
    document.querySelector(".hour-hand").style.transform =
      `translate(-50%, -100%) rotate(${(hr + min/60)*30}deg)`;
    document.querySelector(".minute-hand").style.transform =
      `translate(-50%, -100%) rotate(${(min + sec/60)*6}deg)`;
    document.querySelector(".second-hand").style.transform =
      `translate(-50%, -100%) rotate(${sec*6}deg)`;
  }
  