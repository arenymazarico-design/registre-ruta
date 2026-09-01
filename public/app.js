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
  var APP_VERSION = "2025-07-03 · restaurants-bloquejats";

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
    "Litres": "Litros", "Litres (gasoil)": "Litros (gasoil)", "Km del comptador": "Km del cuentakilómetros", "Nom de la gasolinera": "Nombre de la gasolinera",
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
    "Informe de km i consum": "Informe de km y consumo", "Repostatge": "Repostaje", "Gasolinera": "Gasolinera",
    "Activar vehicle de substitució": "Activar vehículo de sustitución", "Matrícula del vehicle": "Matrícula del vehículo",
    "Km actuals del comptador": "Km actuales del cuentakilómetros", "Activar i desar km": "Activar y guardar km",
    "Mentre estigui actiu, tot el que entris s'assignarà a aquesta matrícula.": "Mientras esté activo, todo lo que introduzcas se asignará a esta matrícula.",
    "Cap vehicle actiu": "Sin vehículo activo", "Toca una matrícula per activar-la. 🏠 = habitual.": "Toca una matrícula para activarla. 🏠 = habitual.",
    "Vehicle habitual": "Vehículo habitual",
    "Despesa": "Gasto", "Té vehicle d'empresa": "Tiene vehículo de empresa", "⬇︎ Descarregar plantilla": "⬇︎ Descargar plantilla",
    "⚠ fora de termini": "⚠ fuera de plazo", "Import màxim per menú/dieta (€)": "Importe máximo por menú/dieta (€)",
    "Posa la matrícula": "Pon la matrícula", "Totes les matrícules": "Todas las matrículas", "(sense matrícula)": "(sin matrícula)", "Matrícula": "Matrícula",
    "Eliminar lectura": "Eliminar lectura", "Lectura eliminada": "Lectura eliminada",
    "Instal·la aquesta app a la pantalla d'inici": "Instala esta app en la pantalla de inicio", "Instal·lar": "Instalar",
    "Llegint el tiquet…": "Leyendo el ticket…",
    "S'estan extraient la data, el número i l'import de la foto.": "Se están extrayendo la fecha, el número y el importe de la foto.",
    "⛽ Combustible / km": "⛽ Combustible / km", "⛽ km": "⛽ km",
    "Lectures de km · toca per editar": "Lecturas de km · toca para editar",
    "Cap repostatge.": "Sin repostajes.", "Cap lectura.": "Sin lecturas.", "Sense dades.": "Sin datos.",
    "Import màxim per persona i menú (€)": "Importe máximo por persona y menú (€)",
    "A l'Excel de consulta, per a cada dieta es divideix l'import entre els acompanyants + la persona que l'entra; si la mitjana per persona supera aquest import, la fila es marca en vermell. No canvia cap import. Deixa-ho a 0 per no comprovar res.": "En el Excel de consulta, para cada dieta se divide el importe entre los acompañantes + la persona que la introduce; si la media por persona supera este importe, la fila se marca en rojo. No cambia ningún importe. Déjalo a 0 para no comprobar nada.",
    "🔄 Activar vehicle de substitució": "🔄 Activar vehículo de sustitución",
    "Mentre estigui actiu, tot el que entris s'assignarà a aquesta matrícula.": "Mientras esté activo, todo lo que introduzcas se asignará a esta matrícula.",
    "Toca una matrícula per activar-la. 🏠 = habitual.": "Toca una matrícula para activarla. 🏠 = habitual.",
    "✓ Validar acompanyant repetit": "✓ Validar acompañante repetido", "Acompanyant validat": "Acompañante validado",
    "Passat al mes de la data del tiquet": "Pasado al mes de la fecha del ticket", "Deixat al mes d'entrada": "Dejado en el mes de entrada",
    "Vehicle actiu:": "Vehículo activo:", "Km del comptador": "Km del cuentakilómetros",
    "Total filtrat": "Total filtrado",
    "Assignar al mes de la data": "Asignar al mes de la fecha", "Deixar al mes d'entrada": "Dejar en el mes de entrada",
    "Repostatge (foto)": "Repostaje (foto)",
    "Km actuals del comptador": "Km actuales del cuentakilómetros",
    "Acompanyant repetit": "Acompañante repetido",
    "Filtra per dates": "Filtra por fechas",
    "Restaurants que facturen a final de mes (bloquejats)": "Restaurantes que facturan a final de mes (bloqueados)",
    "Ho ha pagat l'usuari": "Lo ha pagado el usuario", "Gasoil": "Gasoil", "AdBlue": "AdBlue",
    "Per defecte ho paga l'empresa. Si ho marca, el tiquet passa a Gastos (per reemborsar), però els litres segueixen comptant per al consum.": "Por defecto lo paga la empresa. Si lo marca, el ticket pasa a Gastos (para reembolsar), pero los litros siguen contando para el consumo.",
    "Estat del sistema": "Estado del sistema", "Base de dades (Neon)": "Base de datos (Neon)",
    "Fotos dels tiquets (Netlify Blobs)": "Fotos de los tickets (Netlify Blobs)", "Despeses per tipus": "Gastos por tipo",
    "Usuaris": "Usuarios", "Tiquets": "Tickets", "Lectures de km": "Lecturas de km", "Fotos": "Fotos", "Actualitzar": "Actualizar", "Carregant…": "Cargando…",
    "📋 Apuntar lectura de km": "📋 Apuntar lectura de km",
    "Apunta la lectura del comptador de km del cotxe.": "Apunta la lectura del cuentakilómetros del coche.",
    "Vehicle habitual:": "Vehículo habitual:", "Vehicle actiu": "Vehículo activo",
    "(substitució)": "(sustitución)", "↩︎ Tornar al vehicle habitual": "↩︎ Volver al vehículo habitual",
    "Matrícula (ex. 1234ABC)": "Matrícula (ej. 1234ABC)", "Cap vehicle": "Sin vehículo",
    "Desa els vehicles": "Guardar los vehículos", "Matrícula del vehicle": "Matrícula del vehículo",
    "Activar i desar km": "Activar y guardar km"
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
  var MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var DAYS = ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"];
  var DAYS_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  function months() { return lang === "es" ? MONTHS_ES : MONTHS; }
  function days() { return lang === "es" ? DAYS_ES : DAYS; }

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
  var fuelType = "gasoil";
  var paidByUser = false;
  function isFuel(e) { return e.cat === "combustible" || !!e.fuelType; }
  function fuelTypeOf(e) { return e.fuelType || (e.cat === "combustible" ? "gasoil" : ""); }
  function updateBlockNote() {
    var n = el("blockNote"); if (!n) return;
    var m = blockedMatch(el("place").value);
    if (m) { n.style.display = "block"; n.innerHTML = '<div class="latenote">🚫 <b>' + esc(m) + '</b> envia factura a l\'empresa a final de mes. Aquest tiquet no cal registrar-lo i no es podrà desar.</div>'; }
    else { n.style.display = "none"; n.innerHTML = ""; }
  }
  function blockedMatch(place) {
    var p = String(place || "").trim().toLowerCase();
    if (!p) return null;
    var list = cfg.blockedPlaces || [];
    for (var i = 0; i < list.length; i++) {
      var b = String(list[i]).trim().toLowerCase();
      if (b && (p.indexOf(b) >= 0 || b.indexOf(p) >= 0)) return list[i];
    }
    return null;
  }
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
  function fmtDay(s) { var d = parseDate(s); return days()[d.getDay()] + ", " + d.getDate() + " " + months()[d.getMonth()]; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function initial(n) { return (n || "?").trim().charAt(0).toUpperCase(); }
  function applyTheme() { if (cfg.color) document.documentElement.style.setProperty("--amber", cfg.color); else document.documentElement.style.removeProperty("--amber"); }

  async function loadEntries() { var r = await api("/api/tickets"); entries = r.tickets || []; }
  async function loadReadings() { try { var r = await api("/api/readings"); readings = r.readings || []; } catch (e) { readings = []; } }
  async function loadRoster() { try { var r = await api("/api/users"); roster = r.users || []; } catch (e) { roster = []; } }
  function normalizeCfg(c) {
    cfg.email = c.email || ""; cfg.color = c.color || ""; cfg.logo = c.logo || ""; cfg.cif = c.cif || "";
    cfg.menuMax = (c.menuMax != null && !isNaN(Number(c.menuMax))) ? Number(c.menuMax) : 0;
    var bp = [];
    if (c.blockedPlaces) { try { bp = JSON.parse(c.blockedPlaces); } catch (e) { bp = String(c.blockedPlaces).split(/[\n,;]+/); } }
    cfg.blockedPlaces = (bp || []).map(function (x) { return String(x).trim(); }).filter(Boolean);
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

  function isoDay(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }
  function lateDeadline(dateStr) { var d = new Date(dateStr + "T00:00:00"); return new Date(d.getFullYear(), d.getMonth() + 1, 4).getTime(); }
  function isLateDate(dateStr) { return new Date(todayStr() + "T00:00:00").getTime() > lateDeadline(dateStr); }
  function isLateEntry(e) { if (!e || !e.createdAt) return false; return new Date(isoDay(e.createdAt) + "T00:00:00").getTime() > lateDeadline(e.date); }
  function lateUnresolved(e) { return isLateEntry(e) && !e.lateMonth; }
  function effectiveMonth(e) { return (isLateEntry(e) && e.lateMonth !== "date" && e.createdAt) ? ymOf(isoDay(e.createdAt)) : ymOf(e.date); }
  function visibleEntries() {
    var key = ym(view);
    var list = entries.filter(function (e) { return e.cat !== "combustible" && effectiveMonth(e) === key; });
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

  function applyFilters(list) {
    var l = list.slice();
    if (filter !== "tots") l = l.filter(function (e) { return e.cat === filter; });
    if (admin && userFilter !== "tots") l = l.filter(function (e) { return e.userId === userFilter; });
    return l;
  }
  function renderApp() {
    var mes = visibleEntries();
    var mesUser = (admin && userFilter !== "tots") ? mes.filter(function (e) { return e.userId === userFilter; }) : mes;
    var shown = applyFilters(mes);
    var total = shown.reduce(function (s, e) { return s + e.amount; }, 0);
    var sums = {}; EXPENSE_KEYS.forEach(function (k) { sums[k] = 0; });
    mesUser.forEach(function (e) { if (sums[e.cat] != null) sums[e.cat] += e.amount; });
    var bd = EXPENSE_KEYS.map(function (k) { return '<div class="bd' + (filter === k ? ' bdsel' : '') + '"><div class="n"><span class="dot" style="background:' + CATS[k].color + '"></span>' + CATS[k].label + '</div><div class="v">' + eur(sums[k]) + '</div></div>'; }).join("");
    var fparts = [];
    if (filter !== "tots") fparts.push(CATS[filter].label);
    if (admin && userFilter !== "tots") { var uu = roster.filter(function (x) { return x.id === userFilter; })[0]; if (uu) fparts.push(uu.name); }
    var totalLbl = fparts.length ? ('<span>Total filtrat</span>: ' + esc(fparts.join(" · "))) : (admin ? "Total de tots els usuaris" : "El meu total del mes");

    el("root").innerHTML =
      '<div class="wrap"><header>' +
      '<div class="brand"><div class="l" style="align-items:center;gap:10px">' +
      (cfg.logo ? '<img class="hdrlogo" src="' + cfg.logo + '" alt="logo">' : '') +
      '<div style="display:flex;flex-direction:column"><h1 style="text-transform:none;letter-spacing:.01em">PLUgastos</h1><span class="sub">' + (admin ? 'Panell d\'administrador' : 'despeses de ruta') + '</span></div></div>' +
      '<div class="who">' + (admin ? '<span class="adminbadge">ADMIN</span>' : '') + '<button class="avatar" id="avatarBtn">' + esc(initial(me.name)) + '</button></div></div>' +
      '<div class="monthbar"><button id="prevM">‹</button><div class="m">' + months()[view.getMonth()] + ' ' + view.getFullYear() + '</div><button id="nextM">›</button></div>' +
      '<div class="total"><div class="big">' + eur(total) + '</div><div class="lbl">' + totalLbl + '</div></div>' +
      '<div class="breakdown">' + bd + '</div></header>' + renderToolbar() + '<main id="list"></main></div>' +
      '<div class="fabbar"><button class="fab" id="camBtn"><span class="cam">📷</span> Fer foto del tiquet</button>' + (admin ? '<button class="nolink" id="manualBtn">afegir sense foto</button>' : '') + '</div>';

    renderList(mes); bindMain(); if (lang === "es") applyLang();
  }

  function renderToolbar() {
    var opts = [{ k: "tots", label: "Tots" }].concat(EXPENSE_KEYS.map(function (k) { return { k: k, label: CATS[k].label }; }));
    var chips = opts.map(function (o) { var dot = o.k !== "tots" ? '<span class="cdot" style="background:' + CATS[o.k].color + '"></span>' : ''; return '<button class="chip fc" data-k="' + o.k + '" data-active="' + (filter === o.k) + '">' + dot + o.label + '</button>'; }).join("");
    var userSel = "";
    if (admin) {
      userSel = '<select id="userFilter" class="chip" style="appearance:auto"><option value="tots"' + (userFilter === "tots" ? " selected" : "") + '>Tots els usuaris</option>' +
        roster.map(function (u) { return '<option value="' + u.id + '"' + (userFilter === u.id ? " selected" : "") + '>' + esc(u.name) + '</option>'; }).join("") + '</select>';
    }
    var kmBtn = (admin || myHasVehicle()) ? '<button class="expbtn" id="openKmBtn">⛽ km</button>' : '';
    return '<div class="toolbar">' + chips + '<span class="spacer"></span>' + userSel + kmBtn + '<button class="expbtn" id="openExp">Consulta</button></div>';
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
        var late = lateUnresolved(e);
        var moved = (e.lateMonth === "entry");
        var lateTag = late ? '<span class="latebadge">⚠ fora de termini</span>' : '';
        var movedTag = moved ? '<span class="movedbadge" title="Entrat fora de termini">📅</span>' : '';
        var compTag = e.compFlag ? '<span class="compbadge">👥 acompanyant repetit</span>' : '';
        return '<div class="ticket' + (e.accounted ? ' acct' : '') + ((late || e.compFlag) ? ' late' : '') + (moved ? ' moved' : '') + '" data-id="' + e.id + '"><div class="bar" style="background:' + c.color + '"></div>' +
          '<div class="body"><span class="cat" style="color:' + c.color + '">' + c.label + '</span>' + whoTag + acctTag + lateTag + movedTag + compTag +
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
    var kb = el("openKmBtn"); if (kb) kb.onclick = openKm;
    el("root").querySelectorAll(".fc").forEach(function (c) { c.onclick = function () { filter = c.getAttribute("data-k"); render(); }; });
    var uf = el("userFilter"); if (uf) uf.onchange = function () { userFilter = uf.value; render(); };
  }

  // ---------- Menú ----------
  function openMenu() {
    var items = "";
    if (admin) items += '<button class="mi" id="miUsers">Gestionar usuaris</button>';
    if (admin) items += '<button class="mi" id="miConfig">Configuració</button>';
    if (admin) items += '<button class="mi" id="miStat">Estat del sistema</button>';
    items += '<button class="mi" id="miPin">Canviar contrasenya</button>';
    items += '<button class="mi" id="miKm">Combustible i km</button>';
    if (myHasVehicle()) items += '<button class="mi" id="miVeh">Els meus vehicles</button>';
    items += '<button class="mi danger" id="miLogout">Tancar sessió</button>';
    items += '<div style="display:flex;gap:8px;justify-content:center;padding:12px">' +
      '<button type="button" class="langbtn" data-l="ca"' + (lang === "ca" ? ' data-active="true"' : '') + '>Català</button>' +
      '<button type="button" class="langbtn" data-l="es"' + (lang === "es" ? ' data-active="true"' : '') + '>Castellano</button></div>';
    items += '<div style="padding:2px 18px 12px;font-size:11px;color:var(--muted);text-align:center">Versió ' + APP_VERSION + '</div>';
    el("menuCard").innerHTML = '<div class="u"><b>' + esc(me.name) + '</b><span>' + (admin ? "Administrador" : "Usuari") + '</span></div>' + items;
    el("menu").setAttribute("data-open", "true");
    if (admin) el("miUsers").onclick = function () { closeMenu(); openUM(); };
    if (admin) el("miConfig").onclick = function () { closeMenu(); openCfg(); };
    if (admin) el("miStat").onclick = function () { closeMenu(); openStatus(); };
    el("miPin").onclick = function () { closeMenu(); openPin(); };
    el("miKm").onclick = function () { closeMenu(); openKm(); };
    var mv = el("miVeh"); if (mv) mv.onclick = function () { closeMenu(); openVehicles(null); };
    el("miLogout").onclick = function () { closeMenu(); clearSession(); me = null; render(); };
    el("menuCard").querySelectorAll(".langbtn").forEach(function (b) { b.onclick = function () { setLang(b.getAttribute("data-l")); }; });
    if (lang === "es") applyLang();
  }
  function closeMenu() { el("menu").removeAttribute("data-open"); }

  // ---------- Estat del sistema ----------
  function fmtBytes(b) {
    if (!b || b < 0) return "0 B";
    if (b < 1024) return b + " B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
    if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + " MB";
    return (b / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
  function statCard(label, value, sub) {
    return '<div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:13px 15px">' +
      '<div style="font-size:12px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.03em">' + label + '</div>' +
      '<div style="font-family:var(--mono);font-size:22px;font-weight:700;margin-top:4px">' + value + '</div>' +
      (sub ? '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + sub + '</div>' : '') + '</div>';
  }
  function statBar(usedBytes, limitBytes) {
    var pct = limitBytes > 0 ? Math.min(100, usedBytes / limitBytes * 100) : 0;
    var col = pct > 85 ? "#d9433a" : (pct > 60 ? "#d97706" : "#4f9d69");
    return '<div style="height:10px;border-radius:6px;background:var(--line);overflow:hidden;margin-top:8px"><div style="height:100%;width:' + pct.toFixed(1) + '%;background:' + col + '"></div></div>' +
      '<div style="font-size:12px;color:var(--muted);margin-top:5px">' + fmtBytes(usedBytes) + ' de ' + fmtBytes(limitBytes) + ' (' + pct.toFixed(1) + '%)</div>';
  }
  async function openStatus() {
    el("statBody").innerHTML = '<p style="color:var(--muted)">Carregant…</p>';
    el("statScrim").setAttribute("data-open", "true"); el("statSheet").setAttribute("data-open", "true");
    try {
      var s = await api("/api/status", "GET");
      var catName = { dietes: "Dietes", gastos: "Gastos", bascules: "Bàscules", peatges: "Peatges", combustible: "Combustible" };
      var catRows = (s.byCat || []).map(function (c) {
        return '<div style="display:flex;justify-content:space-between;font-size:14px;padding:6px 0;border-bottom:1px solid var(--line)"><span>' + (catName[c.cat] || c.cat) + '</span><span style="font-family:var(--mono)">' + c.count + ' · ' + eur(c.sum) + '</span></div>';
      }).join("");
      el("statBody").innerHTML =
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
        statCard("Usuaris", s.users) +
        statCard("Tiquets", s.tickets, s.withPhoto + " amb foto") +
        statCard("Lectures de km", s.readings) +
        statCard("Fotos", s.withPhoto) +
        '</div>' +
        '<label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);margin-bottom:8px">Base de dades (Neon)</label>' +
        statBar(s.dbBytes, s.dbLimitBytes) +
        '<p style="font-size:12px;color:var(--muted);margin:6px 0 18px">Conté tiquets, usuaris i lectures (només text). El límit indicat és orientatiu de la capa gratuïta de Neon; mira el teu pla real a la consola de Neon.</p>' +
        '<label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);margin-bottom:8px">Fotos dels tiquets (Netlify Blobs)</label>' +
        '<div style="font-family:var(--mono);font-size:22px;font-weight:700">' + fmtBytes(s.photoBytes) + (s.photosExact ? "" : " (aprox.)") + '</div>' +
        '<p style="font-size:12px;color:var(--muted);margin:4px 0 18px">' + s.withPhoto + ' fotos.' + (s.photosExact ? "" : " " + s.photosUnknown + " són d\'abans d\'aquesta versió i s\'estimen; en tornar a desar-les o afegir-ne de noves, la mida serà exacta.") + ' Netlify Blobs té molt espai; és difícil que sigui un problema.</p>' +
        '<label style="display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);margin-bottom:6px">Despeses per tipus</label>' +
        (catRows || '<p style="color:var(--muted);font-size:13px">Cap despesa.</p>') +
        '<button type="button" class="btn-ghost" id="statReload" style="width:100%;margin-top:16px">Actualitzar</button>';
      var rb = el("statReload"); if (rb) rb.onclick = openStatus;
      if (lang === "es") applyLang();
    } catch (e) {
      el("statBody").innerHTML = '<p style="color:#c0271e">No s\'ha pogut carregar l\'estat: ' + esc(e.message) + '</p>';
    }
  }
  function closeStatus() { el("statScrim").removeAttribute("data-open"); el("statSheet").removeAttribute("data-open"); }
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
      '<button class="btn-ghost" id="umTpl" style="width:100%;margin-top:8px">⬇︎ Descarregar plantilla</button>' +
      '<p style="font-size:12px;color:var(--muted);margin-top:8px">Columnes: <b>Nom</b>, <b>PIN</b> (4 dígits), <b>Rol</b> (usuari/admin) i <b>Vehicles</b> (matrícules separades per espai o coma). La primera fila pot ser de títols.</p>';
    el("umBody").querySelectorAll(".umrow").forEach(function (r) { r.onclick = function () { renderUMEdit(r.getAttribute("data-id")); }; });
    el("umAdd").onclick = function () { renderUMEdit(null); };
    el("umXls").onchange = function (ev) { var f = ev.target.files && ev.target.files[0]; if (f) importUsers(f); ev.target.value = ""; };
    el("umTpl").onclick = function () { downloadTemplate("plantilla-usuaris.xlsx", [["Nom", "PIN", "Rol", "Vehicles"], ["Joan Exemple", "1234", "usuari", "1234ABC 5678DEF"], ["Anna Admin", "4321", "admin", "9876GHI"]]); };
    if (lang === "es") applyLang();
  }

  function importUsers(file) {
    readSheet(file, async function (rows) {
      if (!rows || !rows.length) { toast("No s'ha pogut llegir l'Excel"); return; }
      var bulk = [];
      rows.forEach(function (r, i) {
        var name = (r[0] == null ? "" : String(r[0])).trim();
        var pin = (r[1] == null ? "" : String(r[1])).trim();
        var role = (r[2] == null ? "" : String(r[2])).trim().toLowerCase();
        var vehStr = (r[3] == null ? "" : String(r[3])).trim();
        if (i === 0 && /nom|name/i.test(name) && !/^\d{4}$/.test(pin)) return;
        if (!name) return;
        var vehicles = vehStr ? vehStr.split(/[\s,;]+/).map(function (x) { return x.trim().toUpperCase(); }).filter(Boolean) : [];
        bulk.push({ name: name, pin: pin, role: (role === "admin" || role === "administrador") ? "admin" : "user", vehicles: vehicles });
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
      '<label style="display:flex;align-items:center;gap:9px;font-size:15px;font-weight:600;margin:2px 0 14px;cursor:pointer"><input type="checkbox" id="uVehHas"' + ((!u || u.hasVehicle !== false) ? " checked" : "") + ' style="width:20px;height:20px"> Té vehicle d\'empresa</label>' +
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
        var payload = { name: nm, role: rl, hasVehicle: el("uVehHas").checked };
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
    if (lang === "es") applyLang();
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
      '<div class="field"><label for="cMenuMax">Import màxim per persona i menú (€)</label><input id="cMenuMax" type="number" inputmode="decimal" step="0.01" min="0" placeholder="Ex. 12" value="' + (cfg.menuMax ? esc(String(cfg.menuMax)) : "") + '"></div>' +
      '<p style="font-size:12px;color:var(--muted);margin:-4px 0 12px">A l\'Excel de consulta, per a cada dieta es divideix l\'import entre els acompanyants + la persona que l\'entra; si la mitjana per persona supera aquest import, la fila es marca en vermell. No canvia cap import. Deixa-ho a 0 per no comprovar res.</p>' +
      '<div class="field"><label for="cBlocked">Restaurants que facturen a final de mes (bloquejats)</label><textarea id="cBlocked" rows="4" placeholder="Un nom per línia">' + esc((cfg.blockedPlaces || []).join("\n")) + '</textarea></div>' +
      '<p style="font-size:12px;color:var(--muted);margin:-4px 0 14px">Si el nom del comerç d\'un tiquet coincideix amb algun d\'aquests, no es podrà desar: aquests restaurants ja envien factura a l\'empresa a final de mes.</p>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Color de l\'app</label>' +
      '<div class="swatches">' + swatches + '<input id="cColor" type="color" value="' + esc(cfgColorTmp) + '" style="width:40px;height:34px;border:1px solid var(--line);border-radius:8px;background:none;cursor:pointer;padding:2px"></div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Logo</label>' +
      '<div class="logobox">' + logoBoxHtml() + '</div>' +
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Noms per a acompanyants</label>' +
      '<textarea id="cNames" placeholder="Un nom per línia" style="width:100%;min-height:90px;border:1.5px solid var(--line);border-radius:11px;padding:12px;font-size:15px;font-family:var(--sans)">' + esc(cfg.names.join("\n")) + '</textarea>' +
      '<label class="btn-ghost" for="cNamesXls" style="display:block;text-align:center;cursor:pointer;margin:8px 0 4px">📄 Importar noms d\'Excel</label>' +
      '<input id="cNamesXls" type="file" accept=".xlsx,.xls,.csv" style="display:none">' +
      '<button type="button" class="btn-ghost" id="cNamesTpl" style="width:100%;margin:4px 0">⬇︎ Descarregar plantilla</button>' +
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
    el("cNamesTpl").onclick = function () { downloadTemplate("plantilla-noms.xlsx", [["Nom"], ["Joan Exemple"], ["Maria Exemple"]]); };
    el("cSave").onclick = saveCfg;
    if (lang === "es") applyLang();
  }
  function compressLogo(file, cb) {
    var reader = new FileReader();
    reader.onload = function () { var img = new Image(); img.onload = function () { var max = 280, w = img.width, h = img.height; if (w > h && w > max) { h = Math.round(h * max / w); w = max; } else if (h >= w && h > max) { w = Math.round(w * max / h); h = max; } var cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h); cb(cv.toDataURL("image/png")); }; img.onerror = function () { cb(null); }; img.src = reader.result; };
    reader.onerror = function () { cb(null); }; reader.readAsDataURL(file);
  }
  async function saveCfg() {
    cfg.email = el("cEmail").value.trim(); cfg.color = cfgColorTmp || ""; cfg.logo = cfgLogoTmp || "";
    cfg.cif = el("cCif").value.trim();
    var mm = parseFloat(el("cMenuMax").value); cfg.menuMax = (!isNaN(mm) && mm > 0) ? mm : 0;
    cfg.blockedPlaces = el("cBlocked").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
    cfg.names = el("cNames").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
    try {
      await api("/api/config", "POST", { email: cfg.email, color: cfg.color, logo: cfg.logo, cif: cfg.cif, names: JSON.stringify(cfg.names), menuMax: cfg.menuMax, blockedPlaces: JSON.stringify(cfg.blockedPlaces) });
      applyTheme(); fillNamesDatalist(); closeCfg(); render(); toast("Configuració desada");
    } catch (e) { toast(e.message); }
  }

  // ---------- Foto + extracció ----------
  el("photo").addEventListener("change", function (ev) {
    var file = ev.target.files && ev.target.files[0]; if (!file) return;
    compress(file, function (dataUrl) {
      el("photo").value = "";
      if (!dataUrl) { toast("No s'ha pogut carregar la foto"); return; }
      if (retakeMode) { retakeMode = false; pendingPhoto = dataUrl; setThumb(dataUrl); return; }
      pendingPhoto = dataUrl; runExtraction(dataUrl);
    });
  });
  function downloadTemplate(filename, aoa) {
    if (typeof XLSX === "undefined") { toast("No s'ha pogut generar la plantilla"); return; }
    var ws = XLSX.utils.aoa_to_sheet(aoa); var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla"); XLSX.writeFile(wb, filename);
  }
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
    var MAX = 1100, Q = 0.6;
    function scale(w, h) { if (w > h && w > MAX) { return [MAX, Math.round(h * MAX / w)]; } if (h >= w && h > MAX) { return [Math.round(w * MAX / h), MAX]; } return [w, h]; }
    function toCanvas(src, w, h) { var d = scale(w, h); var cv = document.createElement("canvas"); cv.width = d[0]; cv.height = d[1]; cv.getContext("2d").drawImage(src, 0, 0, d[0], d[1]); var out = null; try { out = cv.toDataURL("image/jpeg", Q); } catch (e) { out = null; } cv.width = cv.height = 0; return out; }
    function legacy() {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () { cb(toCanvas(img, img.width, img.height)); img.src = ""; };
        img.onerror = function () { cb(null); };
        img.src = reader.result;
      };
      reader.onerror = function () { cb(null); };
      reader.readAsDataURL(file);
    }
    // Via preferida: descodifica de forma eficient i allibera la memòria de seguida.
    if (window.createImageBitmap) {
      window.createImageBitmap(file).then(function (bmp) {
        var out = toCanvas(bmp, bmp.width, bmp.height);
        if (bmp.close) bmp.close();
        cb(out);
      }).catch(function () { legacy(); });
    } else legacy();
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
  function setEntryMode(mode) {
    el("modeToggle").querySelectorAll(".mbtn").forEach(function (b) { b.setAttribute("data-active", b.getAttribute("data-m") === mode); });
    if (mode === "combustible") selectedCat = "combustible";
    else if (selectedCat === "combustible") selectedCat = "dietes";
    renderCatPick();
    el("catpick").style.display = (mode === "combustible") ? "none" : "grid";
    toggleCompanions();
  }
  function setFuelTypeUI() {
    var ft = el("fuelTypeToggle"); if (ft) ft.querySelectorAll(".mbtn").forEach(function (b) { b.setAttribute("data-active", b.getAttribute("data-ft") === fuelType); });
  }
  function toggleCompanions() {
    el("compWrap").style.display = (selectedCat === "dietes") ? "block" : "none";
    var fuel = (selectedCat === "combustible");
    el("fuelWrap").style.display = fuel ? "block" : "none";
    el("placeLbl").textContent = fuel ? "Gasolinera" : "Restaurant o empresa";
    el("place").placeholder = fuel ? "Nom de la gasolinera" : "Nom del comerç";
    el("amount").required = !fuel; // en repostatge l'import és opcional (l'important són els litres)
    var pu = el("paidByUser"); if (pu) pu.checked = paidByUser;
    setFuelTypeUI();
    if (fuel) fillPlatesDatalist();
  }
  function fillPlatesDatalist(userId) {
    var dl = el("platesList"); if (!dl) return;
    var uid = userId || me.id;
    var u = roster.filter(function (x) { return x.id === uid; })[0];
    var vs = (u && u.vehicles) ? u.vehicles : [];
    dl.innerHTML = vs.map(function (p) { return '<option value="' + esc(p) + '"></option>'; }).join("");
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
    var wantFuel = pendingFuel || (parsed && (parsed.category === "combustible" || parsed.fuel_type === "gasoil" || parsed.fuel_type === "adblue"));
    el("sheetTitle").textContent = wantFuel ? "Repostatge" : "Revisar tiquet"; el("aiHint").style.display = fromAI ? "flex" : "none";
    fuelType = (parsed && (parsed.fuel_type === "adblue" || parsed.fuel_type === "gasoil")) ? parsed.fuel_type : "gasoil"; paidByUser = false;
    selectedCat = wantFuel ? "combustible" : ((parsed && CATS[parsed.category] && parsed.category !== "combustible") ? parsed.category : "dietes");
    setEntryMode(wantFuel ? "combustible" : "despesa");
    el("amount").value = (parsed && parsed.amount != null) ? parsed.amount : "";
    var norm = function (s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); };
    var companyCif = cfg.cif || "";
    var isFactura = !!(parsed && companyCif && (parsed.is_invoice === true || (parsed.cif && norm(parsed.cif) === norm(companyCif))));
    el("ticket").value = parsed ? (isFactura ? (parsed.invoice_number || parsed.ticket_number || "") : (parsed.ticket_number || parsed.invoice_number || "")) : "";
    el("cif").value = isFactura ? companyCif : ""; setNumberMode(isFactura);
    el("place").value = (parsed && parsed.business_name) ? parsed.business_name : ""; updateBlockNote();
    el("litres").value = (parsed && parsed.litres != null) ? parsed.litres : "";
    el("fuelPlate").value = wantFuel ? myActivePlate() : "";
    el("date").value = (parsed && parsed.date && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) ? parsed.date : todayStr();
    el("compCount").value = 0; el("compList").innerHTML = ""; el("notes").value = ""; setThumb(pendingPhoto);
    el("acctRow").innerHTML = ""; el("lateRow").innerHTML = ""; el("compRow").innerHTML = ""; setLock(false); openSheet_();
    pendingFuel = false;
  }
  function openSheet(id) {
    var e = entries.filter(function (x) { return x.id === id; })[0]; if (!e) return;
    el("entryForm").reset(); el("aiHint").style.display = "none"; el("sheetTitle").textContent = "Editar registre";
    el("editId").value = e.id; selectedCat = isFuel(e) ? "combustible" : e.cat;
    fuelType = fuelTypeOf(e) || "gasoil"; paidByUser = !!e.paidByUser;
    setEntryMode(isFuel(e) ? "combustible" : "despesa");
    el("amount").value = e.amount; el("ticket").value = e.ticket || ""; el("place").value = e.place || ""; updateBlockNote();
    el("cif").value = e.cif || ""; setNumberMode(!!e.cif);
    el("litres").value = (e.litres != null) ? e.litres : ""; el("fuelPlate").value = e.plate || "";
    if (isFuel(e)) fillPlatesDatalist(e.userId);
    el("date").value = e.date; setCompanionsFromString(e.companions || ""); el("notes").value = e.notes || "";
    pendingPhoto = e.photo || null; setThumb(pendingPhoto);
    el("delBtn").style.display = (admin || e.userId === me.id) ? "block" : "none";
    renderAcct(e); renderLate(e); renderCompFlag(e); openSheet_();
  }

  function setLock(locked) {
    ["amount", "ticket", "date", "place", "compCount", "notes", "litres", "fuelPlate"].forEach(function (id) { el(id).disabled = locked; });
    el("compList").querySelectorAll(".compName").forEach(function (i) { i.disabled = locked; });
    document.querySelectorAll('input[name=cat]').forEach(function (r) { r.disabled = locked; });
    el("modeToggle").querySelectorAll(".mbtn").forEach(function (b) { b.disabled = locked; });
    el("retakeBtn").style.display = locked ? "none" : "";
    el("saveBtn").style.display = locked ? "none" : "";
    if (locked) el("delBtn").style.display = "none";
  }
  function renderCompFlag(e) {
    var box = el("compRow"); box.innerHTML = "";
    if (!e || !e.compFlag) return;
    var note = '<div class="latenote" style="background:#fff6e6;color:#8a5a06;border-color:#f0d9a8">👥 Un acompanyant d\'aquest tiquet ja consta en un altre tiquet del mateix dia. Pot ser un altre àpat (esmorzar/dinar).</div>';
    if (admin) {
      box.innerHTML = note + '<button type="button" class="btn-ghost" id="compValBtn" style="border-color:#bcd9c4;color:#2f7a4a;margin-bottom:10px">✓ Validar acompanyant repetit</button>';
      el("compValBtn").onclick = function () { validateCompanion(e.id); };
    } else {
      box.innerHTML = note.replace("</div>", " Un administrador ho ha de validar.</div>");
    }
  }
  async function validateCompanion(id) {
    try {
      await api("/api/tickets", "PUT", { id: id, validateCompanion: true });
      await loadEntries(); closeSheet(); render(); if (el("kmSheet").getAttribute("data-open") === "true") renderKm();
      toast("Acompanyant validat");
    } catch (e) { toast(e.message, { error: true }); }
  }
  function renderLate(e) {
    var box = el("lateRow"); box.innerHTML = "";
    if (!admin || !e || (!isLateEntry(e) && !e.lateMonth)) return;
    var inDate = (e.lateMonth === "date"), inEntry = (e.lateMonth === "entry");
    var realDay = e.origDate || e.date;
    var dateM = monthLabel(ymOf(realDay));
    var entryM = e.createdAt ? monthLabel(ymOf(isoDay(e.createdAt))) : "";
    var status = e.lateMonth
      ? (inEntry
        ? ("Assignat a <b>" + entryM + "</b> (mes d'entrada). S'ha gravat amb la data d'entrada; la data real del tiquet era " + realDay + ".")
        : ("Assignat a <b>" + dateM + "</b> (mes de la data del tiquet)."))
      : ("Ara compta a <b>" + entryM + "</b> (mes d'entrada).");
    var noteCls = inEntry ? 'latenote movednote' : 'latenote';
    box.innerHTML =
      '<div class="' + noteCls + '">' + (inEntry ? "📅" : "⚠") + ' Tiquet fora de termini (correspon a un mes anterior ja tancat). ' + status + '</div>' +
      '<div class="actions" style="margin-bottom:10px">' +
      '<button type="button" class="btn-ghost" id="lateDate"' + (inDate ? ' disabled' : '') + '>📅 Passar a ' + dateM + '</button>' +
      '<button type="button" class="btn-ghost" id="lateEntry"' + (inEntry ? ' disabled' : '') + '>Deixar a ' + entryM + '</button></div>';
    var bd = el("lateDate"); if (bd) bd.onclick = function () { setLateMonth(e.id, "date"); };
    var be = el("lateEntry"); if (be) be.onclick = function () { setLateMonth(e.id, "entry"); };
  }
  async function setLateMonth(id, v) {
    try {
      await api("/api/tickets", "PUT", { id: id, setLateMonth: v });
      await loadEntries(); closeSheet(); render();
      toast(v === "date" ? "Passat al mes de la data del tiquet" : "Deixat al mes d'entrada");
    } catch (e) { toast(e.message, { error: true }); }
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
  function openSheet_() { el("scrim").setAttribute("data-open", "true"); el("sheet").setAttribute("data-open", "true"); if (lang === "es") applyLang(); }
  function closeSheet() { el("scrim").removeAttribute("data-open"); el("sheet").removeAttribute("data-open"); }
  el("closeSheet").onclick = closeSheet; el("scrim").onclick = closeSheet;
  el("retakeBtn").onclick = function () { retakeMode = true; el("photo").value = ""; el("photo").click(); };
  el("compCount").addEventListener("input", function () { renderCompRows(parseInt(el("compCount").value, 10) || 0, readCompValues()); });
  el("place").addEventListener("input", updateBlockNote);
  el("modeToggle").querySelectorAll(".mbtn").forEach(function (b) { b.onclick = function () { setEntryMode(b.getAttribute("data-m")); }; });
  el("fuelTypeToggle").querySelectorAll(".mbtn").forEach(function (b) { b.onclick = function () { fuelType = b.getAttribute("data-ft"); setFuelTypeUI(); }; });
  el("paidByUser").addEventListener("change", function () { paidByUser = el("paidByUser").checked; });
  el("thumbImg").onclick = function () { if (pendingPhoto) openImg(pendingPhoto); };

  el("entryForm").addEventListener("submit", async function (ev) {
    ev.preventDefault();
    if (saving) return;
    var fuelMode = (selectedCat === "combustible");
    var amtStr = String(el("amount").value).replace(",", ".");
    var amount = parseFloat(amtStr);
    if (fuelMode) { if (amtStr.trim() === "" || isNaN(amount)) amount = 0; }
    if (isNaN(amount) || amount < 0) { toast("Posa un import vàlid"); return; }
    var blk = blockedMatch(el("place").value);
    if (blk) { toast("\"" + blk + "\" envia factura a l'empresa a final de mes. No cal registrar aquest tiquet i no es desa.", { error: true, cross: true, ms: 8000 }); return; }
    var id = el("editId").value;
    // Si és repostatge i l'ha pagat l'usuari, va a Gastos (per reemborsar), però compta per al km.
    var outCat = fuelMode ? (paidByUser ? "gastos" : "combustible") : selectedCat;
    var payload = {
      cat: outCat, amount: Math.round(amount * 100) / 100,
      ticket_no: el("ticket").value.trim(), place: el("place").value.trim(),
      cif: el("cif").value.trim(),
      date: el("date").value || todayStr(),
      companions: selectedCat === "dietes" ? getCompanions() : "",
      notes: el("notes").value.trim(),
      litres: el("litres").value
    };
    if (fuelMode) { payload.plate = el("fuelPlate").value.trim().toUpperCase(); payload.fuelType = fuelType; payload.paidByUser = paidByUser; }
    // foto nova per pujar (només si és dataURL, no una URL existent)
    if (pendingPhoto && pendingPhoto.indexOf("data:") === 0) payload.photoBase64 = pendingPhoto.split(",")[1];

    function unlockBtn() { saving = false; el("saveBtn").disabled = false; el("saveBtn").textContent = "Desa el registre"; }
    saving = true; el("saveBtn").disabled = true; el("saveBtn").textContent = "Desant…";
    function showErr(e) {
      if (e && e.data && e.data.duplicate) {
        var of = e.data.of || {};
        toast("Tiquet duplicat: ja registrat" + (of.user ? " per " + of.user : "") + (of.date ? " el " + String(of.date).slice(0, 10) : "") + ". No es desa.", { error: true, cross: true, ms: 7500 });
      } else if (e && e.data && e.data.companionSameDup) {
        toast("Has posat l'acompanyant \"" + e.data.name + "\" dues vegades en aquest mateix tiquet. Treu-ne un.", { error: true, cross: true, ms: 7000 });
      } else toast(e.message, { error: true });
    }
    try {
      var res;
      if (id) { payload.id = id; res = await api("/api/tickets", "PUT", payload); }
      else res = await api("/api/tickets", "POST", payload);
      await loadEntries();
      pendingPhoto = null; closeSheet(); render(); if (el("kmSheet").getAttribute("data-open") === "true") renderKm();
      var okMsg = id ? "Registre actualitzat" : (res && res.emailed ? "Desat i enviat per correu" : "Desat" + (res && res.emailReason ? " — correu no enviat: " + res.emailReason : ""));
      toast(okMsg);
      if (selectedCat === "dietes" && res && res.id) { var saved = entries.filter(function (x) { return x.id === (id || res.id); })[0]; if (saved && saved.compFlag) toast("👥 Un acompanyant ja consta en un altre tiquet d'avui. Un administrador ho ha de validar.", { error: true, ms: 7500 }); }
      if (isLateDate(payload.date)) toast("⚠️ Aquest tiquet és fora de termini (correspon a un mes ja tancat). Quedarà marcat en vermell.", { error: true, ms: 7500 });
    } catch (e) { showErr(e); }
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
    if (lang === "es") applyLang();
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
  function companionsCount(s) { return String(s || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean).length; }
  function dietaAvg(e) { var people = companionsCount(e.companions) + 1; return people > 0 ? Number(e.amount) / people : Number(e.amount); }
  function dietaOverLimit(e) { return e.cat === "dietes" && cfg.menuMax > 0 && dietaAvg(e) > cfg.menuMax + 1e-9; }
  function rowFlag(e) { return dietaOverLimit(e) ? "red" : ((e.lateMonth === "entry") ? "orange" : null); }
  function rowAllExp(e) { var f = e.cif ? (e.ticket || "") : "", t = e.cif ? "" : (e.ticket || ""); return [e.date, e.user, f, t, (CATS[e.cat] ? CATS[e.cat].label : e.cat), e.place || "", Number(e.amount), e.companions || "", e.notes || ""]; }
  function rowUserExp(e) { var f = e.cif ? (e.ticket || "") : "", t = e.cif ? "" : (e.ticket || ""); return [e.date, f, t, (CATS[e.cat] ? CATS[e.cat].label : e.cat), e.place || "", Number(e.amount), e.companions || "", e.notes || ""]; }
  function dlBlob(blob, filename) { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); }
  function loadImageSize(dataUrl) {
    return new Promise(function (res) {
      if (!dataUrl) { res(null); return; }
      var img = new Image();
      img.onload = function () { res({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height }); };
      img.onerror = function () { res(null); };
      img.src = dataUrl;
    });
  }
  function safeSheet(name, used) {
    var s = String(name || "Usuari").replace(/[\\\/\?\*\[\]:]/g, " ").trim().slice(0, 28) || "Usuari";
    var base = s, n = 2; while (used[s.toLowerCase()]) { s = base.slice(0, 25) + " " + n; n++; } used[s.toLowerCase()] = 1; return s;
  }

  async function xlsxCtx() {
    var headerARGB = (cfg.color && /^#?[0-9a-fA-F]{6}$/.test(cfg.color)) ? "FF" + cfg.color.replace("#", "").toUpperCase() : "FF2E3338";
    var wb = new ExcelJS.Workbook();
    var logoId = null;
    if (cfg.logo && cfg.logo.indexOf("data:") === 0) {
      try { var ext = (cfg.logo.substring(5, cfg.logo.indexOf(";")) || "image/png").split("/")[1] || "png"; logoId = wb.addImage({ base64: cfg.logo, extension: ext }); } catch (e) { logoId = null; }
    }
    var logoSize = await loadImageSize(cfg.logo);
    var logoExt = { width: 100, height: 60 };
    if (logoSize && logoSize.w && logoSize.h) {
      var aspect = logoSize.w / logoSize.h, h = Math.min(logoSize.h * 2, 180), w = h * aspect;
      if (w > 300) { w = 300; h = w / aspect; }
      logoExt = { width: Math.round(w * 2 / 3), height: Math.round(h * 2 / 3) };
    }
    var thin = { style: "thin", color: { argb: "FFDDDDDD" } };
    return { wb: wb, logoId: logoId, logoExt: logoExt, logoRows: Math.max(2, Math.ceil(logoExt.height / 20)), headerARGB: headerARGB, thin: thin, borderAll: { top: thin, bottom: thin, left: thin, right: thin } };
  }
  function xlsxTop(ws, ctx, header, title, withLogo) {
    var hr = 1;
    if (withLogo && ctx.logoId != null) {
      for (var rr = 1; rr <= ctx.logoRows; rr++) ws.getRow(rr).height = 20;
      try { ws.addImage(ctx.logoId, { tl: { col: 0, row: 0 }, ext: { width: ctx.logoExt.width, height: ctx.logoExt.height } }); } catch (e) { }
      var startCol = 2, acc = 0;
      for (var ci = 1; ci <= header.length; ci++) { acc += (ws.getColumn(ci).width || 10) * 7; if (acc >= ctx.logoExt.width + 12) { startCol = ci + 1; break; } }
      if (startCol > header.length) startCol = header.length; if (startCol < 2) startCol = 2;
      ws.mergeCells(1, startCol, ctx.logoRows, header.length);
      var tc = ws.getCell(1, startCol); tc.value = title || ""; tc.font = { bold: true, size: 20 }; tc.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      hr = ctx.logoRows + 1;
    } else if (title) {
      ws.getRow(1).height = 36;
      ws.mergeCells(1, 1, 1, header.length);
      var tc2 = ws.getCell(1, 1); tc2.value = title; tc2.font = { bold: true, size: 24 }; tc2.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      hr = 2;
    }
    var headRow = ws.getRow(hr);
    header.forEach(function (h, i) { var c = headRow.getCell(i + 1); c.value = h; c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ctx.headerARGB } }; c.alignment = { vertical: "middle", horizontal: "center", wrapText: true }; c.border = ctx.borderAll; });
    headRow.height = 24;
    ws.autoFilter = { from: { row: hr, column: 1 }, to: { row: hr, column: header.length } };
    ws.views = [{ state: "frozen", ySplit: hr }];
    return hr;
  }
  function xlsxRow(ws, ctx, ri, values, header, euroCol) {
    var row = ws.getRow(ri);
    values.forEach(function (v, ci) { var c = row.getCell(ci + 1); c.value = v; c.border = ctx.borderAll; c.alignment = { vertical: "middle", wrapText: (ci + 1 === header.length) }; if (euroCol && ci + 1 === euroCol) { c.numFmt = '#,##0.00" €"'; c.alignment = { horizontal: "right" }; } });
    return row;
  }
  function xlsxFlatSheet(ctx, name, header, widths, rows, euroCol, title, withLogo, addTotal, rowFlags) {
    var ws = ctx.wb.addWorksheet(name);
    ws.columns = widths.map(function (w) { return { width: w }; });
    var hr = xlsxTop(ws, ctx, header, title, withLogo);
    rows.forEach(function (r, ri) {
      var row = xlsxRow(ws, ctx, hr + 1 + ri, r, header, euroCol);
      var fl = rowFlags && rowFlags[ri];
      if (fl) {
        var bg = (fl === "orange") ? "FFFFF0D8" : (fl === "violet" ? "FFEEE4F6" : "FFFCE4E2");
        var fg = (fl === "orange") ? "FFA5670A" : (fl === "violet" ? "FF6B3EA3" : "FFC0271E");
        for (var ci = 1; ci <= header.length; ci++) { row.getCell(ci).fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } }; }
        if (euroCol) { var ec = row.getCell(euroCol); ec.font = { bold: true, color: { argb: fg } }; }
      }
    });
    if (addTotal && euroCol) {
      var total = rows.reduce(function (s, r) { return s + (Number(r[euroCol - 1]) || 0); }, 0);
      var tr = ws.getRow(hr + 1 + rows.length);
      for (var ci = 1; ci <= header.length; ci++) { var c = tr.getCell(ci); c.border = { top: { style: "medium" }, bottom: ctx.thin, left: ctx.thin, right: ctx.thin }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0EEE7" } }; c.font = { bold: true }; }
      tr.getCell(1).value = "TOTAL"; tr.getCell(euroCol).value = total; tr.getCell(euroCol).numFmt = '#,##0.00" €"'; tr.getCell(euroCol).alignment = { horizontal: "right" };
    }
    return ws;
  }
  // Full agrupat per matrícula amb subtotals i total general (per al km).
  function xlsxKmUserSheet(ctx, name, title, groups) {
    var header = ["Data", "Tipus", "Gasolinera", "Litres", "Import", "Pagat"];
    var ws = ctx.wb.addWorksheet(name);
    ws.columns = [{ width: 13 }, { width: 12 }, { width: 40 }, { width: 12 }, { width: 14 }, { width: 12 }];
    var hr = xlsxTop(ws, ctx, header, title, true);
    var LIT = 4, IMP = 5;
    var ri = hr + 1, gL = 0, gC = 0, gKm = 0;
    function bandRow(r, txt, litres, cost, argb, top) {
      ws.mergeCells(r, 1, r, 3); var c1 = ws.getCell(r, 1); c1.value = txt; c1.font = { bold: true };
      for (var ci = 1; ci <= header.length; ci++) { var c = ws.getCell(r, ci); c.font = { bold: true }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb } }; c.border = top ? { top: { style: "medium" }, bottom: ctx.thin, left: ctx.thin, right: ctx.thin } : ctx.borderAll; }
      if (litres != null) { ws.getCell(r, LIT).value = Number(litres.toFixed(2)); ws.getCell(r, LIT).alignment = { horizontal: "right" }; }
      if (cost != null) { ws.getCell(r, IMP).value = Number(cost.toFixed(2)); ws.getCell(r, IMP).numFmt = '#,##0.00" €"'; ws.getCell(r, IMP).alignment = { horizontal: "right" }; }
    }
    groups.forEach(function (g) {
      ws.mergeCells(ri, 1, ri, header.length); var gc = ws.getCell(ri, 1); gc.value = "Matrícula: " + (g.label || "(sense matrícula)"); gc.font = { bold: true };
      for (var ci = 1; ci <= header.length; ci++) { var c = ws.getCell(ri, ci); c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEDEAE1" } }; c.border = ctx.borderAll; c.font = { bold: true }; }
      ri++;
      g.rows.forEach(function (row) { var rr = xlsxRow(ws, ctx, ri, row.cells, header, IMP); if (row.paid) { for (var ci = 1; ci <= header.length; ci++) rr.getCell(ci).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEE4F6" } }; } ri++; });
      bandRow(ri, "Subtotal · Km: " + fmt(g.km, 0) + " · " + fmt(g.km > 0 ? g.litres / g.km * 100 : 0, 2) + " L/100km", g.litres, g.cost, "FFF6F4EE", false);
      ri += 2;
      gL += g.litres; gC += g.cost; gKm += g.km;
    });
    bandRow(ri, "TOTAL GENERAL · Km: " + fmt(gKm, 0) + " · " + fmt(gKm > 0 ? gL / gKm * 100 : 0, 2) + " L/100km", gL, gC, "FFF0EEE7", true);
  }

  async function buildConsultaXlsx(list) {
    var ctx = await xlsxCtx();
    var headerAll = ["Data", "Usuari", "Número de factura", "Número tiquet", "Tipus de gasto", "Restaurant/Proveïdor", "Import", "Acompanyants", "Observacions"];
    xlsxFlatSheet(ctx, "Consulta", headerAll, [13, 24, 18, 16, 15, 34, 13, 28, 40], list.map(rowAllExp), 7, null, false, true, list.map(rowFlag));
    var byUser = {}, order = [];
    list.forEach(function (e) { if (!byUser[e.userId]) { byUser[e.userId] = []; order.push(e.userId); } byUser[e.userId].push(e); });
    var headerU = ["Data", "Número de factura", "Número tiquet", "Tipus de gasto", "Restaurant/Proveïdor", "Import", "Acompanyants", "Observacions"];
    var used = { "consulta": 1 };
    order.forEach(function (uid) {
      var nm = byUser[uid][0].user || "Usuari";
      xlsxFlatSheet(ctx, safeSheet(nm, used), headerU, [13, 18, 16, 15, 34, 13, 28, 40], byUser[uid].map(rowUserExp), 6, "Despeses\n" + nm, true, true, byUser[uid].map(rowFlag));
    });
    var buf = await ctx.wb.xlsx.writeBuffer();
    dlBlob(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "consulta.xlsx");
  }

  function buildConsultaXlsxPlain(list) {
    var wb = XLSX.utils.book_new();
    var headerAll = ["Data", "Usuari", "Número de factura", "Número tiquet", "Tipus de gasto", "Restaurant/Proveïdor", "Import", "Acompanyants", "Observacions"];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headerAll].concat(list.map(rowAllExp))), "Consulta");
    var byUser = {}, order = [];
    list.forEach(function (e) { if (!byUser[e.userId]) { byUser[e.userId] = []; order.push(e.userId); } byUser[e.userId].push(e); });
    var headerU = ["Data", "Número de factura", "Número tiquet", "Tipus de gasto", "Restaurant/Proveïdor", "Import", "Acompanyants", "Observacions"];
    var used = { "consulta": 1 };
    order.forEach(function (uid) {
      var nm = byUser[uid][0].user || "Usuari";
      var rows = byUser[uid].map(rowUserExp);
      var total = rows.reduce(function (s, r) { return s + (Number(r[5]) || 0); }, 0);
      var aoa = [headerU].concat(rows); aoa.push(["TOTAL", "", "", "", "", Number(total.toFixed(2)), "", ""]);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), safeSheet(nm, used));
    });
    XLSX.writeFile(wb, "consulta.xlsx");
  }

  async function exportXlsx() {
    var list = computeConsulta();
    if (!list.length) { toast("No hi ha registres per exportar"); return; }
    var pend = admin ? list.filter(function (e) { return !e.accounted; }).map(function (e) { return e.id; }) : [];
    var doLock = false;
    if (pend.length) doLock = confirm("S'exportaran " + list.length + " registres.\n\nVols marcar-los com a VALIDATS? Quedaran bloquejats i els usuaris ja no els podran modificar. (" + pend.length + " pendents)");
    try {
      if (typeof ExcelJS !== "undefined") await buildConsultaXlsx(list);
      else if (typeof XLSX !== "undefined") buildConsultaXlsxPlain(list);
      else { toast("No s'ha pogut carregar l'exportador"); return; }
      toast("Excel generat");
    } catch (e) { toast("No s'ha pogut generar l'Excel", { error: true }); return; }
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
  var km = { users: [], from: "", to: "", group: false, plate: "" };
  var kmUserQuery = "";
  function openKm() {
    kmUserQuery = ""; km.plate = "";
    if (!km.from || !km.to) { var d = new Date(); var p = function (n) { return (n < 10 ? "0" : "") + n; }; var y = d.getFullYear(), m = d.getMonth(); km.from = y + "-" + p(m + 1) + "-01"; var last = new Date(y, m + 1, 0); km.to = y + "-" + p(m + 1) + "-" + p(last.getDate()); }
    renderKm(); el("kmScrim").setAttribute("data-open", "true"); el("kmSheet").setAttribute("data-open", "true");
  }
  function closeKm() { el("kmScrim").removeAttribute("data-open"); el("kmSheet").removeAttribute("data-open"); }
  el("closeKm").onclick = closeKm; el("kmScrim").onclick = closeKm;
  function fmt(n, d) { return (n || 0).toLocaleString("ca-ES", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function dayNum(s) { var p = String(s).split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000; }
  function addDay(s, n) { var d = new Date((dayNum(s) + n) * 86400000); return d.toISOString().slice(0, 10); }
  function maxD(a, b) { return a > b ? a : b; }
  function minD(a, b) { return a < b ? a : b; }
  function monthLabel(ym) { var y = ym.slice(0, 4), m = +ym.slice(5, 7); var s = months()[m - 1] + " " + y; return s.charAt(0).toUpperCase() + s.slice(1); }
  function firstDay(ym) { return ym + "-01"; }
  function nextMonthFirst(ym) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7) + 1; if (m > 12) { m = 1; y++; } return y + "-" + String(m).padStart(2, "0") + "-01"; }
  function monthsBetween(fy, ty) { var out = [], y = +fy.slice(0, 4), m = +fy.slice(5, 7), ey = +ty.slice(0, 4), em = +ty.slice(5, 7), g = 0; while ((y < ey || (y === ey && m <= em)) && g < 600) { out.push(y + "-" + String(m).padStart(2, "0")); m++; if (m > 12) { m = 1; y++; } g++; } return out; }

  function readingsOf(userId, plate) { return readings.filter(function (r) { return r.userId === userId && r.km != null && (r.plate || "") === plate; }).slice().sort(function (a, b) { return dayNum(a.date) - dayNum(b.date); }); }
  function kmAt(userId, plate, dateStr) {
    var r = readingsOf(userId, plate);
    if (!r.length) return null;
    if (r.length === 1) return r[0].km;
    var t = dayNum(dateStr);
    // No s'extrapola: abans de la primera lectura val la primera; després de l'última val l'última.
    if (t <= dayNum(r[0].date)) return r[0].km;
    if (t >= dayNum(r[r.length - 1].date)) return r[r.length - 1].km;
    for (var i = 0; i < r.length - 1; i++) { var d0 = dayNum(r[i].date), d1 = dayNum(r[i + 1].date); if (t >= d0 && t <= d1) { var f = (t - d0) / ((d1 - d0) || 1); return r[i].km + (r[i + 1].km - r[i].km) * f; } }
    return r[r.length - 1].km;
  }
  function platesForUser(userId) {
    var set = {}, out = [];
    readings.forEach(function (r) { if (r.userId === userId && r.km != null) { var p = r.plate || ""; if (!(p in set)) { set[p] = 1; out.push(p); } } });
    return out;
  }
  function distanceForUserPlate(userId, plate, from, toExcl) {
    var kf = kmAt(userId, plate, from), kt = kmAt(userId, plate, toExcl);
    return (kf != null && kt != null) ? Math.max(0, kt - kf) : 0;
  }
  function distanceFor(scope, from, toExcl) {
    var total = 0;
    scope.forEach(function (uid) {
      var plates = km.plate ? [km.plate] : platesForUser(uid);
      plates.forEach(function (p) { total += distanceForUserPlate(uid, p, from, toExcl); });
    });
    return total;
  }
  function scopeUsers() { if (!admin) return [me.id]; if (km.users.length) return km.users.slice(); return roster.map(function (u) { return u.id; }); }
  function fuelInRange(scope, a, b) { return entries.filter(function (e) { return isFuel(e) && scope.indexOf(e.userId) >= 0 && e.date >= a && e.date <= b && (!km.plate || (e.plate || "") === km.plate); }); }
  function platesInScope() {
    var scope = scopeUsers(), set = {}, out = [];
    entries.forEach(function (e) { if (isFuel(e) && scope.indexOf(e.userId) >= 0) { var p = e.plate || ""; if (!(p in set)) { set[p] = 1; out.push(p); } } });
    readings.forEach(function (r) { if (scope.indexOf(r.userId) >= 0) { var p = r.plate || ""; if (!(p in set)) { set[p] = 1; out.push(p); } } });
    return out.sort();
  }
  function litresSum(l) { return l.reduce(function (s, e) { return s + (fuelTypeOf(e) === "gasoil" ? (e.litres || 0) : 0); }, 0); }
  function adblueSum(l) { return l.reduce(function (s, e) { return s + (fuelTypeOf(e) === "adblue" ? (e.litres || 0) : 0); }, 0); }
  function costSum(l) { return l.reduce(function (s, e) { return s + (e.amount || 0); }, 0); }
  function rangeBounds() {
    var scope = scopeUsers(), dates = [], today = todayStr();
    entries.forEach(function (e) { if (isFuel(e) && scope.indexOf(e.userId) >= 0) dates.push(e.date); });
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
    var dist = monthlyRows().reduce(function (s, r) { return s + r.dist; }, 0);
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
  function detailTable(list, showUser, dist) {
    var head = '<tr><th>Data</th>' + (showUser ? '<th>Usuari</th>' : '') + '<th>Matrícula</th><th class="num">Litres</th><th class="num">Import</th></tr>';
    var body = list.slice().sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); }).map(function (e) {
      return '<tr><td>' + e.date + '</td>' + (showUser ? '<td>' + esc(e.user) + '</td>' : '') + '<td>' + esc(e.plate || '') + '</td><td class="num">' + (e.litres != null ? fmt(e.litres, 2) : '') + '</td><td class="num">' + eur(e.amount) + '</td></tr>';
    }).join("");
    var lit = litresSum(list), cost = costSum(list), avg = dist > 0 ? lit / dist * 100 : 0;
    var sub = '<tr class="grand"><td colspan="' + (showUser ? 3 : 2) + '">TOTAL · Km: ' + fmt(dist, 0) + ' · ' + fmt(avg, 2) + ' L/100km</td><td class="num">' + fmt(lit, 2) + '</td><td class="num">' + eur(cost) + '</td></tr>';
    return '<table class="rep">' + head + body + sub + '</table>';
  }
  function reportDetailed() {
    var scope = scopeUsers(), b = rangeBounds();
    var list = fuelInRange(scope, b.from, b.to);
    var dist = distanceFor(scope, b.from, addDay(b.to, 1));
    if (!list.length && dist <= 0) return '<p style="color:var(--muted)">Sense dades.</p>';
    return detailTable(list, true, dist);
  }
  function reportGrouped() {
    var scope = scopeUsers(), b = rangeBounds(), html = "";
    scope.forEach(function (uid) {
      var userFuel = fuelInRange([uid], b.from, b.to);
      var plates = km.plate ? [km.plate] : platesForUser(uid).slice();
      var fp = {}; userFuel.forEach(function (e) { fp[e.plate || ""] = 1; });
      Object.keys(fp).forEach(function (p) { if (plates.indexOf(p) < 0) plates.push(p); });
      var uHtml = "", any = false;
      plates.sort().forEach(function (p) {
        var list = userFuel.filter(function (e) { return (e.plate || "") === p; });
        var dist = distanceForUserPlate(uid, p, b.from, addDay(b.to, 1));
        if (!list.length && dist <= 0) return;
        any = true;
        uHtml += '<div class="rep-group-title" style="font-size:13px;margin:10px 0 4px;color:var(--muted)">' + esc(p || "(sense matrícula)") + '</div>' + detailTable(list, false, dist);
      });
      if (any) html += '<div class="rep-group-title">' + esc(userName(uid)) + '</div>' + uHtml;
    });
    return html || '<p style="color:var(--muted)">Sense dades.</p>';
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
    tags.querySelectorAll("[data-rem]").forEach(function (b) { b.onclick = function () { var id = b.getAttribute("data-rem"); var i = km.users.indexOf(id); if (i >= 0) km.users.splice(i, 1); refreshKmMsel(); renderKmReport(); renderKmLists(); }; });
    list.querySelectorAll(".msel-opt").forEach(function (o) { o.onclick = function () { var id = o.getAttribute("data-id"); var i = km.users.indexOf(id); if (i >= 0) km.users.splice(i, 1); else km.users.push(id); refreshKmMsel(); renderKmReport(); renderKmLists(); }; });
  }
  function renderKmReport() { el("kmReport").innerHTML = (admin && km.group) ? reportGrouped() : reportDetailed(); if (lang === "es") applyLang(); }
  function kmFuelRow(e) {
    var ft = fuelTypeOf(e);
    var typeTag = ft === "adblue" ? ' · AdBlue' : '';
    var paidTag = e.paidByUser ? '<span style="display:inline-block;background:#efe4f6;color:#6b3ea3;font-size:11px;font-weight:800;padding:1px 7px;border-radius:6px;margin-left:6px">pagat usuari</span>' : '';
    return '<div class="fuelrow" data-id="' + e.id + '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;margin-bottom:7px;cursor:pointer' + (e.paidByUser ? ';background:#f7f2fb' : '') + '">' +
      '<div style="min-width:0"><b style="font-size:14px">' + esc(e.place || "Gasolinera") + '</b>' + paidTag + '<div style="font-size:12px;color:var(--muted)">' + e.date + (admin ? " · " + esc(e.user) : "") + (e.plate ? " · " + esc(e.plate) : "") + typeTag + '</div></div>' +
      '<div style="text-align:right;white-space:nowrap"><div style="font-family:var(--mono);font-weight:700">' + (e.litres != null ? fmt(e.litres, 2) + " L" : "") + '</div><div style="font-size:12px;color:var(--muted)">' + (e.amount ? eur(e.amount) : "") + '</div></div></div>';
  }
  function kmReadRow(r) {
    return '<div class="readrow" data-id="' + r.id + '" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;margin-bottom:7px;cursor:pointer">' +
      '<div style="min-width:0"><b style="font-size:14px">' + monthLabel(r.ym) + '</b><div style="font-size:12px;color:var(--muted)">' + r.date + (r.plate ? " · " + esc(r.plate) : "") + (admin ? " · " + esc(r.user) : "") + '</div></div>' +
      '<div style="font-family:var(--mono);font-weight:700;white-space:nowrap">' + fmt(r.km, 0) + ' km</div></div>';
  }
  function renderKmLists() {
    if (!el("kmFuelList")) return;
    var scope = scopeUsers();
    function inRange(d) { return (!km.from || d >= km.from) && (!km.to || d <= km.to); }
    var fuel = entries.filter(function (e) { return isFuel(e) && scope.indexOf(e.userId) >= 0 && (!km.plate || (e.plate || "") === km.plate) && inRange(e.date); }).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    el("kmFuelList").innerHTML = '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:4px 0 6px">Repostatges <span>(' + fuel.length + ')</span></label>' +
      (fuel.length ? fuel.slice(0, 120).map(kmFuelRow).join("") : '<p style="font-size:13px;color:var(--muted);margin:0 0 8px">Cap repostatge.</p>');
    el("kmFuelList").querySelectorAll(".fuelrow").forEach(function (r) { r.onclick = function () { openSheet(r.getAttribute("data-id")); }; });
    var reads = readings.filter(function (r) { return scope.indexOf(r.userId) >= 0 && (!km.plate || (r.plate || "") === km.plate) && inRange(r.date); }).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    el("kmReadsList").innerHTML = '<div style="height:1px;background:var(--line);margin:16px 0"></div><label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Lectures de km · toca per editar <span>(' + reads.length + ')</span></label>' +
      (reads.length ? reads.slice(0, 150).map(kmReadRow).join("") : '<p style="font-size:13px;color:var(--muted);margin:0 0 8px">Cap lectura.</p>');
    el("kmReadsList").querySelectorAll(".readrow").forEach(function (r) { r.onclick = function () { openReadEdit(r.getAttribute("data-id")); }; });
    if (lang === "es") applyLang();
  }
  function renderKm() {
    var addBtns = '<div class="actions" style="margin-bottom:12px"><button type="button" class="btn-primary" id="fuAddPhoto"><span class="cam">📷</span> Repostatge (foto)</button><button type="button" class="btn-ghost" id="fuAddManual" style="flex:0 0 auto;width:auto;padding:14px 18px">Sense foto</button></div>' +
      '<button type="button" class="btn-ghost" id="kmAddRead" style="width:100%;margin-bottom:12px">📋 Apuntar lectura de km</button>';
    var dateFilter =
      '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin:2px 0 6px">Filtra per dates</label>' +
      '<div class="grid2" style="margin-top:2px"><div class="field"><label for="kmFrom">Des de</label><input id="kmFrom" type="date" value="' + esc(km.from) + '"></div>' +
      '<div class="field"><label for="kmTo">Fins a</label><input id="kmTo" type="date" value="' + esc(km.to) + '"></div></div>';
    var filters = "";
    if (admin) {
      filters =
        '<label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Usuaris</label>' +
        '<div class="msel"><div class="msel-tags" id="kmUserTags"></div><input id="kmUserSearch" type="text" placeholder="Cerca usuari…" autocomplete="off"><div class="msel-list" id="kmUserList"></div></div>' +
        dateFilter +
        '<label style="display:flex;align-items:center;gap:9px;font-size:15px;font-weight:600;margin:2px 0 12px;cursor:pointer"><input type="checkbox" id="kmGroup"' + (km.group ? " checked" : "") + ' style="width:20px;height:20px"> Agrupar i sumar per usuari</label>';
    } else {
      filters = dateFilter;
    }
    var actions = '<div class="actions" style="margin-top:14px"><button type="button" class="btn-primary" id="kmXls">Exportar a Excel</button><button type="button" class="btn-danger" id="kmPrint" style="border-color:var(--line);color:var(--ink-soft)">Imprimir</button></div>';
    var note = '<p style="font-size:12px;color:var(--muted);margin:10px 0 0">El símbol ~ indica un mes amb km estimats (filtre no complet o falten lectures). Els km surten de les lectures mensuals del comptador.</p>';
    var sep = '<div style="height:1px;background:var(--line);margin:16px 0"></div><label style="display:block;font-size:12px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:8px">Informe de km i consum</label>';
    var plates = platesInScope();
    var plateSel = plates.length ? ('<div class="field"><label for="kmPlate">Matrícula</label><select id="kmPlate"><option value="">Totes les matrícules</option>' + plates.map(function (p) { return '<option value="' + esc(p) + '"' + (km.plate === p ? ' selected' : '') + '>' + (p ? esc(p) : '(sense matrícula)') + '</option>'; }).join("") + '</select></div>') : '';
    el("kmBody").innerHTML = addBtns + filters + plateSel + '<div id="kmFuelList"></div>' + sep + '<div class="repwrap" id="kmReport"></div>' + note + actions + '<div id="kmReadsList"></div>';
    renderKmReport();
    renderKmLists();

    el("fuAddPhoto").onclick = function () { pendingFuel = true; retakeMode = false; pendingPhoto = null; closeKm(); el("photo").value = ""; el("photo").click(); };
    el("fuAddManual").onclick = function () { pendingFuel = true; pendingPhoto = null; closeKm(); openSheetNew(null, false); };
    el("kmAddRead").onclick = function () { openRead(); };
    var kp = el("kmPlate"); if (kp) kp.onchange = function () { km.plate = kp.value; renderKmReport(); renderKmLists(); };

    var kf = el("kmFrom"); if (kf) kf.onchange = function () { km.from = kf.value; renderKmReport(); renderKmLists(); };
    var kt = el("kmTo"); if (kt) kt.onchange = function () { km.to = kt.value; renderKmReport(); renderKmLists(); };
    if (admin) {
      var us = el("kmUserSearch"); if (us) us.oninput = function () { kmUserQuery = us.value; refreshKmMsel(); };
      el("kmGroup").onchange = function () { km.group = el("kmGroup").checked; renderKmReport(); };
      refreshKmMsel();
    }
    el("kmXls").onclick = exportKm;
    el("kmPrint").onclick = printKm;
    if (lang === "es") applyLang();
  }
  function printKm() {
    el("printArea").innerHTML = '<h2>Informe de km i combustible</h2>' + ((admin && km.group) ? reportGrouped() : reportDetailed());
    window.print();
  }
  async function exportKm() {
    var scope = scopeUsers(), b = rangeBounds();
    var fuel = fuelInRange(scope, b.from, b.to);
    if (!fuel.length && !readings.length) { toast("No hi ha registres per exportar"); return; }
    try {
      if (typeof ExcelJS !== "undefined") await buildKmXlsx(scope, b);
      else if (typeof XLSX !== "undefined") buildKmXlsxPlain(scope, b);
      else { toast("No s'ha pogut carregar l'exportador"); return; }
      toast("Excel generat");
    } catch (e) { toast("No s'ha pogut generar l'Excel", { error: true }); }
  }
  async function buildKmXlsx(scope, b) {
    var ctx = await xlsxCtx();
    var mens = [];
    monthlyRows().forEach(function (r) { mens.push([monthLabel(r.ym) + (r.estimated ? " (~)" : ""), Number(r.dist.toFixed(0)), Number(r.litres.toFixed(2)), Number(r.avg.toFixed(2)), Number(r.cost.toFixed(2))]); });
    var t = totalsFor(scope); mens.push(["TOTAL", Number(t.dist.toFixed(0)), Number(t.litres.toFixed(2)), Number(t.avg.toFixed(2)), Number(t.cost.toFixed(2))]);
    xlsxFlatSheet(ctx, "Resum mensual", ["Mes", "Km", "Litres", "Consum (L/100km)", "Cost (€)"], [22, 12, 12, 20, 14], mens, 5, null, false, false);

    var usr = [];
    scope.forEach(function (uid) {
      var uf = fuelInRange([uid], b.from, b.to);
      var pl = km.plate ? [km.plate] : platesForUser(uid).slice();
      var fp = {}; uf.forEach(function (e) { fp[e.plate || ""] = 1; }); Object.keys(fp).forEach(function (p) { if (pl.indexOf(p) < 0) pl.push(p); });
      pl.sort().forEach(function (p) { var list = uf.filter(function (e) { return (e.plate || "") === p; }); var d = distanceForUserPlate(uid, p, b.from, addDay(b.to, 1)); var lit = litresSum(list), cost = costSum(list); if (d > 0 || lit > 0) usr.push([userName(uid), p || "", Number(d.toFixed(0)), Number(lit.toFixed(2)), Number((d > 0 ? lit / d * 100 : 0).toFixed(2)), Number(cost.toFixed(2))]); });
    });
    xlsxFlatSheet(ctx, "Per usuari", ["Usuari", "Matrícula", "Km", "Litres", "Consum (L/100km)", "Cost (€)"], [26, 16, 12, 12, 20, 14], usr, 6, null, false, false);

    var lects = readings.filter(function (r) { return scope.indexOf(r.userId) >= 0 && (!km.plate || (r.plate || "") === km.plate); }).slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; }).map(function (r) { return [monthLabel(r.ym), r.date, r.user, r.plate || "", r.km != null ? Number(r.km) : ""]; });
    xlsxFlatSheet(ctx, "Lectures km", ["Mes", "Data", "Usuari", "Matrícula", "Km"], [20, 14, 26, 16, 12], lects, null, null, false, false);

    var detFuel = fuelInRange(scope, b.from, b.to).slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; });
    var det = detFuel.map(function (e) { return [e.date, e.user, e.plate || "", fuelTypeOf(e) === "adblue" ? "AdBlue" : "Gasoil", e.place || "", e.litres != null ? Number(e.litres) : "", e.amount ? Number(e.amount) : "", e.paidByUser ? "Usuari" : "Empresa"]; });
    xlsxFlatSheet(ctx, "Repostatges", ["Data", "Usuari", "Matrícula", "Tipus", "Gasolinera", "Litres", "Import", "Pagat per"], [13, 22, 16, 12, 40, 12, 14, 12], det, 7, null, false, false, detFuel.map(function (e) { return e.paidByUser ? "violet" : null; }));

    var used = { "resum mensual": 1, "per usuari": 1, "lectures km": 1, "repostatges": 1 };
    scope.forEach(function (uid) {
      var uf = fuelInRange([uid], b.from, b.to);
      var pl = km.plate ? [km.plate] : platesForUser(uid).slice();
      var fp = {}; uf.forEach(function (e) { fp[e.plate || ""] = 1; }); Object.keys(fp).forEach(function (p) { if (pl.indexOf(p) < 0) pl.push(p); });
      var groups = [];
      pl.sort().forEach(function (p) {
        var list = uf.filter(function (e) { return (e.plate || "") === p; }).slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; });
        var d = distanceForUserPlate(uid, p, b.from, addDay(b.to, 1)), lit = litresSum(list), cost = costSum(list);
        if (list.length || d > 0) groups.push({ label: p, km: d, litres: lit, cost: cost, rows: list.map(function (e) { return { cells: [e.date, fuelTypeOf(e) === "adblue" ? "AdBlue" : "Gasoil", e.place || "", e.litres != null ? Number(e.litres) : "", e.amount ? Number(e.amount) : "", e.paidByUser ? "Usuari" : "Empresa"], paid: !!e.paidByUser }; }) });
      });
      if (groups.length) xlsxKmUserSheet(ctx, safeSheet(userName(uid), used), "Combustible\n" + userName(uid), groups);
    });

    var buf = await ctx.wb.xlsx.writeBuffer();
    dlBlob(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "km-combustible.xlsx");
  }
  function buildKmXlsxPlain(scope, b) {
    var det = [["Data", "Usuari", "Matrícula", "Tipus", "Gasolinera", "Litres", "Import", "Pagat per"]].concat(fuelInRange(scope, b.from, b.to).slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; }).map(function (e) { return [e.date, e.user, e.plate || "", fuelTypeOf(e) === "adblue" ? "AdBlue" : "Gasoil", e.place || "", e.litres != null ? Number(e.litres) : "", e.amount ? Number(e.amount) : "", e.paidByUser ? "Usuari" : "Empresa"]; }));
    var mens = [["Mes", "Km", "Litres", "Consum (L/100km)", "Cost (€)"]];
    monthlyRows().forEach(function (r) { mens.push([monthLabel(r.ym) + (r.estimated ? " (~)" : ""), Number(r.dist.toFixed(0)), Number(r.litres.toFixed(2)), Number(r.avg.toFixed(2)), Number(r.cost.toFixed(2))]); });
    var t = totalsFor(scope); mens.push(["TOTAL", Number(t.dist.toFixed(0)), Number(t.litres.toFixed(2)), Number(t.avg.toFixed(2)), Number(t.cost.toFixed(2))]);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mens), "Resum mensual");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(det), "Repostatges");
    var used = { "resum mensual": 1, "repostatges": 1 };
    scope.forEach(function (uid) {
      var uf = fuelInRange([uid], b.from, b.to);
      var pl = km.plate ? [km.plate] : platesForUser(uid).slice();
      var fp = {}; uf.forEach(function (e) { fp[e.plate || ""] = 1; }); Object.keys(fp).forEach(function (p) { if (pl.indexOf(p) < 0) pl.push(p); });
      var aoa = [["Data", "Matrícula", "Gasolinera", "Litres", "Import"]]; var gL = 0, gC = 0, gKm = 0, any = false;
      pl.sort().forEach(function (p) {
        var list = uf.filter(function (e) { return (e.plate || "") === p; }).slice().sort(function (a, c) { return a.date < c.date ? -1 : 1; });
        var d = distanceForUserPlate(uid, p, b.from, addDay(b.to, 1)), lit = litresSum(list), cost = costSum(list);
        if (!list.length && d <= 0) return; any = true;
        list.forEach(function (e) { aoa.push([e.date, p || "", e.place || "", e.litres != null ? Number(e.litres) : "", Number(e.amount)]); });
        aoa.push(["Subtotal " + (p || "(sense)"), "Km " + d.toFixed(0), "", Number(lit.toFixed(2)), Number(cost.toFixed(2))]);
        gL += lit; gC += cost; gKm += d;
      });
      if (any) { aoa.push(["TOTAL GENERAL", "Km " + gKm.toFixed(0), "", Number(gL.toFixed(2)), Number(gC.toFixed(2))]); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), safeSheet(userName(uid), used)); }
    });
    XLSX.writeFile(wb, "km-combustible.xlsx");
  }

  // ---------- Lectura mensual de km + recordatori ----------
  function myActivePlate() { var u = roster.filter(function (x) { return x.id === me.id; })[0]; return (u && u.activePlate) ? u.activePlate : ""; }
  function myHasVehicle() { var u = roster.filter(function (x) { return x.id === me.id; })[0]; return !u || u.hasVehicle !== false; }
  var readEditId = null;
  function openRead() {
    readEditId = null;
    var today = todayStr(); el("readDate").value = today;
    el("readInfo").textContent = "Apunta la lectura del comptador de km del cotxe.";
    el("readDel").style.display = "none";
    if (admin) {
      var uw = el("readUserWrap"); if (uw) uw.style.display = "block";
      var sel = el("readUser");
      if (sel) { sel.innerHTML = roster.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (u) { return '<option value="' + u.id + '"' + (u.id === me.id ? " selected" : "") + '>' + esc(u.name) + '</option>'; }).join(""); sel.onchange = function () { fillPlatesDatalist(sel.value); }; }
      var rpw = el("readPlateWrap"); if (rpw) rpw.style.display = "block";
      var rp = el("readPlate"); if (rp) rp.value = "";
      fillPlatesDatalist(me.id);
      el("readKm").value = "";
    } else {
      var uw2 = el("readUserWrap"); if (uw2) uw2.style.display = "none";
      var rpw2 = el("readPlateWrap"); if (rpw2) rpw2.style.display = "none";
      var rp2 = el("readPlate"); if (rp2) rp2.value = myActivePlate();
      var ym = today.slice(0, 7), ap = myActivePlate();
      var ex = readings.filter(function (r) { return r.userId === me.id && r.ym === ym && (r.plate || "") === ap; })[0];
      el("readKm").value = ex ? ex.km : "";
      fillPlatesDatalist(me.id);
    }
    el("readScrim").setAttribute("data-open", "true"); el("readSheet").setAttribute("data-open", "true");
  }
  function openReadEdit(id) {
    var r = readings.filter(function (x) { return x.id === id; })[0]; if (!r) return;
    readEditId = id;
    el("readKm").value = r.km; el("readDate").value = r.date;
    el("readInfo").textContent = "Lectura" + (admin ? " · " + r.user : "");
    el("readDel").style.display = "";
    var ruw = el("readUserWrap"); if (ruw) ruw.style.display = "none";
    var rp2 = el("readPlate"); if (rp2) rp2.value = r.plate || "";
    var rpw2 = el("readPlateWrap"); if (rpw2) rpw2.style.display = admin ? "block" : "none";
    fillPlatesDatalist(r.userId);
    el("readScrim").setAttribute("data-open", "true"); el("readSheet").setAttribute("data-open", "true");
  }
  function closeRead() { el("readScrim").removeAttribute("data-open"); el("readSheet").removeAttribute("data-open"); }
  el("closeRead").onclick = closeRead; el("readScrim").onclick = closeRead;
  el("readSave").onclick = async function () {
    var v = el("readKm").value;
    if (v === "" || isNaN(Number(v))) { toast("Posa els km", { error: true }); return; }
    try {
      var payload = { km: Number(v), date: el("readDate").value || todayStr() };
      if (readEditId) payload.id = readEditId;
      if (readEditId && admin && el("readPlate")) payload.plate = el("readPlate").value.trim().toUpperCase();
      if (!readEditId && admin) {
        if (el("readUser")) payload.forUserId = el("readUser").value;
        if (el("readPlate")) payload.plate = el("readPlate").value.trim().toUpperCase();
      }
      await api("/api/readings", "POST", payload); await loadReadings(); closeRead(); hideKmReminder();
      if (el("kmSheet").getAttribute("data-open") === "true") renderKm();
      toast("Km desats");
    } catch (e) { toast(e.message, { error: true }); }
  };
  el("readDel").onclick = async function () {
    if (!readEditId) return;
    try { await api("/api/readings?id=" + encodeURIComponent(readEditId), "DELETE"); await loadReadings(); closeRead(); if (el("kmSheet").getAttribute("data-open") === "true") renderKm(); toast("Lectura eliminada"); }
    catch (e) { toast(e.message, { error: true }); }
  };
  function hasReadingThisMonth() { var ym = todayStr().slice(0, 7), ap = myActivePlate(); return readings.some(function (r) { return r.userId === me.id && r.ym === ym && (r.plate || "") === ap; }); }
  function showKmReminder() { if (me && myHasVehicle() && !hasReadingThisMonth()) el("kmReminder").setAttribute("data-show", "true"); }
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
  el("closeStat").onclick = closeStatus; el("statScrim").onclick = closeStatus;
  function renderVeh() {
    var self = !vehTarget;
    var u = roster.filter(function (x) { return x.id === (vehTarget || me.id); })[0];
    var active = (u && u.activePlate) ? u.activePlate : "";
    var main = (u && u.mainPlate) ? u.mainPlate : (vehTmp[0] || "");
    var chips = vehTmp.length ? vehTmp.map(function (p, i) {
      var on = (p === active);
      return '<span class="mtag" data-p="' + esc(p) + '" style="cursor:pointer;' + (on ? 'background:var(--amber)' : '') + '">' + (on ? '★ ' : '') + esc(p) + (p === main ? ' 🏠' : '') + '<b data-i="' + i + '">✕</b></span>';
    }).join("") : '<span style="font-size:13px;color:var(--muted)">Cap vehicle</span>';
    var subActive = self && active && main && active !== main;
    var activeLine = self ? (active ? '<p style="font-size:14px;margin:0 0 4px">Vehicle actiu: <b>' + esc(active) + '</b>' + (subActive ? ' (substitució)' : '') + '</p>' : '<p style="font-size:13px;color:var(--muted);margin:0 0 4px">Cap vehicle actiu</p>') : '';
    var returnBtn = subActive ? '<button type="button" class="btn-primary" id="vehReturn" style="width:100%;margin:6px 0 12px">↩︎ Tornar al vehicle habitual <span>(' + esc(main) + ')</span></button>' : '';
    var mainSel = (self && vehTmp.length) ?
      '<div class="field" style="margin-top:8px"><label for="vehMain">Vehicle habitual</label><select id="vehMain">' +
      vehTmp.map(function (p) { return '<option value="' + esc(p) + '"' + (p === main ? ' selected' : '') + '>' + esc(p) + '</option>'; }).join("") + '</select></div>' : '';
    var actForm = self ?
      '<button type="button" class="btn-ghost" id="vehActivate" style="width:100%;margin-bottom:8px">🔄 Activar vehicle de substitució</button>' +
      '<div id="vehActForm" style="display:none;border:1.5px solid var(--amber);border-radius:12px;padding:12px;margin-bottom:12px">' +
      '<div class="field"><label for="vehActPlate">Matrícula del vehicle</label><input id="vehActPlate" type="text" autocomplete="off" placeholder="Matrícula" style="text-transform:uppercase"></div>' +
      '<div class="field"><label for="vehActKm">Km actuals del comptador</label><input id="vehActKm" type="number" inputmode="numeric" step="1" min="0" placeholder="0"></div>' +
      '<button type="button" class="btn-primary" id="vehActGo" style="width:100%">Activar i desar km</button>' +
      '<p style="font-size:12px;color:var(--muted);margin:8px 0 0">Mentre estigui actiu, tot el que entris s\'assignarà a aquesta matrícula.</p></div>' : '';
    el("vehBody").innerHTML =
      activeLine + returnBtn +
      '<div class="msel-tags" style="margin-bottom:12px">' + chips + '</div>' +
      (self ? '<p style="font-size:12px;color:var(--muted);margin:-4px 0 12px">Toca una matrícula per activar-la. 🏠 = habitual.</p>' : '') +
      '<div style="display:flex;gap:8px;margin-bottom:14px"><input id="vehInput" type="text" placeholder="Matrícula (ex. 1234ABC)" autocomplete="off" style="flex:1;border:1.5px solid var(--line);border-radius:11px;padding:12px 14px;font-size:16px;text-transform:uppercase"><button type="button" class="btn-ghost" id="vehAdd" style="width:auto;padding:12px 18px">Afegir</button></div>' +
      mainSel + actForm +
      '<button type="button" class="btn-primary" id="vehSave" style="width:100%">Desa els vehicles</button>';
    el("vehBody").querySelectorAll("[data-i]").forEach(function (b) { b.onclick = function (ev) { ev.stopPropagation(); vehTmp.splice(+b.getAttribute("data-i"), 1); renderVeh(); }; });
    if (self) el("vehBody").querySelectorAll(".mtag").forEach(function (s) { s.onclick = function () { showActForm(s.getAttribute("data-p")); }; });
    var add = function () { var v = (el("vehInput").value || "").trim().toUpperCase(); if (!v) return; if (vehTmp.indexOf(v) < 0) vehTmp.push(v); el("vehInput").value = ""; renderVeh(); var i = el("vehInput"); if (i) i.focus(); };
    el("vehAdd").onclick = add;
    el("vehInput").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); add(); } });
    if (self) {
      el("vehActivate").onclick = function () { showActForm(""); };
      el("vehActGo").onclick = activateVehicle;
      var rb = el("vehReturn"); if (rb) rb.onclick = function () { showActForm(main); };
      var ms = el("vehMain"); if (ms) ms.onchange = async function () { try { await api("/api/users", "POST", { setMainPlate: ms.value }); await loadRoster(); var u2 = roster.filter(function (x) { return x.id === me.id; })[0]; vehTmp = (u2 && u2.vehicles) ? u2.vehicles.slice() : []; renderVeh(); toast("Vehicle habitual: " + ms.value); } catch (e) { toast(e.message, { error: true }); } };
    }
    el("vehSave").onclick = async function () {
      try { var payload = { setVehicles: vehTmp }; if (vehTarget) payload.id = vehTarget; await api("/api/users", "POST", payload); await loadRoster(); closeVeh(); toast("Vehicles desats"); }
      catch (e) { toast(e.message, { error: true }); }
    };
    if (lang === "es") applyLang();
  }
  function showActForm(plate) {
    var f = el("vehActForm"); if (!f) return;
    f.style.display = "block";
    el("vehActPlate").value = plate || "";
    el("vehActKm").value = "";
    (plate ? el("vehActKm") : el("vehActPlate")).focus();
  }
  async function activateVehicle() {
    var plate = (el("vehActPlate").value || "").trim().toUpperCase();
    var kmv = el("vehActKm").value;
    if (!plate) { toast("Posa la matrícula", { error: true }); return; }
    if (kmv === "" || isNaN(Number(kmv))) { toast("Posa els km", { error: true }); return; }
    try {
      await api("/api/users", "POST", { setActivePlate: plate });
      await api("/api/readings", "POST", { km: Number(kmv) });
      await loadRoster(); await loadReadings();
      var u2 = roster.filter(function (x) { return x.id === me.id; })[0]; vehTmp = (u2 && u2.vehicles) ? u2.vehicles.slice() : [];
      renderVeh(); toast("Vehicle actiu: " + plate);
    } catch (e) { toast(e.message, { error: true }); }
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
