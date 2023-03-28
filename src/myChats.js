import { del, get, post, put } from "./data/api.js";
import {
  getUserData,
  hideSections,
  reloadUserData,
  showNotification,
  toggleLoading,
} from "./utils.js";
import { html, page } from "./lib.js";

let chatsTemplate = (
  chats,
  chatsNames,
  user
) => html`<sector class="chats-page">
  <div class="chat-menu">
    <span>Join Chat</span>
    <input
      type="text"
      name="chat-name"
      id="chat-name"
      placeholder="Chat Name..."
    />
    <input
      type="password"
      name="chat-pass"
      id="chat-pass"
      placeholder="Chat Password..."
    />
    <button @click=${actionChat}  id="chat-submit">Join</@button>
  </div>

  <div class="message-menu">
    <div class="mm-option">Edit</div>
    <div class="mm-option">Delete</div>
  </div>

  <div class="my-chats">
    <div class="chats-header">My Chats</div>
    <div @click=${chatsClick} class="chats">
      ${
        chats.length > 0
          ? chats.map((e) =>
              chatTemplate(e, user, chatsNames[chats.indexOf(e)])
            )
          : null
      }
    </div>
    <div class="chat-manager">
      <button @click=${toggleChatMenu} class="action-chat">
        Join <i class="fa-solid fa-right-to-bracket"></i>
      </button>
      <button @click=${toggleChatMenu} class="action-chat">
        Create <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  </div>
  <div class="chat-page">
    <div class="chat-header">
      <i class="fa-solid fa-hashtag"></i>
      <span>Select Chat</span>
    </div>
    <div class="chat-main"></div>
    <div class="chat-input">
      <div class="input-field">
        <i
          class="fa-solid fa-circle-plus add-file"
          @click=${() => document.getElementById("file-input").click()}
        ></i>
        <input id="file-input" type="file" name="name" style="display: none" />
        <input
          type="text"
          name="message"
          id="message-input"
          @keyup=${(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              sendMessage(e.target.value);
              e.target.value = "";
            }
          }}
          placeholder="Select a chat to message in..."
        />
        <i
          @click=${toggleEmojiMenu}
          class="fa-solid fa-face-smile add-emoji"
          id="add-emoji"
        ></i>
      </div>
    </div>
  </div>
</sector>`;

let chatTemplate = (chat, user, chatId) => {
  return html`<div data-id=${chatId} class="chat-option">
    <i class="fa-solid fa-hashtag left-items"></i> <span>${chat.name}</span>
    ${user && user.id == chat.ownerId
      ? html`<i
          @click=${deleteChat}
          class="fa-solid fa-trash right-items delete"
        ></i>`
      : html`<i
          @click=${leaveChat}
          class="fa-solid fa-right-from-bracket delete right-items leave"
        ></i>`}
  </div>`;
};

async function getChats(chats) {
  let newChats = [];
  for (const chat of chats) {
    let chatInfo = await get(`/chatApp/chats/${chat}`);
    chatInfo ? newChats.push(chatInfo) : null;
  }
  return newChats;
}

export async function showChatsPage(ctx) {
  let userData = getUserData();
  let user = await get(`/chatApp/users/${userData.id}`);
  let userChatsNames = user.chats || [];
  let userChats = await getChats(userChatsNames);
  console.log(userChats);
  ctx.render(chatsTemplate(userChats, userChatsNames, user));

  $(document).bind("click", function (event) {
    document.querySelector(".message-menu").style.display = "none";
  });

  document
    .querySelector("emoji-picker")
    .removeEventListener("emoji-click", emojiClick);
  document
    .querySelector("emoji-picker")
    .addEventListener("emoji-click", emojiClick);
}

function emojiClick(event) {
  document.querySelector("#message-input").value += event.detail.unicode;
}

//   document.getElementById("file-input").addEventListener("change", (e) => {
//     // TODO: Implement file loading function
//   });

function chatsClick(e) {
  if (e.target.classList.contains("chat-option")) {
    Array.from(document.querySelectorAll(".chat-option")).forEach((c) =>
      c.classList.remove("selected-chat")
    );
    e.target.classList.add("selected-chat");
  } else if (e.target.parentElement.classList.contains("chat-option")) {
    Array.from(document.querySelectorAll(".chat-option")).forEach((c) =>
      c.classList.remove("selected-chat")
    );
    e.target.parentElement.classList.add("selected-chat");
  }
  loadChat(e);
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

function actionChat(e) {
  if (e.target.textContent == "Join") {
    joinChat();
  } else {
    createChat();
  }
}

async function createChat() {
  let userData = JSON.parse(localStorage.getItem("userData"));
  let chatName = document.getElementById("chat-name").value;
  let chatPass = document.getElementById("chat-pass").value;
  if (chatName == "" || chatPass == "") {
    return showNotification("All fields are required!", "red");
  }
  let currentChats = await get("/chatApp/chats");
  if (currentChats != undefined) {
    for (const [chatId, chatInfo] of Object.entries(currentChats)) {
      if (chatInfo.name == chatName && chatInfo.password == chatPass) {
        return showNotification("Room already exists.", "red");
      }
    }
  }
  await post("/chatApp/chats", {
    name: chatName,
    password: chatPass,
    ownerId: userData.id,
    messages: [],
  });
  refreshChats();
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
      if (!newChats.includes(chatId)) {
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
        refreshChats();
        return showNotification("Successfully joined chat.", "green");
      } else {
        return showNotification("You are already in this chat.", "red");
      }
    }
  }

  return showNotification("Chat not found.", "red");
}

async function loadChat(e, newId) {
  let id = null;
  if (e != undefined) {
    id =
      e.target.getAttribute("data-id") ||
      e.target.parentElement.getAttribute("data-id");
  } else {
    id = document.querySelector(".chat-page").getAttribute("data-id");
  }
  if (newId) id = newId;

  let userData = JSON.parse(localStorage.getItem("userData"));
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
                  <div class="message"><span>${m.content}</span></div>
              </div>
        `;
        if (m.senderId && m.senderId == userData.id) {
          div.addEventListener("contextmenu", openContext);
        }
        chatMessages.appendChild(div);
      });
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
      senderId: userData.id,
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
      ownerId: chatInfo.ownerId,
      messages,
    });
    loadChat();
  }
}

async function deleteChat(e) {
  let chatId = e.target.parentElement.getAttribute("data-id");
  await del(`/chatApp/chats/${chatId}`);
  refreshChats();
  showNotification("Chat deleted.", "green");
}

async function leaveChat(e) {
  let chatId = e.target.parentElement.getAttribute("data-id");
  let userData = JSON.parse(localStorage.getItem("userData"));
  userData.chats.splice(userData.chats.indexOf(chatId), 1);
  await put(`/chatApp/users/${userData.id}`, {
    email: userData.email,
    password: userData.password,
    id: userData.id,
    chats: userData.chats,
    img: userData.img,
    username: userData.username,
  });
  reloadUserData();
  refreshChats();
  showNotification("Successfully left chat - " + chatId);
}

function openContext(event) {
  event.preventDefault();
  document.querySelector(".message-menu").style.display = "flex";
  document.querySelector(".message-menu").style.top = mouseY(event) + "px";
  document.querySelector(".message-menu").style.left = mouseX(event) + "px";
  window.event.returnValue = false;
}

function mouseX(evt) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return (
      evt.clientX +
      (document.documentElement.scrollLeft
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft)
    );
  } else {
    return null;
  }
}

function mouseY(evt) {
  if (evt.pageY) {
    return evt.pageY - 45;
  } else if (evt.clientY) {
    return (
      evt.clientY +
      (document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop)
    );
  } else {
    return null;
  }
}

function refreshChats() {
  page.redirect("/mychats");
}
