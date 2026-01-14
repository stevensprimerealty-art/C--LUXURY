/* =============================
   C-LUXURY — Hero slider 6 slides
   4.5s autoplay, fade image + fade text, tap rings to change
   ============================= */

const headlines = [
  "A NEW YEAR\nWITH PRESENCE",
  "SILENCE\nCONNOTES NOISE",
  "LUXURY\nWITHOUT NOISE",
  "PRESENCE\nWITHOUT NOISE",
  "SILENCE\nIS POWER",
  "LUXURY\nWITHOUT NOISE"
];

const slides = Array.from(document.querySelectorAll(".slide"));
const titleEl = document.getElementById("heroTitle");
const rings = Array.from(document.querySelectorAll(".ring"));

let index = 0;
let timer = null;
const INTERVAL = 4500; // 4.5s

function setActiveRing(i){
  rings.forEach(r => r.classList.remove("is-active"));
  const ring = rings[i];
  if(!ring) return;
  ring.classList.remove("is-active");
  void ring.offsetWidth; // restart animation
  ring.classList.add("is-active");
}

function setHeadline(i){
  titleEl.classList.add("is-fading");
  window.setTimeout(() => {
    titleEl.innerHTML = headlines[i].replace(/\n/g, "<br/>");
    titleEl.classList.remove("is-fading");
  }, 250);
}

function showSlide(i){
  slides.forEach(s => s.classList.remove("is-active"));
  if(slides[i]) slides[i].classList.add("is-active");
  setHeadline(i);
  setActiveRing(i);
}

function next(){
  index = (index + 1) % slides.length;
  showSlide(index);
}

function start(){
  stop();
  timer = window.setInterval(next, INTERVAL);
}
function stop(){
  if(timer) window.clearInterval(timer);
  timer = null;
}

rings.forEach(btn => {
  btn.addEventListener("click", () => {
    const go = Number(btn.getAttribute("data-go"));
    if(Number.isNaN(go)) return;
    index = go;
    showSlide(index);
    start(); // reset timer
  });
});

/* Overlay open/close */
function openOverlay(el){
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeOverlay(el){
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const menuOverlay = document.getElementById("menuOverlay");
document.getElementById("openMenu").addEventListener("click", () => openOverlay(menuOverlay));
document.getElementById("closeMenu").addEventListener("click", () => closeOverlay(menuOverlay));
menuOverlay.addEventListener("click", (e) => { if(e.target === menuOverlay) closeOverlay(menuOverlay); });

const searchOverlay = document.getElementById("searchOverlay");
document.getElementById("openSearch").addEventListener("click", () => openOverlay(searchOverlay));
document.getElementById("closeSearch").addEventListener("click", () => closeOverlay(searchOverlay));
searchOverlay.addEventListener("click", (e) => { if(e.target === searchOverlay) closeOverlay(searchOverlay); });

document.addEventListener("keydown", (e) => {
  if(e.key !== "Escape") return;
  if(menuOverlay.classList.contains("is-open")) closeOverlay(menuOverlay);
  if(searchOverlay.classList.contains("is-open")) closeOverlay(searchOverlay);
});

/* init */
showSlide(index);
start();

// Header scroll behavior
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});

/* =============================
   Gift touch scroll: fade in/out + safe loop
   ============================= */
(() => {
  const scroller = document.getElementById("giftScroller");
  const cards = Array.from(document.querySelectorAll(".gift-card"));
  if (!scroller || cards.length === 0) return;

  // Fade in/out when card is in view inside the scroller
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        e.target.classList.remove("is-out");
      } else if (e.intersectionRatio === 0) {
        // when fully out, soften it
        e.target.classList.add("is-out");
      }
    });
  }, { root: scroller, threshold: 0.55 });

  cards.forEach(c => io.observe(c));

  // Safe loop: when you reach the duplicate end card, jump back to the first
  let loopLock = false;
  scroller.addEventListener("scroll", () => {
    if (loopLock) return;

    const endCard = scroller.querySelector('[data-loop="end"]');
    const startCard = scroller.querySelector('[data-loop="start"]');
    if (!endCard || !startCard) return;

    const endRect = endCard.getBoundingClientRect();
    const rootRect = scroller.getBoundingClientRect();

    // if end card is mostly visible
    const visible = endRect.left < (rootRect.left + 30);
    if (visible) {
      loopLock = true;
      // jump back instantly (no break, no flicker)
      scroller.scrollLeft = 0;
      setTimeout(() => { loopLock = false; }, 120);
    }
  }, { passive: true });
})();

