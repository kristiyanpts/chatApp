import { showHomePage } from "./homePage.js";
import { showLoginPage } from "./login.js";
import { showChatsPage } from "./myChats.js";
import { showRegisterPage } from "./register.js";
import { selectOption, showSettingsPage } from "./settings.js";
import { page, render } from "./lib.js";
import { showNav } from "./nav.js";
import { showPage } from "./settings.js";
import { showNotification } from "./utils.js";
import { showAaboutPage } from "./about.js";
import { showErrorPage } from "./error.js";

let main = document.querySelector("main");

page(decorateContenxt);
page("/index.html", "/chatApp/");
page("/chatApp/", showHomePage);
page("/chatApp/mychats", showChatsPage);
page("/chatApp/login", showLoginPage);
page("/chatApp/register", showRegisterPage);
page("/chatApp/settings", showSettingsPage);
page("/chatApp/about", showAaboutPage);
page("/chatApp/settings/username", (e) =>
  settingsPage(e, "username-option-page")
);
page("/chatApp/settings/pinformation", (e) =>
  settingsPage(e, "pinformation-option-page")
);
page("/chatApp/settings/account", (e) =>
  settingsPage(e, "account-option-page")
);
page("/chatApp/settings/actions", (e) =>
  settingsPage(e, "account-actions-page")
);
page("/chatApp/*", showErrorPage);

showNav();
page.start();

function decorateContenxt(ctx, next) {
  ctx.render = renderMain;
  ctx.updateNav = showNav;
  showNav();
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
