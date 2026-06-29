/* ===========================================================
   SwiftRide Cloud — Shared App Logic
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-ready");
  initTheme();
  initRippleButtons();
  initScrollReveal();
  initNavScroll();
  initMobileNav();
  renderAuthState();
  if (!document.getElementById("toast-stack")) {
    const stack = document.createElement("div");
    stack.id = "toast-stack";
    document.body.appendChild(stack);
  }
});

/* ---------------- Theme (Dark mode) ---------------- */
function initTheme() {
  const saved = localStorage.getItem("sr_theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    updateThemeIcon(btn, saved);
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("sr_theme", next);
      document.querySelectorAll("[data-theme-toggle]").forEach(b => updateThemeIcon(b, next));
    });
  });
}
function updateThemeIcon(btn, mode) {
  btn.innerHTML = mode === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/* ---------------- Ripple effect on buttons ---------------- */
function initRippleButtons() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

/* ---------------- Scroll reveal ---------------- */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ---------------- Navbar scroll state ---------------- */
function initNavScroll() {
  const nav = document.querySelector(".navbar");
  if (!nav) return;
  if (nav.dataset.forceLight === "true") return; // pages without a dark hero stay in light/glass style always
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-burger");
  const menu = document.querySelector(".nav-mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("active");
  });
}

/* ---------------- Toasts ---------------- */
function srToast(message, type = "info", icon = null) {
  let stack = document.getElementById("toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "toast-stack";
    document.body.appendChild(stack);
  }
  const defaultIcons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icon || defaultIcons[type]}"></i><span>${message}</span><span class="toast-close"><i class="fa-solid fa-xmark"></i></span>`;
  toast.querySelector(".toast-close").addEventListener("click", () => toast.remove());
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

/* ---------------- Mock Auth ---------------- */
function srGetSession() {
  try { return JSON.parse(localStorage.getItem("sr_session") || "null"); } catch { return null; }
}
function srSetSession(session) {
  localStorage.setItem("sr_session", JSON.stringify(session));
}
function srLogout() {
  localStorage.removeItem("sr_session");
  srToast("You've been signed out", "info");
  setTimeout(() => window.location.href = "index.html", 600);
}
function renderAuthState() {
  const session = srGetSession();
  document.querySelectorAll("[data-auth-area]").forEach(area => {
    if (session) {
      area.innerHTML = `
        <div class="nav-user-chip">
          <div class="nav-user-avatar">${session.name.charAt(0).toUpperCase()}</div>
          <span>${session.name.split(" ")[0]}</span>
          <i class="fa-solid fa-chevron-down" style="font-size:11px;"></i>
          <div class="nav-user-dropdown">
            <a href="${session.role === 'admin' ? 'admin-dashboard.html' : session.role === 'operator' ? 'operator-dashboard.html' : 'dashboard.html'}"><i class="fa-solid fa-gauge"></i> Dashboard</a>
            <a href="profile.html"><i class="fa-solid fa-user"></i> Profile</a>
            <a href="booking-history.html"><i class="fa-solid fa-ticket"></i> Booking History</a>
            <a href="#" onclick="srLogout(); return false;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out</a>
          </div>
        </div>`;
    } else {
      area.innerHTML = `
        <a href="login.html" class="btn btn-outline btn-sm">Log In</a>
        <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>`;
    }
  });
}

/* ---------------- Guard pages that require auth ---------------- */
function srRequireAuth(role = null) {
  const session = srGetSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  if (role && session.role !== role) {
    srToast("You don't have access to that page", "error");
    setTimeout(() => window.location.href = "index.html", 800);
    return null;
  }
  return session;
}

/* ---------------- Loading overlay helper ---------------- */
function srShowLoader(targetEl, ms, callback) {
  targetEl.classList.add("sr-loading");
  setTimeout(() => {
    targetEl.classList.remove("sr-loading");
    callback();
  }, ms);
}
