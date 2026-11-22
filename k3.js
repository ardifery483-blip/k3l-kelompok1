document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
      themeToggle.setAttribute("title", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    }
    if (themeColor) themeColor.setAttribute("content", isDark ? "#101712" : "#f7f8f3");
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("k3l-theme");
  } catch (_) {}
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || preferredTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("k3l-theme", nextTheme);
      } catch (_) {}
    });
  }

  const checklist = document.querySelector(".checklist");
  const count = document.querySelector("#progress-count");
  const fill = document.querySelector("#progress-fill");
  const bar = document.querySelector("#progress-bar");

  function updateProgress() {
    if (!checklist || !count || !fill || !bar) return;
    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    const total = checkboxes.length;
    const completed = checklist.querySelectorAll('input[type="checkbox"]:checked').length;
    
    count.textContent = `${completed} dari ${total}`;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    fill.style.width = `${percent}%`;
    bar.setAttribute("aria-valuenow", completed);
    bar.setAttribute("aria-valuemax", total);

    const feedbackEl = document.querySelector("#checklist-feedback");
    if (feedbackEl) {
      if (completed === total && total > 0) {
        feedbackEl.textContent = "✓ Sempurna! Seluruh protokol kesiapan K3 telah terpenuhi.";
        feedbackEl.style.color = "var(--green)";
      } else {
        feedbackEl.textContent = "Lengkapi semua item sebelum memulai kegiatan praktikum atau kerja.";
        feedbackEl.style.color = "var(--muted)";
      }
    }
  }

  if (checklist) {
    checklist.addEventListener("change", updateProgress);
    updateProgress();
  }
});