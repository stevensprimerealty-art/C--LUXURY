document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     HERO SLIDER — STABLE
     ============================= */

  const headlines = [
    "A NEW YEAR\nWITH PRESENCE",
    "SILENCE\nCONNOTES NOISE",
    "LUXURY\nWITHOUT NOISE",
    "PRESENCE\nWITHOUT NOISE",
    "SILENCE\nIS POWER",
    "LUXURY\nWITHOUT NOISE"
  ];

  const slides = document.querySelectorAll(".slide");
  const titleEl = document.getElementById("heroTitle");
  const rings = document.querySelectorAll(".ring");

  if (!slides.length || !titleEl || !rings.length) return;

  let index = 0;
  const INTERVAL = 4500;

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("is-active"));
    rings.forEach(r => r.classList.remove("is-active"));

    slides[i]?.classList.add("is-active");
    rings[i]?.classList.add("is-active");

    titleEl.classList.add("is-fading");
    setTimeout(() => {
      titleEl.innerHTML = headlines[i].replace(/\n/g, "<br>");
      titleEl.classList.remove("is-fading");
    }, 250);
  }

  // INIT FIRST SLIDE
  showSlide(0);

  // AUTOPLAY
  setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, INTERVAL);

  // RING CLICK
  rings.forEach((ring, i) => {
    ring.addEventListener("click", () => {
      index = i;
      showSlide(index);
    });
  });

  /* =============================
     GIFT STRIP — SAFE LOOP
     ============================= */

  (() => {
    const scroller = document.getElementById("giftScroller");
    if (!scroller) return;

    scroller.addEventListener("scroll", () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (scroller.scrollLeft >= maxScroll - 5) {
        scroller.scrollLeft = 0;
      }
    }, { passive: true });
  })();

});
