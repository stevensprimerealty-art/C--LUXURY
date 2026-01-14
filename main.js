document.addEventListener("DOMContentLoaded", () => {

  const headlines = [
    "A NEW YEAR\nWITH PRESENCE",
    "LUXURY\nWITHOUT NOISE",
    "SILENCE\nIS POWER",
    "PRESENCE\nWITHOUT NOISE",
    "SILENCE\nCONNOTES NOISE",
    "LUXURY\nWITHOUT NOISE"
  ];

  const slides = document.querySelectorAll(".slide");
  const title = document.getElementById("heroTitle");
  const rings = document.querySelectorAll(".ring");

  if (!slides.length || !title || !rings.length) return;

  let i = 0;

  function show(n) {
    slides.forEach(s => s.classList.remove("is-active"));
    rings.forEach(r => r.classList.remove("is-active"));

    slides[n].classList.add("is-active");
    rings[n].classList.add("is-active");

    title.classList.add("is-fading");
    setTimeout(() => {
      title.innerHTML = headlines[n].replace(/\n/g, "<br>");
      title.classList.remove("is-fading");
    }, 250);
  }

  setInterval(() => {
    i = (i + 1) % slides.length;
    show(i);
  }, 4500);

  rings.forEach((r, idx) => {
    r.addEventListener("click", () => {
      i = idx;
      show(i);
    });
  });

  /* Gift loop */
  const scroller = document.getElementById("giftScroller");
  if (scroller) {
    scroller.addEventListener("scroll", () => {
      if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 5) {
        scroller.scrollLeft = 0;
      }
    });
  }

});
