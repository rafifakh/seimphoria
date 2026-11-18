/* ================= LOGIKA HALAMAN SEJARAH (SEIMPHORIA) ================= */
document.addEventListener("DOMContentLoaded", () => {
  /* ================= 1. SCROLL PROGRESS INDICATOR ================= */
  const progressBar = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0 && progressBar) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = `${scrolled}%`;
    }
  });

  /* ================= 2. LOGIKA TAB & SINKRONISASI HASH (QR CODE) ================= */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const reportPanels = document.querySelectorAll(".report-panel");

  function switchTab(targetId) {
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.target === targetId);
    });

    reportPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      switchTab(targetId);
      history.replaceState(null, "", `#${targetId}`);
    });
  });

  // Buka otomatis tab & arahkan layar jika dibuka dari scan QR Code
  function syncHashFromUrl() {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash && document.getElementById(currentHash)) {
      switchTab(currentHash);
      const tabsNav = document.querySelector(".group-tabs");
      if (tabsNav) {
        tabsNav.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  syncHashFromUrl();
  window.addEventListener("hashchange", syncHashFromUrl);

  /* ================= 3. PARTIKEL BINTANG (MOUSE & USAPAN JARI HP) ================= */
  const starIcons = ["✦", "★", "✧", "•"];
  const starColors = ["#f472b6", "#fb923c", "#facc15", "#c084fc", "#67e8f9"];
  let lastSpawn = 0;

  function createSparkle(x, y) {
    const star = document.createElement("span");
    star.className = "trail-star";
    star.textContent = starIcons[Math.floor(Math.random() * starIcons.length)];

    const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
    star.style.color = chosenColor;
    star.style.textShadow = `0 0 6px ${chosenColor}`;

    const size = Math.floor(Math.random() * 10) + 12;
    star.style.fontSize = `${size}px`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 800);
  }

  function handlePointer(x, y) {
    const now = Date.now();
    if (now - lastSpawn > 35) {
      createSparkle(x, y);
      lastSpawn = now;
    }
  }

  window.addEventListener("mousemove", (e) => {
    handlePointer(e.clientX, e.clientY);
  });

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches && e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );
});