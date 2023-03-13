import { get } from "./data/api.js";

export function checkUserState() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let userNavs = Array.from(document.getElementsByClassName("user"));
  let guestNavs = Array.from(document.getElementsByClassName("guest"));
  let profileName = document.getElementById("profile-name");
  if (userData) {
    userNavs.forEach((u) => (u.style.display = "inline-block"));
    guestNavs.forEach((g) => (g.style.display = "none"));
    profileName.innerHTML = `Welcome, ${userData.username}`;
  } else {
    userNavs.forEach((u) => (u.style.display = "none"));
    guestNavs.forEach((g) => (g.style.display = "inline-block"));
    profileName.innerHTML = "Welcome, Guest!";
  }
}

let menuOpen = false;
export function toggleUserMenu() {
  let menu = document.querySelector(".user-menu");
  if (!menuOpen) {
    menu.style.display = "block";
    menuOpen = true;
  } else {
    menu.style.display = "none";
    menuOpen = false;
  }
}

export function hideSections() {
  document
    .querySelectorAll("sector")
    .forEach((s) => (s.style.display = "none"));
}

export function showNotification(text, color) {
  let notifElem = document.getElementById("notification");
  notifElem.innerHTML = text;
  notifElem.style.backgroundColor = color;
  notifElem.style.opacity = "1";
  setTimeout(() => {
    notifElem.style.opacity = "0";
  }, 5000);
}

export function toggleLoading(show, text) {
  let loader = document.querySelector(".loading-page");
  if (text) {
    loader.getElementsByTagName("span")[0].textContent = text;
  }
  if (show) {
    loader.style.display = "flex";
  } else {
    loader.style.display = "none";
  }
}

export async function reloadUserData() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let user = await get(`/chatApp/users/${userData.id}`);
  localStorage.setItem(
    "userData",
    JSON.stringify({
      email: user.email,
      username: user.username,
      password: user.password,
      id: userData.id,
    })
  );
  checkUserState();
}
