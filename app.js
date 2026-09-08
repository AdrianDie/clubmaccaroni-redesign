(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.querySelector(".mobile-menu");
  var closeBtn = document.querySelector(".mobile-menu-close");

  function openMenu() {
    mobileMenu.classList.add("open");
    document.body.classList.add("menu-open");
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver, not GSAP — reliable on load) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Menu tabs (Rød / Hvit pizza) ---------- */
  var tabs = document.querySelectorAll(".menu-tab");
  var panels = document.querySelectorAll(".menu-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-target");
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); });
      tab.classList.add("is-active");
      document.getElementById(target).classList.add("is-active");
    });
  });

  /* ---------- Menu data → rendered rows ---------- */
  var ROD_PIZZA = [
    { n: 1, navn: "Margherita", tag: "VEGETAR", desc: "Mozzarella, tomatsaus", pris: 190 },
    { n: 2, navn: "Markens Grøde", tag: "VEGETAR", desc: "Mozzarella, tomatsaus, squash, champignon, rødløk, parmesan", pris: 240 },
    { n: 3, navn: "Parma", desc: "Mozzarella, tomatsaus, parmaskinke, ruccola, parmesan", pris: 240 },
    { n: 4, navn: "Diavola", desc: "Mozzarella, tomatsaus, sterk salami fra Napoli, rødløk", pris: 230 },
    { n: 5, navn: "Skinke", desc: "Mozzarella, tomatsaus, italiensk kokt skinke, champignon, rødløk", pris: 230 },
    { n: 6, navn: "Pepperoni", desc: "Mozzarella, tomatsaus, pepperoni", pris: 230 },
    { n: 7, navn: "Kylling", desc: "Mozzarella, tomatsaus, kylling, pesto, ruccola", pris: 240 },
    { n: 8, navn: "Trøffel", desc: "Mozzarella, tomatsaus, italiensk kokt skinke, trøffelolje, steinsopp, rødløk, ruccola", pris: 250 },
    { n: 9, navn: "Barnevennlig", desc: "Mozzarella, tomatsaus, italiensk kokt skinke", pris: 200 }
  ];
  var HVIT_PIZZA = [
    { n: 10, navn: "Margherita", tag: "VEGETAR", desc: "Mozzarella, creme fraiche, urter", pris: 190 },
    { n: 11, navn: "Markens Grøde", tag: "VEGETAR", desc: "Mozzarella, creme fraiche, squash, champignon, rødløk, parmesan", pris: 240 },
    { n: 12, navn: "Parma", desc: "Mozzarella, creme fraiche, parmaskinke, ruccola, parmesan", pris: 240 },
    { n: 13, navn: "Diavola", desc: "Mozzarella, creme fraiche, sterk salami fra Napoli, rødløk", pris: 230 },
    { n: 14, navn: "Skinke", desc: "Mozzarella, creme fraiche, italiensk kokt skinke, champignon, rødløk", pris: 230 },
    { n: 15, navn: "Pepperoni", desc: "Mozzarella, creme fraiche, pepperoni", pris: 230 },
    { n: 16, navn: "Kylling", desc: "Mozzarella, creme fraiche, kylling, pesto, ruccola", pris: 240 },
    { n: 17, navn: "Trøffel", desc: "Mozzarella, creme fraiche, italiensk kokt skinke, trøffelolje, steinsopp, rødløk, ruccola", pris: 250 }
  ];

  function renderMenu(list, mount) {
    if (!mount) return;
    var html = list.map(function (item) {
      var tag = item.tag ? '<span class="menu-row-tag">' + item.tag + "</span>" : "";
      return (
        '<div class="menu-row reveal">' +
          '<div class="menu-row-top">' +
            '<span class="menu-row-name">' + item.n + ". " + item.navn + "</span>" + tag +
            '<span class="menu-row-leader" aria-hidden="true"></span>' +
            '<span class="menu-row-price">' + item.pris + ",&#8211;</span>" +
          "</div>" +
          '<p class="menu-row-desc">' + item.desc + "</p>" +
        "</div>"
      );
    }).join("");
    mount.innerHTML = html;
  }
  renderMenu(ROD_PIZZA, document.getElementById("menu-rod"));
  renderMenu(HVIT_PIZZA, document.getElementById("menu-hvit"));

  /* Re-run reveal observer for freshly injected menu rows */
  if ("IntersectionObserver" in window) {
    var lateReveals = document.querySelectorAll(".menu-row.reveal:not(.is-visible)");
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    lateReveals.forEach(function (el) { io2.observe(el); });
  } else {
    document.querySelectorAll(".menu-row.reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Catering list ---------- */
  var CATERING_ITEMS = [
    "Italienske kjøttboller med parmesan og urter i tomatsaus",
    "Kyllingspyd med pestodipp",
    "Spareribs med hjemmelaget BBQ-saus",
    "Italienske spekeskinker med melon",
    "Marinerte scampi med chili og koriander",
    "Ravioli fylt med ricotta i urtesaus",
    "Pastasalat, husets «spesial» med en kremet pestosaus",
    "Potetsalat med vinaigrette-dressing, grønne bønner og urter",
    "Tomatsalat med fersk mozzarella og basilikum",
    "Belugalinser i balsamico",
    "Eple- og rødbetsalat i sitronvinaigrette",
    "Rødkålsalat med lime og chili",
    "Husets grønne salat med vinaigrette-dressing",
    "Focaccia",
    "Grillede grønnsaker",
    "Aioli-dipp"
  ];
  var cateringMount = document.getElementById("catering-list");
  if (cateringMount) {
    cateringMount.innerHTML = CATERING_ITEMS.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");
  }
})();
