document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scrolling down → fade out
      navbar.style.opacity = "0";
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up → fade in
      navbar.style.opacity = "1";
      navbar.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
});