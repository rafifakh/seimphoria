// Matikan pemulihan scroll otomatis bawaan browser & paksa ke atas
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Up Button & Navbar Shadow
  const scrollUp = document.querySelector(".scroll-up");
  const navbar = document.querySelector(".navbar");

  window.addEventListener(
    "scroll",
    () => {
      const scrollPos = window.scrollY;

      if (scrollUp) {
        if (scrollPos > 400) {
          scrollUp.classList.add("scroll-active");
        } else {
          scrollUp.classList.remove("scroll-active");
        }
      }

      if (navbar) {
        if (scrollPos > 40) {
          navbar.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
        } else {
          navbar.style.boxShadow = "var(--shadow-sm)";
        }
      }
    },
    { passive: true }
  );

  // 2. Scrollspy Menu Highlight
  const sections = document.querySelectorAll("section[id], header[id], footer[id]");
  const navLinks = document.querySelectorAll(".navbar-box .menu li a");

  window.addEventListener(
    "scroll",
    () => {
      let currentSectionId = "";
      const scrollPosition = window.scrollY + 140;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSectionId = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const hrefTarget = link.getAttribute("href").replace("#", "");
        if (hrefTarget === currentSectionId) {
          link.classList.add("active");
        }
      });
    },
    { passive: true }
  );

  // 3. Smooth Scroll Tombol Scroll-Up
  if (scrollUp) {
    scrollUp.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 4. Logika Slider dengan Auto-Hide Tombol Panah
  function setupSmartSlider(sliderId, prevBtnId, nextBtnId) {
    const slider = document.getElementById(sliderId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!slider || !prevBtn || !nextBtn) return;

    function updateArrowVisibility() {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const currentScroll = slider.scrollLeft;

      if (currentScroll <= 15) {
        prevBtn.classList.add("is-hidden");
      } else {
        prevBtn.classList.remove("is-hidden");
      }

      if (currentScroll >= maxScrollLeft - 15) {
        nextBtn.classList.add("is-hidden");
      } else {
        nextBtn.classList.remove("is-hidden");
      }
    }

    nextBtn.addEventListener("click", () => {
      const card = slider.querySelector(".box");
      const cardWidth = card ? card.offsetWidth + 28 : 320;
      slider.scrollBy({ left: cardWidth, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      const card = slider.querySelector(".box");
      const cardWidth = card ? card.offsetWidth + 28 : 320;
      slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    slider.addEventListener("scroll", updateArrowVisibility, { passive: true });
    window.addEventListener("resize", updateArrowVisibility);

    updateArrowVisibility();
    setTimeout(updateArrowVisibility, 300);
  }

  setupSmartSlider("akademikBox", "slidePrev", "slideNext");
  setupSmartSlider("achievementBox", "achievePrev", "achieveNext");
});

/* ================= PARTIKEL JEJAK BINTANG SEIMPHORIA ================= */
(function initSparkleTrail() {
  const starIcons = ["✦", "★", "✧", "•"];
  const starColors = ["#f472b6", "#fb923c", "#facc15", "#a78bfa", "#38bdf8"];
  let lastSpawnTime = 0;

  function createSparkle(x, y) {
    const star = document.createElement("span");
    star.className = "trail-star";

    // Pilih bentuk dan warna secara acak
    star.textContent = starIcons[Math.floor(Math.random() * starIcons.length)];
    const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
    star.style.color = chosenColor;
    star.style.textShadow = `0 0 6px ${chosenColor}`;

    // Variasi ukuran acak antara 12px s.d 22px
    const size = Math.floor(Math.random() * 11) + 12;
    star.style.fontSize = `${size}px`;

    // Posisi tepat di ujung kursor / sentuhan jari
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 800);
  }

  // Throttle agar tidak membebani browser jika gerakan terlalu cepat
  function handleSpawn(x, y) {
    const now = Date.now();
    if (now - lastSpawnTime > 35) { // Batasi jeda kemunculan tiap 35 milidetik
      createSparkle(x, y);
      lastSpawnTime = now;
    }
  }

  // 1. Deteksi Gerakan Mouse di Laptop/Desktop
  window.addEventListener("mousemove", (e) => {
    handleSpawn(e.clientX, e.clientY);
  });

  // 2. Deteksi Usapan Jari di Layar Sentuh HP/Tablet
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches.length > 0) {
        handleSpawn(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );
})();

// Inisialisasi AOS
window.addEventListener("load", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 900,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
    AOS.refresh();
  }
});

// ================= PENGIRIMAN SARAN (DENGAN HONEYPOT & COOLDOWN) =================
const feedbackForm = document.getElementById("feedbackForm");
const formStatus = document.getElementById("formStatus");
const btnSubmit = document.getElementById("btnSubmit");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // 1. Cek Honeypot (Perlindungan Bot)
    const honeypotInput = feedbackForm.querySelector('input[name="website_url"]');
    if (honeypotInput && honeypotInput.value) {
      console.warn("Bot terdeteksi!");
      return;
    }

    // 2. Cek Cooldown (Jeda 60 Detik Antar Pengiriman)
    const lastSubmit = localStorage.getItem("last_submit");
    if (lastSubmit && Date.now() - Number(lastSubmit) < 60000) {
      alert("Tunggu 1 menit sebelum mengirim pesan lagi ya!");
      return;
    }

    // 3. Ubah Tombol ke Status Loading
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim Masukan...';

    formStatus.style.display = "none";
    formStatus.className = "form-status";

    const formData = new FormData(feedbackForm);

    // 4. Kirim ke Google Apps Script
    fetch(feedbackForm.action, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        localStorage.setItem("last_submit", Date.now().toString());

        formStatus.className = "form-status success";
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Pesan Terkirim!</strong> Terima kasih atas aspirasinya untuk Seimphoria XI-11 🎠✨';
        formStatus.style.display = "block";

        feedbackForm.reset();

        setTimeout(() => {
          formStatus.style.display = "none";
        }, 6000);
      })
      .catch((error) => {
        console.error("Error pengiriman:", error);
        formStatus.className = "form-status error";
        formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> <strong>Gagal Terkirim!</strong> Periksa koneksi internetmu dan coba lagi.';
        formStatus.style.display = "block";
      })
      .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Masukan';
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const captionText = document.getElementById("modalCaption");

  // Ambil semua foto di dalam id="memories"
  const galleryImages = document.querySelectorAll("#memories img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      if (modal && modalImg) {
        modal.classList.add("active");
        modalImg.src = this.src;
        if (captionText) {
          captionText.innerHTML = this.alt || "Dokumentasi Seimphoria";
        }
      }
    });
  });
});

// ================= TOGGLE NAVBAR HAMBURGER =================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Tutup menu otomatis jika salah satu tautan diklik
  document.querySelectorAll('#navMenu li a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

// Indikator Garis Scroll
window.addEventListener("scroll", () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.getElementById("scrollProgress");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
});

