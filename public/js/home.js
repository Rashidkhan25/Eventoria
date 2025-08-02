 gsap.registerPlugin(ScrollTrigger);

  const clipAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: "#clip",
      start: "center center",
      end: "+=800 center",
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
    },
  });

  clipAnimation.to(".mask-clip-path", {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    ease: "power2.inOut"
  });

  //bento animation 
  document.addEventListener("DOMContentLoaded", () => {
  // Tilt Effect
  document.querySelectorAll(".bento-tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * 5}deg) rotateY(${x * -5}deg) scale(0.95)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Hover Button Radial Effect
  document.querySelectorAll(".hover-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.background = `radial-gradient(100px circle at ${x}px ${y}px, #656fe288, #00000026)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "white/20";
    });
  });
});

  