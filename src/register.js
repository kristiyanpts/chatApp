import { loginUser, registerUser } from "./data/user.js";
import { html } from "./lib.js";
import { createSubmitHandler, showNotification } from "./utils.js";

let registerTemplate = (onRegister) => html` <sector class="register-page">
  <form @submit=${onRegister} id="register-form">
    <h1>Register</h1>
    <span>Having a profile is required to use the chat.</span>
    <div class="single-input">
      <span><i class="fas fa-user"></i></span>
      <input type="email" name="email" placeholder="Email" />
    </div>
    <div class="single-input">
      <span><i class="fas fa-user"></i></span>
      <input type="text" name="username" placeholder="Username" />
    </div>
    <div class="single-input">
      <span><i class="fas fa-unlock"></i></span>
      <input type="password" name="password" placeholder="Password" />
    </div>
    <div class="single-input">
      <span><i class="fas fa-unlock"></i></span>
      <input
        type="password"
        name="repeatPassword"
        placeholder="Repeat Password"
      />
    </div>

    <div class="single-input submit-btn">
      <input type="submit" value="Register" />
    </div>
    <span
      >Already have an account?
      <a href="/login" id="sign-in-text">Sign In</a></span
    >
  </form>
</sector>`;

export function showRegisterPage(ctx) {
  ctx.render(registerTemplate(createSubmitHandler(onRegister)));

  async function onRegister({ email, username, password, repeatPassword }) {
    if (email == "" || password == "" || username == "")
      return showNotification("All fields are required.", "red");
    if (password != repeatPassword)
      return showNotification("Passwords do not match.", "red");
    let regged = await registerUser(email, password, username);
    if (regged) {
      ctx.page.redirect("/");
      ctx.updateNav();
    }
  }
}
