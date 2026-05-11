/**
 * NIR Portal — Shared Sidebar Navigation
 */
(function () {
  const TOOLS = [
    {
      id: "running",
      label: "Running Performance Check",
      url: "NIR-Running-Performance-Check.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    },
    {
      id: "summary",
      label: "Summary",
      url: "summary_5.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    },
    {
      id: "bias",
      label: "Install & Bias",
      url: "bias_latest.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    },
    {
      id: "constituent",
      label: "Best Constituent Finder",
      url: "best_constituent.html",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    },
  ];

  const currentFile = location.pathname.split("/").pop() || "";

  function getUserData() {
    try { return JSON.parse(localStorage.getItem("nir_user") || "{}"); }
    catch (e) { return {}; }
  }

  const SIDEBAR_WIDTH = 220;
  const SIDEBAR_COLLAPSED = 52;

  const style = document.createElement("style");
  style.textContent = `
    html { height: 100%; }
    body { margin: 0 !important; min-height: 100vh; }
    #nir-layout { display: flex; min-height: 100vh; }
    #nir-sidebar {
      width: ${SIDEBAR_WIDTH}px; min-height: 100vh;
      background: #ffffff; border-right: 0.5px solid #e0e0dc;
      display: flex; flex-direction: column;
      position: fixed; top: 0; left: 0; bottom: 0; z-index: 200;
      transition: width 0.22s cubic-bezier(.4,0,.2,1);
      overflow: hidden; box-shadow: 2px 0 12px rgba(0,0,0,0.04);
    }
    #nir-sidebar.collapsed { width: ${SIDEBAR_COLLAPSED}px; }
    .nir-sb-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 0 14px; height: 52px; border-bottom: 0.5px solid #e8e8e4;
      flex-shrink: 0; overflow: hidden; white-space: nowrap;
    }
    .nir-sb-logo {
      width: 26px; height: 26px; border-radius: 7px;
      background: linear-gradient(135deg, #1a4a8a, #3a7bd5);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.04em;
    }
    .nir-sb-title {
      font-size: 12px; font-weight: 600; color: #1a1a1a;
      letter-spacing: 0.06em; text-transform: uppercase;
      opacity: 1; transition: opacity 0.15s; white-space: nowrap;
    }
    #nir-sidebar.collapsed .nir-sb-title { opacity: 0; pointer-events: none; }
    .nir-sb-toggle {
      position: absolute; top: 14px; right: -12px;
      width: 24px; height: 24px; border-radius: 50%;
      background: #fff; border: 0.5px solid #d8d8d4; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.10); z-index: 10;
      transition: background 0.15s;
    }
    .nir-sb-toggle:hover { background: #f5f5f3; }
    .nir-sb-toggle svg { transition: transform 0.22s; }
    #nir-sidebar.collapsed .nir-sb-toggle svg { transform: rotate(180deg); }
    .nir-sb-nav { flex: 1; padding: 10px 0; overflow-y: auto; overflow-x: hidden; }
    .nir-sb-nav::-webkit-scrollbar { width: 3px; }
    .nir-sb-nav::-webkit-scrollbar-thumb { background: #d8d8d4; border-radius: 2px; }
    .nir-sb-section-label {
      font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: #b0b0a8; padding: 10px 16px 4px;
      white-space: nowrap; overflow: hidden; transition: opacity 0.15s;
    }
    #nir-sidebar.collapsed .nir-sb-section-label { opacity: 0; }
    .nir-sb-item {
      display: flex; align-items: center; gap: 11px;
      padding: 0 14px; height: 40px; cursor: pointer;
      text-decoration: none !important; color: #555 !important;
      font-size: 12.5px; font-weight: 500; white-space: nowrap;
      transition: background 0.12s, color 0.12s;
      position: relative; overflow: hidden; font-family: inherit;
    }
    .nir-sb-item:hover { background: #f5f5f3; color: #1a1a1a !important; }
    .nir-sb-item.active { background: #eaf2ff; color: #1a5fbf !important; font-weight: 600; }
    .nir-sb-item.active::before {
      content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
      width: 3px; border-radius: 0 2px 2px 0; background: #1a5fbf;
    }
    .nir-sb-item.locked { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
    .nir-sb-item-icon { flex-shrink: 0; width: 24px; display: flex; align-items: center; justify-content: center; }
    .nir-sb-item-label { opacity: 1; transition: opacity 0.15s; overflow: hidden; text-overflow: ellipsis; }
    #nir-sidebar.collapsed .nir-sb-item-label { opacity: 0; }
    #nir-sidebar.collapsed .nir-sb-item { justify-content: center; padding: 0; }
    #nir-sidebar.collapsed .nir-sb-item::after {
      content: attr(data-tooltip); position: absolute; left: calc(100% + 10px); top: 50%;
      transform: translateY(-50%); background: #1a1a1a; color: #fff; font-size: 11px;
      padding: 4px 10px; border-radius: 5px; white-space: nowrap;
      pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 999;
    }
    #nir-sidebar.collapsed .nir-sb-item:hover::after { opacity: 1; }
    .nir-sb-lock { margin-left: auto; font-size: 11px; opacity: 0.5; }
    #nir-sidebar.collapsed .nir-sb-lock { display: none; }
    .nir-sb-footer {
      border-top: 0.5px solid #e8e8e4; padding: 10px 14px;
      display: flex; align-items: center; gap: 9px;
      overflow: hidden; white-space: nowrap; flex-shrink: 0;
    }
    .nir-sb-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #3a7bd5, #7ab3f5);
      color: #fff; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; letter-spacing: 0.04em;
    }
    .nir-sb-user-info { transition: opacity 0.15s; }
    #nir-sidebar.collapsed .nir-sb-user-info { opacity: 0; pointer-events: none; }
    .nir-sb-username { font-size: 12px; font-weight: 600; color: #1a1a1a; }
    .nir-sb-role { font-size: 10px; color: #999; margin-top: 1px; }
    #nir-main-content {
      margin-left: ${SIDEBAR_WIDTH}px; flex: 1; min-width: 0;
      transition: margin-left 0.22s cubic-bezier(.4,0,.2,1);
    }
    #nir-sidebar.collapsed ~ #nir-main-content { margin-left: ${SIDEBAR_COLLAPSED}px; }
    @media (max-width: 600px) {
      #nir-sidebar { width: ${SIDEBAR_COLLAPSED}px; }
      #nir-main-content { margin-left: ${SIDEBAR_COLLAPSED}px; }
    }
  `;
  document.head.appendChild(style);

  function buildSidebar() {
    const userData = getUserData();
    const perms = userData.perms || {};
    const role = userData.role || "";
    const name = userData.name || userData.username || "Guest";
    const initials = name.split(" ").map(function(w){ return w[0]; }).join("").slice(0, 2).toUpperCase() || "?";

    const sidebar = document.createElement("div");
    sidebar.id = "nir-sidebar";

    const isCollapsed = localStorage.getItem("nir_sidebar_collapsed") === "1";
    if (isCollapsed) sidebar.classList.add("collapsed");

    const items = TOOLS.map(function(tool) {
      const isActive = currentFile === tool.url;
      const hasAccess = role === "admin" || perms[tool.id] !== false;
      return '<a class="nir-sb-item' + (isActive ? " active" : "") + (!hasAccess ? " locked" : "") + '"' +
        ' href="' + (hasAccess ? tool.url : "#") + '"' +
        ' data-tooltip="' + tool.label + '"' +
        ' title="' + tool.label + '">' +
        '<span class="nir-sb-item-icon">' + tool.icon + '</span>' +
        '<span class="nir-sb-item-label">' + tool.label + '</span>' +
        (!hasAccess ? '<span class="nir-sb-lock">🔒</span>' : "") +
        '</a>';
    }).join("");

    sidebar.innerHTML =
      '<div class="nir-sb-brand">' +
        '<div class="nir-sb-logo">NIR</div>' +
        '<span class="nir-sb-title">NIR Portal</span>' +
      '</div>' +
      '<button class="nir-sb-toggle" id="nir-sb-toggle-btn" title="Toggle sidebar">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<nav class="nir-sb-nav">' +
        '<div class="nir-sb-section-label">เมนู</div>' +
        items +
      '</nav>' +
      '<div class="nir-sb-footer">' +
        '<div class="nir-sb-avatar">' + initials + '</div>' +
        '<div class="nir-sb-user-info">' +
          '<div class="nir-sb-username">' + name + '</div>' +
          '<div class="nir-sb-role">' + (role ? role.charAt(0).toUpperCase() + role.slice(1) : "—") + '</div>' +
        '</div>' +
      '</div>';

    return sidebar;
  }

  function injectSidebar() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", injectSidebar);
      return;
    }

    var sidebar = buildSidebar();
    var mainWrapper = document.createElement("div");
    mainWrapper.id = "nir-main-content";
    var layout = document.createElement("div");
    layout.id = "nir-layout";

    while (document.body.firstChild) {
      mainWrapper.appendChild(document.body.firstChild);
    }

    layout.appendChild(sidebar);
    layout.appendChild(mainWrapper);
    document.body.appendChild(layout);

    var toggleBtn = document.getElementById("nir-sb-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        var collapsed = sidebar.classList.contains("collapsed");
        localStorage.setItem("nir_sidebar_collapsed", collapsed ? "1" : "0");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSidebar);
  } else {
    injectSidebar();
  }
})();
