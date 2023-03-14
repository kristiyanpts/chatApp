import { get, post, put } from "./data/api.js";
import { hideSections, reloadUserData, showNotification } from "./utils.js";
let chatsPage = document.querySelector(".chats-page");
let chats = document.querySelector(".chats");

document.getElementById("add-emoji").addEventListener("click", toggleEmojiMenu);
document
  .querySelector("emoji-picker")
  .addEventListener(
    "emoji-click",
    (event) =>
      (document.querySelector("#message-input").value += event.detail.unicode)
  );

Array.from(document.querySelectorAll(".action-chat")).forEach((a) =>
  a.addEventListener("click", toggleChatMenu)
);
document.getElementById("chat-submit").addEventListener("click", actionChat);

chats.addEventListener("click", (e) => {
  Array.from(document.querySelectorAll(".chat-option")).forEach((c) =>
    c.classList.remove("selected-chat")
  );
  if (e.target.getAttribute("data-id") != null) {
    e.target.classList.add("selected-chat");
  } else {
    e.target.parentElement.classList.add("selected-chat");
  }
  loadChat(e);
});

document
  .getElementById("message-input")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      sendMessage(e.target.value);
      e.target.value = "";
    }
  });

//   document.getElementById("file-input").addEventListener("change", (e) => {
//     // TODO: Implement file loading function
//   });

export function showChatsPage() {
  hideSections();
  chatsPage.style.display = "flex";
  document.querySelector("main").replaceChildren(chatsPage);
  document.querySelector(".chat-main").innerHTML = "";
  loadChats();
}

let emojiShown = false;
function toggleEmojiMenu() {
  let emojiMenu = document.querySelector(".emoji-menu");
  if (emojiShown) {
    emojiShown = false;
    emojiMenu.style.display = "none";
  } else {
    emojiShown = true;
    emojiMenu.style.display = "block";
  }
}

let chatShown = false;
function toggleChatMenu(e) {
  let chatMenu = document.querySelector(".chat-menu");
  if (!chatShown) {
    chatMenu.style.display = "flex";
    chatShown = true;
    if (e.target.textContent.trim() == "Join") {
      document.querySelector(".chat-menu span").textContent = "Join Chat";
      document.getElementById("chat-submit").textContent = "Join";
    } else {
      document.querySelector(".chat-menu span").textContent = "Create Chat";
      document.getElementById("chat-submit").textContent = "Create";
    }
  } else {
    chatMenu.style.display = "none";
    chatShown = false;
  }
}

async function loadChats() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let user = await get(`/chatApp/users/${userData.id}`);
  chats.innerHTML = "";
  if (user.chats != undefined && user.chats.length > 0) {
    user.chats.forEach(async (c) => {
      let chatInfo = await get(`/chatApp/chats/${c}`);
      let div = document.createElement("div");
      div.setAttribute("class", "chat-option");
      div.setAttribute("data-id", c);
      div.innerHTML = `
      <i class="fa-solid fa-hashtag"></i> <span>${chatInfo.name}</span>
      `;
      chats.appendChild(div);
    });
  }
}

function actionChat(e) {
  if (e.target.textContent == "Join") {
    joinChat();
  } else {
    createChat();
  }
}

async function createChat() {
  let chatName = document.getElementById("chat-name").value;
  let chatPass = document.getElementById("chat-pass").value;
  if (chatName == "" || chatPass == "") {
    return showNotification("All fields are required!", "red");
  }
  let currentChats = await get("/chatApp/chats");
  for (const [chatId, chatInfo] of Object.entries(currentChats)) {
    if (chatInfo.name == chatName && chatInfo.password == chatPass) {
      return showNotification("Room already exists.", "red");
    }
  }
  await post("/chatApp/chats", {
    name: chatName,
    password: chatPass,
    messages: [],
  });
  return showNotification("Chat created successfully.", "green");
}

async function joinChat() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let chatName = document.getElementById("chat-name").value;
  let chatPass = document.getElementById("chat-pass").value;
  if (chatName == "" || chatPass == "") {
    return showNotification("All fields are required!", "red");
  }
  let currentChats = await get("/chatApp/chats");
  for (const [chatId, chatInfo] of Object.entries(currentChats)) {
    if (chatInfo.name == chatName && chatInfo.password == chatPass) {
      let newChats = userData.chats || [];
      newChats.push(chatId);
      await put(`/chatApp/users/${userData.id}`, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        img: userData.img,
        id: userData.id,
        chats: newChats,
      });
      reloadUserData();
      return showNotification("Successfully joined chat.", "green");
    }
  }

  return showNotification("Chat not found.", "red");
}

async function loadChat(e) {
  let id = null;
  if (e != undefined) {
    id =
      e.target.getAttribute("data-id") ||
      e.target.parentElement.getAttribute("data-id");
  } else {
    id = document.querySelector(".chat-page").getAttribute("data-id");
  }

  if (id != null) {
    let chatPage = document.querySelector(".chat-page");
    chatPage.setAttribute("data-id", id);
    let chatInfo = await get(`/chatApp/chats/${id}`);
    let chatMessages = chatPage.querySelector(".chat-main");
    chatMessages.innerHTML = "";
    chatPage.querySelector(".chat-header span").textContent = chatInfo.name;
    chatPage
      .querySelector("#message-input")
      .setAttribute("placeholder", `Message #${chatInfo.name}`);
    if (chatInfo.messages != undefined && chatInfo.messages.length > 0) {
      chatInfo.messages.forEach((m) => {
        let div = document.createElement("div");
        div.setAttribute("class", "chat-message");
        let sendDate = new Date(m.sendDate);
        div.innerHTML = `
              <img
                  class="message-avatar"
                  src="${m.senderImage}"
                  alt=""
              />
              <div class="message-sender">
                  <div class="sender">${
                    m.senderName
                  } <span>${sendDate.getDate()}/${sendDate.getMonth()}/${sendDate.getFullYear()} - ${sendDate.getHours()}:${sendDate.getMinutes()}</span></div>
                  <div class="message">${m.content}</div>
              </div>
        `;
        chatMessages.appendChild(div);
      });
      //   var elem = document.querySelector(".chat-main");
      //   elem.scrollTop = elem.scrollHeight;
    }
  }
}

async function sendMessage(msg) {
  let chatPage = document.querySelector(".chat-page");
  let chatId = chatPage.getAttribute("data-id");

  if (chatId != null && msg != "") {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let chatInfo = await get(`/chatApp/chats/${chatId}`);
    let msgData = {
      senderImage: userData.img,
      senderName: userData.username,
      sendDate: new Date(),
      content: msg,
    };
    let messages = chatInfo.messages || [];
    messages.push(msgData);
    await put(`/chatApp/chats/${chatId}`, {
      name: chatInfo.name,
      password: chatInfo.password,
      messages,
    });
    loadChat();
  }
}

setInterval(() => {
  loadChat();
}, 1000);
