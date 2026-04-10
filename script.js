if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// 2. Register all tools
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 3. Side Navigation Logic
const setupSideNav = () => {
  const sideLinks = document.querySelectorAll(".side-link");

  sideLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const destination = link.getAttribute("href");

      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: destination,
          autoKill: true,
        },
        ease: "power4.inOut",
      });
    });
  });
};

// 4. Main initialization
window.onload = () => {
  // side nav bar
  setupSideNav();

  const elements = document.querySelectorAll(
    ".type-container svg rect, .type-container svg path",
  );
  const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
  const startPositions = [];

  // INTRO ANIMATION //

  elements.forEach((target, index) => {
    const rect = target.getBoundingClientRect();
    const dLeft = rect.left;
    const dRight = window.innerWidth - rect.right;
    const dTop = rect.top;
    const dBottom = window.innerHeight - rect.bottom;

    const min = Math.min(dLeft, dRight, dTop, dBottom);

    let startX = 0;
    let startY = 0;
    const offScreen = 5000;

    if (min === dLeft) startX = -offScreen;
    else if (min === dRight) startX = offScreen;
    else if (min === dTop) startY = -offScreen;
    else if (min === dBottom) startY = offScreen;

    startPositions[index] = { x: startX, y: startY };

    const customDelay = Math.max(0, (min / maxDistance) * 0.4);
    // delay tutorial https://gsap.com/resources/getting-started/timelines

    gsap.from(target, {
      duration: 1.7,
      scale: 4,
      x: startX,
      y: startY,
      transformOrigin: "50% 50%",
      delay: customDelay,
      ease: "power4.out",
      force3D: true,
    });
  });

  // Fade in the headers
  gsap.fromTo(
    ".header-text",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, delay: 1.3, ease: "power3.out" },
  );

  // SCROLL LOGIC //

  setTimeout(() => {
    // bars opening
    elements.forEach((target, index) => {
      gsap.to(target, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "500px top",
          scrub: 1,
        },
        x: startPositions[index].x,
        y: startPositions[index].y,
        scale: 4,
        ease: "power2.in",
        force3D: true,
      });
    });

    // headers fade out
    gsap.to(".header-text", {
      scrollTrigger: {
        trigger: "body",
        start: "10px top",
        end: "200px top",
        scrub: true,
      },
      opacity: 0,
      y: -20,
    });

    // GRID LINES //
    const gridContainer = document.getElementById("grid-container");
    const gridSize = 30;

    const cols = Math.floor(window.innerWidth / gridSize);
    const rows = Math.floor(window.innerHeight / gridSize);

    // vertical lines
    for (let i = 1; i <= cols; i++) {
      const line = document.createElement("div");
      line.classList.add("grid-line-v");
      line.style.left = `${i * gridSize}px`;
      gridContainer.appendChild(line);
    }

    // horizontal lines
    for (let i = 1; i <= rows; i++) {
      const line = document.createElement("div");
      line.classList.add("grid-line-h");
      line.style.top = `${i * gridSize}px`;
      gridContainer.appendChild(line);
    }

    // center text zooming in
    gsap.fromTo(
      ".intro-text",
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: "body",
          start: "100px top",
          end: "400px top",
          scrub: 1,
        },
        scale: 1,
        opacity: 1,
        ease: "power2.out",
      },
    );

    // grid line animation
    gsap.to(".grid-line-h, .grid-line-v", {
      scrollTrigger: {
        trigger: "body",
        start: "175px top",
        end: "400px top",

        scrub: 1,
      },
      opacity: 1,
      stagger: {
        amount: 1,
        from: "random",
      },
      ease: "none",
    });
    // stagger turtorial https://gsap.com/resources/getting-started/Staggers

    // PARALLAX SPEEDS //

    //Foreground Images
    gsap.utils.toArray(".img-fg").forEach((img) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -130,
      });
    });

    // fade in and out for strips
    gsap.utils.toArray(".img-fg").forEach((img) => {
      gsap.set(img, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: "top 98%",
          end: "bottom 5%",
          scrub: true,
        },
      });

      tl.to(img, { opacity: 1, duration: 0.5, ease: "power2.in" })

        .to(img, { opacity: 1, duration: 4, ease: "none" })

        .to(img, { opacity: 0, duration: 0.5, ease: "power2.out" });
    });

    gsap.utils.toArray(".img-bg").forEach((img) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: 80,
      });
    });

    // background image fade
    gsap.utils.toArray(".img-bg").forEach((img) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          end: "bottom 5%",
          scrub: true,
        },
      });

      tl.to(img, { opacity: 0.9, duration: 0.5, ease: "power2.out" })

        .to(img, { opacity: 0.9, duration: 2, ease: "none" })

        .to(img, { opacity: 0, duration: 2, ease: "power2.in" });
    });

    ScrollTrigger.create({
      trigger: ".pinned-intro",
      start: "top top",
      end: "+=400",
      pin: true,
    });
  }, 2300);

  //  DOWNLOADS SECTION //

  // starting point
  gsap.set(".bar-top", { xPercent: -97 });
  gsap.set(".bar-bottom", { xPercent: 97 });
  gsap.set("#final-menu", { yPercent: 100 });

  // timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".redaction-stage",
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: 1,
    },
  });

  // bars closing
  tl.to(".bar-top, .bar-bottom", {
    xPercent: 0,
    ease: "power2.out",
    duration: 1,
  });
  tl.to(
    "#final-menu",
    {
      yPercent: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 1,
    },
    "-=0.6",
  );

  // download menu scroll up from void

  const menuHeaders = document.querySelectorAll("#final-menu .menu-header");

  menuHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      parent.classList.toggle("active");
    });
  });
};
