document.addEventListener("DOMContentLoaded", () => {
  const waveTopLeft = document.getElementById("waveTopLeft");
  const waveBottomRight = document.getElementById("waveBottomRight");

  // ✅ Step 1: Reverse wave if we just arrived from another page
  if (sessionStorage.getItem("waveTransition") === "true") {
    sessionStorage.removeItem("waveTransition");
    gsap.set([waveTopLeft, waveBottomRight], { scale: 1 });

    // Animate waves going out diagonally
    gsap.to(waveTopLeft, {
      scale: 0,
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.to(waveBottomRight, {
      scale: 0,
      duration: 1,
      ease: "power4.inOut",
      delay: 0.1,
    });
  }

  // ✅ Step 2: Animate waves in on link click
  document.querySelectorAll("a[data-transition]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.currentTarget.getAttribute("href");

      // Animate waves to fill the screen
      gsap.set([waveTopLeft, waveBottomRight], { scale: 0 });

      gsap.to(waveTopLeft, {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      });

      gsap.to(waveBottomRight, {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.1,
        onComplete: () => {
          sessionStorage.setItem("waveTransition", "true");
          window.location.href = target;
        },
      });
    });
  });
});
