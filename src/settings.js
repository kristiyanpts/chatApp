import { hideSections } from "./utils.js";
let settingsPage = document.querySelector(".settings-page");
let settingsOptions = Array.from(document.querySelectorAll(".settings-option"));
let menuOptions = Array.from(document.querySelectorAll(".menu-option"));

let navs = {
  "/settings/username": () => showPage("username-option-page"),
  "/settings/pinformation": () => showPage("pinformation-option-page"),
  "/settings/account": () => showPage("account-option-page"),
  "/settings/actions": () => showPage("account-actions-page"),
};

export function showSettingsPage() {
  hideSections();
  settingsPage.style.display = "block";
  document.querySelector("main").replaceChildren(settingsPage);
  settingsOptions.forEach((o) => (o.style.display = "none"));
  menuOptions.forEach((o) => o.classList.remove("settings-selected"));
  settingsOptions[0].style.display = "flex";
  menuOptions[0].classList.add("settings-selected");
  menuOptions.forEach((o) => o.addEventListener("click", selectOption));
  loadUserData();
}

function selectOption(e) {
  e.preventDefault();
  let id = e.target.parentElement.getAttribute("href");
  menuOptions.forEach((o) => o.classList.remove("settings-selected"));
  e.target.parentElement.classList.add("settings-selected");
  navs[id]();
}

function showPage(id) {
  settingsOptions.forEach((o) => (o.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

async function loadUserData() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  document.getElementById("settings-username").value = userData.username;
  document.getElementById("settings-email").value = userData.email;
  document.getElementById("settings-avatar").value =
    userData.img || "No Avatar";
}
