import { del, get, post, put } from "./data/api.js";
import {
  hideSections,
  reloadUserData,
  showNotification,
  toggleLoading,
} from "./utils.js";
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
  toggleLoading(true, "Gettings your chats...");
  chats.innerHTML = "";
  if (user.chats != undefined && user.chats.length > 0) {
    user.chats.forEach(async (c) => {
      let chatInfo = await get(`/chatApp/chats/${c}`);
      if (chatInfo != null) {
        console.log(chatInfo);
        let div = document.createElement("div");
        div.setAttribute("class", "chat-option");
        div.setAttribute("data-id", c);
        div.innerHTML = `
        <i class="fa-solid fa-hashtag left-items"></i> <span>${chatInfo.name}</span>
        `;
        if (userData.id == chatInfo.ownerId) {
          div.innerHTML +=
            '<i class="fa-solid fa-trash right-items delete"></i>';
          div.querySelector(".delete").addEventListener("click", deleteChat);
        } else {
          div.innerHTML +=
            '<i class="fa-solid fa-right-from-bracket delete right-items leave"></i>';
          div.querySelector(".leave").addEventListener("click", leaveChat);
        }
        chats.appendChild(div);
      }
    });
  }
  toggleLoading(false);
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
  loadChats();
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
        loadChats();
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

// setInterval(() => {
//   loadChat();
// }, 1000);

async function deleteChat(e) {
  let chatId = e.target.parentElement.getAttribute("data-id");
  await del(`/chatApp/chats/${chatId}`);
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
  loadChats();
  showNotification("Successfully left chat - " + chatId);
}

function openContext(event) {
  // event.preventDefault();
  // document.querySelector(".message-menu").style.display = "flex";
  // document.querySelector(".message-menu").style.top = mouseY(event) + "px";
  // document.querySelector(".message-menu").style.left = mouseX(event) + "px";
  // window.event.returnValue = false;
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
    return evt.pageY - 30;
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

$(document).bind("click", function (event) {
  document.querySelector(".message-menu").style.display = "none";
});
