import { hideSections } from "./utils.js";
let registerPage = document.querySelector(".register-page");

export function showRegisterPage() {
  hideSections();
  registerPage.style.display = "flex";
}
