import { html } from "./lib.js";
import {
  deleteAccount,
  saveEmail,
  savePassword,
  saveUsername,
} from "./update.js";

let settingsTemplate = () => html`<sector class="settings-page">
  <div class="settings-nav">
    <div class="s-nav-title">Account <br />Management</div>
    <div class="s-nav-menu">
      <a class="menu-option" href="/settings/username">
        <i class="fa-solid fa-signature"></i> <span>username</span>
      </a>
      <a class="menu-option" href="/settings/pinformation">
        <i class="fa-solid fa-user"></i>
        <span>personal information</span>
      </a>
      <a class="menu-option" href="/settings/account">
        <i class="fa-solid fa-key"></i>
        <span>account sign-in</span>
      </a>
      <a class="menu-option" href="/settings/actions">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>account actions</span>
      </a>
    </div>
  </div>
  <div class="settings-blocks">
    <div class="settings-option" id="username-option-page">
      <div class="option-left">
        <div class="left-title">Username</div>
        <div class="left-desc">
          Your username is used by other users to identify you.
        </div>
      </div>
      <div class="option-right">
        <input
          type="text"
          name="username"
          id="settings-username"
          class="settings-username"
          placeholder="Username"
          autocomplete="off"
        />
        <label for="username" class="username-label">Username</label>
        <input
          type="text"
          name="avatar"
          id="settings-avatar"
          class="settings-username4"
          placeholder="Avatar"
          autocomplete="off"
        />
        <label for="avatar" class="username-4-label">Avatar</label>
      </div>
      <button @click=${saveUsername} class="save-changes" id="save-username">
        save changes
      </button>
    </div>
    <div class="settings-option" id="pinformation-option-page">
      <div class="option-left">
        <div class="left-title">Personal Information</div>
        <div class="left-desc">
          This information is private and will not be shared with other users.
        </div>
      </div>
      <div class="option-right">
        <input
          type="text"
          name="email"
          id="settings-email"
          class="settings-username"
          placeholder="Email"
          autocomplete="off"
        />
        <label for="email" class="username-label">Email</label>
      </div>
      <button @click=${saveEmail} class="save-changes" id="save-email">
        save changes
      </button>
    </div>
    <div class="settings-option" style="height: 40%" id="account-option-page">
      <div class="option-left">
        <div class="left-title">Account Sign-In</div>
        <div class="left-desc">
          We recommend that you periodically update your password to help
          prevent unauthorized access to your account.
        </div>
      </div>
      <div class="option-right">
        <h2 align="center">Change Password</h2>
        <input
          type="password"
          name="current-password"
          id="settings-current-password"
          class="settings-username"
          placeholder="Current Password"
          autocomplete="off"
        />
        <label for="current-password" class="username-label"
          >Current Password</label
        >
        <input
          type="password"
          name="new-password"
          id="settings-new-password"
          class="settings-username2"
          placeholder="New Password"
          autocomplete="off"
        />
        <label for="new-password" class="username-2-label">New Password</label>
        <input
          type="password"
          name="repeat-new-password"
          id="settings-repeat-new-password"
          class="settings-username3"
          placeholder="Repeat New Password"
          autocomplete="off"
        />
        <label for="repeat-new-password" class="username-3-label"
          >Repeat New Password</label
        >
      </div>
      <button @click=${savePassword} class="save-changes" id="save-password">
        save changes
      </button>
    </div>
    <div class="settings-option" id="account-actions-page">
      <div class="option-left">
        <div class="left-title">Account Actions</div>
        <div class="left-desc">All available account actions.</div>
      </div>
      <div class="option-right">
        <span
          >Once you delete your account, it cannot be undone. Your account will
          be gone forever. You can make a new account with same email address
          once the old one is deleted.</span
        >
        <button
          @click=${deleteAccount}
          class="delete-account"
          id="delete-account"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</sector>`;

export function showSettingsPage(ctx) {
  ctx.render(settingsTemplate());
  ctx.page.redirect("/settings/username");
  loadUserData();
}

export function selectOption(e) {
  let elem = document.querySelector(`a[href="${e.path}"]`);
  console.log(elem);
  let menuOptions = Array.from(document.querySelectorAll(".menu-option"));
  menuOptions.forEach((o) => o.classList.remove("settings-selected"));
  elem.classList.add("settings-selected");
  console.log(elem.classList);
}

export function showPage(id) {
  let settingsOptions = Array.from(
    document.querySelectorAll(".settings-option")
  );
  settingsOptions.forEach((o) => (o.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

async function loadUserData() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  document.getElementById("settings-username").value = userData.username;
  document.getElementById("settings-email").value = userData.email;
  document.getElementById("settings-avatar").value =
    userData.img || "No Avatar";
}
