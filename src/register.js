import { hideSections } from "./utils.js";
let registerPage = document.querySelector(".register-page");

export function showRegisterPage() {
  hideSections();
  registerPage.style.display = "flex";
  let form = document.querySelector("#register-form");
  form.addEventListener("submit", registerUser);
}

async function registerUser() {}
