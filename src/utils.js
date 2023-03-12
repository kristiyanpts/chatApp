export function checkUserState() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let userNavs = Array.from(document.getElementsByClassName("user"));
  let guestNavs = Array.from(document.getElementsByClassName("guest"));
  if (userData) {
    userNavs.forEach((u) => (u.style.display = "inline-block"));
    guestNavs.forEach((g) => (g.style.display = "none"));
  } else {
    userNavs.forEach((u) => (u.style.display = "none"));
    guestNavs.forEach((g) => (g.style.display = "inline-block"));
  }
}

let menuOpen = false;
export function toggleUserMenu() {
  let menu = document.querySelector(".user-menu");
  if (!menuOpen) {
    menu.style.display = "block";
    menuOpen = true;
  } else {
    menu.style.display = "none";
    menuOpen = false;
  }
}

export function hideSections() {
  document
    .querySelectorAll("sector")
    .forEach((s) => (s.style.display = "none"));
}
