/**
 * NIR Portal — Auth + Plant Filter Wrapper
 * วางใน <head> ของทุกไฟล์ที่ต้องป้องกัน
 *
 * Running:     <script>var NIR_TOOL_ID = "running";</script>
 * Summary:     <script>var NIR_TOOL_ID = "summary";</script>
 * Constituent: <script>var NIR_TOOL_ID = "constituent";</script>
 */
(function () {
  const PORTAL_URL = "index.html";

  // 1. ตรวจ session
  const raw = localStorage.getItem("nir_user");
  const tab = localStorage.getItem("nir_tab_active") || sessionStorage.getItem("nir_tab_active");
  if (!raw || !tab) {
    document.documentElement.innerHTML = '<body style="display:none"></body>';
    window.location.replace(PORTAL_URL);
    return;
  }
  let session;
  try { session = JSON.parse(raw); } catch (e) { window.location.replace(PORTAL_URL); return; }

  // 2. ตรวจสิทธิ์ tool
  const users = JSON.parse(localStorage.getItem("nir_users") || "null");
  const toolId = (typeof NIR_TOOL_ID !== "undefined") ? NIR_TOOL_ID : null;
  if (toolId && users) {
    const u = users[session.username];
    if (!u || !u.perms || !u.perms[toolId]) {
      document.documentElement.innerHTML = `<head><meta charset="UTF-8">
        <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f3;}
        .box{text-align:center;padding:40px;background:#fff;border-radius:16px;border:0.5px solid #e0e0dc;max-width:360px;}
        h2{font-size:18px;font-weight:500;color:#1a1a1a;margin-bottom:8px;}p{font-size:13px;color:#888;margin-bottom:24px;}
        a{display:inline-block;padding:10px 24px;background:#1a1a1a;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;}</style></head>
        <body><div class="box"><div style="font-size:40px;margin-bottom:12px;">🔒</div>
        <h2>ไม่มีสิทธิ์เข้าถึง</h2><p>กรุณาติดต่อ Admin</p>
        <a href="${PORTAL_URL}">← กลับหน้าหลัก</a></div></body>`;
      setTimeout(() => window.location.replace(PORTAL_URL), 3000);
      return;
    }
  }

  // 3. ซ่อนหน้าชั่วคราว
  document.documentElement.style.visibility = "hidden";

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.style.visibility = "visible";

    // 4. Lock Plant filter
    const allowedPlants = (session.plants && session.plants.length > 0) ? session.plants : null;
    const fPlant = document.getElementById("fPlant");

    if (fPlant && allowedPlants !== null) {
      const applyPlantFilter = () => {
        if (allowedPlants.length === 1) {
          // เดียว — set แล้ว disable
          Array.from(fPlant.options).forEach(opt => {
            if (opt.text === allowedPlants[0] || opt.value === allowedPlants[0]) {
              fPlant.value = opt.value;
            }
          });
          fPlant.disabled = true;
          fPlant.style.opacity = "0.6";
          fPlant.style.cursor = "not-allowed";
          fPlant.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // หลาย plant — ลบ option ที่ไม่ได้รับสิทธิ์
          Array.from(fPlant.options).forEach(opt => {
            if (opt.value === "") return;
            if (!allowedPlants.includes(opt.text) && !allowedPlants.includes(opt.value)) {
              opt.remove();
            }
          });
        }
      };
      setTimeout(applyPlantFilter, 400);
      setTimeout(applyPlantFilter, 1000);
    }

    // 5. User badge มุมล่างขวา
    const allowedPlants2 = (session.plants && session.plants.length > 0) ? session.plants : null;
    const badge = document.createElement("div");
    badge.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:9999;background:#fff;border:0.5px solid #e0e0dc;border-radius:8px;padding:6px 14px;font-size:11px;color:#555;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;gap:8px;";
    const ini = session.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    badge.innerHTML = `
      <div style="width:22px;height:22px;border-radius:50%;background:#e8f0fb;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#1a6fbf;">${ini}</div>
      <span>${session.name}</span>
      ${allowedPlants2 ? `<span style="color:#ddd;">|</span><span style="color:#1a6fbf;font-size:10px;">${allowedPlants2.join(", ")}</span>` : '<span style="color:#ddd;">|</span><span style="color:#aaa;font-size:10px;">All Plants</span>'}
      <a href="${PORTAL_URL}" style="color:#aaa;text-decoration:none;margin-left:4px;">← Portal</a>`;
    document.body.appendChild(badge);

    // 6. Back → portal
    history.pushState({ page: "tool" }, "", window.location.href);
    window.addEventListener("popstate", function () { window.location.replace(PORTAL_URL); });
  });
})();
