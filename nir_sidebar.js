/**
 * NIR Portal — Shared Sidebar Navigation v4
 */
(function () {
  var BASE = "https://central-lab-pcg.github.io/NIR-Running-Performance-Check/";

  var TOOLS = [
    { id: "running",
      label: "Running Performance Check",
      url: BASE + "NIR-Running-Performance-Check.html",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { id: "running",
      label: "Raw Data",
      url: BASE + "NIR-Running-Performance-Check.html#raw",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>' },
    { id: "summary",
      label: "Summary",
      url: BASE + "summary_5.html",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' },
    { id: "bias",
      label: "Install & Bias",
      url: BASE + "bias_latest.html",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>' },
    { id: "constituent",
      label: "Best Constituent Finder",
      url: BASE + "best_constituent.html",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' },
  ];

  /* Active detection: compare full href */
  var pageHref = location.href.split("?")[0]; // strip query, keep hash

  function getUserData() {
    try { return JSON.parse(localStorage.getItem("nir_user") || "{}"); } catch(e) { return {}; }
  }

  var W = 220, C = 52;

  var css = [
    "#nir-sb{position:fixed;top:0;left:0;bottom:0;width:"+W+"px;",
    "background:#fff;border-right:1px solid #e4e4e0;",
    "display:flex;flex-direction:column;z-index:9990;",
    "transition:width .22s cubic-bezier(.4,0,.2,1);",
    "box-shadow:2px 0 12px rgba(0,0,0,0.06);}",
    "#nir-sb.col{width:"+C+"px;}",

    "body{margin-left:"+W+"px!important;",
    "transition:margin-left .22s cubic-bezier(.4,0,.2,1)!important;}",
    "body.nir-col{margin-left:"+C+"px!important;}",

    /* Toggle button — fixed, independent of sidebar overflow */
    "#nir-sb-btn{position:fixed;top:15px;left:"+(W-13)+"px;",
    "width:26px;height:26px;border-radius:50%;",
    "background:#fff;border:1px solid #d4d4ce;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;",
    "box-shadow:0 1px 6px rgba(0,0,0,0.14);z-index:9999;",
    "transition:left .22s cubic-bezier(.4,0,.2,1),background .15s;padding:0;}",
    "#nir-sb-btn:hover{background:#f0f0ec;}",
    "#nir-sb-btn svg{transition:transform .22s;}",
    "body.nir-col #nir-sb-btn{left:"+(C-13)+"px;}",
    "body.nir-col #nir-sb-btn svg{transform:rotate(180deg);}",

    /* Brand */
    ".sb-brand{display:flex;align-items:center;gap:10px;padding:0 14px;height:52px;",
    "border-bottom:1px solid #eeeeea;flex-shrink:0;overflow:hidden;white-space:nowrap;}",
    ".sb-logo{width:28px;height:28px;border-radius:7px;flex-shrink:0;",
    "background:linear-gradient(135deg,#1a4a8a,#3a7bd5);",
    "display:flex;align-items:center;justify-content:center;",
    "font-size:11px;font-weight:700;color:#fff;}",
    ".sb-title{font-size:11px;font-weight:700;color:#1a1a1a;letter-spacing:.09em;",
    "text-transform:uppercase;white-space:nowrap;",
    "transition:opacity .15s,transform .15s;transform-origin:left;}",
    "#nir-sb.col .sb-title{opacity:0;transform:scaleX(0);}",

    /* Nav */
    ".sb-nav{flex:1;padding:8px 0;overflow-y:auto;overflow-x:hidden;}",
    ".sb-nav::-webkit-scrollbar{width:3px;}",
    ".sb-nav::-webkit-scrollbar-thumb{background:#d0d0cc;border-radius:2px;}",
    ".sb-sec{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;",
    "color:#b4b4ac;padding:10px 16px 4px;white-space:nowrap;transition:opacity .15s;}",
    "#nir-sb.col .sb-sec{opacity:0;}",

    /* Items */
    ".sb-a{display:flex;align-items:center;gap:10px;padding:0 14px;height:42px;",
    "text-decoration:none!important;color:#4a4a4a!important;",
    "font-size:12.5px;font-weight:500;white-space:nowrap;",
    "transition:background .12s,color .12s;position:relative;overflow:hidden;}",
    ".sb-a:hover{background:#f4f4f0;color:#111!important;}",
    ".sb-a.on{background:#e8f0fe!important;color:#1a5fbf!important;font-weight:600;}",
    ".sb-a.on::before{content:'';position:absolute;left:0;top:8px;bottom:8px;",
    "width:3px;border-radius:0 3px 3px 0;background:#1a5fbf;}",
    ".sb-a.lk{opacity:.28;cursor:not-allowed;pointer-events:none;}",

    /* Sub-item indent for Raw Data */
    ".sb-a.sub{padding-left:28px;height:36px;font-size:12px;color:#666!important;}",
    ".sb-a.sub .sb-ico{width:18px;}",
    "#nir-sb.col .sb-a.sub{padding-left:0;}",

    ".sb-ico{flex-shrink:0;width:22px;display:flex;align-items:center;justify-content:center;}",
    ".sb-lbl{overflow:hidden;text-overflow:ellipsis;transition:opacity .15s,width .15s;}",
    "#nir-sb.col .sb-lbl{opacity:0;width:0;}",
    "#nir-sb.col .sb-a{justify-content:center;padding:0;}",

    /* Tooltip collapsed */
    "#nir-sb.col .sb-a[data-tip]::after{content:attr(data-tip);",
    "position:fixed;left:"+(C+10)+"px;",
    "background:#1a1a1a;color:#fff;font-size:11px;",
    "padding:4px 10px;border-radius:5px;white-space:nowrap;",
    "pointer-events:none;opacity:0;transition:opacity .15s;z-index:9999;}",
    "#nir-sb.col .sb-a:hover[data-tip]::after{opacity:1;}",

    ".sb-lock{margin-left:auto;font-size:10px;}",
    "#nir-sb.col .sb-lock{display:none;}",

    /* Footer */
    ".sb-foot{border-top:1px solid #eeeeea;padding:10px 14px;",
    "display:flex;align-items:center;gap:9px;overflow:hidden;white-space:nowrap;flex-shrink:0;}",
    ".sb-av{width:28px;height:28px;border-radius:50%;flex-shrink:0;",
    "background:linear-gradient(135deg,#3a7bd5,#7ab3f5);",
    "color:#fff;font-size:11px;font-weight:700;",
    "display:flex;align-items:center;justify-content:center;}",
    ".sb-ui{transition:opacity .15s;}",
    "#nir-sb.col .sb-ui{opacity:0;pointer-events:none;}",
    ".sb-un{font-size:12px;font-weight:600;color:#1a1a1a;}",
    ".sb-ur{font-size:10px;color:#999;margin-top:1px;}",
  ].join("");

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function isActive(toolUrl) {
    // Normalize both to compare: strip trailing slash, lowercase
    var th = toolUrl.toLowerCase();
    var ph = pageHref.toLowerCase();
    return ph === th || ph === th + "/" || th === ph + "/";
  }

  function build() {
    if (document.getElementById("nir-sb")) return;

    var ud    = getUserData();
    var perms = ud.perms || {};
    var role  = ud.role  || "";
    var name  = ud.name  || ud.username || "Guest";
    var init  = name.split(" ").map(function(w){return w[0]||"";}).join("").slice(0,2).toUpperCase()||"?";
    var col   = localStorage.getItem("nir_sb_col") === "1";

    var items = TOOLS.map(function(t, i) {
      var active  = isActive(t.url);
      var ok      = (role === "admin") || (perms[t.id] !== false);
      // Raw Data (index 1) is a sub-item
      var isSub   = (i === 1);
      var cls = "sb-a" + (isSub ? " sub" : "") + (active ? " on" : "") + (!ok ? " lk" : "");
      return '<a class="' + cls + '" href="' + (ok ? t.url : "#") + '" data-tip="' + t.label + '">' +
             '<span class="sb-ico">' + t.icon + '</span>' +
             '<span class="sb-lbl">' + t.label + '</span>' +
             (!ok ? '<span class="sb-lock">🔒</span>' : '') +
             '</a>';
    }).join("");

    var sb = document.createElement("div");
    sb.id = "nir-sb";
    sb.innerHTML =
      '<div class="sb-brand">' +
        '<div class="sb-logo">NIR</div>' +
        '<span class="sb-title">NIR PORTAL</span>' +
      '</div>' +
      '<nav class="sb-nav">' +
        '<div class="sb-sec">เมนู</div>' +
        items +
      '</nav>' +
      '<div class="sb-foot">' +
        '<div class="sb-av">' + init + '</div>' +
        '<div class="sb-ui">' +
          '<div class="sb-un">' + name + '</div>' +
          '<div class="sb-ur">' + (role ? role.charAt(0).toUpperCase() + role.slice(1) : "—") + '</div>' +
        '</div>' +
      '</div>';

    var btn = document.createElement("button");
    btn.id = "nir-sb-btn";
    btn.title = "Toggle menu";
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" width="12" height="12"><polyline points="15 18 9 12 15 6"/></svg>';

    document.body.insertBefore(sb, document.body.firstChild);
    document.body.insertBefore(btn, document.body.firstChild);

    if (col) { sb.classList.add("col"); document.body.classList.add("nir-col"); }

    btn.addEventListener("click", function() {
      var isCol = sb.classList.toggle("col");
      document.body.classList.toggle("nir-col", isCol);
      localStorage.setItem("nir_sb_col", isCol ? "1" : "0");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
