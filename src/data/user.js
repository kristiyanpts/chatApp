import { page } from "../lib.js";
import { showNav } from "../nav.js";
import { clearUserData, setUserData } from "../utils.js";
import { get, post } from "./api.js";

export async function loginUser(email, password) {
  let users = await get("/chatApp/users");
  let user = null;
  let userId = null;
  for (const [userIdd, userInfo] of Object.entries(users)) {
    if (userInfo.email === email && userInfo.password === password) {
      user = userInfo;
      userId = userIdd;
    }
  }

  if (user != null) {
    setUserData({
      email: user.email,
      username: user.username,
      password: user.password,
      img: user.img,
      chats: user.chats,
      id: userId,
    });
    return true;
  } else {
    return false;
  }
}

export async function registerUser(email, password, username) {
  let user = await post("/chatApp/users", { email, password, username });
  setUserData({
    email,
    username,
    img: "",
    chats: [],
    id: user.name,
  });
  return true;
}

export async function logoutUser() {
  localStorage.clear();
  showNav();
  page.redirect("/");
}
