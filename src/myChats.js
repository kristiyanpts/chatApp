import { hideSections } from "./utils.js";
let chatsPage = document.querySelector(".chats-page");

export function showChatsPage() {
  hideSections();
  chatsPage.style.display = "flex";
  document.querySelector("main").replaceChildren(chatsPage);
}
