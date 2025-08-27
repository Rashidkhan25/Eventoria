gsap.registerPlugin(ScrollTrigger);

const audio = document.getElementById("zoomAudio");
const enableAudioBtn = document.getElementById("enableAudioBtn");
const text = document.getElementById("musicText");
const wrapper = document.getElementById("musicWrapper");


let audioEnabled = false;

// 🎵 User clicks → allow audio to play
enableAudioBtn.addEventListener("click", () => {
  audioEnabled = true;
  audio.volume = 0;
  audio.loop = true;   // Keeps playing till end of site
  audio.play().then(() => {
    console.log("Audio started");
  }).catch(err => console.log("Autoplay blocked:", err));

  // Hide the button after enabling
  wrapper.style.display = "none";
});

// ✅ Scroll Animation (Zoom + Volume Fade-in)
const clipAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: "#clip",
    start: "center center",
    end: "+=800 center",
    scrub: 0.5,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      if (audioEnabled) {
        // Increase volume gradually during scroll
        audio.volume = Math.min(1, self.progress);
      }
    }
  }
});

// Zoom Animation
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

//bento card border effect
const card = document.querySelector(".bento-tilt");

card.addEventListener("mousemove", (e) => {
  const { offsetWidth: w, offsetHeight: h } = card;
  const { offsetX: x, offsetY: y } = e;

  card.classList.remove("glow-right", "glow-left", "glow-top", "glow-bottom");

  if (x > w * 0.75) card.classList.add("glow-right");
  else if (x < w * 0.25) card.classList.add("glow-left");
  else if (y < h * 0.25) card.classList.add("glow-top");
  else if (y > h * 0.75) card.classList.add("glow-bottom");
});

card.addEventListener("mouseleave", () => {
  card.classList.remove("glow-right", "glow-left", "glow-top", "glow-bottom");
});