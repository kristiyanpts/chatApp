import { html } from "./lib.js";

let errorTemplate = () => html`<sector class="error-page">
  <div class="err-code">404</div>
  <div class="err-msg">Page not found!</div>
</sector>`;

export function showErrorPage(ctx) {
  ctx.render(errorTemplate());
}
