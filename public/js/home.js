gsap.registerPlugin(ScrollTrigger);

const audio = document.getElementById("zoomAudio");

// ✅ Force autoplay: start muted
audio.volume = 0;
audio.muted = true;
audio.play().then(() => {
  // Once it starts, unmute it so volume control works
  audio.muted = false;
}).catch(err => console.log("Autoplay blocked:", err));

const clipAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: "#clip",
    start: "center center",
    end: "+=800 center",
    scrub: 0.5,
    pin: true,
    pinSpacing: true,
    onEnter: () => {
      // Play if it somehow didn't start
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    },
    onUpdate: (self) => {
      // ✅ Gradually increase volume with scroll progress
      audio.volume = Math.min(1, self.progress);
    }
  }
});

// ✅ Zoom animation
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

  