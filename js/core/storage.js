import { activeUser, activeUsername } from "./state.js";

export function loadAllUsers() {
  return JSON.parse(localStorage.getItem("runnerlog_users") || "{}");
}

export function saveAllUsers(obj) {
  localStorage.setItem("runnerlog_users", JSON.stringify(obj));
}

export function saveActiveUser() {
  if (!activeUsername) return;
  const users = loadAllUsers();
  users[activeUsername] = activeUser;
  saveAllUsers(users);
}

export function hashPassword(pw) {
  return btoa(pw);
}
