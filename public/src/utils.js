import { get } from "./data/api.js";

let menuOpen = false;
export function toggleUserMenu() {
  let menu = document.querySelector(".user-menu");
  if (!menuOpen) {
    menu.style.display = "flex";
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
  notifElem.style.display = "flex";
  notifElem.style.opacity = "1";
  setTimeout(() => {
    notifElem.style.opacity = "0";
    notifElem.style.display = "none";
  }, 3000);
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
      img: user.img,
      chats: user.chats,
      id: userData.id,
    })
  );
}

export function createSubmitHandler(callback) {
  return function (event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries());

    callback(data);
  };
}

export function getUserData() {
  return JSON.parse(localStorage.getItem("userData"));
}

export function setUserData(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
}

export function clearUserData() {
  localStorage.removeItem("userData");
}
