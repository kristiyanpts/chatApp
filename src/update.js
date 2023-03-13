import { put } from "./data/api.js";
import { showSettingsPage } from "./settings.js";
import { reloadUserData, showNotification } from "./utils.js";

export async function saveUsername() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let newUsername = document.getElementById("settings-username").value;
  let newAvatar = document.getElementById("settings-avatar").value;
  let data = await put(`/chatApp/users/${userData.id}`, {
    username: newUsername,
    img: newAvatar,
    email: userData.email,
    password: userData.password,
  });
  showNotification("Updated username and avatar!", "green");
  reloadUserData();
}

export async function saveEmail() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let newEmail = document.getElementById("settings-email").value;
  let data = await put(`/chatApp/users/${userData.id}`, {
    username: userData.username,
    img: userData.img,
    email: newEmail,
    password: userData.password,
  });
  showNotification("Updated email successfully!", "green");
  reloadUserData();
}
