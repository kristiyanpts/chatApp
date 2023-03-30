import { html } from "./lib.js";

let aboutTemplate = () => html`<sector class="about-page">
  <div class="about-box">
    <div class="about-info">
      <div class="about-title">Chat Application</div>
      <div class="about-description">
        This application was created to be used in
        <b
          >The Second National Conference "Information Technology and
          Automation" 2023</b
        >. It is meant to showcase the usage of
        <a href="https://firebase.google.com/">FireBase</a> for the database,
        <a href="https://visionmedia.github.io/page.js/">Page.js</a> for routing
        through the SPA,
        <a href="https://lit.dev/docs/v1/lit-html/introduction/">lit-html</a>
        for rendering HTML templates. The source code can be found at
        <a href="https://github.com/KrisDevBG/chatApp">GitHub</a>. Feel free to
        use the source code and modify it however you like, but when publishing
        your version you must credit this one. If you have any questions or
        suggestions, please feel free to contact me on one of the listed social
        medias at the top of the page.
      </div>
    </div>
  </div>
  <div class="about-box">
    <div class="about-leftimg">
      <img src="/images/kristiyan.jpg" alt="" />
    </div>
    <div class="about-rightblock">
      <div class="about-title">
        Application Developer
        <span class="about-name"> - Kristiyan Petsanov</span>
      </div>
      <div class="about-description">
        Kristiyan is a fourth year Software Engineering student. He has been
        studying JavaScript for 2 years now. He is currently unemployed, focused
        on his studies, although he is actively looking for a job. Kristiyan is
        most passionate about Web Developing in general. He likes both Back-End
        and Front-End Development. He is mainly studying JS (at SoftUni) and C#
        (at school).
      </div>
    </div>
  </div>
  <div class="about-box">
    <div class="about-leftblock">
      <div class="about-title">
        Mentor/Teacher
        <span class="about-name"> - Nadezhda Manchevska</span>
      </div>
      <div class="about-description"></div>
    </div>
    <div class="about-rightimg">
      <img src="/images/default-user.png" alt="" />
    </div>
  </div>
</sector>`;

export function showAaboutPage(ctx) {
  ctx.render(aboutTemplate());
}
