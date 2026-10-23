// ЗАГРАНЬ: общий скрипт для всех страниц
(function () {
"use strict";

const UNIS = window.UNIS || [];
const ARTICLES = window.ARTICLES || [];
const TERMS = window.TERMS || [];
const DIRS = window.DIRS || {};
const REGIONS = window.REGIONS || {};
const byId = Object.fromEntries(UNIS.map(u => [u.id, u]));
const artById = Object.fromEntries(ARTICLES.map(a => [a.id, a]));
const termByKey = {};
TERMS.forEach(t => { termByKey[t.id] = t; if (t.alias) termByKey[t.alias] = t; });

/* ---------- вспомогательные функции ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const params = new URLSearchParams(location.search);
// пути считаем от корня сайта
const ROOT = document.body.dataset.root || "";
const PAGES = {"index.html": "index.html", "universities.html": "pages/universities.html", "university.html": "pages/university.html", "articles.html": "pages/articles.html", "article.html": "pages/articles/article.html", "glossary.html": "pages/glossary.html", "tests.html": "pages/tests.html", "match.html": "pages/tests/match.html", "quiz.html": "pages/tests/quiz.html", "about.html": "pages/about.html", "russia.html": "pages/russia.html", "feedback.html": "pages/feedback.html"};
const url = file => ROOT + (PAGES[file] || file);
const FORM_URL = "https://formspree.io/f/mppqrdqz";
// пример статьи лежит отдельным файлом
const STATIC_ARTICLES = ["ielts-russia"];
const artHref = id => STATIC_ARTICLES.includes(id) ? `${ROOT}pages/articles/${id}.html` : `${url("article.html")}?id=${id}`;
const uniHref = id => `${url("university.html")}?id=${id}`;
const nbsp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fee = u => u.feeYear == null ? "цена на сайте" : "€" + nbsp(u.feeYear) + " / год";
// без платы = нет платы за обучение, только взносы
const isFree = u => u.feeYear != null && /^Без платы/.test(u.tuition);
const ielts = u => u.ielts == null ? "—" : u.ielts.toFixed(1);
const shortDeadline = u => u.deadline.split(/[(;]/)[0].trim().replace(/[,.]$/, "");
const uniImg = id => `${ROOT}images/unis/${id}.jpg`;
const artImg = a => a.photo.uni ? uniImg(a.photo.uni) : `${ROOT}images/photos/${a.photo.file}`;
const uniCredit = u => u.photo ? `Фото: ${u.photo.author}, ${u.photo.license}` : "";
const fmtDate = d => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(/\s*г\.$/, "");
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
// цвета карточек и фото идут по кругу, как в макете
const TINTS = ["", "ph--pink", "", "ph--pink", "ph--mint"];
const TONES = ["panel--mint", "", "panel--pink"];
const POPULAR = ["polimi", "unibo", "kuleuven", "wu", "lmu", "tum", "eth", "tudelft", "bocconi", "aalto", "uva", "cuni", "muni", "edinburgh", "lund", "epfl", "bgu", "aua", "tsu", "nu"];

/* ---------- иконки ---------- */
const ICONS = {
  search: '<path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.5 15.5 20 20" />',
  close: '<path d="M6 6l12 12M18 6 6 18" />',
};
const icon = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true">${ICONS[n]}</svg>`;

/* ---------- логотип ---------- */
const LOGO = `${window.LOGO_MARK || ""}<span class="logo__text"><span class="logo__word">ЗАГРАНЬ</span></span>`;

/* ---------- шапка и подвал ---------- */
const NAV = [
  ["universities.html", "Вузы", ["universities", "university"]],
  ["russia.html", "Из России", ["russia"]],
  ["articles.html", "Статьи", ["articles", "article"]],
  ["glossary.html", "Словарь", ["glossary"]],
  ["tests.html", "Тесты", ["tests", "match", "quiz"]],
  ["about.html", "О проекте", ["about"]]
];
const page = document.body.dataset.page;

function renderChrome() {
  const extra = document.createElement("div");
  extra.innerHTML = `<div class="toast" role="status"></div>`;
  // на заглушке нет меню и поиска
  if (page !== "feedback") {
    extra.innerHTML += `
    <div class="mnav" data-mnav>
      <div class="mnav__top"><a class="logo" href="${url("index.html")}" aria-label="ЗАГРАНЬ — на главную">${LOGO}</a>
        <button class="burger" data-action="menu-close" aria-label="Закрыть меню">${icon("close")}</button></div>
      <nav class="mnav__links">${NAV.map(([h, t, p]) => `<a href="${url(h)}"${p.includes(page) ? ' class="is-active"' : ""}>${t}</a>`).join("")}</nav>
      <div class="mnav__btns"><a class="btn btn--primary btn--block" href="${url("match.html")}">Подобрать вуз</a>
        <button class="btn btn--block" data-action="search">${icon("search")}Поиск</button></div>
    </div>
    <div class="overlay" data-overlay>
      <div class="panel overlay__box" role="dialog" aria-label="Поиск">
        <label class="searchbar">${icon("search")}<input type="search" placeholder="Вуз, город, статья или термин" data-search-input></label>
        <div class="overlay__results" data-search-results></div>
      </div>
    </div>`;
  }
  document.body.append(...extra.children);
}

let toastTimer;
function toast(msg) {
  const t = $(".toast"); if (!t) return;
  t.textContent = msg; t.classList.add("is-visible");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2400);
}

/* ---------- фото ---------- */
const ph = (img, tint = "", cap = "", credit = "") =>
  `<div class="ph ${tint}"><div class="ph__img" style="background-image:url(${img})"></div>${cap ? `<span class="cap">${esc(cap)}</span>` : ""}${credit ? `<span class="credit">${esc(credit)}</span>` : ""}</div>`;

/* ---------- карточка вуза ---------- */
function ticket(u, i = 0) {
  return `<a class="panel ucard" href="${uniHref(u.id)}" data-uni="${u.id}">
    ${ph(uniImg(u.id), TINTS[i % TINTS.length], `${u.city}, ${u.country}`, uniCredit(u))}
    <div class="ucard__body"><h3 class="ucard__name">${esc(u.name)}</h3>
      <div class="ucard__data"><span class="price">${fee(u)}</span><span class="ucard__ielts">IELTS ${ielts(u)}</span></div></div></a>`;
}

/* ---------- карточки статей ---------- */
const articleCard = (a, i = 0) => `<a class="panel rays ${TONES[i % TONES.length]} acard" href="${artHref(a.id)}">
  <span class="cap cap--ink">${a.rubric}</span><h3 class="acard__title">${esc(a.title)}</h3>
  <span class="acard__meta">${a.read} мин · читать →</span></a>`;
const articleFeature = a => `<a class="panel feature" href="${artHref(a.id)}">
  ${ph(artImg(a), "ph--pink", `Главное · ${a.read} мин`)}
  <div class="feature__text"><h2 class="feature__title">${esc(a.title)}</h2><p>${esc(a.lead)}</p><span class="more">Читать →</span></div></a>`;

/* ---------- общие события ---------- */
document.addEventListener("click", e => {
  if (e.target.closest('[data-action="menu"]')) { setMenu(true); return; }
  if (e.target.closest(".mnav__links a")) setMenu(false);
  if (e.target.closest('[data-action="menu-close"]')) { setMenu(false); return; }
  if (e.target.closest('[data-action="search"]')) { setMenu(false); openSearch(); return; }
  if (e.target.closest("[data-instagram]")) { e.preventDefault(); toast("Instagram скоро появится"); return; }
  if (e.target.matches("[data-overlay]")) closeSearch();
});

// обратная связь через formspree
document.addEventListener("submit", async e => {
  if (e.target.dataset.form !== "feedback") return;
  e.preventDefault();
  const form = e.target, inp = $("input[type=email]", form), msg = $("textarea", form), btn = $("button", form);
  if (!/^\S+@\S+\.\S+$/.test(inp.value)) { toast("Проверь почту"); inp.focus(); return; }
  if (msg && !msg.value.trim()) { toast("Напиши вопрос"); msg.focus(); return; }
  btn.disabled = true;
  try {
    const res = await fetch(FORM_URL, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    toast("Спасибо! Сообщение отправлено");
  } catch (err) {
    toast("Не получилось отправить, попробуй ещё раз");
  }
  btn.disabled = false;
});

/* ---------- мобильное меню ---------- */
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  const b = $('.header [data-action="menu"]'); if (b) b.setAttribute("aria-expanded", String(open));
}

/* ---------- поиск ---------- */
function openSearch() {
  const o = $("[data-overlay]"); if (!o) return; o.classList.add("is-open");
  const i = $("[data-search-input]"); i.value = ""; renderSearch(""); setTimeout(() => i.focus(), 10);
}
function closeSearch() { const o = $("[data-overlay]"); if (o) o.classList.remove("is-open"); }
const norm = s => s.toLowerCase().replace(/ё/g, "е");
function renderSearch(q) {
  const box = $("[data-search-results]"); q = norm(q.trim());
  if (!q) { box.innerHTML = `<div class="overlay__group">Например: Милан, IELTS, апостиль</div>`; return; }
  const unis = UNIS.filter(u => norm([u.name, u.city, u.country].join(" ")).includes(q)).slice(0, 6);
  const arts = ARTICLES.filter(a => norm(a.title + " " + a.lead).includes(q)).slice(0, 4);
  const terms = TERMS.filter(t => norm([t.term, t.ru, t.full].join(" ")).includes(q)).slice(0, 4);
  let h = "";
  if (unis.length) h += `<div class="overlay__group">Вузы</div>` + unis.map(u => `<a href="${uniHref(u.id)}"><span>${esc(u.name)}</span><span class="muted">${esc(u.city)}</span></a>`).join("");
  if (arts.length) h += `<div class="overlay__group">Статьи</div>` + arts.map(a => `<a href="${artHref(a.id)}"><span>${esc(a.title)}</span><span class="muted">${a.rubric}</span></a>`).join("");
  if (terms.length) h += `<div class="overlay__group">Словарь</div>` + terms.map(t => `<a href="${url("glossary.html")}#${t.id}"><span>${esc(t.ru)}</span><span class="muted">${esc(t.term)}</span></a>`).join("");
  box.innerHTML = h || `<div class="overlay__group">Ничего не нашлось</div>`;
}
document.addEventListener("input", e => { if (e.target.matches("[data-search-input]")) renderSearch(e.target.value); });
document.addEventListener("keydown", e => {
  const o = $("[data-overlay]"); if (!o) return;
  if (e.key === "Escape") { closeSearch(); setMenu(false); }
  if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  if (o.classList.contains("is-open") && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
    const links = $$("[data-search-results] a"); if (!links.length) return;
    let i = links.findIndex(a => a.classList.contains("is-focus"));
    if (e.key === "Enter") { e.preventDefault(); location.href = (links[i] || links[0]).href; return; }
    e.preventDefault(); links.forEach(a => a.classList.remove("is-focus"));
    i = e.key === "ArrowDown" ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[i].classList.add("is-focus"); links[i].scrollIntoView({ block: "nearest" });
  }
});

/* ---------- подсказки к терминам ---------- */
function enhanceTerms(root) {
  $$(".term", root).forEach(el => {
    const t = termByKey[el.dataset.term]; if (!t) return;
    el.tabIndex = 0;
    el.insertAdjacentHTML("beforeend", `<span class="term__tip" role="tooltip"><b>${esc(t.ru)}</b>${esc(t.short)}</span>`);
    el.addEventListener("click", () => location.href = url("glossary.html") + "#" + t.id);
  });
}

/* ---------- страницы ---------- */
const pages = {};
const popular = () => [...POPULAR.map(id => byId[id]).filter(Boolean), ...UNIS.filter(u => !POPULAR.includes(u.id))];

/* ---------- главная ---------- */
pages.home = () => {
  $("#home-unis").innerHTML = popular().slice(0, 4).map(ticket).join("");
  $("#home-articles").innerHTML = ARTICLES.slice(0, 3).map(articleCard).join("");
};

/* ---------- каталог ---------- */
pages.universities = () => {
  const st = {
    q: params.get("q") || "", region: params.get("region") || "", country: params.get("country") || "", dir: params.get("dir") || "",
    cheap: params.get("cheap") === "1", low: params.get("low") === "1", english: params.get("english") === "1",
    sort: "popular", shown: 12
  };
  const CHIPS = [["region", "", "Все страны"], ["region", "eu", "Европа"], ["region", "uk", "Великобритания"], ["region", "na", "США и Канада"], ["region", "asia", "Азия"], ["region", "ca", "Кавказ и Центральная Азия"],
    ["cheap", 1, "До €5 000"], ["low", 1, "IELTS до 6.0"], ["english", 1, "На английском"]];
  const search = $("#cat-search"); search.value = st.q;

  const drawChips = () => {
    const extra = [st.country && ["country", st.country, st.country + " ×"], st.dir && ["dir", st.dir, (DIRS[st.dir] || st.dir) + " ×"]].filter(Boolean);
    $("#cat-chips").innerHTML = [...extra, ...CHIPS].map(([k, v, t]) => {
      const on = k === "region" ? st.region === v : k === "country" || k === "dir" ? true : st[k];
      return `<button class="chip${on ? " is-active" : ""}" type="button" data-k="${k}" data-v="${v}">${t}</button>`;
    }).join("");
  };
  const apply = () => {
    const q = norm(st.q.trim());
    let list = popular().filter(u =>
      (!q || norm(u.name + " " + u.city + " " + u.country).includes(q)) &&
      (!st.region || u.region === st.region) &&
      (!st.country || u.country === st.country) &&
      (!st.dir || u.dirs.includes(st.dir)) &&
      (!st.cheap || (u.feeYear != null && u.feeYear <= 5000)) &&
      (!st.low || (u.ielts != null && u.ielts <= 6)) &&
      (!st.english || u.english));
    const f = u => u.feeYear == null ? Infinity : u.feeYear;
    const sorters = { cheap: (a, b) => f(a) - f(b), expensive: (a, b) => (b.feeYear || 0) - (a.feeYear || 0), name: (a, b) => a.name.localeCompare(b.name) };
    if (sorters[st.sort]) list.sort(sorters[st.sort]);
    drawChips();
    $("#cat-count").textContent = list.length;
    $("#cat-count-label").textContent = plural(list.length, "вуз", "вуза", "вузов");
    $("#cat-list").innerHTML = list.length ? list.slice(0, st.shown).map(ticket).join("")
      : `<div class="panel empty"><h3 class="h3">Ничего не нашлось</h3><button class="btn btn--primary" type="button" data-reset>Сбросить фильтры</button></div>`;
    const more = $("#cat-more");
    more.classList.toggle("is-hidden", list.length <= st.shown);
    more.textContent = `Показать ещё ${Math.min(12, list.length - st.shown)}`;
    const p = new URLSearchParams();
    ["q", "region", "country", "dir"].forEach(k => st[k] && p.set(k, st[k]));
    ["cheap", "low", "english"].forEach(k => st[k] && p.set(k, 1));
    history.replaceState(null, "", "?" + p.toString());
  };
  $("#cat-chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    const k = b.dataset.k;
    if (k === "region") st.region = b.dataset.v;
    else if (k === "country" || k === "dir") st[k] = "";
    else st[k] = !st[k];
    st.shown = 12; apply();
  });
  $("#cat-form").addEventListener("submit", e => { e.preventDefault(); st.q = search.value; st.shown = 12; apply(); });
  search.addEventListener("input", () => { st.q = search.value; st.shown = 12; apply(); });
  $("#cat-sort").addEventListener("change", e => { st.sort = e.target.value; apply(); });
  $("#cat-more").addEventListener("click", () => { st.shown += 12; apply(); });
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-reset]")) return;
    Object.assign(st, { q: "", region: "", country: "", dir: "", cheap: false, low: false, english: false, shown: 12 });
    search.value = ""; apply();
  });
  apply();
};

/* ---------- страница вуза ---------- */
// что важно знать по стране, если поступаешь из России
const RU_NOTES = {
  "Германия": "Нужен блокированный счёт на год жизни, а после 11 классов часто — подготовительный год Studienkolleg.",
  "Чехия": "Студенческие визы россиянам сейчас почти не выдают — проверь это до подачи.",
  "Италия": "Перед визой нужна регистрация на портале Universitaly.",
  "США": "Собеседование на визу проходят в Казахстане, Армении или Сербии.",
  "Сербия": "Виза для въезда россиянам не нужна.", "Армения": "Виза для въезда россиянам не нужна.",
  "Грузия": "Виза для въезда россиянам не нужна.", "Казахстан": "Виза для въезда россиянам не нужна."
};
pages.university = () => {
  const root = $("#uni-root");
  const u = byId[params.get("id")];
  if (!u) {
    root.innerHTML = `<section class="pagehead"><h1 class="pagehead__title">Вуз не найден</h1><p class="pagehead__sub">Возможно, ссылка устарела.</p><a class="btn btn--primary" href="${url("universities.html")}">Все вузы</a></section>`;
    return;
  }
  document.title = u.name + " — ЗАГРАНЬ";
  const host = s => { try { return new URL(s).hostname.replace(/^www\./, ""); } catch (e) { return s; } };
  const dl = u.deadline.match(/\((.*)\)/);
  const facts = [
    ["Плата", isFree(u) ? "Бесплатно" : fee(u), isFree(u) ? u.tuition.replace(/^Без платы за обучение,?\s*/, "") || "без платы за обучение" : u.tuition, ""],
    ["Язык", u.lang, u.english ? "есть программы на английском" : "программы на языке страны", "panel--mint tone"],
    ["Дедлайн", shortDeadline(u), dl ? dl[1] : "смотри на сайте вуза", "panel--pink tone"],
    ["Город", u.city, `${u.citySize === "big" ? "большой город" : "студенческий город"}, ${u.country}`, ""]
  ];
  const similar = UNIS.filter(x => x.id !== u.id && (x.country === u.country || x.region === u.region) && x.dirs.some(d => u.dirs.includes(d)))
    .sort((a, b) => (b.country === u.country) - (a.country === u.country) || Math.abs((a.feeYear || 0) - (u.feeYear || 0)) - Math.abs((b.feeYear || 0) - (u.feeYear || 0))).slice(0, 3);
  const burst = u.feeYear == null ? "" : isFree(u) ? "без платы" : u.feeYear <= 5000 ? "до €5 000" : "";
  root.innerHTML = `
  <section class="uhead">
    <div class="uhead__text">
      <nav class="crumbs"><a href="${url("universities.html")}">Вузы</a><span>/</span><a href="${url("universities.html")}?country=${encodeURIComponent(u.country)}">${esc(u.country)}</a><span>/</span><span>${esc(u.name)}</span></nav>
      <span class="cap">${esc(u.country)} · ${esc(u.city)}</span>
      <h1 class="uhead__title">${esc(u.name)}</h1>
      ${u.note ? `<p>${esc(u.note)}</p>` : ""}
      <div class="facts">${facts.map(([k, b, s, c]) => `<div class="panel ${c} fact"><span class="cap">${k}</span><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div>
    </div>
    <div class="panel uhead__photo">${ph(uniImg(u.id), "", "", uniCredit(u))}${burst ? `<span class="burst">${burst}</span>` : ""}</div>
  </section>
  <section>
    <div class="sechead"><h2 class="ribbon">Направления</h2></div>
    <div class="chips">${u.dirs.map(d => `<a class="chip" href="${url("universities.html")}?dir=${d}">${DIRS[d]}</a>`).join("")}</div>
  </section>
  <section class="stack">
    <div class="panel panel--green tone ru-box"><h2>Если поступаешь из России</h2>
      <p>Аттестат нужно заверить апостилем и перевести. Проверь, нужен ли подготовительный год, и заранее реши, как будешь платить. ${RU_NOTES[u.country] || ""}</p></div>
    <div class="row">
      <a class="btn btn--primary" href="${esc(u.src[0])}" target="_blank" rel="noopener">Сайт вуза ↗</a>
      <a class="btn" href="${url("match.html")}?dir=${u.dirs[0]}&region=${u.region}">Подобрать похожие</a>
    </div>
    <div class="sources"><span>Данные с официального сайта вуза · октябрь 2026</span>${u.src.map(s => `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(host(s))}</a>`).join("")}</div>
  </section>
  ${similar.length ? `<section><div class="sechead"><h2 class="ribbon">Похожие вузы</h2><a class="more more--ink" href="${url("universities.html")}">Все вузы →</a></div>
    <div class="grid-3">${similar.map((x, i) => ticket(x, i + 3)).join("")}</div></section>` : ""}`;
};

/* ---------- статьи ---------- */
pages.articles = () => {
  const rubrics = ["Все", ...new Set(ARTICLES.map(a => a.rubric))];
  let cur = params.get("rubric") || "Все";
  const chips = $("#rubrics");
  const render = () => {
    chips.innerHTML = rubrics.map(r => `<button class="chip${r === cur ? " is-active" : ""}" type="button" data-rubric="${r}">${r}</button>`).join("");
    const list = ARTICLES.filter(a => cur === "Все" || a.rubric === cur);
    const [lead, ...rest] = list;
    $("#lead-story").innerHTML = lead ? articleFeature(lead) : "";
    $("#article-list").innerHTML = rest.map((a, i) => articleCard(a, [1, 2, 0, 1][i % 4])).join("");
  };
  chips.addEventListener("click", e => { const b = e.target.closest("[data-rubric]"); if (!b) return; cur = b.dataset.rubric; render(); });
  render();
};

/* ---------- статья ---------- */
pages.article = () => {
  const root = $("#art-root");
  const a = artById[params.get("id") || document.body.dataset.article];
  if (!a) {
    root.innerHTML = `<section class="pagehead"><h1 class="pagehead__title">Статья не найдена</h1><p class="pagehead__sub">Возможно, ссылка устарела.</p><a class="btn btn--primary" href="${url("articles.html")}">Все статьи</a></section>`;
    return;
  }
  document.title = a.title + " — ЗАГРАНЬ";
  const credit = a.photo.uni && byId[a.photo.uni] ? uniCredit(byId[a.photo.uni]) : "";
  root.innerHTML = `
  <header class="ahead">
    <nav class="crumbs"><a href="${url("articles.html")}">Статьи</a><span>/</span><a href="${url("articles.html")}?rubric=${encodeURIComponent(a.rubric)}">${a.rubric}</a></nav>
    <span class="cap cap--ink">${a.rubric} · ${a.read} ${plural(a.read, "минута", "минуты", "минут")}</span>
    <h1 class="ahead__title">${esc(a.title)}</h1>
    <p class="lead">${esc(a.lead)}</p>
    <span class="ahead__by">${esc(a.author)} · ${fmtDate(a.date)}</span>
  </header>
  <figure class="art-photo" style="margin:0">
    <div class="panel">${ph(artImg(a), "ph--pink")}</div>${a.burst ? `<span class="burst">${esc(a.burst)}</span>` : ""}
    <figcaption class="photo-caption">${esc(a.caption || "")}${credit ? ` · ${esc(credit)}` : ""}</figcaption>
  </figure>
  <section class="art">
    <div>
      <article class="prose" id="art-body">${a.html}</article>
      ${a.sources && a.sources.length ? `<div class="sources art-sources"><span>Источники</span>${a.sources.map(([t, s]) => `<a href="${esc(s)}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</div>` : ""}
    </div>
    <aside class="panel panel--mint tone short"><h2>Коротко</h2><dl>${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></aside>
  </section>`;
  // ссылки в тексте статьи пишем от папки articles
  $$("#art-body a[href^='../']").forEach(l => l.setAttribute("href", ROOT + "pages/" + l.getAttribute("href").slice(3)));
  enhanceTerms($("#art-body"));
  const i = ARTICLES.indexOf(a);
  const next = [1, 2, 3].map(k => ARTICLES[(i + k) % ARTICLES.length]);
  $("#art-next").innerHTML = `<h2>Читайте также</h2><div class="readalso__list">${next.map(x => `<a class="readalso__item" href="${artHref(x.id)}"><span class="cap cap--ink">${x.rubric}</span><b>${esc(x.title)}</b><span>→</span></a>`).join("")}</div>`;
};

/* ---------- словарь ---------- */
pages.glossary = () => {
  const title = t => cap1(t.ru);
  const sorted = [...TERMS].sort((x, y) => title(x).localeCompare(title(y), "ru"));
  // русский алфавит без Ё, Й, Ъ, Ы, Ь
  const letters = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ".split("");
  const first = t => title(t)[0].toUpperCase();
  const has = new Set(sorted.map(first));
  let letter = "";
  $("#alphabet").innerHTML = `<button type="button" data-letter="" class="is-active">Все</button>` + letters.map(l => `<button type="button" data-letter="${l}"${has.has(l) ? "" : " disabled"}>${l}</button>`).join("");
  const list = $("#terms");
  list.innerHTML = sorted.map((t, i) => `<details class="panel ${["", "panel--mint tone", "panel--mint tone", ""][i % 4]} termcard" id="${t.id}" data-l="${first(t)}">
    <summary><span class="termcard__title">${esc(title(t))}</span>${t.term.toLowerCase() !== t.ru.toLowerCase() ? `<span class="termcard__en">${esc(t.term)}</span>` : ""}<p>${esc(t.short)}</p></summary>
    <div class="termcard__body"><p>${esc(t.body)}</p><p class="termcard__ex">${esc(t.example)}</p>
      ${t.articles.map(id => artById[id]).filter(Boolean).map(a => `<a class="link" href="${artHref(a.id)}">${esc(a.title)}</a>`).join("")}</div></details>`).join("");
  const filter = () => {
    let n = 0;
    $$(".termcard", list).forEach(c => { const ok = !letter || c.dataset.l === letter; c.classList.toggle("is-hidden", !ok); if (ok) n++; });
    $("#terms-empty").classList.toggle("is-hidden", n > 0);
  };
  $("#alphabet").addEventListener("click", e => {
    const b = e.target.closest("[data-letter]"); if (!b || b.disabled) return;
    letter = b.dataset.letter === letter ? "" : b.dataset.letter;
    $$("#alphabet button").forEach(x => x.classList.toggle("is-active", x.dataset.letter === letter)); filter();
  });
  const openHash = () => {
    const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el && el.classList.contains("termcard")) { el.open = true; setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 50); }
  };
  window.addEventListener("hashchange", openHash); openHash(); filter();
};

/* ---------- подбор вуза ---------- */
function scoreUni(u, ans) {
  const W = { dir: 3, budget: 3, region: 2, lang: 2, ielts: 1.5, city: 1 };
  if (ans.prio && W[ans.prio]) W[ans.prio] *= 2;
  let sum = 0, tot = 0;
  const add = (k, v) => { sum += W[k] * v; tot += W[k]; };
  if (ans.dir) add("dir", u.dirs.includes(ans.dir) ? 1 : 0);
  if (ans.budget) {
    const b = ans.budget === "any" ? Infinity : +ans.budget;
    add("budget", u.feeYear == null ? 0.5 : u.feeYear <= b ? 1 : u.feeYear <= b * 1.5 ? 0.4 : 0);
  }
  if (ans.region) add("region", ans.region === "any" || u.region === ans.region ? 1 : 0);
  if (ans.lang) add("lang", ans.lang === "local" ? 1 : u.english ? 1 : 0);
  if (ans.ielts) {
    const s = +ans.ielts;
    let v = s === 0 ? 0.5 : u.ielts == null ? 0.8 : s >= u.ielts ? 1 : s + 0.5 >= u.ielts ? 0.4 : 0;
    if (ans.lang === "local" && !u.english) v = 1;
    add("ielts", v);
  }
  if (ans.city) add("city", ans.city === "any" || u.citySize === ans.city ? 1 : 0.3);
  return { u, pct: tot ? Math.round(sum / tot * 100) : 0 };
}

const resultCard = (r, i) => `<article class="panel rcard">
  <a href="${uniHref(r.u.id)}" aria-label="${esc(r.u.name)}">${ph(uniImg(r.u.id), ["", "ph--pink"][i % 2])}</a>
  <div class="rcard__body"><a class="rcard__name" href="${uniHref(r.u.id)}">${esc(r.u.name)}</a>
    <span class="muted">${esc(r.u.city)}, ${esc(r.u.country)}</span>
    <span class="rcard__meta">${r.u.feeYear == null ? "цена на сайте" : "€" + nbsp(r.u.feeYear) + " в год"} · IELTS ${ielts(r.u)}</span>
    <a class="more" href="${uniHref(r.u.id)}">Подробнее →</a>
    <span class="pct ${r.pct >= 85 ? "pct--hi" : r.pct >= 75 ? "pct--mid" : ""}">${r.pct}%</span></div></article>`;

pages.match = () => {
  const STEPS = window.MATCH_STEPS;
  const ans = {}; let step = 0;
  STEPS.forEach(s => { const v = params.get(s.key); if (v && s.options.some(o => o.v === v)) ans[s.key] = v; });
  while (step < STEPS.length - 1 && ans[STEPS[step].key]) step++;
  const label = s => { const o = s.options.find(o => o.v === ans[s.key]); return o ? o.t.split(" — ")[0] : ""; };
  const stepsEl = $("#match-steps"), main = $("#match-main"), wrap = $("#match-wrap");
  const title = $("#match-title"), sub = $("#match-sub");

  const renderSteps = () => {
    stepsEl.innerHTML = STEPS.map((s, i) => `<li class="${i === step ? "is-current" : ans[s.key] ? "is-done" : ""}" data-goto="${i}" style="cursor:${ans[s.key] || i === step ? "pointer" : "default"}">
      <span class="dot">${i + 1}</span><span class="step__name">${s.short}${ans[s.key] && i !== step ? `<small>${esc(label(s))}</small>` : ""}</span></li>`).join("");
  };
  const renderQ = () => {
    const s = STEPS[step];
    wrap.classList.remove("is-result");
    title.textContent = "Подбор вуза"; sub.textContent = "7 вопросов — и список вузов с процентом совпадения.";
    renderSteps();
    main.innerHTML = `<div class="panel panel--mint rays qbox">
      <div class="progress">${STEPS.map((_, i) => `<span class="${i < step ? "is-done" : i === step ? "is-current" : ""}"></span>`).join("")}</div>
      <p class="qbox__step">Шаг ${step + 1} из ${STEPS.length}</p>
      <h2 class="qbox__q">${s.q}</h2>
      <div class="options">${s.options.map(o => `<button class="option${ans[s.key] === o.v ? " is-selected" : ""}" type="button" data-v="${o.v}">${esc(o.t)}</button>`).join("")}</div>
      <div class="qbox__nav">
        <button class="btn" type="button" data-prev${step === 0 ? " disabled" : ""}>Назад</button>
        <button class="btn btn--primary" type="button" data-next${ans[s.key] ? "" : " disabled"}>${step === STEPS.length - 1 ? "Показать вузы" : "Дальше"}</button>
      </div></div>`;
  };
  const renderResult = () => {
    wrap.classList.add("is-result");
    const res = UNIS.map(u => scoreUni(u, ans)).sort((a, b) => b.pct - a.pct || (a.u.feeYear ?? Infinity) - (b.u.feeYear ?? Infinity));
    const parts = STEPS.filter(s => ["dir", "budget", "region"].includes(s.key) && ans[s.key] && ans[s.key] !== "any").map(s => label(s).toLowerCase());
    title.textContent = "Твои вузы";
    sub.textContent = parts.length ? `Лучшие совпадения по твоим ответам: ${parts.join(", ")}.` : "Лучшие совпадения по твоим ответам.";
    let shown = 10;
    const draw = () => {
      main.innerHTML = `<div class="stack"><div class="results">${res.slice(0, shown).map(resultCard).join("")}</div>
        <div class="row">${shown < res.length ? `<button class="btn" type="button" data-more>Показать ещё 10</button>` : ""}
          <a class="btn btn--primary" href="${url("universities.html")}">Все вузы</a><button class="btn" type="button" data-restart>Пройти заново</button></div></div>`;
      countUp($$(".pct", main));
    };
    main.onclick = e => { if (e.target.closest("[data-more]")) { shown += 10; draw(); } };
    draw();
    const p = new URLSearchParams(ans); p.set("done", 1); history.replaceState(null, "", "?" + p);
    scrollTo({ top: 0, behavior: "smooth" });
  };
  main.addEventListener("click", e => {
    const opt = e.target.closest(".option");
    if (opt) { ans[STEPS[step].key] = opt.dataset.v; $$(".option", main).forEach(o => o.classList.toggle("is-selected", o === opt)); $("[data-next]", main).disabled = false; return; }
    if (e.target.closest("[data-prev]") && step > 0) { step--; renderQ(); }
    if (e.target.closest("[data-next]") && ans[STEPS[step].key]) { if (step < STEPS.length - 1) { step++; renderQ(); } else renderResult(); }
    if (e.target.closest("[data-restart]")) { for (const k in ans) delete ans[k]; step = 0; main.onclick = null; history.replaceState(null, "", "?"); renderQ(); }
  });
  stepsEl.addEventListener("click", e => {
    const li = e.target.closest("[data-goto]"); if (!li) return;
    const i = +li.dataset.goto; if (ans[STEPS[i].key] || i <= Object.keys(ans).length) { step = i; renderQ(); }
  });
  if (params.get("done") && STEPS.every(s => ans[s.key])) renderResult(); else renderQ();
};

/* ---------- тесты: страна, IELTS, Foundation ---------- */
const QUIZ_CARDS = {
  match: ["Подбор вуза", "7 вопросов — и список вузов", "panel--green", () => url("match.html")],
  country: ["Какая страна — твоя?", "Подберём страну под твой стиль жизни", "panel--mint", () => url("quiz.html") + "?id=country"],
  ielts: ["Хватит ли английского?", "Подвинь ползунок IELTS", "panel--pink", () => url("quiz.html") + "?id=ielts"],
  foundation: ["Foundation или сразу?", "Разберёмся, нужен ли подготовительный год", "", () => url("quiz.html") + "?id=foundation"]
};
pages.quiz = () => {
  const id = window.QUIZZES[params.get("id")] || params.get("id") === "ielts" ? params.get("id") : "country";
  const main = $("#quiz-main"), side = $("#quiz-side");
  const name = QUIZ_CARDS[id][0];
  document.title = name + " — ЗАГРАНЬ";
  $("#quiz-name").textContent = name;
  $("#quiz-others").innerHTML = Object.entries(QUIZ_CARDS).filter(([k]) => k !== id).slice(0, 2).map(([, [t, s, c, h]]) =>
    `<a class="panel ${c} tone tcard" style="min-height:0" href="${h()}"><h3 class="tcard__title">${t}</h3><p>${s}</p><span class="more">Начать →</span></a>`).join("");
  const photoSide = (img, burst) => { side.className = "panel quiz-photo"; side.innerHTML = ph(img, "ph--pink") + `<span class="burst">${burst}</span>`; };

  if (id === "ielts") {
    let score = 6.5;
    const withNum = UNIS.filter(u => u.ielts != null);
    side.className = "panel panel--pink tone qbox";
    side.innerHTML = `<span class="cap">Твой балл</span><div class="ielts-big" id="ielts-out">6.5</div>
      <input class="range" type="range" min="4" max="9" step="0.5" value="6.5" id="ielts-range" aria-label="Балл IELTS">
      <div class="range-value"><span>4.0</span><span>9.0</span></div>`;
    const draw = () => {
      $("#ielts-out").textContent = score.toFixed(1);
      const ok = withNum.filter(u => u.ielts <= score).sort((a, b) => b.ielts - a.ielts || a.name.localeCompare(b.name));
      const near = withNum.filter(u => u.ielts > score && u.ielts <= score + 0.5);
      const pct = Math.round(ok.length / withNum.length * 100);
      main.innerHTML = `<span class="cap">Хватит ли IELTS ${score.toFixed(1)}?</span>
        <h1 class="qbox__q">${pct >= 90 ? "Хватит почти везде" : pct >= 50 ? "Хватит для многих" : pct > 0 ? "Хватит не везде" : "Пока не хватит"}</h1>
        <div class="mini-stats">
          <div class="panel"><b>${ok.length}</b><span>из ${withNum.length} вузов с единым минимумом</span></div>
          <div class="panel"><b>${near.length}</b><span>не хватает 0.5</span></div>
          <div class="panel"><b>${UNIS.length - withNum.length}</b><span>смотрят по программе</span></div>
        </div>
        <p style="margin:0">IELTS в России не проводят — <a class="link" href="${artHref("ielts-russia")}">где его сдать</a>.</p>
        ${ok.length ? `<div class="grid-2">${ok.slice(0, 4).map(ticket).join("")}</div>` : ""}`;
    };
    $("#ielts-range").addEventListener("input", e => { score = +e.target.value; draw(); });
    draw(); return;
  }

  const Q = window.QUIZZES[id];
  photoSide(ROOT + Q.photo, "2 минуты");
  const answers = []; let i = 0;
  const drawQ = () => {
    const q = Q.questions[i];
    main.innerHTML = `<span class="cap">Вопрос ${i + 1} из ${Q.questions.length}</span>
      <h1 class="qbox__q">${esc(q.q)}</h1>
      <div class="options options--grid">${q.options.map((o, k) => `<button class="option${answers[i] === k ? " is-selected" : ""}" type="button" data-k="${k}"><span class="option__letter">${"ABCDE"[k]}</span>${esc(o.t)}</button>`).join("")}</div>
      <div class="qbox__nav"><button class="btn" type="button" data-prev${i === 0 ? " disabled" : ""}>Назад</button><button class="btn btn--primary" type="button" data-next${answers[i] == null ? " disabled" : ""}>${i === Q.questions.length - 1 ? "Результат" : "Дальше"}</button></div>`;
  };
  const drawResult = () => {
    if (id === "foundation") {
      const s = answers.reduce((acc, k, n) => acc + Q.questions[n].options[k].s, 0);
      const v = Q.verdicts.find(x => s <= x.max);
      main.innerHTML = `<div class="verdict"><span class="cap">Результат</span><h1 class="qbox__q">${v.title}</h1><p>${v.text}</p>
        <div class="row"><a class="btn btn--primary" href="${url("glossary.html")}#foundation">Что такое Foundation</a><button class="btn" type="button" data-restart>Пройти заново</button></div></div>`;
      return;
    }
    const pts = {};
    answers.forEach((k, n) => Object.entries(Q.questions[n].options[k].p).forEach(([c, v]) => pts[c] = (pts[c] || 0) + v));
    const rank = Object.keys(Q.results).map(c => [c, pts[c] || 0]).sort((a, b) => b[1] - a[1]);
    const max = rank[0][1] || 1;
    const r = Q.results[rank[0][0]];
    const unis = UNIS.filter(u => u.country === r.country);
    if (unis[0]) photoSide(uniImg(unis[0].id), r.name);
    main.innerHTML = `<div class="verdict"><span class="cap">Твоя страна</span><h1 class="qbox__q">${r.name}</h1><p>${r.text}</p>
      <div class="stack" style="width:100%">${rank.slice(0, 4).map(([c, v]) => `<div class="scorebar"><span>${Q.results[c].name}</span><div class="bar"><span class="${c === rank[0][0] ? "is-best" : ""}" style="width:${Math.round(v / max * 100)}%"></span></div><b>${Math.round(v / max * 100)}%</b></div>`).join("")}</div>
      <div class="row"><a class="btn btn--primary" href="${url("universities.html")}?country=${encodeURIComponent(r.country)}">Вузы страны</a><button class="btn" type="button" data-restart>Пройти заново</button></div></div>`;
  };
  main.addEventListener("click", e => {
    const o = e.target.closest(".option");
    if (o) { answers[i] = +o.dataset.k; answers.length = i + 1; $$(".option", main).forEach(x => x.classList.toggle("is-selected", x === o)); $("[data-next]", main).disabled = false; return; }
    if (e.target.closest("[data-prev]") && i > 0) { i--; drawQ(); }
    if (e.target.closest("[data-next]") && answers[i] != null) { if (i < Q.questions.length - 1) { i++; drawQ(); } else drawResult(); }
    if (e.target.closest("[data-restart]")) { answers.length = 0; i = 0; photoSide(ROOT + Q.photo, "2 минуты"); drawQ(); }
  });
  drawQ();
};

/* ---------- из России ---------- */
pages.russia = () => {
  $("#ru-articles").innerHTML = ARTICLES.slice(0, 3).map(articleCard).join("");
  $("#ru-unis").innerHTML = ["bgu", "aua", "tsu", "nu"].map(id => byId[id]).filter(Boolean).map(ticket).join("");
};

/* ---------- счётчики из данных ---------- */
function fillCounts() {
  const n = { uni: UNIS.length, country: new Set(UNIS.map(u => u.country)).size, article: ARTICLES.length };
  $$("[data-uni-count]").forEach(el => el.textContent = n.uni);
  $$("[data-country-count]").forEach(el => el.textContent = n.country);
  $$("[data-article-count]").forEach(el => el.textContent = n.article);
}

/* ---------- анимации ---------- */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(els) {
  if (reduced) return;
  els.forEach((el, i) => {
    const m = el.textContent.match(/^(\d+)(%?)$/); if (!m) return;
    const to = +m[1], t0 = performance.now() + i * 60, dur = 800;
    const step = now => { const k = Math.min(1, Math.max(0, (now - t0) / dur)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + m[2]; if (k < 1) requestAnimationFrame(step); };
    el.textContent = "0" + m[2]; requestAnimationFrame(step);
  });
}
function initAnimations() {
  if (reduced || !("IntersectionObserver" in window)) return;
  const sel = ".sechead, .ucard, .acard, .feature, .stat, .cta, .ask, .termcard, .tcard, .person, .what, .info, .step5, .rcard, .readalso, .wide-cta, .bigtest, .about-box";
  const els = $$(sel).filter(el => el.getBoundingClientRect().top > innerHeight * 0.85);
  const show = t => {
    if (!t.classList.contains("reveal") || t.classList.contains("is-in")) return;
    t.classList.add("is-in");
    countUp($$(".stat__num", t));
    setTimeout(() => { t.classList.remove("reveal", "is-in"); t.style.removeProperty("--d"); }, 1400);
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); show(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
    el.style.setProperty("--d", (Math.min(sibs.indexOf(el), 4) * 0.07) + "s");
    el.classList.add("reveal"); io.observe(el);
  });
  // цифры на первом экране тоже считаем
  countUp($$(".stat__num").filter(el => !el.closest(".reveal")));
}

/* ---------- типографика: без висячих предлогов ---------- */
// короткие слова приклеиваем к следующему, тире — к предыдущему, дефис делаем неразрывным
const SHORT = /(^|[\s(«"„])(в|во|к|ко|с|со|о|об|обо|у|и|а|но|да|на|по|за|из|от|до|не|ни|для|при|без|под|над|про|или|что|как|это|из-за|через)[ \t\n]+/giu;
const typoText = t => t.replace(SHORT, "$1$2 ").replace(SHORT, "$1$2 ").replace(/[ \t\n]+([—–])/g, " $1").replace(/([а-яёa-z])-([а-яёa-z])/giu, "$1‑$2").replace(/(\d)[ \t]+(?=[a-zа-яё%€$£])/giu, "$1 ").replace(/(€|№)[ \t]+(?=\d)/g, "$1 ");
function typograph(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.parentElement && !n.parentElement.closest("script, style, textarea") && /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  for (let n; (n = walker.nextNode());) { const v = typoText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
}
// тексты, которые скрипт дорисовывает позже, тоже обрабатываем
new MutationObserver(list => list.forEach(m => m.addedNodes.forEach(n => {
  if (n.nodeType === 1) typograph(n); else if (n.nodeType === 3 && n.parentElement) typograph(n.parentElement);
}))).observe(document.body, { childList: true, subtree: true });

/* ---------- запуск ---------- */
typograph(document.body);
renderChrome();
fillCounts();
if (pages[page]) pages[page]();
initAnimations();
})();
