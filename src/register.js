import { post } from "./data/api.js";
import { showHomePage } from "./homePage.js";
import { checkUserState, hideSections, toggleLoading } from "./utils.js";
let registerPage = document.querySelector(".register-page");

export function showRegisterPage() {
  hideSections();
  registerPage.style.display = "block";
  document.querySelector("main").replaceChildren(registerPage);
  let form = document.querySelector("#register-form");
  form.addEventListener("submit", registerUser);
}

async function registerUser(e) {
  e.preventDefault();
  toggleLoading(true, "Trying to register your profile...");
  let formData = new FormData(e.target);
  let { email, username, password, repeatPassword } = Object.fromEntries(
    formData.entries()
  );
  let regex = /([a-z0-9]+)@([a-z]+).([a-z]+)/g;
  let emailValid = false;
  if (regex.exec(email) !== null) {
    emailValid = true;
  }
  if (!emailValid) {
    alert("Email is invalid. Format <text>@<source>.<domain>");
    return;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }
  if (password != repeatPassword) {
    alert("Passwords do not match.");
    return;
  }
  let user = await post("/chatApp/users", { email, password, username });
  localStorage.setItem(
    "userData",
    JSON.stringify({
      email,
      username,
      password,
      id: user.name,
    })
  );
  checkUserState();
  showHomePage();
  toggleLoading(false);
}
