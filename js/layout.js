/* ===========================================================
   SwiftRide Cloud — Shared Layout Injection (Navbar + Footer)
   =========================================================== */

function srRenderNavbar(activePage = "", forceLight = false) {
  const navHtml = `
  <nav class="navbar ${forceLight ? 'scrolled' : ''}" id="srNavbar" ${forceLight ? 'data-force-light="true"' : ''}>
    <div class="container">
      <a href="index.html" class="brand">
        <span class="brand-mark"><i class="fa-solid fa-bus-simple"></i></span>
        <span class="brand-text">SwiftRide <span>Cloud</span></span>
      </a>
      <ul class="nav-links">
        <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="search.html" class="${activePage === 'search' ? 'active' : ''}">Search Bus</a></li>
        <li><a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
        <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        <li><a href="faq.html" class="${activePage === 'faq' ? 'active' : ''}">FAQ</a></li>
      </ul>
      <div class="nav-right">
        <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"><i class="fa-solid fa-moon"></i></button>
        <div data-auth-area></div>
        <button class="nav-burger" aria-label="Open menu"><span></span><span></span><span></span></button>
      </div>
      <div class="nav-mobile-menu">
        <a href="index.html">Home</a>
        <a href="search.html">Search Bus</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="faq.html">FAQ</a>
        <div class="nav-mobile-divider"></div>
        <a href="dashboard.html">My Dashboard</a>
        <a href="login.html">Log In</a>
      </div>
    </div>
  </nav>`;
  document.getElementById("sr-navbar-mount").outerHTML = navHtml;
}

function srRenderDashSidebar(role, activePage) {
  const session = srGetSession();
  const name = session ? session.name : "Guest";

  const navsByRole = {
    passenger: [
      { sec: "Overview" },
      { href: "dashboard.html", icon: "fa-gauge", label: "Dashboard", key: "dashboard" },
      { href: "booking-history.html", icon: "fa-ticket", label: "Booking History", key: "history" },
      { sec: "Account" },
      { href: "profile.html", icon: "fa-user", label: "Profile", key: "profile" },
      { href: "wallet.html", icon: "fa-wallet", label: "Wallet & Rewards", key: "wallet" },
      { href: "notifications.html", icon: "fa-bell", label: "Notifications", key: "notifications" },
      { href: "support.html", icon: "fa-headset", label: "Support Tickets", key: "support" },
      { sec: "" },
      { href: "settings.html", icon: "fa-gear", label: "Settings", key: "settings" },
    ],
    operator: [
      { sec: "Operations" },
      { href: "operator-dashboard.html", icon: "fa-gauge", label: "Dashboard", key: "dashboard" },
      { href: "operator-buses.html", icon: "fa-bus", label: "Manage Buses", key: "buses" },
      { href: "operator-routes.html", icon: "fa-route", label: "Manage Routes", key: "routes" },
      { href: "operator-bookings.html", icon: "fa-ticket", label: "View Bookings", key: "bookings" },
      { sec: "Insights" },
      { href: "operator-reports.html", icon: "fa-chart-line", label: "Reports & Revenue", key: "reports" },
      { sec: "" },
      { href: "settings.html", icon: "fa-gear", label: "Settings", key: "settings" },
    ],
    admin: [
      { sec: "Overview" },
      { href: "admin-dashboard.html", icon: "fa-gauge", label: "Dashboard", key: "dashboard" },
      { href: "admin-analytics.html", icon: "fa-chart-pie", label: "Analytics", key: "analytics" },
      { sec: "Management" },
      { href: "admin-users.html", icon: "fa-users", label: "User Management", key: "users" },
      { href: "admin-buses.html", icon: "fa-bus", label: "Bus Management", key: "buses" },
      { href: "admin-operators.html", icon: "fa-building", label: "Operator Management", key: "operators" },
      { href: "admin-routes.html", icon: "fa-route", label: "Route Management", key: "routes" },
      { href: "admin-bookings.html", icon: "fa-ticket", label: "Booking Management", key: "bookings" },
      { href: "admin-payments.html", icon: "fa-credit-card", label: "Payment Monitoring", key: "payments" },
      { sec: "" },
      { href: "settings.html", icon: "fa-gear", label: "Settings", key: "settings" },
    ]
  };

  const items = navsByRole[role] || navsByRole.passenger;
  const navHtml = items.map(item => {
    if (item.sec !== undefined) return item.sec ? `<div class="dash-nav-section">${item.sec}</div>` : `<div style="height:8px;"></div>`;
    return `<a href="${item.href}" class="${activePage === item.key ? 'active' : ''}"><i class="fa-solid ${item.icon}"></i> ${item.label}</a>`;
  }).join("");

  const sidebarHtml = `
  <aside class="dash-sidebar">
    <a href="index.html" class="brand"><span class="brand-mark"><i class="fa-solid fa-bus-simple"></i></span><span class="brand-text">SwiftRide <span>Cloud</span></span></a>
    <nav class="dash-nav">${navHtml}</nav>
    <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px; margin-top:10px;">
      <div style="display:flex; align-items:center; gap:10px; padding:8px 10px;">
        <div class="nav-user-avatar">${name.charAt(0).toUpperCase()}</div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:13px; font-weight:700; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
          <div style="font-size:11px; color:rgba(255,255,255,0.5); text-transform:capitalize;">${role}</div>
        </div>
        <button onclick="srLogout()" aria-label="Sign out" style="background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer;"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
      </div>
    </div>
  </aside>
  <div class="mobile-dash-nav">${items.filter(i => i.sec === undefined).map(i => `<a href="${i.href}" class="${activePage === i.key ? 'active' : ''}">${i.label}</a>`).join("")}</div>`;

  document.getElementById("sr-dash-sidebar-mount").outerHTML = sidebarHtml;
}

function srRenderFooter() {
  const footerHtml = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="brand" style="margin-bottom: 6px;">
            <span class="brand-mark"><i class="fa-solid fa-bus-simple"></i></span>
            <span class="brand-text" style="color:white;">SwiftRide <span style="color:var(--orange-400);">Cloud</span></span>
          </a>
          <p class="footer-brand-text">A cloud-native bus ticketing platform with real-time seat availability, secure digital payments, and live journey tracking — built for the modern Indian traveler.</p>
          <div class="footer-socials">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="search.html">Search Buses</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="search.html">Bus Booking</a></li>
            <li><a href="#">Live Tracking</a></li>
            <li><a href="register-operator.html">Operator Partner Portal</a></li>
            <li><a href="#">Group Bookings</a></li>
            <li><a href="#">Corporate Travel</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-links">
            <li><i class="fa-solid fa-location-dot" style="margin-right:8px; color:var(--orange-400);"></i>Cloud Tower, BKC, Mumbai 400051</li>
            <li><i class="fa-solid fa-phone" style="margin-right:8px; color:var(--orange-400);"></i>+91 22 4000 1234</li>
            <li><i class="fa-solid fa-envelope" style="margin-right:8px; color:var(--orange-400);"></i>support@swiftridecloud.app</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 SwiftRide Cloud. All rights reserved.</span>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </div>
  </footer>`;
  document.getElementById("sr-footer-mount").outerHTML = footerHtml;
}
