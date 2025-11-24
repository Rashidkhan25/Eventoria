 const images = document.querySelectorAll(".loader-image");
      const loaderVideo = document.getElementById("loaderVideo");
      const overlay = document.getElementById("overlay");

      const PLAY_DURATION = 1.5;

      // Initial setup for video
      gsap.set(loaderVideo, {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "300px",
        height: "250px",
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 0.8,
        zIndex: 5,
        objectFit: "cover",
      });

      const title = document.getElementById("loaderTitle");
      const text = title.textContent;
      title.textContent = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        title.appendChild(span);
      });

      // ✅ Animate letters one by one
      gsap.to(title, { opacity: 1, duration: 0.5 });
      gsap.to("#loaderTitle span", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.4,
        delay: 0.6,
      });

      // Animate images sequentially
      images.forEach((img, index) => {
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.5,
          onComplete: () => {
            if (index < images.length - 1)
              gsap.to(img, { opacity: 0, duration: 0.3 });
          },
        });
      });

      // Show video
      gsap.to(loaderVideo, {
        opacity: 1,
        scale: 1,
        delay: images.length * 0.5,
        duration: 0.5,
        onComplete: () => loaderVideo.play(),
      });

      function handleTimeUpdate() {
        if (loaderVideo.currentTime >= PLAY_DURATION) {
          loaderVideo.removeEventListener("timeupdate", handleTimeUpdate);

          sessionStorage.setItem("heroVideoTime", loaderVideo.currentTime);

          // Step 1: Zoom to fullscreen
          gsap.to(loaderVideo, {
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.inOut",
            onComplete: () => {
              // Step 2: Fade to black with slight delay
              gsap.to(overlay, {
                opacity: 1,
                duration: 1,
                ease: "expo.inOut",
                delay: 0.2,
                onComplete: () => {
                  window.location.href = "/home";
                },
              });
            },
          });
        }
      }

      loaderVideo.addEventListener("timeupdate", handleTimeUpdate);