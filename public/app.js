(function () {
  "use strict";

  var CATS = {
    dietes: { label: "Dietes", color: "var(--c-dietes)" },
    gastos: { label: "Gastos", color: "var(--c-gastos)" },
    bascules: { label: "Bàscules", color: "var(--c-bascules)" },
    peatges: { label: "Peatges", color: "var(--c-peatges)" }
  };
  var CAT_KEYS = Object.keys(CATS);
  var MONTHS = ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"];
  var DAYS = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"];

  // ---------- Estat ----------
  var token = localStorage.getItem("token") || "";
  var me = null, admin = false;
  var roster = [];            // {id,name,role} per a login
  var entries = [];
  var cfg = { email: "", color: "", logo: "" };
  var view = new Date(); view.setDate(1);
  var filter = "tots", userFilter = "tots";
  var pendingPhoto = null;    // dataURL nova, o URL existent, o null
  var retakeMode = false;
  var loginTarget = null;
  var selectedCat = "dietes";
  var saving = false;

  // ---------- API ----------
  function setSession(t, u) { token = t; localStorage.setItem("token", t); localStorage.setItem("me", JSON.stringify(u)); }
  function clearSession() { token = ""; localStorage.removeItem("token"); localStorage.removeItem("me"); }
  async function api(path, method, bodyObj) {
    var headers = { "content-type": "application/json" };
    if (token) headers.authorization = "Bearer " + token;
    var res = await fetch(path, { method: method || "GET", headers: headers, body: bodyObj ? JSON.stringify(bodyObj) : undefined });
    var data = null; try { data = await res.json(); } catch (e) { }
    if (res.status === 401) { clearSession(); me = null; }
    if (!res.ok) throw new Error((data && data.error) || ("Error " + res.status));
    return data;
  }

  // ---------- Utils ----------
  function el(id) { return document.getElementById(id); }
  function eur(n) { return (n || 0).toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }
  function ym(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
  function ymOf(s) { return String(s).slice(0, 7); }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDay(s) { var d = parseDate(s); return DAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()]; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function initial(n) { return (n || "?").trim().charAt(0).toUpperCase(); }
  function applyTheme() { if (cfg.color) document.documentElement.style.setProperty("--amber", cfg.color); else document.documentElement.style.removeProperty("--amber"); }

  async function loadEntries() { var r = await api("/api/tickets"); entries = r.tickets || []; }
  async function loadRoster() { try { var r = await api("/api/users"); roster = r.users || []; } catch (e) { roster = []; } }

  function visibleEntries() {
    var key = ym(view);
    var list = entries.filter(function (e) { return ymOf(e.date) === key; });
    if (!admin) list = list.filter(function (e) { return e.userId === me.id; });
    return list;
  }

  // ================= RENDER =================
  function render() {
    admin = !!(me && me.role === "admin");
    if (!me) { if (roster.length === 0) renderBootstrap(); else renderLogin(); return; }
    renderApp();
  }

  function renderBootstrap() {
    el("root").innerHTML =
      '<div class="center"><div class="logo">Dietes / Gastos</div>' +
      '<h2>Configura l\'administrador</h2>' +
      '<p>Encara no hi ha cap compte. Crea el primer administrador: podrà donar d\'alta la resta d\'usuaris i consultar totes les dades.</p>' +
      '<div class="field"><label for="bName">Nom</label><input id="bName" type="text" placeholder="Ex. Jordi Puig"></div>' +
      '<div class="field"><label for="bPin">PIN (4 dígits)</label><input id="bPin" type="tel" inputmode="numeric" maxlength="4" placeholder="••••"></div>' +
      '<button class="btn-primary" id="bGo" style="width:100%">Crear administrador</button></div>';
    el("bGo").onclick = async function () {
      var n = el("bName").value.trim(), p = el("bPin").value.trim();
      if (!n) { toast("Escriu el nom"); return; }
      if (!/^\d{4}$/.test(p)) { toast("El PIN ha de tenir 4 dígits"); return; }
      try {
        var r = await api("/api/users", "POST", { name: n, pin: p });
        var lg = await api("/api/login", "POST", { userId: r.id, pin: p });
        me = lg.user; setSession(lg.token, me);
        cfg = await api("/api/config"); applyTheme(); await loadRoster(); await loadEntries();
        render(); toast("Administrador creat");
      } catch (e) { toast(e.message); }
    };
  }

  function renderLogin() {
    var rows = roster.map(function (u) {
      return '<button class="userrow" data-id="' + u.id + '" data-sel="' + (loginTarget === u.id) + '">' +
        '<span class="ava">' + esc(initial(u.name)) + '</span>' +
        '<span class="un"><b>' + esc(u.name) + '</b><span>' + (u.role === "admin" ? "Administrador" : "Usuari") + '</span></span>' +
        '<span class="rolechip ' + (u.role === "admin" ? "adm" : "usr") + '">' + (u.role === "admin" ? "admin" : "usuari") + '</span></button>';
    }).join("");
    var target = roster.filter(function (u) { return u.id === loginTarget; })[0];
    var pinBlock = loginTarget ?
      '<div class="field"><label for="lPin">PIN de ' + esc(target ? target.name : "") + '</label>' +
      '<input id="lPin" type="tel" inputmode="numeric" maxlength="4" placeholder="••••"></div>' +
      '<button class="btn-primary" id="lGo" style="width:100%">Entrar</button>' : '';
    el("root").innerHTML =
      '<div class="center"><div class="logo">Dietes / Gastos</div><h2>Inicia sessió</h2>' +
      '<p>Tria el teu nom i introdueix el PIN.</p><div class="userlist">' + rows + '</div>' + pinBlock + '</div>';
    el("root").querySelectorAll(".userrow").forEach(function (b) {
      b.onclick = function () { loginTarget = b.getAttribute("data-id"); renderLogin(); setTimeout(function () { var i = el("lPin"); if (i) i.focus(); }, 50); };
    });
    var go = el("lGo");
    if (go) { go.onclick = doLogin; el("lPin").addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); }); }
  }
  async function doLogin() {
    var t = roster.filter(function (u) { return u.id === loginTarget; })[0];
    if (!t) return;
    try {
      var lg = await api("/api/login", "POST", { userId: t.id, pin: (el("lPin").value || "").trim() });
      me = lg.user; setSession(lg.token, me); loginTarget = null; filter = "tots"; userFilter = "tots";
      cfg = await api("/api/config"); applyTheme(); await loadEntries();
      render(); toast("Hola, " + me.name.split(" ")[0]);
    } catch (e) { toast(e.message); }
  }

  function renderApp() {
    var mes = visibleEntries();
    var total = mes.reduce(function (s, e) { return s + e.amount; }, 0);
    var sums = {}; CAT_KEYS.forEach(function (k) { sums[k] = 0; });
    mes.forEach(function (e) { if (sums[e.cat] != null) sums[e.cat] += e.amount; });
    var bd = CAT_KEYS.map(function (k) { return '<div class="bd"><div class="n"><span class="dot" style="background:' + CATS[k].color + '"></span>' + CATS[k].label + '</div><div class="v">' + eur(sums[k]) + '</div></div>'; }).join("");

    el("root").innerHTML =
      '<div class="wrap"><header>' +
      '<div class="brand"><div class="l" style="align-items:center;gap:10px">' +
      (cfg.logo ? '<img class="hdrlogo" src="' + cfg.logo + '" alt="logo">' : '') +
      '<div style="display:flex;flex-direction:column"><h1>DIETES / GASTOS</h1><span class="sub">' + (admin ? 'Panell d\'administrador' : 'despeses de ruta') + '</span></div></div>' +
      '<div class="who">' + (admin ? '<span class="adminbadge">ADMIN</span>' : '') + '<button class="avatar" id="avatarBtn">' + esc(initial(me.name)) + '</button></div></div>' +
      '<div class="monthbar"><button id="prevM">‹</button><div class="m">' + MONTHS[view.getMonth()] + ' ' + view.getFullYear() + '</div><button id="nextM">›</button></div>' +
      '<div class="total"><div class="big">' + eur(total) + '</div><div class="lbl">' + (admin ? 'Total de tots els usuaris' : 'El meu total del mes') + '</div></div>' +
      '<div class="breakdown">' + bd + '</div></header>' + renderToolbar() + '<main id="list"></main></div>' +
      '<div class="fabbar"><button class="fab" id="camBtn"><span class="cam">📷</span> Fer foto del tiquet</button><button class="nolink" id="manualBtn">afegir sense foto</button></div>';

    renderList(mes); bindMain();
  }

  function renderToolbar() {
    var opts = [{ k: "tots", label: "Tots" }].concat(CAT_KEYS.map(function (k) { return { k: k, label: CATS[k].label }; }));
    var chips = opts.map(function (o) { var dot = o.k !== "tots" ? '<span class="cdot" style="background:' + CATS[o.k].color + '"></span>' : ''; return '<button class="chip fc" data-k="' + o.k + '" data-active="' + (filter === o.k) + '">' + dot + o.label + '</button>'; }).join("");
    var userSel = "";
    if (admin) {
      userSel = '<select id="userFilter" class="chip" style="appearance:auto"><option value="tots"' + (userFilter === "tots" ? " selected" : "") + '>Tots els usuaris</option>' +
        roster.map(function (u) { return '<option value="' + u.id + '"' + (userFilter === u.id ? " selected" : "") + '>' + esc(u.name) + '</option>'; }).join("") + '</select>';
    }
    return '<div class="toolbar">' + chips + '<span class="spacer"></span>' + userSel + '<button class="expbtn" id="openExp">⇩ CSV</button></div>';
  }

  function renderList(mes) {
    var list = mes.slice();
    if (filter !== "tots") list = list.filter(function (e) { return e.cat === filter; });
    if (admin && userFilter !== "tots") list = list.filter(function (e) { return e.userId === userFilter; });
    list.sort(function (a, b) { if (a.date !== b.date) return a.date < b.date ? 1 : -1; return (b.createdAt || 0) - (a.createdAt || 0); });
    var main = el("list");
    if (!list.length) { main.innerHTML = '<div class="empty"><div class="ic">🧾</div><p>Cap registre aquest mes.<br>Toca <b>Fer foto del tiquet</b> per començar.</p></div>'; return; }
    var groups = {}, order = [];
    list.forEach(function (e) { if (!groups[e.date]) { groups[e.date] = []; order.push(e.date); } groups[e.date].push(e); });
    main.innerHTML = order.map(function (day) {
      var items = groups[day]; var dtotal = items.reduce(function (s, e) { return s + e.amount; }, 0);
      var cards = items.map(function (e) {
        var c = CATS[e.cat] || { label: e.cat, color: "#999" };
        var sub = []; if (e.ticket) sub.push("#" + e.ticket); if (e.companions) sub.push("👥 " + e.companions);
        var extra = sub.length ? '<div class="extra">' + esc(sub.join("  ·  ")) + '</div>' : '';
        var whoTag = admin ? '<span class="who2">' + esc(e.user) + '</span>' : '';
        var acctTag = e.accounted ? '<span class="acctbadge">✓ comptabilitzat</span>' : '';
        return '<div class="ticket' + (e.accounted ? ' acct' : '') + '" data-id="' + e.id + '"><div class="bar" style="background:' + c.color + '"></div>' +
          '<div class="body"><span class="cat" style="color:' + c.color + '">' + c.label + '</span>' + whoTag + acctTag +
          '<div class="concept">' + esc(e.place || c.label) + '</div>' + extra + '</div>' +
          '<div class="right"><span class="amt">' + eur(e.amount) + '</span>' + (e.photo ? '<span class="clip">📎</span>' : '') + '</div></div>';
      }).join("");
      return '<div class="daygroup"><div class="dayhead"><span class="d">' + fmtDay(day) + '</span><span class="dt">' + eur(dtotal) + '</span></div>' + cards + '</div>';
    }).join("");
    main.querySelectorAll(".ticket").forEach(function (t) { t.onclick = function () { openSheet(t.getAttribute("data-id")); }; });
  }

  function bindMain() {
    el("prevM").onclick = function () { view.setMonth(view.getMonth() - 1); render(); };
    el("nextM").onclick = function () { view.setMonth(view.getMonth() + 1); render(); };
    el("camBtn").onclick = function () { retakeMode = false; pendingPhoto = null; el("photo").value = ""; el("photo").click(); };
    el("manualBtn").onclick = function () { pendingPhoto = null; openSheetNew(null, false); };
    el("avatarBtn").onclick = openMenu;
    el("openExp").onclick = openExport;
    el("root").querySelectorAll(".fc").forEach(function (c) { c.onclick = function () { filter = c.getAttribute("data-k"); render(); }; });
    var uf = el("userFilter"); if (uf) uf.onchange = function () { userFilter = uf.value; render(); };
  }

  // ---------- Menú ----------
  function openMenu() {
    var items = "";
    if (admin) items += '<button class="mi" id="miUsers">Gestionar usuaris</button>';
    if (admin) items += '<button class="mi" id="miConfig">Configuració</button>';
    items += '<button class="mi danger" id="miLogout">Tancar sessió</button>';
    el("menuCard").innerHTML = '<div class="u"><b>' + esc(me.name) + '</b><span>' + (admin ? "Administrador" : "Usuari") + '</span></div>' + items;
    el("menu").setAttribute("data-open", "true");
    if (admin) el("miUsers").onclick = function () { closeMenu(); openUM(); };
    if (admin) el("miConfig").onclick = function () { closeMenu(); openCfg(); };
    el("miLogout").onclick = function () { closeMenu(); clearSession(); me = null; render(); };
  }
  function closeMenu() { el("menu").removeAttribute("data-open"); }
  el("menuBg").onclick = closeMenu;

  // ---------- Gestió d'usuaris ----------
  function openUM() { renderUMList(); el("umScrim").setAttribute("data-open", "true"); el("umSheet").setAttribute("data-open", "true"); }
  function closeUM() { el("umScrim").removeAttribute("data-open"); el("umSheet").removeAttribute("data-open"); }
  el("closeUm").onclick = closeUM; el("umScrim").onclick = closeUM;

  function renderUMList() {
    el("umTitle").textContent = "Usuaris (" + roster.length + ")";
    var rows = roster.map(function (u) {
      return '<div class="umrow" data-id="' + u.id + '"><span class="ava">' + esc(initial(u.name)) + '</span>' +
        '<span class="un"><b>' + esc(u.name) + '</b><span>' + (u.role === "admin" ? "Administrador" : "Usuari") + '</span></span>' +
        '<span class="rolechip ' + (u.role === "admin" ? "adm" : "usr") + '">' + (u.role === "admin" ? "admin" : "usuari") + '</span></div>';
    }).join("");
    el("umBody").innerHTML = '<div class="umlist">' + rows + '</div><button class="btn-primary" id="umAdd" style="width:100%">+ Nou usuari</button>';
    el("umBody").querySelectorAll(".umrow").forEach(function (r) { r.onclick = function () { renderUMEdit(r.getAttribute("data-id")); }; });
    el("umAdd").onclick = function () { renderUMEdit(null); };
  }

  function renderUMEdit(id) {
    var u = id ? roster.filter(function (x) { return x.id === id; })[0] : null;
    var name = u ? u.name : "", role = u ? u.role : "user";
    el("umTitle").textContent = u ? "Editar usuari" : "Nou usuari";
    el("umBody").innerHTML =
      '<div class="field"><label for="uName">Nom</label><input id="uName" type="text" value="' + esc(name) + '" placeholder="Nom i cognom"></div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Rol</label>' +
      '<div class="roles"><label><input type="radio" name="urole" value="user"' + (role === "user" ? " checked" : "") + '><div class="opt">Usuari</div></label>' +
      '<label><input type="radio" name="urole" value="admin"' + (role === "admin" ? " checked" : "") + '><div class="opt">Administrador</div></label></div>' +
      '<div class="field"><label for="uPin">PIN (4 dígits)</label><input id="uPin" type="tel" inputmode="numeric" maxlength="4" placeholder="' + (u ? "Deixa-ho buit per no canviar-lo" : "••••") + '"></div>' +
      '<div class="actions"><button type="button" class="btn-ghost" id="uBack" style="flex:0 0 auto;width:auto;padding:14px 18px">‹ Enrere</button><button type="button" class="btn-primary" id="uSave">Desa</button></div>' +
      (u ? '<button type="button" class="btn-danger" id="uDel" style="width:100%;margin-top:10px">Eliminar usuari</button>' : '');
    el("uBack").onclick = renderUMList;
    el("uSave").onclick = async function () {
      var nm = el("uName").value.trim();
      var rl = (document.querySelector('input[name=urole]:checked') || {}).value || "user";
      var pn = el("uPin").value.trim();
      if (!nm) { toast("Escriu el nom"); return; }
      if (!u && !/^\d{4}$/.test(pn)) { toast("El PIN ha de tenir 4 dígits"); return; }
      if (u && pn && !/^\d{4}$/.test(pn)) { toast("El PIN ha de tenir 4 dígits"); return; }
      try {
        var payload = { name: nm, role: rl };
        if (u) payload.id = u.id;
        if (pn) payload.pin = pn;
        await api("/api/users", "POST", payload);
        await loadRoster(); if (u) await loadEntries();
        renderUMList(); render(); toast(u ? "Usuari actualitzat" : "Usuari creat");
      } catch (e) { toast(e.message); }
    };
    var del = el("uDel");
    if (del) del.onclick = async function () {
      if (!confirm("Eliminar " + u.name + "? Els seus tiquets es mantindran.")) return;
      try {
        await api("/api/users?id=" + encodeURIComponent(u.id), "DELETE");
        await loadRoster();
        if (me && me.id === u.id) { clearSession(); me = null; closeUM(); render(); return; }
        renderUMList(); render(); toast("Usuari eliminat");
      } catch (e) { toast(e.message); }
    };
  }

  // ---------- Configuració ----------
  var cfgLogoTmp = "", cfgColorTmp = "";
  var PRESET = ["#d97706", "#e07a5f", "#3d84a8", "#4f9d69", "#8b6cb0", "#c0503c", "#1f6f5c", "#2a2f36"];
  function openCfg() { renderCfg(); el("cfgScrim").setAttribute("data-open", "true"); el("cfgSheet").setAttribute("data-open", "true"); }
  function closeCfg() { el("cfgScrim").removeAttribute("data-open"); el("cfgSheet").removeAttribute("data-open"); }
  el("closeCfg").onclick = closeCfg; el("cfgScrim").onclick = closeCfg;
  function logoBoxHtml() {
    return (cfgLogoTmp ? '<img id="cLogoImg" src="' + cfgLogoTmp + '" alt="logo">' : '<span style="font-size:13px;color:var(--muted)">Cap logo</span>') +
      '<label class="lbtn" for="cLogo">' + (cfgLogoTmp ? "Canviar" : "Pujar logo") + '</label>' +
      (cfgLogoTmp ? '<button type="button" class="lbtn" id="cLogoRm" style="color:#c0503c">Treure</button>' : '') +
      '<input id="cLogo" type="file" accept="image/*" style="display:none">';
  }
  function bindLogo() {
    el("cLogo").onchange = function (ev) { var f = ev.target.files && ev.target.files[0]; if (!f) return; compressLogo(f, function (d) { if (d) { cfgLogoTmp = d; refreshLogoBox(); } else toast("No s'ha pogut carregar el logo"); }); };
    var rm = el("cLogoRm"); if (rm) rm.onclick = function () { cfgLogoTmp = ""; refreshLogoBox(); };
  }
  function refreshLogoBox() { el("cfgBody").querySelector(".logobox").innerHTML = logoBoxHtml(); bindLogo(); }
  function renderCfg() {
    cfgColorTmp = cfg.color || "#d97706"; cfgLogoTmp = cfg.logo || "";
    var swatches = PRESET.map(function (c) { return '<span class="swatch" data-c="' + c + '" data-sel="' + (cfgColorTmp.toLowerCase() === c.toLowerCase()) + '" style="background:' + c + '"></span>'; }).join("");
    el("cfgBody").innerHTML =
      '<div class="field"><label for="cEmail">Correu de destinació</label><input id="cEmail" type="email" placeholder="comptabilitat@empresa.com" value="' + esc(cfg.email) + '"></div>' +
      '<p style="font-size:12px;color:var(--muted);margin:-4px 0 12px">On s\'enviaran les fotos dels tiquets en guardar-los.</p>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Color de l\'app</label>' +
      '<div class="swatches">' + swatches + '<input id="cColor" type="color" value="' + esc(cfgColorTmp) + '" style="width:40px;height:34px;border:1px solid var(--line);border-radius:8px;background:none;cursor:pointer;padding:2px"></div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Logo</label>' +
      '<div class="logobox">' + logoBoxHtml() + '</div>' +
      '<button type="button" class="btn-primary" id="cSave" style="width:100%;margin-top:6px">Desa la configuració</button>';
    el("cfgBody").querySelectorAll(".swatch").forEach(function (s) {
      s.onclick = function () { cfgColorTmp = s.getAttribute("data-c"); el("cColor").value = cfgColorTmp; el("cfgBody").querySelectorAll(".swatch").forEach(function (x) { x.setAttribute("data-sel", String(x.getAttribute("data-c").toLowerCase() === cfgColorTmp.toLowerCase())); }); };
    });
    el("cColor").oninput = function () { cfgColorTmp = el("cColor").value; el("cfgBody").querySelectorAll(".swatch").forEach(function (x) { x.setAttribute("data-sel", "false"); }); };
    bindLogo();
    el("cSave").onclick = saveCfg;
  }
  function compressLogo(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { var img = new Image(); img.onload = function () { var max = 280, w = img.width, h = img.height; if (w > h && w > max) { h = Math.round(h * max / w); w = max; } else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; } var cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h); cb(cv.toDataURL("image/png")); }; img.onerror = function () { cb(null); }; img.src = reader.result; };
    reader.onerror = function () { cb(null); }; reader.readAsDataURL(file);
  }
  async function saveCfg() {
    cfg.email = el("cEmail").value.trim(); cfg.color = cfgColorTmp || ""; cfg.logo = cfgLogoTmp || "";
    try { await api("/api/config", "POST", cfg); applyTheme(); closeCfg(); render(); toast("Configuració desada"); }
    catch (e) { toast(e.message); }
  }

  // ---------- Foto + extracció ----------
  el("photo").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0]; if (!file) return;
    compress(file, function (dataUrl) {
      if (!dataUrl) { toast("No s'ha pogut carregar la foto"); return; }
      if (retakeMode) { retakeMode = false; pendingPhoto = dataUrl; setThumb(dataUrl); return; }
      pendingPhoto = dataUrl; runExtraction(dataUrl);
    });
  });
  function compress(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { var img = new Image(); img.onload = function () { var max = 1100, w = img.width, h = img.height; if (w > h && w > max) { h = Math.round(h * max / w); w = max; } else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; } var cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h); cb(cv.toDataURL("image/jpeg", 0.62)); }; img.onerror = function () { cb(null); }; img.src = reader.result; };
    reader.onerror = function () { cb(null); }; reader.readAsDataURL(file);
  }
  async function runExtraction(dataUrl) {
    el("extractImg").src = dataUrl; el("extract").setAttribute("data-open", "true");
    var parsed = null, reason = null;
    try { var r = await api("/api/extract", "POST", { imageBase64: dataUrl.split(",")[1], mediaType: "image/jpeg" }); parsed = r && r.parsed; reason = r && r.reason; } catch (e) { reason = e.message; }
    el("extract").removeAttribute("data-open");
    if (!parsed) {
      if (reason === "no-key") toast("Falta la clau ANTHROPIC_API_KEY per llegir tiquets");
      else if (reason) toast("No s'ha pogut llegir el tiquet (" + reason + ")");
    }
    openSheetNew(parsed, !!parsed);
  }

  // ---------- Full de tiquet ----------
  function renderCatPick() {
    el("catpick").innerHTML = CAT_KEYS.map(function (k) { return '<label style="color:' + CATS[k].color + '"><input type="radio" name="cat" value="' + k + '"' + (selectedCat === k ? " checked" : "") + '><div class="opt"><span class="sq" style="background:' + CATS[k].color + '"></span>' + CATS[k].label + '</div></label>'; }).join("");
    document.querySelectorAll('input[name=cat]').forEach(function (r) { r.onchange = function () { selectedCat = r.value; toggleCompanions(); }; });
  }
  function toggleCompanions() { el("compWrap").style.display = (selectedCat === "dietes") ? "block" : "none"; }
  function setThumb(src) { if (src) { el("thumbImg").src = src; el("thumbrow").style.display = "flex"; } else el("thumbrow").style.display = "none"; }

  function openSheetNew(parsed, fromAI) {
    el("entryForm").reset(); el("editId").value = ""; el("delBtn").style.display = "none";
    el("sheetTitle").textContent = "Revisar tiquet"; el("aiHint").style.display = fromAI ? "flex" : "none";
    selectedCat = (parsed && CATS[parsed.category]) ? parsed.category : "dietes"; renderCatPick(); toggleCompanions();
    el("amount").value = (parsed && parsed.amount != null) ? parsed.amount : "";
    el("ticket").value = (parsed && parsed.ticket_number) ? parsed.ticket_number : "";
    el("place").value = (parsed && parsed.business_name) ? parsed.business_name : "";
    el("date").value = (parsed && parsed.date && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) ? parsed.date : todayStr();
    el("companions").value = ""; el("notes").value = ""; setThumb(pendingPhoto);
    el("acctRow").innerHTML = ""; setLock(false); openSheet_();
  }
  function openSheet(id) {
    var e = entries.filter(function (x) { return x.id === id; })[0]; if (!e) return;
    el("entryForm").reset(); el("aiHint").style.display = "none"; el("sheetTitle").textContent = "Editar registre";
    el("editId").value = e.id; selectedCat = e.cat; renderCatPick(); toggleCompanions();
    el("amount").value = e.amount; el("ticket").value = e.ticket || ""; el("place").value = e.place || "";
    el("date").value = e.date; el("companions").value = e.companions || ""; el("notes").value = e.notes || "";
    pendingPhoto = e.photo || null; setThumb(pendingPhoto);
    el("delBtn").style.display = (admin || e.userId === me.id) ? "block" : "none";
    renderAcct(e); openSheet_();
  }

  function setLock(locked) {
    ["amount", "ticket", "date", "place", "companions", "notes"].forEach(function (id) { el(id).disabled = locked; });
    document.querySelectorAll('input[name=cat]').forEach(function (r) { r.disabled = locked; });
    el("retakeBtn").style.display = locked ? "none" : "";
    el("saveBtn").style.display = locked ? "none" : "";
    if (locked) el("delBtn").style.display = "none";
  }
  function renderAcct(e) {
    var acct = el("acctRow");
    if (e && e.accounted) {
      setLock(true);
      el("sheetTitle").textContent = "Registre comptabilitzat";
      acct.innerHTML = '<div class="acctnote">🔒 Comptabilitzat — bloquejat: no es pot editar ni eliminar.</div>' +
        (admin ? '<button type="button" class="btn-ghost" id="unacctBtn">Treure de comptabilitzat</button>' : '');
      if (admin) el("unacctBtn").onclick = function () { toggleAccounted(e.id, false); };
    } else {
      setLock(false);
      acct.innerHTML = (admin && e) ? '<button type="button" class="btn-ghost" id="acctBtn" style="border-color:#bcd9c4;color:#2f7a4a;margin-bottom:10px">✓ Marcar com a comptabilitzat</button>' : "";
      if (admin && e) el("acctBtn").onclick = function () { toggleAccounted(e.id, true); };
    }
  }
  async function toggleAccounted(id, val) {
    try {
      await api("/api/tickets", "PUT", { id: id, setAccounted: val });
      await loadEntries(); closeSheet(); render();
      toast(val ? "Marcat com a comptabilitzat" : "Desbloquejat");
    } catch (e) { toast(e.message); }
  }
  function openSheet_() { el("scrim").setAttribute("data-open", "true"); el("sheet").setAttribute("data-open", "true"); }
  function closeSheet() { el("scrim").removeAttribute("data-open"); el("sheet").removeAttribute("data-open"); }
  el("closeSheet").onclick = closeSheet; el("scrim").onclick = closeSheet;
  el("retakeBtn").onclick = function () { retakeMode = true; el("photo").value = ""; el("photo").click(); };
  el("thumbImg").onclick = function () { if (pendingPhoto) openImg(pendingPhoto); };

  el("entryForm").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    if (saving) return;
    var amount = parseFloat(String(el("amount").value).replace(",", "."));
    if (isNaN(amount) || amount < 0) { toast("Posa un import vàlid"); return; }
    var id = el("editId").value;
    var payload = {
      cat: selectedCat, amount: Math.round(amount * 100) / 100,
      ticket_no: el("ticket").value.trim(), place: el("place").value.trim(),
      date: el("date").value || todayStr(),
      companions: selectedCat === "dietes" ? el("companions").value.trim() : "",
      notes: el("notes").value.trim()
    };
    // foto nova per pujar (només si és dataURL, no una URL existent)
    if (pendingPhoto && pendingPhoto.indexOf("data:") === 0) payload.photoBase64 = pendingPhoto.split(",")[1];

    saving = true; el("saveBtn").disabled = true; el("saveBtn").textContent = "Desant…";
    try {
      var res;
      if (id) { payload.id = id; res = await api("/api/tickets", "PUT", payload); }
      else res = await api("/api/tickets", "POST", payload);
      await loadEntries();
      pendingPhoto = null; closeSheet(); render();
      toast(id ? "Registre actualitzat" : (res && res.emailed ? "Desat i enviat per correu" : "Registre desat"));
    } catch (e) { toast(e.message); }
    saving = false; el("saveBtn").disabled = false; el("saveBtn").textContent = "Desa el registre";
  });

  el("delBtn").onclick = async function () {
    var id = el("editId").value; if (!id) return;
    if (!confirm("Eliminar aquest registre?")) return;
    try { await api("/api/tickets?id=" + encodeURIComponent(id), "DELETE"); await loadEntries(); pendingPhoto = null; closeSheet(); render(); toast("Registre eliminat"); }
    catch (e) { toast(e.message); }
  };

  // ---------- Export CSV ----------
  function buildCsv() {
    var mes = visibleEntries().slice();
    if (filter !== "tots") mes = mes.filter(function (e) { return e.cat === filter; });
    if (admin && userFilter !== "tots") mes = mes.filter(function (e) { return e.userId === userFilter; });
    mes.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var head = ["Data", "Usuari", "Categoria", "Restaurant/Empresa", "Num tiquet", "Acompanyants", "Observacions", "Import"];
    var rows = mes.map(function (e) { return [e.date, e.user, CATS[e.cat] ? CATS[e.cat].label : e.cat, e.place || "", e.ticket || "", e.companions || "", e.notes || "", e.amount.toFixed(2).replace(".", ",")]; });
    return [head].concat(rows).map(function (r) { return r.map(function (c) { c = String(c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";"); }).join("\n");
  }
  function openExport() { el("csvText").value = buildCsv(); el("expScrim").setAttribute("data-open", "true"); el("expSheet").setAttribute("data-open", "true"); }
  function closeExport() { el("expScrim").removeAttribute("data-open"); el("expSheet").removeAttribute("data-open"); }
  el("closeExp").onclick = closeExport; el("expScrim").onclick = closeExport;
  el("copyCsv").onclick = function () { var ta = el("csvText"); ta.select(); try { if (navigator.clipboard) navigator.clipboard.writeText(ta.value); else document.execCommand("copy"); toast("CSV copiat"); } catch (e) { document.execCommand("copy"); toast("CSV copiat"); } };
  el("dlCsv").onclick = function () { try { var blob = new Blob(["\uFEFF" + el("csvText").value], { type: "text/csv;charset=utf-8" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "registre-" + ym(view) + ".csv"; document.body.appendChild(a); a.click(); a.remove(); toast("Descarregant…"); } catch (e) { toast("Copia el text manualment"); } };

  function openImg(src) { el("imgviewImg").src = src; el("imgview").setAttribute("data-open", "true"); }
  el("imgview").onclick = function () { this.removeAttribute("data-open"); };
  var toastT; function toast(msg) { var t = el("toast"); t.textContent = msg; t.setAttribute("data-show", "true"); clearTimeout(toastT); toastT = setTimeout(function () { t.removeAttribute("data-show"); }, 2200); }

  // ---------- Instal·lar com a app ----------
  var deferredPrompt = null;
  function isStandalone() { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; }
  function showInstall(txt, canPrompt) {
    if (isStandalone()) return;
    if (localStorage.getItem("installDismissed") === "1") return;
    el("installTxt").textContent = txt;
    el("installBtn").style.display = canPrompt ? "" : "none";
    el("installBar").setAttribute("data-show", "true");
  }
  function hideInstall() { el("installBar").removeAttribute("data-show"); }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferredPrompt = e; showInstall("Instal·la aquesta app a la pantalla d'inici", true); });
  window.addEventListener("appinstalled", function () { hideInstall(); });
  el("installBtn").onclick = async function () { if (!deferredPrompt) return; deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch (e) { } deferredPrompt = null; hideInstall(); };
  el("installClose").onclick = function () { hideInstall(); localStorage.setItem("installDismissed", "1"); };
  (function () {
    var ua = navigator.userAgent || "";
    var iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    if (iOS && !isStandalone()) showInstall("Per instal·lar: toca Compartir i «Afegir a la pantalla d'inici»", false);
  })();

  // ---------- Init ----------
  (async function () {
    await loadRoster();
    var savedMe = localStorage.getItem("me");
    if (token && savedMe) {
      try { me = JSON.parse(savedMe); } catch (e) { me = null; }
      if (me) {
        try { cfg = await api("/api/config"); applyTheme(); await loadEntries(); }
        catch (e) { if (!token) me = null; }
      }
    }
    render();
  })();
})();
