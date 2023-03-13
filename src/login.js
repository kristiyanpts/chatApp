import { get } from "./data/api.js";
import { showHomePage } from "./homePage.js";
import { checkUserState, hideSections } from "./utils.js";
let loginPage = document.querySelector(".login-page");

export function showLoginPage() {
  hideSections();
  loginPage.style.display = "block";
  document.querySelector("main").replaceChildren(loginPage);
  let form = document.querySelector("#login-form");
  form.addEventListener("submit", loginUser);
}

async function loginUser(e) {
  e.preventDefault();
  let formData = new FormData(e.target);
  let { email, password } = Object.fromEntries(formData.entries());
  let users = await get("/chatApp/users");
  let user = null;
  for (const [userId, userInfo] of Object.entries(users)) {
    if (userInfo.email === email && userInfo.password === password) {
      user = userInfo;
    }
  }
  if (user != null) {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        email: user.email,
        accessToken: user.accessToken,
        id: user._id,
      })
    );
    checkUserState();
    showHomePage();
  }
}
