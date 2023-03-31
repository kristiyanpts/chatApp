import { del, put } from "./data/api.js";
import { logoutUser } from "./data/user.js";
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
  showNotification(
    "Updated email successfully! You have been logged out.",
    "green"
  );
  logoutUser();
}

export async function savePassword() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let currentPassword = document.getElementById(
    "settings-current-password"
  ).value;
  let newPassword = document.getElementById("settings-new-password").value;
  let reNewPassword = document.getElementById(
    "settings-repeat-new-password"
  ).value;

  if (currentPassword == "" || newPassword == "" || reNewPassword == "") {
    return showNotification("All fields are required!", "red");
  }
  if (currentPassword != userData.password) {
    return showNotification("Invalid current password!", "red");
  }
  if (newPassword != reNewPassword) {
    return showNotification("New passwords do not match!", "red");
  }
  let data = await put(`/chatApp/users/${userData.id}`, {
    username: userData.username,
    img: userData.img,
    email: userData.email,
    password: newPassword,
  });
  showNotification(
    "Updated password successfully! You have been logged out.",
    "green"
  );
  logoutUser();
}

export async function deleteAccount() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let data = await del(`/chatApp/users/${userData.id}`);
  showNotification("Deleted account successfully!", "green");
  logoutUser();
}
