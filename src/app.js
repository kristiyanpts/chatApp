import { showHomePage } from "./homePage.js";
import { showLoginPage } from "./login.js";
import { showRegisterPage } from "./register.js";
import { showSettingsPage } from "./settings.js";
import { saveEmail, saveUsername } from "./update.js";
import { checkUserState, hideSections, toggleUserMenu } from "./utils.js";

let navs = {
  "/home": showHomePage,
  // "/mychats": showMyChatsPage,
  // "/onetimechat": showOnetimeChatPage,
  // "/about": showAboutPage,
  "/login": showLoginPage,
  "/register": showRegisterPage,
  "/logout": logoutUser,
  "/settings": showSettingsPage,
};

window.onload = function () {
  checkUserState();
  hideSections();
  showHomePage();
  document
    .getElementById("user-menu")
    .addEventListener("click", toggleUserMenu);
  document.querySelector(".user-menu").addEventListener("click", clickNav);
  document.getElementById("logout").addEventListener("click", logoutUser);
  document.querySelector(".page-header").addEventListener("click", clickNav);
  document
    .getElementById("register-text")
    .addEventListener("click", showRegisterPage);
  document
    .getElementById("sign-in-text")
    .addEventListener("click", showLoginPage);
  document
    .getElementById("save-username")
    .addEventListener("click", saveUsername);
  document.getElementById("save-email").addEventListener("click", saveEmail);
};

function clickNav(e) {
  e.preventDefault();
  console.log(e.target.tagName);
  if (e.target.tagName === "A" || e.target.parentElement.tagName === "A") {
    let href =
      e.target.getAttribute("href") ||
      e.target.parentElement.getAttribute("href");
    if (navs[href] != null && typeof navs[href] == "function") {
      navs[href]();
    }
  }
}

function logoutUser() {
  localStorage.clear();
  checkUserState();
  showHomePage();
}
