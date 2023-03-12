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

export function toggleUserMenu() {
  let menu = document.querySelector(".user-menu");
  if (menu.style.display === "none") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}
