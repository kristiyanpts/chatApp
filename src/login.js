import { loginUser } from "./data/user.js";
import { html } from "./lib.js";
import { createSubmitHandler, showNotification } from "./utils.js";

let loginTemplate = (onLogin) => html`<sector class="login-page">
  <form @submit=${onLogin} id="login-form">
    <h1>Sign In</h1>
    <span>Having a profile is required to use the chat.</span>
    <div class="single-input">
      <span><i class="fas fa-user"></i></span>
      <input type="email" name="email" placeholder="Email" />
    </div>
    <div class="single-input">
      <span><i class="fas fa-unlock"></i></span>
      <input type="password" name="password" placeholder="Password" />
    </div>

    <div class="single-input submit-btn">
      <input type="submit" value="Login" />
    </div>
    <span
      >Don't have an account?
      <a href="/register" id="register-text">Register</a></span
    >
  </form>
</sector>`;

export function showLoginPage(ctx) {
  ctx.render(loginTemplate(createSubmitHandler(onLogin)));

  async function onLogin({ email, password }) {
    if (email == "" || password == "")
      return showNotification("All fields are required.", "red");
    let logged = await loginUser(email, password);
    ctx.updateNav();
    if (logged) return ctx.page.redirect("/chatApp/");
    return showNotification("Wrong email or password.", "red");
  }
}
