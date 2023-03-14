import { showHomePage } from "./homePage.js";
import { logoutUser, showLoginPage } from "./login.js";
import { showChatsPage } from "./myChats.js";
import { showRegisterPage } from "./register.js";
import { showSettingsPage } from "./settings.js";
import page from "../node_modules/page/page.mjs";
import {
  saveEmail,
  saveUsername,
  savePassword,
  deleteAccount,
} from "./update.js";
import { checkUserState, hideSections, toggleUserMenu } from "./utils.js";

let errorPage = document.querySelector(".error-page");
function showErrorPage() {
  hideSections();
  errorPage.style.display = "flex";
  document.querySelector("main").innerHTML = errorPage;
}

page("/index.html", "/");
page("/", showHomePage);
page("/mychats", showChatsPage);
page("/login", showLoginPage);
page("/register", showRegisterPage);
page("/login", showRegisterPage);
page("/settings", showSettingsPage);
page("*", showErrorPage);

page.start();

window.onload = function () {
  checkUserState();
  document
    .getElementById("user-menu")
    .addEventListener("click", toggleUserMenu);
  document.getElementById("logout").addEventListener("click", logoutUser);
  document.getElementById("register-text").addEventListener("click", () => {
    page.redirect("/register");
  });
  document.getElementById("sign-in-text").addEventListener("click", () => {
    page.redirect("/login");
  });
  document
    .getElementById("save-username")
    .addEventListener("click", saveUsername);
  document.getElementById("save-email").addEventListener("click", saveEmail);
  document
    .getElementById("save-password")
    .addEventListener("click", savePassword);
  document
    .getElementById("delete-account")
    .addEventListener("click", deleteAccount);
};
