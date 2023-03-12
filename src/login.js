import { hideSections } from "./utils.js";
let loginPage = document.querySelector(".login-page");

export function showLoginPage() {
  hideSections();
  loginPage.style.display = "flex";
}
