export function showBootScreen() {
    const boot = document.getElementById("bootScreen");
    const login = document.getElementById("loginScreen");
  
    boot.classList.remove("hidden");
    login.classList.add("hidden");
  
    setTimeout(() => {
      boot.classList.add("hidden");
      login.classList.remove("hidden");
    }, 2200);
}
  