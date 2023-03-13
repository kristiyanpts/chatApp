import { showHomePage } from "./homePage.js";
import { showLoginPage } from "./login.js";
import { showRegisterPage } from "./register.js";
import { checkUserState, hideSections, toggleUserMenu } from "./utils.js";

let navs = {
  "/home": showHomePage,
  // "/mychats": showMyChatsPage,
  // "/onetimechat": showOnetimeChatPage,
  // "/about": showAboutPage,
  "/login": showLoginPage,
  "/register": showRegisterPage,
  "/logout": logoutUser,
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
}
