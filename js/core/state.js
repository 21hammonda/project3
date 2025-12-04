// Global application state (clean!)
// export let activeUser = null;
// export let activeUsername = null;
// export let zCounter = 50; // ensure windows layer correctly

// export function setActiveUser(user, username) {
//   activeUser = user;
//   activeUsername = username;
// }

// export function clearActiveUser() {
//   activeUser = null;
//   activeUsername = null;
// }

// export function incrementZ() {
//   zCounter++;
//   return zCounter;
// }

// GLOBAL APPLICATION STATE
// The currently logged-in user's full object
export let activeUser = null;

// Username string (same name used as the key in localStorage)
export let activeUsername = null;

// Z-index counter for draggable windows
export let zCounter = 50;


// STATE MANAGEMENT HELPERS

//Called after a successful login
export function setActiveUser(userObj, username) {
  activeUser = userObj;
  activeUsername = username;
}

//Called on logout
export function clearActiveUser() {
  activeUser = null;
  activeUsername = null;
}


//Brings a window to the front
export function incrementZ() {
  zCounter++;
  return zCounter;
}

// SAFE GETTERS 

export function requireUser() {
  if (!activeUser)
    throw new Error("No active user. Are you running this before login?");
  return activeUser;
}

export function getUsername() {
  return activeUsername || "";
}
