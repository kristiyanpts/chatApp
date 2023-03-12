import { showLoginPage } from "./login.js";
import { showRegisterPage } from "./register.js";
import { checkUserState, hideSections, toggleUserMenu } from "./utils.js";

window.onload = function () {
  checkUserState();
  hideSections();
  document
    .getElementById("user-menu")
    .addEventListener("click", toggleUserMenu);
  document.getElementById("sign-in").addEventListener("click", showLoginPage);
  document.getElementById("sign-in-text").addEventListener("click", (e) => {
    e.preventDefault();
    showLoginPage();
  });
  document
    .getElementById("register")
    .addEventListener("click", showRegisterPage);
  document.getElementById("register-text").addEventListener("click", (e) => {
    e.preventDefault();
    showRegisterPage();
  });
};
