import { logoutUser } from "./data/user.js";
import { html, render } from "./lib.js";
import { getUserData, toggleUserMenu } from "./utils.js";
let navHeader = document.querySelector(".page-header");
let userMenu = document.querySelector(".user-menu");

let navTemplate = (user) => html`<a class="header-option" href="/">Home</a>
  ${user
    ? html`<a class="header-option" href="/mychats">My Chats</a>
        <a class="header-option" href="/onetimechat">One-Time Chat</a>`
    : null}

  <a class="header-option" href="/about">About</a>

  <div
    @click=${toggleUserMenu}
    class="header-option header-right"
    id="user-menu"
  >
    ${user && user.image
      ? html`<img class="header-image" src="${user.image}" />`
      : html`<i class="fa-solid fa-user"></i>`}
  </div>`;

let userMenuTemplate = (user, onLogout) => html`
  <div class="profile-name" id="profile-name">
    Welcome, ${(user && user.username) || "Guest"}!
  </div>
  ${user
    ? html`<a class="user-menu-option" href="/settings">
          <span>Settings</span> <i class="fa-solid fa-gear"></i>
        </a>
        <a
          class="user-menu-option"
          id="logout"
          href="javascript:void(0)"
          @click=${onLogout}
        >
          <span>Logout</span> <i class="fa-solid fa-right-from-bracket"></i>
        </a>`
    : html`<a class="user-menu-option" href="/login">
          <span>Sign In</span> <i class="fa-solid fa-right-to-bracket"></i>
        </a>
        <a class="user-menu-option" href="/register">
          <span>Register</span> <i class="fa-solid fa-user-plus"></i>
        </a>`}
`;

export function showNav() {
  let user = getUserData();
  render(navTemplate(user), navHeader);
  render(userMenuTemplate(user, onLogout), userMenu);
}

function onLogout() {
  logoutUser();
  showNav();
}
