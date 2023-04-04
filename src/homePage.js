import { html } from "./lib.js";

let homeTemplate = () => html`<sector class="home-page">
  <div class="left-side">
    <div class="main-text">
      Have your <br />
      best chat
    </div>
    <div class="desc-text">Fast. Easy. Unlimited Chats.</div>
    <div class="home-buttons">
      <a href="/register"><span>Try it for free</span></a>
      <a href="/login"><span>Already a member?</span></a>
    </div>
  </div>
  <div class="right-side">
    <img src="./chatApp/images/dog-chatting.png" alt="" class="chat-dog" />
  </div>
</sector>`;

export function showHomePage(ctx) {
  ctx.render(homeTemplate());
}
