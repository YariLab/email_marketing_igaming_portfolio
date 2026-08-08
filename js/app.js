const TEMPLATES = [
  {
    id: "welcome",
    file: "templates/welcome.html",
    title: "Welcome / Account Active",
    typeKey: "trigger",
  },
  {
    id: "promo-free-spins",
    file: "templates/promo-free-spins.html",
    title: "100 Free Spins Promo",
    typeKey: "promo",
  },
  {
    id: "weekend-reload",
    file: "templates/weekend-reload.html",
    title: "Weekend Reload 50%",
    typeKey: "promo",
  },
  {
    id: "vip-upgrade",
    file: "templates/vip-upgrade.html",
    title: "Gold VIP Upgrade",
    typeKey: "trigger",
  },
  {
    id: "winback",
    file: "templates/winback.html",
    title: "Win-back: We've Missed You",
    typeKey: "winback",
  },
  {
    id: "new-slot",
    file: "templates/new-slot.html",
    title: "New Slot Launch",
    typeKey: "info",
  },
  {
    id: "cashback",
    file: "templates/cashback.html",
    title: "Weekly Cashback",
    typeKey: "trigger",
  },
  {
    id: "holiday",
    file: "templates/holiday.html",
    title: "12 Days of Bonuses",
    typeKey: "seasonal",
  },
];

const DEFAULT_MERGE = {
  first_name: "Yaroslav",
  bonus_amount: "$200",
  cashback_amount: "$47.50",
  min_deposit: "$20",
  spin_value: "$0.20",
  promo_code: "BOGACH100",
  vip_tier: "Gold VIP",
  cashback_rate: "10%",
  holiday_day: "7",
  wagering: "35",
  expiry_date: "15 Aug 2026",
  cta_url: "https://example.com/play",
  unsubscribe_url: "https://example.com/unsubscribe",
  preferences_url: "https://example.com/preferences",
};

const state = {
  activeId: TEMPLATES[0].id,
  view: "desktop",
  lang: getLang(),
  merge: { ...DEFAULT_MERGE },
  rawHtml: "",
};

const listEl = document.getElementById("template-list");
const frameEl = document.getElementById("preview-frame");
const frameWrapEl = document.getElementById("preview-frame-wrap");
const activeTitleEl = document.getElementById("active-title");
const activeMetaEl = document.getElementById("active-meta");
const toastEl = document.getElementById("toast");
const modalEl = document.getElementById("generator-modal");

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function applyMergeTags(html, data) {
  return html.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      return String(data[key]);
    }
    return `{{${key}}}`;
  });
}

function getTemplateMeta(tpl) {
  return {
    type: templateType(tpl.typeKey, state.lang),
    desc: templateDesc(tpl.id, state.lang),
  };
}

function renderList() {
  listEl.innerHTML = TEMPLATES.map((tpl) => {
    const active = tpl.id === state.activeId ? "active" : "";
    const meta = getTemplateMeta(tpl);
    return `
      <li>
        <button type="button" class="template-btn ${active}" data-id="${tpl.id}">
          <strong>${tpl.title}</strong>
          <span>${meta.desc}</span>
          <span class="tag">${meta.type}</span>
        </button>
      </li>
    `;
  }).join("");
}

function refreshActiveMeta() {
  const tpl = TEMPLATES.find((item) => item.id === state.activeId) || TEMPLATES[0];
  const meta = getTemplateMeta(tpl);
  activeTitleEl.textContent = tpl.title;
  activeMetaEl.textContent = `${meta.type} · ${tpl.file}`;
}

async function loadTemplate(id) {
  const tpl = TEMPLATES.find((item) => item.id === id) || TEMPLATES[0];
  state.activeId = tpl.id;
  refreshActiveMeta();
  renderList();

  const res = await fetch(tpl.file);
  if (!res.ok) {
    throw new Error(`${t("toastLoadFail", state.lang)} ${tpl.file}`);
  }
  state.rawHtml = await res.text();
  paintPreview();
}

function paintPreview() {
  const html = applyMergeTags(state.rawHtml, state.merge);
  frameEl.srcdoc = html;
}

function setView(view) {
  state.view = view;
  frameWrapEl.classList.toggle("mobile", view === "mobile");
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
}

function setLang(lang) {
  state.lang = lang === "en" ? "en" : "uk";
  localStorage.setItem(LANG_KEY, state.lang);
  applyI18n(state.lang);
  renderList();
  refreshActiveMeta();
}

function openGenerator() {
  Object.entries(state.merge).forEach(([key, value]) => {
    const input = document.getElementById(`merge-${key}`);
    if (input) input.value = value;
  });
  modalEl.classList.add("open");
}

function closeGenerator() {
  modalEl.classList.remove("open");
}

function saveGenerator(event) {
  event.preventDefault();
  const form = event.target;
  const next = { ...state.merge };
  Object.keys(DEFAULT_MERGE).forEach((key) => {
    const field = form.elements.namedItem(key);
    if (field && "value" in field) {
      next[key] = field.value.trim() || DEFAULT_MERGE[key];
    }
  });
  state.merge = next;
  paintPreview();
  closeGenerator();
  showToast(t("toastMerge", state.lang));
}

async function copyHtml() {
  const html = applyMergeTags(state.rawHtml, state.merge);
  await navigator.clipboard.writeText(html);
  showToast(t("toastCopied", state.lang));
}

function downloadHtml() {
  const html = applyMergeTags(state.rawHtml, state.merge);
  const tpl = TEMPLATES.find((item) => item.id === state.activeId);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tpl?.id || "email"}.html`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(t("toastDownloaded", state.lang));
}

function openRaw() {
  const tpl = TEMPLATES.find((item) => item.id === state.activeId);
  if (tpl) window.open(tpl.file, "_blank");
}

listEl.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-id]");
  if (!btn) return;
  loadTemplate(btn.dataset.id).catch((err) => showToast(err.message));
});

document.querySelectorAll("[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

document.getElementById("btn-generator").addEventListener("click", openGenerator);
document.getElementById("btn-copy").addEventListener("click", () => {
  copyHtml().catch(() => showToast(t("toastCopyFail", state.lang)));
});
document.getElementById("btn-download").addEventListener("click", downloadHtml);
document.getElementById("btn-raw").addEventListener("click", openRaw);
document.getElementById("btn-close-modal").addEventListener("click", closeGenerator);
document.getElementById("generator-form").addEventListener("submit", saveGenerator);

modalEl.addEventListener("click", (event) => {
  if (event.target === modalEl) closeGenerator();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGenerator();
});

setLang(state.lang);
setView("desktop");
loadTemplate(state.activeId).catch((err) => {
  activeMetaEl.textContent = err.message;
});
