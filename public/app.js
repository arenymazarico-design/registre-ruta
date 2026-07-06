(function () {
  "use strict";

  var CATS = {
    dietes: { label: "Dietes", color: "var(--c-dietes)" },
    gastos: { label: "Gastos", color: "var(--c-gastos)" },
    bascules: { label: "Bàscules", color: "var(--c-bascules)" },
    peatges: { label: "Peatges", color: "var(--c-peatges)" },
    combustible: { label: "Combustible", color: "var(--c-combustible)" }
  };
  var CAT_KEYS = Object.keys(CATS);
  var EXPENSE_KEYS = CAT_KEYS.filter(function (k) { return k !== "combustible"; });
  var APP_VERSION = "2025-07-03 · combustible-apart";

  // ---------- Idioma (català per defecte / castellà) ----------
  var lang = localStorage.getItem("lang") || "ca";
  function setLang(l) { if (l === lang) return; localStorage.setItem("lang", l); location.reload(); }
  var ES = {
    "Inicia sessió": "Inicia sesión", "Escriu el teu nom i el PIN.": "Escribe tu nombre y el PIN.",
    "Nom": "Nombre", "El teu nom": "Tu nombre", "Entrar": "Entrar",
    "Configura l'administrador": "Configura el administrador",
    "Encara no hi ha cap compte. Crea el primer administrador: podrà donar d'alta la resta d'usuaris i consultar totes les dades.": "Todavía no hay ninguna cuenta. Crea el primer administrador: podrá dar de alta al resto de usuarios y consultar todos los datos.",
    "PIN (4 dígits)": "PIN (4 dígitos)", "Crear administrador": "Crear administrador",
    "despeses de ruta": "gastos de ruta", "Panell d'administrador": "Panel de administrador",
    "El meu total del mes": "Mi total del mes", "Total de tots els usuaris": "Total de todos los usuarios",
    "Dietes": "Dietas", "Gastos": "Gastos", "Bàscules": "Básculas", "Peatges": "Peajes",
    "Fer foto del tiquet": "Hacer foto del ticket", "afegir sense foto": "añadir sin foto",
    "Tots": "Todos", "Consulta": "Consulta",
    "Cap registre aquest mes.": "Sin registros este mes.", "Toca": "Toca", "per començar.": "para empezar.",
    "Gestionar usuaris": "Gestionar usuarios", "Configuració": "Configuración",
    "Canviar contrasenya": "Cambiar contraseña", "Tancar sessió": "Cerrar sesión",
    "Administrador": "Administrador", "Usuari": "Usuario",
    "Revisar tiquet": "Revisar ticket", "Editar registre": "Editar registro", "Registre validat": "Registro validado",
    "Dades llegides del tiquet. Repassa-les i completa el que falti.": "Datos leídos del ticket. Revísalos y completa lo que falte.",
    "Foto del tiquet": "Foto del ticket", "Refer": "Rehacer", "Import": "Importe",
    "Núm. tiquet": "Núm. ticket", "Núm. factura": "Núm. factura", "Data": "Fecha",
    "Restaurant o empresa": "Restaurante o empresa", "Nom del comerç": "Nombre del comercio",
    "Acompanyants (nombre de persones)": "Acompañantes (número de personas)",
    "Observacions": "Observaciones", "Notes (opcional)": "Notas (opcional)",
    "Desa el registre": "Guardar el registro", "Elimina": "Eliminar",
    "🔒 Validat — bloquejat: no es pot editar ni eliminar.": "🔒 Validado — bloqueado: no se puede editar ni eliminar.",
    "Treure de comptabilitzat": "Quitar validación", "Treure validació": "Quitar validación",
    "✓ Marcar com a validat": "✓ Marcar como validado", "✓ validat": "✓ validado",
    "Usuaris": "Usuarios", "Nou usuari": "Nuevo usuario", "Editar usuari": "Editar usuario",
    "+ Nou usuari": "+ Nuevo usuario", "📄 Importar usuaris d'Excel": "📄 Importar usuarios de Excel",
    "Rol": "Rol", "Deixa-ho buit per no canviar-lo": "Déjalo vacío para no cambiarlo",
    "‹ Enrere": "‹ Atrás", "Desa": "Guardar", "Eliminar usuari": "Eliminar usuario",
    "Correu de destinació": "Correo de destino",
    "On s'enviaran les fotos dels tiquets en guardar-los.": "Donde se enviarán las fotos de los tickets al guardarlos.",
    "CIF de l'empresa": "CIF de la empresa",
    "Si en llegir un document hi ha CIF, es tractarà com a factura i s'agafarà el número de factura.": "Si al leer un documento hay CIF, se tratará como factura y se tomará el número de factura.",
    "Color de l'app": "Color de la app", "Logo": "Logo", "Cap logo": "Sin logo",
    "Pujar logo": "Subir logo", "Canviar": "Cambiar", "Treure": "Quitar",
    "Noms per a acompanyants": "Nombres para acompañantes", "Un nom per línia": "Un nombre por línea",
    "📄 Importar noms d'Excel": "📄 Importar nombres de Excel",
    "Excel amb una columna de noms (la primera). S'afegiran als que ja hi ha.": "Excel con una columna de nombres (la primera). Se añadirán a los que ya hay.",
    "Desa la configuració": "Guardar la configuración",
    "Contrasenya actual": "Contraseña actual", "Contrasenya nova (4 dígits)": "Contraseña nueva (4 dígitos)",
    "Desa la contrasenya": "Guardar la contraseña", "Tanca": "Cerrar",
    "Usuaris (cerca i tria'n més d'un)": "Usuarios (busca y elige más de uno)", "Cerca usuari…": "Busca usuario…",
    "Cap usuari": "Sin usuario", "Tipus de gasto (pots triar-ne més d'un)": "Tipo de gasto (puedes elegir más de uno)",
    "Des de": "Desde", "Fins a": "Hasta", "Restaurant o empresa conté": "Restaurante o empresa contiene",
    "Estat": "Estado", "Pendents": "Pendientes", "Validats": "Validados",
    "Exportar a Excel": "Exportar a Excel",
    "Registre desat": "Registro guardado", "Desat i enviat per correu": "Guardado y enviado por correo",
    "Registre actualitzat": "Registro actualizado", "Registre eliminat": "Registro eliminado",
    "Configuració desada": "Configuración guardada", "Contrasenya canviada": "Contraseña cambiada",
    "Usuari creat": "Usuario creado", "Usuari actualitzat": "Usuario actualizado", "Usuari eliminat": "Usuario eliminado",
    "Excel generat": "Excel generado", "CSV descarregat": "CSV descargado",
    "Marcat com a validat": "Marcado como validado", "Validació treta": "Validación quitada",
    "Administrador creat": "Administrador creado",
    "No hi ha registres per exportar": "No hay registros para exportar",
    "Escriu el teu nom": "Escribe tu nombre", "El PIN nou ha de tenir 4 dígits": "El PIN nuevo debe tener 4 dígitos",
    "El PIN ha de tenir 4 dígits": "El PIN debe tener 4 dígitos", "Escriu el nom": "Escribe el nombre",
    "Posa un import vàlid": "Pon un importe válido",
    "Litres": "Litros", "Km del comptador": "Km del cuentakilómetros", "Nom de la gasolinera": "Nombre de la gasolinera",
    "Consulta de km": "Consulta de km", "Informe de km i combustible": "Informe de km y combustible",
    "Agrupar i sumar per usuari": "Agrupar y sumar por usuario", "Imprimir": "Imprimir",
    "Total general": "Total general", "Distància (km)": "Distancia (km)", "Consum (L/100km)": "Consumo (L/100km)",
    "Cost (€)": "Coste (€)", "No hi ha registres per exportar": "No hay registros para exportar",
    "Apuntar km del cotxe": "Apuntar km del coche", "Desa la lectura": "Guardar la lectura", "Km desats": "Km guardados",
    "Posa els km": "Pon los km", "Cost": "Coste",
    "📋 Apunta els km del cotxe d'aquest mes": "📋 Apunta los km del coche de este mes",
    "Apunta la lectura del comptador de km del cotxe. Es demana un cop al mes.": "Apunta la lectura del cuentakilómetros del coche. Se pide una vez al mes.",
    "El símbol ~ indica un mes amb km estimats (filtre no complet o falten lectures). Els km surten de les lectures mensuals del comptador.": "El símbolo ~ indica un mes con km estimados (filtro incompleto o faltan lecturas). Los km salen de las lecturas mensuales del cuentakilómetros.",
    "Els meus vehicles": "Mis vehículos", "Cap vehicle": "Sin vehículo", "Afegir": "Añadir",
    "Desa els vehicles": "Guardar los vehículos", "Vehicles desats": "Vehículos guardados",
    "Vehicles de l'usuari": "Vehículos del usuario",
    "Combustible i km": "Combustible y km", "Repostatge (foto)": "Repostaje (foto)", "Sense foto": "Sin foto",
    "Repostatges": "Repostajes", "Repostatges (tots)": "Repostajes (todos)", "Cap repostatge encara.": "Sin repostajes todavía.",
    "Informe de km i consum": "Informe de km y consumo", "Repostatge": "Repostaje", "Gasolinera": "Gasolinera"
  };
  var translating = false;
  function translateNode(node) {
    if (lang !== "es") return;
    if (node.nodeType === 3) {
      var s = node.nodeValue, key = s.trim();
      if (key && ES[key] && ES[key] !== key) node.nodeValue = s.replace(key, ES[key]);
      return;
    }
    if (node.nodeType === 1) {
      var tag = node.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SCRIPT" || tag === "STYLE") {
        if (node.placeholder && ES[node.placeholder.trim()]) node.placeholder = ES[node.placeholder.trim()];
        return;
      }
      if (node.placeholder && ES[node.placeholder.trim()]) node.placeholder = ES[node.placeholder.trim()];
      for (var i = 0; i < node.childNodes.length; i++) translateNode(node.childNodes[i]);
    }
  }
  function applyLang() {
    if (lang !== "es") return;
    translating = true;
    try { translateNode(document.body); } catch (e) { }
    translating = false;
  }
  function T(s) { return (lang === "es" && ES[s]) ? ES[s] : s; }
  if (lang === "es" && typeof MutationObserver !== "undefined") {
    var mo = new MutationObserver(function (muts) {
      if (translating) return;
      translating = true;
      try {
        muts.forEach(function (m) {
          if (m.type === "childList") { for (var i = 0; i < m.addedNodes.length; i++) translateNode(m.addedNodes[i]); }
          else if (m.type === "characterData") translateNode(m.target);
        });
      } catch (e) { }
      translating = false;
    });
    try { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) { }
  }
  try { if (lang === "es") applyLang(); } catch (e) { }
  var MONTHS = ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"];
  var DAYS = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"];

  // ---------- Estat ----------
  var token = localStorage.getItem("token") || "";
  var me = null, admin = false;
  var roster = [];            // {id,name,role} per a login
  var entries = [];
  var readings = [];
  var cfg = { email: "", color: "", logo: "", cif: "", names: [] };
  var view = new Date(); view.setDate(1);
  var filter = "tots", userFilter = "tots";
  var pendingPhoto = null;    // dataURL nova, o URL existent, o null
  var retakeMode = false;
  var loginTarget = null;
  var noUsers = false;
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
    if (!res.ok) { var err = new Error((data && data.error) || ("Error " + res.status)); err.status = res.status; err.data = data; throw err; }
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
  async function loadReadings() { try { var r = await api("/api/readings"); readings = r.readings || []; } catch (e) { readings = []; } }
  async function loadRoster() { try { var r = await api("/api/users"); roster = r.users || []; } catch (e) { roster = []; } }
  function normalizeCfg(c) {
    cfg.email = c.email || ""; cfg.color = c.color || ""; cfg.logo = c.logo || ""; cfg.cif = c.cif || "";
    var names = [];
    if (c.names) { try { names = JSON.parse(c.names); } catch (e) { names = String(c.names).split(/[\n,;]+/); } }
    cfg.names = (names || []).map(function (x) { return String(x).trim(); }).filter(Boolean);
  }
  function allNames() {
    var set = {}, out = [];
    roster.forEach(function (u) { if (u.name && !set[u.name.toLowerCase()]) { set[u.name.toLowerCase()] = 1; out.push(u.name); } });
    cfg.names.forEach(function (n) { if (n && !set[n.toLowerCase()]) { set[n.toLowerCase()] = 1; out.push(n); } });
    return out.sort(function (a, b) { return a.localeCompare(b); });
  }
  function fillNamesDatalist() {
    var dl = el("namesList"); if (!dl) return;
    dl.innerHTML = allNames().map(function (n) { return '<option value="' + esc(n) + '"></option>'; }).join("");
  }

  function visibleEntries() {
    var key = ym(view);
    var list = entries.filter(function (e) { return e.cat !== "combustible" && ymOf(e.date) === key; });
    if (!admin) list = list.filter(function (e) { return e.userId === me.id; });
    return list;
  }

  // ================= RENDER =================
  function render() {
    admin = !!(me && me.role === "admin");
    if (!me) { if (noUsers) renderBootstrap(); else renderLogin(); return; }
    renderApp();
  }

  function renderBootstrap() {
    el("root").innerHTML =
      '<div class="center"><div class="logo" style="text-transform:none;font-size:22px">PLUgastos</div>' +
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
        normalizeCfg(await api("/api/config")); applyTheme(); await loadRoster(); fillNamesDatalist(); await loadEntries(); await loadReadings();
        render(); toast("Administrador creat");
      } catch (e) { toast(e.message); }
    };
  }

  function renderLogin() {
    el("root").innerHTML =
      '<div class="center"><div class="logo" style="text-transform:none;font-size:22px">PLUgastos</div><h2>Inicia sessió</h2>' +
      '<p>Escriu el teu nom i el PIN.</p>' +
      '<div class="field"><label for="lName">Nom</label><input id="lName" type="text" autocomplete="username" placeholder="El teu nom"></div>' +
      '<div class="field"><label for="lPin">PIN</label><input id="lPin" type="tel" inputmode="numeric" maxlength="4" placeholder="••••"></div>' +
      '<button class="btn-primary" id="lGo" style="flex:0 0 auto;width:auto;min-width:110px;padding:12px 26px;font-size:16px;align-self:center;margin:4px 0 0">Entrar</button>' +
      '<div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex:0 0 auto">' +
      '<button type="button" class="langbtn" data-l="ca"' + (lang === "ca" ? ' data-active="true"' : '') + '>Català</button>' +
      '<button type="button" class="langbtn" data-l="es"' + (lang === "es" ? ' data-active="true"' : '') + '>Castellano</button></div></div>';
    el("lGo").onclick = doLogin;
    el("lPin").addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
    el("root").querySelectorAll(".langbtn").forEach(function (b) { b.onclick = function () { setLang(b.getAttribute("data-l")); }; });
  }
  async function doLogin() {
    var name = (el("lName").value || "").trim();
    var pin = (el("lPin").value || "").trim();
    if (!name) { toast("Escriu el teu nom"); return; }
    try {
      var lg = await api("/api/login", "POST", { name: name, pin: pin });
      me = lg.user; setSession(lg.token, me); filter = "tots"; userFilter = "tots";
      normalizeCfg(await api("/api/config")); applyTheme(); await loadRoster(); fillNamesDatalist(); await loadEntries(); await loadReadings();
      render(); toast("Hola, " + me.name.split(" ")[0]); showKmReminder();
    } catch (e) { toast(e.message); }
  }

  function renderApp() {
    var mes = visibleEntries();
    var total = mes.reduce(function (s, e) { return s + e.amount; }, 0);
    var sums = {}; EXPENSE_KEYS.forEach(function (k) { sums[k] = 0; });
    mes.forEach(function (e) { if (sums[e.cat] != null) sums[e.cat] += e.amount; });
    var bd = EXPENSE_KEYS.map(function (k) { return '<div class="bd"><div class="n"><span class="dot" style="background:' + CATS[k].color + '"></span>' + CATS[k].label + '</div><div class="v">' + eur(sums[k]) + '</div></div>'; }).join("");

    el("root").innerHTML =
      '<div class="wrap"><header>' +
      '<div class="brand"><div class="l" style="align-items:center;gap:10px">' +
      (cfg.logo ? '<img class="hdrlogo" src="' + cfg.logo + '" alt="logo">' : '') +
      '<div style="display:flex;flex-direction:column"><h1 style="text-transform:none;letter-spacing:.01em">PLUgastos</h1><span class="sub">' + (admin ? 'Panell d\'administrador' : 'despeses de ruta') + '</span></div></div>' +
      '<div class="who">' + (admin ? '<span class="adminbadge">ADMIN</span>' : '') + '<button class="avatar" id="avatarBtn">' + esc(initial(me.name)) + '</button></div></div>' +
      '<div class="monthbar"><button id="prevM">‹</button><div class="m">' + MONTHS[view.getMonth()] + ' ' + view.getFullYear() + '</div><button id="nextM">›</button></div>' +
      '<div class="total"><div class="big">' + eur(total) + '</div><div class="lbl">' + (admin ? 'Total de tots els usuaris' : 'El meu total del mes') + '</div></div>' +
      '<div class="breakdown">' + bd + '</div></header>' + renderToolbar() + '<main id="list"></main></div>' +
      '<div class="fabbar"><button class="fab" id="camBtn"><span class="cam">📷</span> Fer foto del tiquet</button>' + (admin ? '<button class="nolink" id="manualBtn">afegir sense foto</button>' : '') + '</div>';

    renderList(mes); bindMain();
  }

  function renderToolbar() {
    var opts = [{ k: "tots", label: "Tots" }].concat(EXPENSE_KEYS.map(function (k) { return { k: k, label: CATS[k].label }; }));
    var chips = opts.map(function (o) { var dot = o.k !== "tots" ? '<span class="cdot" style="background:' + CATS[o.k].color + '"></span>' : ''; return '<button class="chip fc" data-k="' + o.k + '" data-active="' + (filter === o.k) + '">' + dot + o.label + '</button>'; }).join("");
    var userSel = "";
    if (admin) {
      userSel = '<select id="userFilter" class="chip" style="appearance:auto"><option value="tots"' + (userFilter === "tots" ? " selected" : "") + '>Tots els usuaris</option>' +
        roster.map(function (u) { return '<option value="' + u.id + '"' + (userFilter === u.id ? " selected" : "") + '>' + esc(u.name) + '</option>'; }).join("") + '</select>';
    }
    return '<div class="toolbar">' + chips + '<span class="spacer"></span>' + userSel + '<button class="expbtn" id="openExp">Consulta</button></div>';
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
        var acctTag = e.accounted ? '<span class="acctbadge">✓ validat</span>' : '';
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
    var mb = el("manualBtn"); if (mb) mb.onclick = function () { pendingPhoto = null; openSheetNew(null, false); };
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
    items += '<button class="mi" id="miPin">Canviar contrasenya</button>';
    items += '<button class="mi" id="miKm">Combustible i km</button>';
    items += '<button class="mi" id="miVeh">Els meus vehicles</button>';
    items += '<button class="mi danger" id="miLogout">Tancar sessió</button>';
    items += '<div style="display:flex;gap:8px;justify-content:center;padding:12px">' +
      '<button type="button" class="langbtn" data-l="ca"' + (lang === "ca" ? ' data-active="true"' : '') + '>Català</button>' +
      '<button type="button" class="langbtn" data-l="es"' + (lang === "es" ? ' data-active="true"' : '') + '>Castellano</button></div>';
    items += '<div style="padding:2px 18px 12px;font-size:11px;color:var(--muted);text-align:center">Versió ' + APP_VERSION + '</div>';
    el("menuCard").innerHTML = '<div class="u"><b>' + esc(me.name) + '</b><span>' + (admin ? "Administrador" : "Usuari") + '</span></div>' + items;
    el("menu").setAttribute("data-open", "true");
    if (admin) el("miUsers").onclick = function () { closeMenu(); openUM(); };
    if (admin) el("miConfig").onclick = function () { closeMenu(); openCfg(); };
    el("miPin").onclick = function () { closeMenu(); openPin(); };
    el("miKm").onclick = function () { closeMenu(); openKm(); };
    el("miVeh").onclick = function () { closeMenu(); openVehicles(null); };
    el("miLogout").onclick = function () { closeMenu(); clearSession(); me = null; render(); };
    el("menuCard").querySelectorAll(".langbtn").forEach(function (b) { b.onclick = function () { setLang(b.getAttribute("data-l")); }; });
  }
  function closeMenu() { el("menu").removeAttribute("data-open"); }
  el("menuBg").onclick = closeMenu;

  // ---------- Canviar la pròpia contrasenya ----------
  function openPin() { el("oldPin").value = ""; el("newPin").value = ""; el("pinScrim").setAttribute("data-open", "true"); el("pinSheet").setAttribute("data-open", "true"); }
  function closePin() { el("pinScrim").removeAttribute("data-open"); el("pinSheet").removeAttribute("data-open"); }
  el("closePin").onclick = closePin; el("pinScrim").onclick = closePin;
  el("pinSave").onclick = async function () {
    var oldPin = el("oldPin").value.trim(), newPin = el("newPin").value.trim();
    if (!/^\d{4}$/.test(newPin)) { toast("El PIN nou ha de tenir 4 dígits"); return; }
    try { await api("/api/users", "POST", { changePin: true, oldPin: oldPin, newPin: newPin }); closePin(); toast("Contrasenya canviada"); }
    catch (e) { toast(e.message); }
  };

  // ---------- Gestió d'usuaris ----------
  function openUM() { renderUMList(); el("umScrim").setAttribute("data-open", "true"); el("umSheet").setAttribute("data-open", "true"); }
  function closeUM() { el("umScrim").removeAttribute("data-open"); el("umSheet").removeAttribute("data-open"); }
  el("closeUm").onclick = closeUM; el("umScrim").onclick = closeUM;

  function renderUMList() {
    el("umTitle").textContent = "Usuaris (" + roster.length + ")";
    var rows = roster.map(function (u) {
      var pinTxt = (u.pin ? "PIN " + esc(u.pin) : (u.role === "admin" ? "Administrador" : "Usuari"));
      return '<div class="umrow" data-id="' + u.id + '"><span class="ava">' + esc(initial(u.name)) + '</span>' +
        '<span class="un"><b>' + esc(u.name) + '</b><span>' + pinTxt + '</span></span>' +
        '<span class="rolechip ' + (u.role === "admin" ? "adm" : "usr") + '">' + (u.role === "admin" ? "admin" : "usuari") + '</span></div>';
    }).join("");
    el("umBody").innerHTML = '<div class="umlist">' + rows + '</div>' +
      '<button class="btn-primary" id="umAdd" style="width:100%;margin-bottom:10px">+ Nou usuari</button>' +
      '<label class="btn-ghost" for="umXls" style="display:block;text-align:center;cursor:pointer">📄 Importar usuaris d\'Excel</label>' +
      '<input id="umXls" type="file" accept=".xlsx,.xls,.csv" style="display:none">' +
      '<p style="font-size:12px;color:var(--muted);margin-top:8px">Excel amb columnes: <b>Nom</b>, <b>PIN</b> (4 dígits) i, opcionalment, <b>Rol</b> (usuari/admin). La primera fila pot ser de títols.</p>';
    el("umBody").querySelectorAll(".umrow").forEach(function (r) { r.onclick = function () { renderUMEdit(r.getAttribute("data-id")); }; });
    el("umAdd").onclick = function () { renderUMEdit(null); };
    el("umXls").onchange = function (ev) { var f = ev.target.files && ev.target.files[0]; if (f) importUsers(f); ev.target.value = ""; };
  }

  function importUsers(file) {
    readSheet(file, async function (rows) {
      if (!rows || !rows.length) { toast("No s'ha pogut llegir l'Excel"); return; }
      var bulk = [];
      rows.forEach(function (r, i) {
        var name = (r[0] == null ? "" : String(r[0])).trim();
        var pin = (r[1] == null ? "" : String(r[1])).trim();
        var role = (r[2] == null ? "" : String(r[2])).trim().toLowerCase();
        // salta la fila de títols si sembla capçalera
        if (i === 0 && /nom|name/i.test(name) && !/^\d{4}$/.test(pin)) return;
        if (!name) return;
        bulk.push({ name: name, pin: pin, role: (role === "admin" || role === "administrador") ? "admin" : "user" });
      });
      if (!bulk.length) { toast("Cap fila vàlida a l'Excel"); return; }
      try {
        var res = await api("/api/users", "POST", { bulk: bulk });
        await loadRoster(); fillNamesDatalist(); renderUMList();
        toast("Importats: " + res.created + " · omesos: " + res.skipped);
      } catch (e) { toast(e.message); }
    });
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
      '<div class="field"><label for="uPin">PIN (4 dígits)</label><input id="uPin" type="tel" inputmode="numeric" maxlength="4" value="' + (u && u.pin ? esc(u.pin) : "") + '" placeholder="' + (u ? "Deixa-ho buit per no canviar-lo" : "••••") + '"></div>' +
      '<div class="actions"><button type="button" class="btn-ghost" id="uBack" style="flex:0 0 auto;width:auto;padding:14px 18px">‹ Enrere</button><button type="button" class="btn-primary" id="uSave">Desa</button></div>' +
      (u ? '<button type="button" class="btn-ghost" id="uVeh" style="width:100%;margin-top:10px">Vehicles de l\'usuari</button>' : '') +
      (u ? '<button type="button" class="btn-danger" id="uDel" style="width:100%;margin-top:10px">Eliminar usuari</button>' : '');
    el("uBack").onclick = renderUMList;
    var uv = el("uVeh"); if (uv) uv.onclick = function () { openVehicles(u.id); };
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
      '<div class="field"><label for="cCif">CIF de l\'empresa</label><input id="cCif" type="text" placeholder="Ex. B12345678" value="' + esc(cfg.cif) + '"></div>' +
      '<p style="font-size:12px;color:var(--muted);margin:-4px 0 12px">Si en llegir un document hi ha CIF, es tractarà com a factura i s\'agafarà el número de factura.</p>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Color de l\'app</label>' +
      '<div class="swatches">' + swatches + '<input id="cColor" type="color" value="' + esc(cfgColorTmp) + '" style="width:40px;height:34px;border:1px solid var(--line);border-radius:8px;background:none;cursor:pointer;padding:2px"></div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Logo</label>' +
      '<div class="logobox">' + logoBoxHtml() + '</div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Noms per a acompanyants</label>' +
      '<textarea id="cNames" placeholder="Un nom per línia" style="width:100%;min-height:90px;border:1.5px solid var(--line);border-radius:11px;padding:12px;font-size:15px;font-family:var(--sans)">' + esc(cfg.names.join("\n")) + '</textarea>' +
      '<label class="btn-ghost" for="cNamesXls" style="display:block;text-align:center;cursor:pointer;margin:8px 0 4px">📄 Importar noms d\'Excel</label>' +
      '<input id="cNamesXls" type="file" accept=".xlsx,.xls,.csv" style="display:none">' +
      '<p style="font-size:12px;color:var(--muted);margin:4px 0 14px">Excel amb una columna de noms (la primera). S\'afegiran als que ja hi ha.</p>' +
      '<button type="button" class="btn-primary" id="cSave" style="width:100%;margin-top:2px">Desa la configuració</button>';
    el("cfgBody").querySelectorAll(".swatch").forEach(function (s) {
      s.onclick = function () { cfgColorTmp = s.getAttribute("data-c"); el("cColor").value = cfgColorTmp; el("cfgBody").querySelectorAll(".swatch").forEach(function (x) { x.setAttribute("data-sel", String(x.getAttribute("data-c").toLowerCase() === cfgColorTmp.toLowerCase())); }); };
    });
    el("cColor").oninput = function () { cfgColorTmp = el("cColor").value; el("cfgBody").querySelectorAll(".swatch").forEach(function (x) { x.setAttribute("data-sel", "false"); }); };
    bindLogo();
    el("cNamesXls").onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0]; ev.target.value = "";
      if (!f) return;
      readSheet(f, function (rows) {
        if (!rows) { toast("No s'ha pogut llegir l'Excel"); return; }
        var got = [];
        rows.forEach(function (r, i) {
          var n = (r[0] == null ? "" : String(r[0])).trim();
          if (i === 0 && /nom|name/i.test(n)) return;
          if (n) got.push(n);
        });
        var ta = el("cNames");
        var cur = ta.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
        var seen = {}; var merged = [];
        cur.concat(got).forEach(function (n) { if (!seen[n.toLowerCase()]) { seen[n.toLowerCase()] = 1; merged.push(n); } });
        ta.value = merged.join("\n");
        toast("Afegits " + got.length + " noms");
      });
    };
    el("cSave").onclick = saveCfg;
  }
  function compressLogo(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { var img = new Image(); img.onload = function () { var max = 280, w = img.width, h = img.height; if (w > h && w > max) { h = Math.round(h * max / w); w = max; } else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; } var cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h); cb(cv.toDataURL("image/png")); }; img.onerror = function () { cb(null); }; img.src = reader.result; };
    reader.onerror = function () { cb(null); }; reader.readAsDataURL(file);
  }
  async function saveCfg() {
    cfg.email = el("cEmail").value.trim(); cfg.color = cfgColorTmp || ""; cfg.logo = cfgLogoTmp || "";
    cfg.cif = el("cCif").value.trim();
    cfg.names = el("cNames").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
    try {
      await api("/api/config", "POST", { email: cfg.email, color: cfg.color, logo: cfg.logo, cif: cfg.cif, names: JSON.stringify(cfg.names) });
      applyTheme(); fillNamesDatalist(); closeCfg(); render(); toast("Configuració desada");
    } catch (e) { toast(e.message); }
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
  function readSheet(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        if (typeof XLSX === "undefined") { cb(null); return; }
        var wb = XLSX.read(new Uint8Array(reader.result), { type: "array" });
        var ws = wb.Sheets[wb.SheetNames[0]];
        cb(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }));
      } catch (e) { cb(null); }
    };
    reader.onerror = function () { cb(null); };
    reader.readAsArrayBuffer(file);
  }
  function compress(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { var img = new Image(); img.onload = function () { var max = 1100, w = img.width, h = img.height; if (w > h && w > max) { h = Math.round(h * max / w); w = max; } else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; } var cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h); cb(cv.toDataURL("image/jpeg", 0.62)); }; img.onerror = function () { cb(null); }; img.src = reader.result; };
    reader.onerror = function () { cb(null); }; reader.readAsDataURL(file);
  }
  async function runExtraction(dataUrl) {
    el("extractImg").src = dataUrl; el("extract").setAttribute("data-open", "true");
    var parsed = null, reason = null;
    try { var r = await api("/api/extract", "POST", { imageBase64: dataUrl.split(",")[1], mediaType: "image/jpeg", companyCif: cfg.cif || "" }); parsed = r && r.parsed; reason = r && r.reason; } catch (e) { reason = e.message; }
    el("extract").removeAttribute("data-open");
    if (!parsed) {
      if (reason === "no-key") toast("Falta la clau ANTHROPIC_API_KEY per llegir tiquets");
      else if (reason) toast("No s'ha pogut llegir el tiquet (" + reason + ")");
    }
    openSheetNew(parsed, !!parsed);
  }

  // ---------- Full de tiquet ----------
  function renderCatPick() {
    el("catpick").innerHTML = EXPENSE_KEYS.map(function (k) { return '<label style="color:' + CATS[k].color + '"><input type="radio" name="cat" value="' + k + '"' + (selectedCat === k ? " checked" : "") + '><div class="opt"><span class="sq" style="background:' + CATS[k].color + '"></span>' + CATS[k].label + '</div></label>'; }).join("");
    document.querySelectorAll('input[name=cat]').forEach(function (r) { r.onchange = function () { selectedCat = r.value; toggleCompanions(); }; });
  }
  function toggleCompanions() {
    el("compWrap").style.display = (selectedCat === "dietes") ? "block" : "none";
    var fuel = (selectedCat === "combustible");
    el("fuelWrap").style.display = fuel ? "grid" : "none";
    el("placeLbl").textContent = fuel ? "Gasolinera" : "Restaurant o empresa";
    el("place").placeholder = fuel ? "Nom de la gasolinera" : "Nom del comerç";
  }
  function setThumb(src) { if (src) { el("thumbImg").src = src; el("thumbrow").style.display = "flex"; } else el("thumbrow").style.display = "none"; }
  function setNumberMode(isFactura) { el("ticketLbl").textContent = isFactura ? "Núm. factura" : "Núm. tiquet"; }
  function renderCompRows(n, values) {
    n = Math.max(0, Math.min(30, n || 0));
    var html = "";
    for (var i = 0; i < n; i++) {
      var v = (values && values[i]) ? esc(values[i]) : "";
      html += '<input class="compName" type="text" list="namesList" autocomplete="off" placeholder="Acompanyant ' + (i + 1) + '" value="' + v + '" style="width:100%;border:1.5px solid var(--line);background:var(--card);border-radius:11px;padding:12px 14px;font-size:16px">';
    }
    el("compList").innerHTML = html;
  }
  function readCompValues() { return Array.prototype.map.call(el("compList").querySelectorAll(".compName"), function (i) { return i.value.trim(); }); }
  function getCompanions() { return readCompValues().filter(Boolean).join(", "); }
  function setCompanionsFromString(s) {
    var list = (s || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    el("compCount").value = list.length; renderCompRows(list.length, list);
  }

  var pendingFuel = false;
  function openSheetNew(parsed, fromAI) {
    el("entryForm").reset(); el("editId").value = ""; el("delBtn").style.display = "none";
    var isFuel = pendingFuel || (parsed && parsed.category === "combustible");
    el("sheetTitle").textContent = isFuel ? "Repostatge" : "Revisar tiquet"; el("aiHint").style.display = fromAI ? "flex" : "none";
    selectedCat = isFuel ? "combustible" : ((parsed && CATS[parsed.category] && parsed.category !== "combustible") ? parsed.category : "dietes");
    renderCatPick(); el("catpick").style.display = isFuel ? "none" : "grid"; toggleCompanions();
    el("amount").value = (parsed && parsed.amount != null) ? parsed.amount : "";
    var cifVal = (parsed && parsed.cif) ? parsed.cif : "";
    el("ticket").value = parsed ? ((parsed.invoice_number || parsed.ticket_number) || "") : "";
    el("cif").value = cifVal; setNumberMode(!!cifVal);
    el("place").value = (parsed && parsed.business_name) ? parsed.business_name : "";
    el("litres").value = (parsed && parsed.litres != null) ? parsed.litres : "";
    el("date").value = (parsed && parsed.date && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) ? parsed.date : todayStr();
    el("compCount").value = 0; el("compList").innerHTML = ""; el("notes").value = ""; setThumb(pendingPhoto);
    el("acctRow").innerHTML = ""; setLock(false); openSheet_();
    pendingFuel = false;
  }
  function openSheet(id) {
    var e = entries.filter(function (x) { return x.id === id; })[0]; if (!e) return;
    el("entryForm").reset(); el("aiHint").style.display = "none"; el("sheetTitle").textContent = "Editar registre";
    el("editId").value = e.id; selectedCat = e.cat; renderCatPick(); el("catpick").style.display = (e.cat === "combustible") ? "none" : "grid"; toggleCompanions();
    el("amount").value = e.amount; el("ticket").value = e.ticket || ""; el("place").value = e.place || "";
    el("cif").value = e.cif || ""; setNumberMode(!!e.cif);
    el("litres").value = (e.litres != null) ? e.litres : "";
    el("date").value = e.date; setCompanionsFromString(e.companions || ""); el("notes").value = e.notes || "";
    pendingPhoto = e.photo || null; setThumb(pendingPhoto);
    el("delBtn").style.display = (admin || e.userId === me.id) ? "block" : "none";
    renderAcct(e); openSheet_();
  }

  function setLock(locked) {
    ["amount", "ticket", "date", "place", "compCount", "notes", "litres"].forEach(function (id) { el(id).disabled = locked; });
    el("compList").querySelectorAll(".compName").forEach(function (i) { i.disabled = locked; });
    document.querySelectorAll('input[name=cat]').forEach(function (r) { r.disabled = locked; });
    el("retakeBtn").style.display = locked ? "none" : "";
    el("saveBtn").style.display = locked ? "none" : "";
    if (locked) el("delBtn").style.display = "none";
  }
  function renderAcct(e) {
    var acct = el("acctRow");
    if (e && e.accounted) {
      setLock(true);
      el("sheetTitle").textContent = "Registre validat";
      acct.innerHTML = '<div class="acctnote">🔒 Validat — bloquejat: no es pot editar ni eliminar.</div>' +
        (admin ? '<button type="button" class="btn-ghost" id="unacctBtn">Treure validació</button>' : '');
      if (admin) el("unacctBtn").onclick = function () { toggleAccounted(e.id, false); };
    } else {
      setLock(false);
      acct.innerHTML = (admin && e) ? '<button type="button" class="btn-ghost" id="acctBtn" style="border-color:#bcd9c4;color:#2f7a4a;margin-bottom:10px">✓ Marcar com a validat</button>' : "";
      if (admin && e) el("acctBtn").onclick = function () { toggleAccounted(e.id, true); };
    }
  }
  async function toggleAccounted(id, val) {
    try {
      await api("/api/tickets", "PUT", { id: id, setAccounted: val });
      await loadEntries(); closeSheet(); render(); if (el("kmSheet").getAttribute("data-open")==="true") renderKm();
      toast(val ? "Marcat com a validat" : "Validació treta");
    } catch (e) { toast(e.message); }
  }
  function openSheet_() { el("scrim").setAttribute("data-open", "true"); el("sheet").setAttribute("data-open", "true"); }
  function closeSheet() { el("scrim").removeAttribute("data-open"); el("sheet").removeAttribute("data-open"); }
  el("closeSheet").onclick = closeSheet; el("scrim").onclick = closeSheet;
  el("retakeBtn").onclick = function () { retakeMode = true; el("photo").value = ""; el("photo").click(); };
  el("compCount").addEventListener("input", function () { renderCompRows(parseInt(el("compCount").value, 10) || 0, readCompValues()); });
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
      cif: el("cif").value.trim(),
      date: el("date").value || todayStr(),
      companions: selectedCat === "dietes" ? getCompanions() : "",
      notes: el("notes").value.trim(),
      litres: el("litres").value
    };
    // foto nova per pujar (només si és dataURL, no una URL existent)
    if (pendingPhoto && pendingPhoto.indexOf("data:") === 0) payload.photoBase64 = pendingPhoto.split(",")[1];

    function unlockBtn() { saving = false; el("saveBtn").disabled = false; el("saveBtn").textContent = "Desa el registre"; }
    saving = true; el("saveBtn").disabled = true; el("saveBtn").textContent = "Desant…";
    try {
      var res;
      if (id) { payload.id = id; res = await api("/api/tickets", "PUT", payload); }
      else res = await api("/api/tickets", "POST", payload);
      await loadEntries();
      pendingPhoto = null; closeSheet(); render(); if (el("kmSheet").getAttribute("data-open")==="true") renderKm();
      var okMsg;
      if (id) okMsg = "Registre actualitzat";
      else if (res && res.emailed) okMsg = "Desat i enviat per correu";
      else okMsg = "Desat" + (res && res.emailReason ? " — correu no enviat: " + res.emailReason : "");
      toast(okMsg);
    } catch (e) {
      if (e && e.data && e.data.duplicate) {
        var of = e.data.of || {};
        toast("Tiquet duplicat: ja registrat" + (of.user ? " per " + of.user : "") + (of.date ? " el " + String(of.date).slice(0, 10) : "") + ". No es desa.", { error: true, cross: true, ms: 7500 });
      } else toast(e.message, { error: true });
    }
    unlockBtn();
  });

  el("delBtn").onclick = async function () {
    var id = el("editId").value; if (!id) return;
    if (!confirm("Eliminar aquest registre?")) return;
    try { await api("/api/tickets?id=" + encodeURIComponent(id), "DELETE"); await loadEntries(); pendingPhoto = null; closeSheet(); render(); if (el("kmSheet").getAttribute("data-open")==="true") renderKm(); toast("Registre eliminat"); }
    catch (e) { toast(e.message); }
  };

  // ---------- Export CSV ----------
  // ---------- Consulta (filtres + exportació) ----------
  var q = { users: [], cats: [], from: "", to: "", text: "", acct: "tots" };
  var qUserQuery = "";
  function userName(id) { var u = roster.filter(function (x) { return x.id === id; })[0]; return u ? u.name : id; }
  function refreshUserMsel() {
    var tags = el("qUserTags"), list = el("qUserList");
    if (!tags || !list) return;
    tags.innerHTML = q.users.map(function (id) { return '<span class="mtag">' + esc(userName(id)) + '<b data-rem="' + id + '">✕</b></span>'; }).join("");
    var term = (qUserQuery || "").toLowerCase();
    var opts = roster.filter(function (u) { return u.name.toLowerCase().indexOf(term) >= 0; });
    list.innerHTML = opts.length ? opts.map(function (u) {
      var sel = q.users.indexOf(u.id) >= 0;
      return '<div class="msel-opt" data-id="' + u.id + '" data-sel="' + sel + '"><span class="ck">' + (sel ? "✓" : "") + '</span>' + esc(u.name) + '</div>';
    }).join("") : '<div class="msel-empty">Cap usuari</div>';
    tags.querySelectorAll("[data-rem]").forEach(function (b) {
      b.onclick = function () { var id = b.getAttribute("data-rem"); var i = q.users.indexOf(id); if (i >= 0) q.users.splice(i, 1); refreshUserMsel(); updateConsultaSummary(); };
    });
    list.querySelectorAll(".msel-opt").forEach(function (o) {
      o.onclick = function () { var id = o.getAttribute("data-id"); var i = q.users.indexOf(id); if (i >= 0) q.users.splice(i, 1); else q.users.push(id); refreshUserMsel(); updateConsultaSummary(); };
    });
  }
  function computeConsulta() {
    var list = entries.filter(function (e) { return e.cat !== "combustible"; }); // despeses (el combustible va a part)
    if (admin && q.users.length) list = list.filter(function (e) { return q.users.indexOf(e.userId) >= 0; });
    if (q.cats.length) list = list.filter(function (e) { return q.cats.indexOf(e.cat) >= 0; });
    if (q.from) list = list.filter(function (e) { return e.date >= q.from; });
    if (q.to) list = list.filter(function (e) { return e.date <= q.to; });
    if (q.text) { var t = q.text.toLowerCase(); list = list.filter(function (e) { return (e.place || "").toLowerCase().indexOf(t) >= 0; }); }
    if (q.acct === "si") list = list.filter(function (e) { return e.accounted; });
    if (q.acct === "no") list = list.filter(function (e) { return !e.accounted; });
    list.sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });
    return list;
  }
  function updateConsultaSummary() {
    var list = computeConsulta();
    var total = list.reduce(function (s, e) { return s + e.amount; }, 0);
    var elc = el("qCount"); if (elc) elc.textContent = list.length + (list.length === 1 ? " registre" : " registres") + " · " + eur(total);
  }
  function chipStrip(items, selected, allLabel) {
    var chips = '<button type="button" class="chip qchip" data-v="" data-active="' + (selected.length === 0) + '">' + allLabel + '</button>';
    chips += items.map(function (it) {
      return '<button type="button" class="chip qchip" data-v="' + esc(it.v) + '" data-active="' + (selected.indexOf(it.v) >= 0) + '">' + esc(it.label) + '</button>';
    }).join("");
    return '<div class="toolbar" style="position:static;border:0;padding:0 0 4px;gap:7px;flex-wrap:wrap">' + chips + '</div>';
  }
  function renderConsulta() {
    qUserQuery = "";
    var userBlock = admin ?
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Usuaris (cerca i tria\'n més d\'un)</label>' +
      '<div class="msel"><div class="msel-tags" id="qUserTags"></div><input id="qUserSearch" type="text" placeholder="Cerca usuari…" autocomplete="off"><div class="msel-list" id="qUserList"></div></div>' : '';
    var catBlock =
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:12px 0 6px">Tipus de gasto (pots triar-ne més d\'un)</label>' +
      chipStrip(EXPENSE_KEYS.map(function (k) { return { v: k, label: CATS[k].label }; }), q.cats, "Tots");
    el("expBody").innerHTML =
      userBlock + catBlock +
      '<div class="grid2" style="margin-top:10px"><div class="field"><label for="qFrom">Des de</label><input id="qFrom" type="date" value="' + esc(q.from) + '"></div>' +
      '<div class="field"><label for="qTo">Fins a</label><input id="qTo" type="date" value="' + esc(q.to) + '"></div></div>' +
      '<div class="field"><label for="qText">Restaurant o empresa conté</label><input id="qText" type="text" value="' + esc(q.text) + '" placeholder="(opcional)"></div>' +
      '<div class="field"><label for="qAcct">Estat</label><select id="qAcct">' +
      '<option value="tots"' + (q.acct === "tots" ? " selected" : "") + '>Tots</option>' +
      '<option value="no"' + (q.acct === "no" ? " selected" : "") + '>Pendents</option>' +
      '<option value="si"' + (q.acct === "si" ? " selected" : "") + '>Validats</option></select></div>' +
      '<div style="text-align:center;font-weight:700;font-size:15px;margin:6px 0 14px" id="qCount">—</div>' +
      '<div class="actions"><button type="button" class="btn-primary" id="qXls">Exportar a Excel</button>' +
      '<button type="button" class="btn-danger" id="qCsv" style="border-color:var(--line);color:var(--ink-soft)">CSV</button></div>';
    // categoria: pastilles multi-selecció (buit = totes)
    el("expBody").querySelectorAll(".qchip").forEach(function (c) {
      c.onclick = function () {
        var v = c.getAttribute("data-v");
        if (v === "") { q.cats.length = 0; }
        else { var i = q.cats.indexOf(v); if (i >= 0) q.cats.splice(i, 1); else q.cats.push(v); }
        c.parentNode.querySelectorAll(".qchip").forEach(function (x) {
          var xv = x.getAttribute("data-v");
          x.setAttribute("data-active", xv === "" ? (q.cats.length === 0) : (q.cats.indexOf(xv) >= 0));
        });
        updateConsultaSummary();
      };
    });
    var us = el("qUserSearch"); if (us) us.oninput = function () { qUserQuery = us.value; refreshUserMsel(); };
    var bindQ = function (id, prop) { var e = el(id); if (e) e.onchange = function () { q[prop] = e.value; updateConsultaSummary(); }; };
    bindQ("qFrom", "from"); bindQ("qTo", "to"); bindQ("qAcct", "acct");
    var qt = el("qText"); if (qt) qt.oninput = function () { q.text = qt.value; updateConsultaSummary(); };
    el("qXls").onclick = exportXlsx;
    el("qCsv").onclick = exportCsv;
    refreshUserMsel();
    updateConsultaSummary();
  }
  function consultaRows() {
    var list = computeConsulta();
    var header = ["Data", "Usuari", "Número de factura", "Número tiquet", "Tipus de gasto", "Restaurant/Proveïdor", "Import", "Acompanyants", "Observacions"];
    var rows = list.map(function (e) {
      var factura = e.cif ? (e.ticket || "") : "";
      var tiquet = e.cif ? "" : (e.ticket || "");
      return [e.date, e.user, factura, tiquet, CATS[e.cat] ? CATS[e.cat].label : e.cat, e.place || "", Number(e.amount), e.companions || "", e.notes || ""];
    });
    return { header: header, rows: rows };
  }
  async function exportXlsx() {
    if (typeof XLSX === "undefined") { toast("No s'ha pogut carregar l'exportador"); return; }
    var list = computeConsulta();
    if (!list.length) { toast("No hi ha registres per exportar"); return; }
    // Preguntem ABANS d'exportar (així funciona igual a PC i mòbil).
    var pend = admin ? list.filter(function (e) { return !e.accounted; }).map(function (e) { return e.id; }) : [];
    var doLock = false;
    if (pend.length) {
      doLock = confirm("S'exportaran " + list.length + " registres.\n\nVols marcar-los com a VALIDATS? Quedaran bloquejats i els usuaris ja no els podran modificar. (" + pend.length + " pendents)");
    }
    var d = consultaRows();
    var ws = XLSX.utils.aoa_to_sheet([d.header].concat(d.rows));
    ws["!cols"] = [{ wch: 11 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 24 }, { wch: 10 }, { wch: 22 }, { wch: 26 }];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consulta");
    XLSX.writeFile(wb, "consulta.xlsx");
    toast("Excel generat");
    if (doLock && pend.length) {
      try {
        await api("/api/tickets", "PUT", { validateIds: pend });
        await loadEntries(); updateConsultaSummary(); render();
        toast(pend.length + " registres validats");
      } catch (e) { toast(e.message, { error: true }); }
    }
  }
  function exportCsv() {
    var d = consultaRows();
    var csv = [d.header].concat(d.rows).map(function (r) {
      return r.map(function (c) { c = String(c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";");
    }).join("\n");
    try {
      var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "consulta.csv";
      document.body.appendChild(a); a.click(); a.remove(); toast("CSV descarregat");
    } catch (e) { toast("No s'ha pogut descarregar"); }
  }
  function openExport() { renderConsulta(); el("expScrim").setAttribute("data-open", "true"); el("expSheet").setAttribute("data-open", "true"); }
  function closeExport() { el("expScrim").removeAttribute("data-open"); el("expSheet").removeAttribute("data-open"); }
  el("closeExp").onclick = closeExport; el("expScrim").onclick = closeExport;

  // ---------- Informe de km i combustible (km per lectures mensuals) ----------
  var km = { users: [], from: "", to: "", group: false };
  var kmUserQuery = "";
  function openKm() { kmUserQuery = ""; renderKm(); el("kmScrim").setAttribute("data-open", "true"); el("kmSheet").setAttribute("data-open", "true"); }
  function closeKm() { el("kmScrim").removeAttribute("data-open"); el("kmSheet").removeAttribute("data-open"); }
  el("closeKm").onclick = closeKm; el("kmScrim").onclick = closeKm;
  function fmt(n, d) { return (n || 0).toLocaleString("ca-ES", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function dayNum(s) { var p = String(s).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000; }
  function addDay(s, n) { var d = new Date((dayNum(s) + n) * 86400000); return d.toISOString().slice(0, 10); }
  function maxD(a, b) { return a > b ? a : b; }
  function minD(a, b) { return a < b ? a : b; }
  function monthLabel(ym) { var y = ym.slice(0, 4), m = +ym.slice(5, 7); var s = MONTHS[m - 1] + " " + y; return s.charAt(0).toUpperCase() + s.slice(1); }
  function firstDay(ym) { return ym + "-01"; }
  function nextMonthFirst(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7) + 1; if (m > 12) { m = 1; y++; } return y + "-" + String(m).padStart(2, "0") + "-01"; }
  function monthsBetween(fy, ty) { var out = [], y = +fy.slice(0, 4), m = +fy.slice(5, 7), ey = +ty.slice(0, 4), em = +ty.slice(5, 7), g = 0; while ((y < ey || (y === ey && m <= em)) && g < 600) { out.push(y + "-" + String(m).padStart(2, "0")); m++; if (m > 12) { m = 1; y++; } g++; } return out; }

  function readingsOf(userId) { return readings.filter(function (r) { return r.userId === userId && r.km != null; }).slice().sort(function (a, b) { return dayNum(a.date) - dayNum(b.date); }); }
  function kmAt(userId, dateStr) {
    var r = readingsOf(userId);
    if (!r.length) return null;
    if (r.length === 1) return r[0].km;
    var t = dayNum(dateStr);
    if (t <= dayNum(r[0].date)) { var s0 = (r[1].km - r[0].km) / ((dayNum(r[1].date) - dayNum(r[0].date)) || 1); return r[0].km + s0 * (t - dayNum(r[0].date)); }
    if (t >= dayNum(r[r.length - 1].date)) { var a = r[r.length - 2], b = r[r.length - 1]; var s1 = (b.km - a.km) / ((dayNum(b.date) - dayNum(a.date)) || 1); return b.km + s1 * (t - dayNum(b.date)); }
    for (var i = 0; i < r.length - 1; i++) { var d0 = dayNum(r[i].date), d1 = dayNum(r[i + 1].date); if (t >= d0 && t <= d1) { var f = (t - d0) / ((d1 - d0) || 1); return r[i].km + (r[i + 1].km - r[i].km) * f; } }
    return r[r.length - 1].km;
  }
  function distanceFor(scope, from, toExcl) {
    var total = 0;
    scope.forEach(function (uid) { var kf = kmAt(uid, from), kt = kmAt(uid, toExcl); if (kf != null && kt != null) total += Math.max(0, kt - kf); });
    return total;
  }
  function scopeUsers() { if (!admin) return [me.id]; if (km.users.length) return km.users.slice(); return roster.map(function (u) { return u.id; }); }
  function fuelInRange(scope, a, b) { return entries.filter(function (e) { return e.cat === "combustible" && scope.indexOf(e.userId) >= 0 && e.date >= a && e.date <= b; }); }
  function litresSum(l) { return l.reduce(function (s, e) { return s + (e.litres || 0); }, 0); }
  function costSum(l) { return l.reduce(function (s, e) { return s + (e.amount || 0); }, 0); }
  function rangeBounds() {
    var scope = scopeUsers(), dates = [], today = todayStr();
    entries.forEach(function (e) { if (e.cat === "combustible" && scope.indexOf(e.userId) >= 0) dates.push(e.date); });
    readings.forEach(function (r) { if (scope.indexOf(r.userId) >= 0) dates.push(r.date); });
    var minD0 = dates.length ? dates.reduce(function (a, b) { return a < b ? a : b; }) : today;
    return { from: km.from || minD0, to: km.to || today };
  }
  function monthlyRows() {
    var b = rangeBounds(), scope = scopeUsers();
    return monthsBetween(b.from.slice(0, 7), b.to.slice(0, 7)).map(function (ym) {
      var mStart = firstDay(ym), mNext = nextMonthFirst(ym);
      var a = maxD(mStart, b.from), bexcl = minD(mNext, addDay(b.to, 1));
      var dist = distanceFor(scope, a, bexcl);
      var fuel = fuelInRange(scope, a, addDay(bexcl, -1));
      var lit = litresSum(fuel), cost = costSum(fuel);
      return { ym: ym, dist: dist, litres: lit, cost: cost, avg: dist > 0 ? lit / dist * 100 : 0, estimated: (a !== mStart) || (bexcl !== mNext) };
    });
  }
  function totalsFor(scope) {
    var b = rangeBounds();
    var dist = distanceFor(scope, b.from, addDay(b.to, 1));
    var fuel = fuelInRange(scope, b.from, b.to);
    var lit = litresSum(fuel), cost = costSum(fuel);
    return { dist: dist, litres: lit, cost: cost, avg: dist > 0 ? lit / dist * 100 : 0, count: fuel.length };
  }
  function reportMonthly() {
    var rows = monthlyRows(), t = totalsFor(scopeUsers());
    var head = '<tr><th>Mes</th><th class="num">Km</th><th class="num">Litres</th><th class="num">L/100km</th><th class="num">Cost</th></tr>';
    var body = rows.map(function (r) {
      return '<tr><td>' + monthLabel(r.ym) + '</td><td class="num">' + fmt(r.dist, 0) + (r.estimated ? ' ~' : '') + '</td><td class="num">' + fmt(r.litres, 2) + '</td><td class="num">' + fmt(r.avg, 2) + '</td><td class="num">' + eur(r.cost) + '</td></tr>';
    }).join("");
    var total = '<tr class="grand"><td>TOTAL</td><td class="num">' + fmt(t.dist, 0) + '</td><td class="num">' + fmt(t.litres, 2) + '</td><td class="num">' + fmt(t.avg, 2) + '</td><td class="num">' + eur(t.cost) + '</td></tr>';
    return '<table class="rep">' + head + body + total + '</table>';
  }
  function reportByUser() {
    var scope = scopeUsers(), b = rangeBounds();
    var head = '<tr><th>Usuari</th><th class="num">Km</th><th class="num">Litres</th><th class="num">L/100km</th><th class="num">Cost</th></tr>';
    var tD = 0, tL = 0, tC = 0;
    var body = scope.map(function (uid) {
      var d = distanceFor([uid], b.from, addDay(b.to, 1));
      var fuel = fuelInRange([uid], b.from, b.to);
      var lit = litresSum(fuel), cost = costSum(fuel);
      tD += d; tL += lit; tC += cost;
      return { uid: uid, d: d, lit: lit, cost: cost, avg: d > 0 ? lit / d * 100 : 0 };
    }).filter(function (x) { return x.d > 0 || x.lit > 0; }).map(function (x) {
      return '<tr><td>' + esc(userName(x.uid)) + '</td><td class="num">' + fmt(x.d, 0) + '</td><td class="num">' + fmt(x.lit, 2) + '</td><td class="num">' + fmt(x.avg, 2) + '</td><td class="num">' + eur(x.cost) + '</td></tr>';
    }).join("");
    var avg = tD > 0 ? tL / tD * 100 : 0;
    var total = '<tr class="grand"><td>TOTAL</td><td class="num">' + fmt(tD, 0) + '</td><td class="num">' + fmt(tL, 2) + '</td><td class="num">' + fmt(avg, 2) + '</td><td class="num">' + eur(tC) + '</td></tr>';
    return '<table class="rep">' + head + body + total + '</table>';
  }
  function refreshKmMsel() {
    var tags = el("kmUserTags"), list = el("kmUserList");
    if (!tags || !list) return;
    tags.innerHTML = km.users.map(function (id) { return '<span class="mtag">' + esc(userName(id)) + '<b data-rem="' + id + '">✕</b></span>'; }).join("");
    var term = (kmUserQuery || "").toLowerCase();
    var opts = roster.filter(function (u) { return u.name.toLowerCase().indexOf(term) >= 0; });
    list.innerHTML = opts.length ? opts.map(function (u) {
      var sel = km.users.indexOf(u.id) >= 0;
      return '<div class="msel-opt" data-id="' + u.id + '" data-sel="' + sel + '"><span class="ck">' + (sel ? "✓" : "") + '</span>' + esc(u.name) + '</div>';
    }).join("") : '<div class="msel-empty">Cap usuari</div>';
    tags.querySelectorAll("[data-rem]").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-rem"); var i = km.users.indexOf(id); if (i >= 0) km.users.splice(i, 1); refreshKmMsel(); renderKmReport(); }; });
    list.querySelectorAll(".msel-opt").forEach(function (o) { o.onclick = function () { var id = o.getAttribute("data-id"); var i = km.users.indexOf(id); if (i >= 0) km.users.splice(i, 1); else km.users.push(id); refreshKmMsel(); renderKmReport(); }; });
  }
  function renderKmReport() { el("kmReport").innerHTML = (admin && km.group) ? reportByUser() : reportMonthly(); }
  function renderKm() {
    var addBtns = '<div class="actions" style="margin-bottom:12px"><button type="button" class="btn-primary" id="fuAddPhoto"><span class="cam">📷</span> Repostatge (foto)</button><button type="button" class="btn-ghost" id="fuAddManual" style="flex:0 0 auto;width:auto;padding:14px 18px">Sense foto</button></div>';
    var myFuel = entries.filter(function (e) { return e.cat === "combustible" && (admin || e.userId === me.id); }).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var fuelListHtml = '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:4px 0 6px">Repostatges' + (admin ? " (tots)" : "") + '</label>';
    fuelListHtml += myFuel.length ? myFuel.slice(0, 60).map(function (e) {
      return '<div class="fuelrow" data-id="' + e.id + '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;margin-bottom:7px;cursor:pointer">' +
        '<div style="min-width:0"><b style="font-size:14px">' + esc(e.place || "Gasolinera") + '</b><div style="font-size:12px;color:var(--muted)">' + e.date + (admin ? " · " + esc(e.user) : "") + '</div></div>' +
        '<div style="text-align:right;white-space:nowrap"><div style="font-family:var(--mono);font-weight:700">' + (e.litres != null ? fmt(e.litres, 2) + " L" : "") + '</div><div style="font-size:12px;color:var(--muted)">' + eur(e.amount) + '</div></div></div>';
    }).join("") : '<p style="font-size:13px;color:var(--muted);margin:0 0 8px">Cap repostatge encara.</p>';

    var filters = "";
    if (admin) {
      filters =
        '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Usuaris</label>' +
        '<div class="msel"><div class="msel-tags" id="kmUserTags"></div><input id="kmUserSearch" type="text" placeholder="Cerca usuari…" autocomplete="off"><div class="msel-list" id="kmUserList"></div></div>' +
        '<div class="grid2" style="margin-top:10px"><div class="field"><label for="kmFrom">Des de</label><input id="kmFrom" type="date" value="' + esc(km.from) + '"></div>' +
        '<div class="field"><label for="kmTo">Fins a</label><input id="kmTo" type="date" value="' + esc(km.to) + '"></div></div>' +
        '<label style="display:flex;align-items:center;gap:9px;font-size:15px;font-weight:600;margin:2px 0 12px;cursor:pointer"><input type="checkbox" id="kmGroup"' + (km.group ? " checked" : "") + ' style="width:20px;height:20px"> Agrupar i sumar per usuari</label>';
    }
    var actions = '<div class="actions" style="margin-top:14px"><button type="button" class="btn-primary" id="kmXls">Exportar a Excel</button><button type="button" class="btn-danger" id="kmPrint" style="border-color:var(--line);color:var(--ink-soft)">Imprimir</button></div>';
    var note = '<p style="font-size:12px;color:var(--muted);margin:10px 0 0">El símbol ~ indica un mes amb km estimats (filtre no complet o falten lectures). Els km surten de les lectures mensuals del comptador.</p>';
    var sep = '<div style="height:1px;background:var(--line);margin:16px 0"></div><label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Informe de km i consum</label>';
    el("kmBody").innerHTML = addBtns + fuelListHtml + sep + filters + '<div class="repwrap" id="kmReport"></div>' + note + actions;
    renderKmReport();

    el("fuAddPhoto").onclick = function () { pendingFuel = true; retakeMode = false; pendingPhoto = null; closeKm(); el("photo").value = ""; el("photo").click(); };
    el("fuAddManual").onclick = function () { pendingFuel = true; pendingPhoto = null; closeKm(); openSheetNew(null, false); };
    el("kmBody").querySelectorAll(".fuelrow").forEach(function (r) { r.onclick = function () { openSheet(r.getAttribute("data-id")); }; });

    if (admin) {
      var us = el("kmUserSearch"); if (us) us.oninput = function () { kmUserQuery = us.value; refreshKmMsel(); };
      el("kmFrom").onchange = function () { km.from = el("kmFrom").value; renderKmReport(); };
      el("kmTo").onchange = function () { km.to = el("kmTo").value; renderKmReport(); };
      el("kmGroup").onchange = function () { km.group = el("kmGroup").checked; renderKmReport(); };
      refreshKmMsel();
    }
    el("kmXls").onclick = exportKm;
    el("kmPrint").onclick = printKm;
  }
  function printKm() {
    el("printArea").innerHTML = '<h2>Informe de km i combustible</h2>' + ((admin && km.group) ? reportByUser() : reportMonthly());
    window.print();
  }
  function exportKm() {
    if (typeof XLSX === "undefined") { toast("No s'ha pogut carregar l'exportador"); return; }
    var scope = scopeUsers(), b = rangeBounds();
    var fuel = fuelInRange(scope, b.from, b.to);
    if (!fuel.length && !readings.length) { toast("No hi ha registres per exportar"); return; }
    var det = [["Data", "Usuari", "Gasolinera", "Litres", "Import"]].concat(
      fuel.slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; }).map(function (e) { return [e.date, e.user, e.place || "", e.litres != null ? Number(e.litres) : "", Number(e.amount)]; }));
    var mens = [["Mes", "Km", "Litres", "Consum (L/100km)", "Cost (€)"]];
    monthlyRows().forEach(function (r) { mens.push([monthLabel(r.ym) + (r.estimated ? " (~)" : ""), Number(r.dist.toFixed(0)), Number(r.litres.toFixed(2)), Number(r.avg.toFixed(2)), Number(r.cost.toFixed(2))]); });
    var t = totalsFor(scope); mens.push(["TOTAL", Number(t.dist.toFixed(0)), Number(t.litres.toFixed(2)), Number(t.avg.toFixed(2)), Number(t.cost.toFixed(2))]);
    var usr = [["Usuari", "Km", "Litres", "Consum (L/100km)", "Cost (€)"]];
    scope.forEach(function (uid) { var d = distanceFor([uid], b.from, addDay(b.to, 1)); var f = fuelInRange([uid], b.from, b.to); var lit = litresSum(f), cost = costSum(f); if (d > 0 || lit > 0) usr.push([userName(uid), Number(d.toFixed(0)), Number(lit.toFixed(2)), Number((d > 0 ? lit / d * 100 : 0).toFixed(2)), Number(cost.toFixed(2))]); });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mens), "Resum mensual");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(usr), "Per usuari");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(det), "Repostatges");
    XLSX.writeFile(wb, "km-combustible.xlsx");
    toast("Excel generat");
  }

  // ---------- Lectura mensual de km + recordatori ----------
  function openRead() {
    var today = todayStr(); el("readDate").value = today;
    var ym = today.slice(0, 7); var ex = readings.filter(function (r) { return r.userId === me.id && r.ym === ym; })[0];
    el("readKm").value = ex ? ex.km : "";
    el("readScrim").setAttribute("data-open", "true"); el("readSheet").setAttribute("data-open", "true");
  }
  function closeRead() { el("readScrim").removeAttribute("data-open"); el("readSheet").removeAttribute("data-open"); }
  el("closeRead").onclick = closeRead; el("readScrim").onclick = closeRead;
  el("readSave").onclick = async function () {
    var v = el("readKm").value;
    if (v === "" || isNaN(Number(v))) { toast("Posa els km", { error: true }); return; }
    try { await api("/api/readings", "POST", { km: Number(v), date: el("readDate").value || todayStr() }); await loadReadings(); closeRead(); hideKmReminder(); toast("Km desats"); }
    catch (e) { toast(e.message, { error: true }); }
  };
  function hasReadingThisMonth() { var ym = todayStr().slice(0, 7); return readings.some(function (r) { return r.userId === me.id && r.ym === ym; }); }
  function showKmReminder() { if (me && !hasReadingThisMonth()) el("kmReminder").setAttribute("data-show", "true"); }
  function hideKmReminder() { el("kmReminder").removeAttribute("data-show"); }
  el("kmReminderGo").onclick = function () { hideKmReminder(); openRead(); };
  el("kmReminderX").onclick = function () { hideKmReminder(); };

  // ---------- Vehicles (matrícules) ----------
  var vehTarget = null, vehTmp = [];
  function openVehicles(userId) {
    vehTarget = userId || null;
    var uid = userId || me.id;
    var u = roster.filter(function (x) { return x.id === uid; })[0];
    vehTmp = (u && u.vehicles) ? u.vehicles.slice() : [];
    el("vehTitle").textContent = userId ? ("Vehicles de " + (u ? u.name : "")) : "Els meus vehicles";
    renderVeh();
    el("vehScrim").setAttribute("data-open", "true"); el("vehSheet").setAttribute("data-open", "true");
  }
  function closeVeh() { el("vehScrim").removeAttribute("data-open"); el("vehSheet").removeAttribute("data-open"); }
  el("closeVeh").onclick = closeVeh; el("vehScrim").onclick = closeVeh;
  function renderVeh() {
    var chips = vehTmp.length ? vehTmp.map(function (p, i) { return '<span class="mtag">' + esc(p) + '<b data-i="' + i + '">✕</b></span>'; }).join("") : '<span style="font-size:13px;color:var(--muted)">Cap vehicle</span>';
    el("vehBody").innerHTML =
      '<div class="msel-tags" style="margin-bottom:12px">' + chips + '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:14px"><input id="vehInput" type="text" placeholder="Matrícula (ex. 1234ABC)" autocomplete="off" style="flex:1;border:1.5px solid var(--line);border-radius:11px;padding:12px 14px;font-size:16px;text-transform:uppercase"><button type="button" class="btn-ghost" id="vehAdd" style="width:auto;padding:12px 18px">Afegir</button></div>' +
      '<button type="button" class="btn-primary" id="vehSave" style="width:100%">Desa els vehicles</button>';
    el("vehBody").querySelectorAll("[data-i]").forEach(function (b) { b.onclick = function () { vehTmp.splice(+b.getAttribute("data-i"), 1); renderVeh(); }; });
    var add = function () { var v = (el("vehInput").value || "").trim().toUpperCase(); if (!v) return; if (vehTmp.indexOf(v) < 0) vehTmp.push(v); el("vehInput").value = ""; renderVeh(); var i = el("vehInput"); if (i) i.focus(); };
    el("vehAdd").onclick = add;
    el("vehInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); add(); } });
    el("vehSave").onclick = async function () {
      try {
        var payload = { setVehicles: vehTmp };
        if (vehTarget) payload.id = vehTarget;
        await api("/api/users", "POST", payload);
        await loadRoster();
        closeVeh(); toast("Vehicles desats");
      } catch (e) { toast(e.message, { error: true }); }
    };
  }

  function openImg(src) { el("imgviewImg").src = src; el("imgview").setAttribute("data-open", "true"); }
  el("imgview").onclick = function () { this.removeAttribute("data-open"); };
  var toastT; function toast(msg, opts) {
    opts = opts || {};
    var t = el("toast");
    t.className = "toast" + (opts.error ? " err" : "");
    t.innerHTML = (opts.cross ? '<span class="xmark">✕</span>' : '') + esc(msg);
    t.setAttribute("data-show", "true");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.removeAttribute("data-show"); }, opts.ms || 5500);
  }

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
    try { var st = await api("/api/users"); noUsers = (st && typeof st.count === "number") ? st.count === 0 : false; } catch (e) { noUsers = false; }
    var savedMe = localStorage.getItem("me");
    if (token && savedMe) {
      try { me = JSON.parse(savedMe); } catch (e) { me = null; }
      if (me) {
        try {
          normalizeCfg(await api("/api/config")); applyTheme();
          await loadRoster(); fillNamesDatalist(); await loadEntries(); await loadReadings();
        } catch (e) { if (!token) me = null; }
      }
    }
    render();
    if (lang === "es") applyLang();
    if (me) showKmReminder();
  })();
})();
