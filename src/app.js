import { showHomePage } from "./homePage.js";
import { showLoginPage } from "./login.js";
// import { showChatsPage } from "./myChats.js";
import { showRegisterPage } from "./register.js";
import { selectOption, showSettingsPage } from "./settings.js";
import page from "../node_modules/page/page.mjs";
// import {
//   saveEmail,
//   saveUsername,
//   savePassword,
//   deleteAccount,
// } from "./update.js";
// import { checkUserState, hideSections, toggleUserMenu } from "./utils.js";
import { render } from "./lib.js";
import { showNav } from "./nav.js";
import { showPage } from "./settings.js";

let main = document.querySelector("main");

page(decorateContenxt);
page("/index.html", "/");
page("/", showHomePage);
// page("/mychats", showChatsPage);
page("/login", showLoginPage);
page("/register", showRegisterPage);
// page("/login", showRegisterPage);
page("/settings", showSettingsPage);
// page("*", showErrorPage);

page("/settings/username", (e) => settingsPage(e, "username-option-page"));
page("/settings/pinformation", (e) =>
  settingsPage(e, "pinformation-option-page")
);
page("/settings/account", (e) => settingsPage(e, "account-option-page"));
page("/settings/actions", (e) => settingsPage(e, "account-actions-page"));

showNav();
page.start();

function decorateContenxt(ctx, next) {
  ctx.render = renderMain;
  ctx.updateNav = showNav;
  next();
}

function renderMain(content) {
  render(content, main);
}

function settingsPage(e, page) {
  selectOption(e);
  showPage(page);
}

// window.onload = function () {
//   document
//     .getElementById("user-menu")
//     .addEventListener("click", toggleUserMenu);
//   document.getElementById("logout").addEventListener("click", logoutUser);
//   document.getElementById("register-text").addEventListener("click", () => {
//     page.redirect("/register");
//   });
//   document.getElementById("sign-in-text").addEventListener("click", () => {
//     page.redirect("/login");
//   });
//   document
//     .getElementById("save-username")
//     .addEventListener("click", saveUsername);
//   document.getElementById("save-email").addEventListener("click", saveEmail);
//   document
//     .getElementById("save-password")
//     .addEventListener("click", savePassword);
//   document
//     .getElementById("delete-account")
//     .addEventListener("click", deleteAccount);
// };
