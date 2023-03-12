import { checkUserState, toggleUserMenu } from "./utils.js";

window.onload = function () {
  checkUserState();
  document
    .getElementById("user-menu")
    .addEventListener("click", toggleUserMenu);
};
