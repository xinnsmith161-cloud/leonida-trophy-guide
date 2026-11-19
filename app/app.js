// Leonida Trophy Guide — tracker state, filters, detail views and progress I/O.
// Data: app/data/trophies.json (55 official trophies, guides written for this entry).
// Progress lives in localStorage only; nothing leaves the browser except an export
// file the reader asks for.
const EARNED_KEY = 'leonida-trophy-earned-v1';
const COUNTS_KEY = 'leonida-trophy-counts-v1';
const SPOILER_KEY = 'leonida-trophy-spoiler-v1';

const STAGE_LABELS = {
  ch1: 'Chapter 1',
  ch2: 'Chapter 2',
  ch3: 'Chapter 3',
  ch4: 'Chapter 4',
  finale: 'The final mission',
  story: 'Story mission',
  post: 'After the story',
  any: 'Any time',
};

const KIND_LABELS = {
  story: 'Story',
  stranger: 'Stranger strand',
  collectible: 'Collectible',
  activity: 'Activity',
  combat: 'Combat',
  robbery: 'Robbery',
  exploration: 'Exploration',
  money: 'Money',
  misc: 'Misc',
  platinum: 'Platinum',
};

const state = {
  earned: new Set(loadJson(EARNED_KEY, [])),
  counts: loadJson(COUNTS_KEY, {}),
  spoiler: localStorage.getItem(SPOILER_KEY) === '1',
  openId: null,
  search: '',
  kind: 'all',
  grade: 'all',
  show: 'all',
};

let doc = null;

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...state.earned]));
}

function saveCounts() {
  localStorage.setItem(COUNTS_KEY, JSON.stringify(state.counts));
}

function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, state.spoiler ? '1' : '0');
}

function gradeWord(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function sourceName(key) {
  const found = (doc.sources || []).find((s) => s.key === key);
  return found ? found.name : key;
}

function trophyIsSpoiled(t) {
  return state.spoiler && t.hidden && !state.earned.has(t.name);
}

function visibleTrophies() {
  const q = state.search.trim().toLowerCase();
  return doc.trophies.filter((t) => {
    if (state.kind === 'missable') {
      if (!t.missable) return false;
    } else if (state.kind !== 'all' && t.kind !== state.kind) {
      return false;
    }
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.show === 'earned' && !state.earned.has(t.name)) return false;
    if (state.show === 'remaining' && state.earned.has(t.name)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = doc.trophies.length;
  const n = state.earned.size;
  const pct = Math.round((n / total) * 100);
  document.getElementById('progressText').textContent = `${n} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${pct}% to the platinum`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = doc.trophies.filter((t) => t.grade === g).length;
    const got = doc.trophies.filter((t) => t.grade === g && state.earned.has(t.name)).length;
    return `${got}/${all} ${gradeWord(g)}`;
  });
  document.getElementById('gradeLine').textContent = parts.join(' · ');
}

function renderCountLine(shown) {
  document.getElementById('countLine').textContent =
    `Showing ${shown} of ${doc.trophies.length} trophies · ${state.earned.size} earned`;
}

function renderSources() {
  const ul = document.getElementById('sourceList');
  ul.replaceChildren();
  for (const s of doc.sources || []) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = `[${s.key}]`;
    li.append(b);
    const a = document.createElement('a');
    a.href = s.url;
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
}

function makeCounter(t) {
  const wrap = document.createElement('div');
  wrap.className = 'counter';
  const label = document.createElement('span');
  label.textContent = 'Your count:';
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', 'Decrease count');
  const value = document.createElement('strong');
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', 'Increase count');
  const target = document.createElement('span');
  const update = () => {
    const v = state.counts[t.id] || 0;
    const labelText = t.countLabel || '';
    value.textContent = `${v} / ${t.count.toLocaleString()} ${labelText}`.trim();
    target.textContent = v >= t.count ? 'Target reached — tick the trophy above.' : '';
  };
  minus.addEventListener('click', () => {
    state.counts[t.id] = Math.max(0, (state.counts[t.id] || 0) - 1);
    saveCounts();
    update();
  });
  plus.addEventListener('click', () => {
    state.counts[t.id] = Math.min(t.count, (state.counts[t.id] || 0) + 1);
    saveCounts();
    update();
  });
  update();
  wrap.append(label, minus, value, plus, target);
  return wrap;
}

function renderDetail(card, t) {
  const detail = document.createElement('div');
  detail.className = 'detail';
  const guide = document.createElement('p');
  guide.textContent = t.guide;
  detail.append(guide);
  const when = document.createElement('p');
  when.className = 'when';
  const whenLabel = document.createElement('b');
  whenLabel.textContent = 'When: ';
  when.append(whenLabel, document.createTextNode(
    `${STAGE_LABELS[t.stage] || t.stage}${t.missable ? ' — missable, see the warning at the top of the tracker' : ''}${t.hidden ? ' · hidden on PlayStation until earned' : ''}.`
  ));
  detail.append(when);
  if (t.count) detail.append(makeCounter(t));
  const src = document.createElement('p');
  src.className = 'sources-line';
  const srcLabel = document.createElement('b');
  srcLabel.textContent = 'Sources: ';
  src.append(srcLabel);
  src.append(document.createTextNode(t.sources.map(sourceName).join('; ')));
  detail.append(src);
  card.append(detail);
}

function renderList() {
  const list = document.getElementById('list');
  list.replaceChildren();
  const shown = visibleTrophies();
  for (const t of shown) {
    const earned = state.earned.has(t.name);
    const spoiled = trophyIsSpoiled(t);
    const card = document.createElement('article');
    card.className = 'card' + (earned ? ' earned' : '') + (t.missable ? ' missable-card' : '');
    card.id = `trophy-${t.id}`;

    const head = document.createElement('div');
    head.className = 'card-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'check';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${spoiled ? 'hidden trophy' : t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) state.earned.add(t.name);
      else state.earned.delete(t.name);
      saveEarned();
      renderProgress();
      renderList();
    });
    head.append(box);

    const main = document.createElement('div');
    main.className = 'card-main';
    const titleRow = document.createElement('div');
    titleRow.className = 'card-title';
    const h = document.createElement('h3');
    const nameBtn = document.createElement('button');
    nameBtn.type = 'button';
    nameBtn.textContent = spoiled ? 'Hidden trophy' : t.name;
    nameBtn.addEventListener('click', () => {
      state.openId = state.openId === t.id ? null : t.id;
      renderList();
      if (state.openId === t.id) {
        document.getElementById(`trophy-${t.id}`).scrollIntoView({ block: 'nearest' });
      }
    });
    h.append(nameBtn);
    titleRow.append(h);
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `badge ${t.grade}`;
    gradeBadge.textContent = gradeWord(t.grade);
    titleRow.append(gradeBadge);
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind';
    kindBadge.textContent = KIND_LABELS[t.kind] || t.kind;
    titleRow.append(kindBadge);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'badge missable';
      m.textContent = 'Missable';
      titleRow.append(m);
    }
    if (t.hidden && !spoiled) {
      const hf = document.createElement('span');
      hf.className = 'badge hidden-flag';
      hf.textContent = 'Hidden on PS';
      titleRow.append(hf);
    }
    main.append(titleRow);

    const desc = document.createElement('p');
    desc.className = 'desc';
    if (spoiled) {
      const em = document.createElement('em');
      em.className = 'spoiled';
      em.textContent = 'Hidden trophy — earn it to reveal its name and description. (Spoiler setting is on.)';
      desc.append(em);
    } else {
      const tag = document.createElement('span');
      tag.className = 'official';
      tag.textContent = 'Official: ';
      desc.append(tag, document.createTextNode(t.description));
    }
    main.append(desc);

    if (!spoiled) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'guide-toggle';
      const open = state.openId === t.id;
      toggle.textContent = open ? 'Hide guide ▲' : 'Read the guide ▼';
      toggle.addEventListener('click', () => {
        state.openId = open ? null : t.id;
        renderList();
      });
      main.append(toggle);
    }
    head.append(main);
    card.append(head);
    if (!spoiled && state.openId === t.id) renderDetail(card, t);
    list.append(card);
  }
  document.getElementById('empty').hidden = shown.length > 0;
  renderCountLine(shown.length);
}

function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...state.earned],
    counts: state.counts,
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  file.text().then((text) => {
    const data = JSON.parse(text);
    if (!Array.isArray(data.earned)) throw new Error('no earned list');
    const known = new Set(doc.trophies.map((t) => t.name));
    state.earned = new Set(data.earned.filter((n) => known.has(n)));
    if (data.counts && typeof data.counts === 'object') {
      state.counts = {};
      for (const [id, v] of Object.entries(data.counts)) {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) state.counts[id] = n;
      }
    }
    saveEarned();
    saveCounts();
    renderProgress();
    renderList();
  }).catch(() => {
    alert('That file is not a progress export from this guide.');
  });
}

function readUrlParams() {
  const params = new URLSearchParams(location.search);
  const open = Number(params.get('open'));
  if (Number.isInteger(open) && open >= 1 && open <= 55) state.openId = open;
  const kind = params.get('kind');
  if (kind && [...document.getElementById('kind').options].some((o) => o.value === kind)) {
    state.kind = kind;
    document.getElementById('kind').value = kind;
  }
  if (params.get('spoiler') === '1') {
    state.spoiler = true;
    saveSpoiler();
    document.getElementById('spoiler').checked = true;
  }
  if (params.get('view') === 'roadmap') {
    setTimeout(() => document.getElementById('roadmap').scrollIntoView(), 50);
  }
}

async function boot() {
  const res = await fetch('data/trophies.json');
  doc = await res.json();
  renderSources();
  renderRoadmap();

  document.getElementById('spoiler').checked = state.spoiler;
  document.getElementById('search').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderList();
  });
  document.getElementById('kind').addEventListener('change', (e) => {
    state.kind = e.target.value;
    renderList();
  });
  document.getElementById('grade').addEventListener('change', (e) => {
    state.grade = e.target.value;
    renderList();
  });
  document.getElementById('show').addEventListener('change', (e) => {
    state.show = e.target.value;
    renderList();
  });
  document.getElementById('spoiler').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    saveSpoiler();
    renderList();
  });
  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('change', (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies and counts?')) return;
    state.earned = new Set();
    state.counts = {};
    saveEarned();
    saveCounts();
    renderProgress();
    renderList();
  });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  readUrlParams();
  renderProgress();
  renderList();
  if (state.openId) {
    setTimeout(() => {
      const el = document.getElementById(`trophy-${state.openId}`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }, 60);
  }
}

boot();
