// js/core/login.js
import { setActiveUser, clearActiveUser } from "./state.js";
import { loadAllUsers, saveAllUsers, saveActiveUser, hashPassword } from "./storage.js";
import { emit } from "./events.js";
// TRACKING CURRENT MODE ("login" or "signup")
let mode = "login";   

export function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  const loginScreen = document.getElementById("loginScreen");
  const desktop = document.getElementById("desktop");
  const logoutBtn = document.getElementById("logoutBtn");

  const loginTabs = document.querySelectorAll(".login-tab");
  const signupOnlyFields = document.querySelectorAll(".signup-only");
  const loginTitle = document.getElementById("loginTitle");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");


  // LOGIN / SIGNUP TABS

  loginTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      loginTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      mode = tab.dataset.mode;   // ← UPDATE MODE

      if (mode === "login") {
        signupOnlyFields.forEach(f => f.classList.add("hidden"));
        loginTitle.textContent = "Sign In";
        loginSubmitBtn.textContent = "Sign In";
      } else {
        signupOnlyFields.forEach(f => f.classList.remove("hidden"));
        loginTitle.textContent = "Create Account";
        loginSubmitBtn.textContent = "Create Account";
      }
    });
  });


  // SUBMIT HANDLER

  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = runnerName.value.trim();
    const password = runnerPassword.value;
    const password2 = runnerPasswordConfirm.value;

    const users = loadAllUsers();

    //  LOGIN 
    if (mode === "login") {
      if (!users[username]) {
        alert("Account not found.");
        return;
      }

      if (users[username].passwordHash !== hashPassword(password)) {
        alert("Wrong password.");
        return;
      }

      setActiveUser(users[username], username);
      saveActiveUser();

      emit("user:login");
      loginScreen.classList.add("hidden");
      desktop.classList.remove("hidden");
      return;
    }

    //  SIGNUP 
    if (mode === "signup") {
      if (users[username]) {
        alert("That account already exists.");
        return;
      }

      if (password !== password2) {
        alert("Passwords do not match.");
        return;
      }

      users[username] = {
        username,
        passwordHash: hashPassword(password),
        runs: [],
        shoes: {},
        journal: [],
        races: [],
        theme: {
          "--desktop-bg": "#008080",
          "--window-bg": "#e0e0e0",
          "--accent-color": "#000080",
          pattern: "none",
          patternColor: "#ffffff"
        },
        windows: {}
      };

      saveAllUsers(users);

      setActiveUser(users[username], username);
      saveActiveUser();

      emit("user:login");
      loginScreen.classList.add("hidden");
      desktop.classList.remove("hidden");
    }
  });


  // LOGOUT
  logoutBtn.addEventListener("click", () => {
    saveActiveUser();
    clearActiveUser();
    emit("user:logout");

    desktop.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });
}




// // js/core/login.js
// import { setActiveUser, clearActiveUser } from "./state.js";
// import { loadAllUsers, saveActiveUser, hashPassword } from "./storage.js";
// import { emit } from "./events.js";

// export function setupLogin() {
//   const loginForm = document.getElementById("loginForm");
//   const loginScreen = document.getElementById("loginScreen");
//   const desktop = document.getElementById("desktop");
//   const logoutBtn = document.getElementById("logoutBtn");

//   // OLD
//   // loginForm.addEventListener("submit", (e) => {
//   //   e.preventDefault();

//   //   const user = document.getElementById("runnerName").value.trim();
//   //   const pass = document.getElementById("runnerPassword").value;

//   //   const users = loadAllUsers();
//   //   if (!users[user]) return alert("User not found.");

//   //   if (users[user].passwordHash !== hashPassword(pass))
//   //     return alert("Incorrect password");

//   //   setActiveUser(users[user], user);
//   //   emit("user:login");

//   //   document.getElementById("sidebarUsername").textContent = activeUsername;
//   //   document.querySelector(".runner-name").textContent = activeUsername;


//   //   loginScreen.classList.add("hidden");
//   //   desktop.classList.remove("hidden");
//   // });
//   loginForm.addEventListener("submit", e => {
//     e.preventDefault();
  
//     const username = runnerName.value.trim();
//     const password = runnerPassword.value;
  
//     const users = loadAllUsers();
  
//     //  LOGIN 
//     if (mode === "login") {
//       if (!users[username]) {
//         alert("Account not found.");
//         return;
//       }
  
//       if (users[username].passwordHash !== btoa(password)) {
//         alert("Wrong password.");
//         return;
//       }
  
//       setActiveUser(users[username], username);
  
//       emit("user:login");
//       loginScreen.classList.add("hidden");
//       desktop.classList.remove("hidden");
//       return;
//     }
//   });


//   logoutBtn.addEventListener("click", () => {
//     saveActiveUser();
//     clearActiveUser();
//     emit("user:logout");

//     desktop.classList.add("hidden");
//     loginScreen.classList.remove("hidden");
//   });
// }
