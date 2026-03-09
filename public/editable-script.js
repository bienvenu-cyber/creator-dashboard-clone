(function () {
  if (window.__ghostdashInjected) return;
  window.__ghostdashInjected = true;

  // =====================================================
  // GhostDash Inline Editor (iframe-safe)
  // - keeps the nav bridge
  // - adds Edit Mode to make MOST dashboard texts editable
  // - persists values per page via localStorage
  // =====================================================

  // ---------- 1) Global cleanup styles (remove FakeDash green highlight, hide SingleFile infobar)
  var cleanupStyle = document.createElement('style');
  cleanupStyle.id = 'ghostdash-cleanup-style';
  cleanupStyle.textContent = [
    'single-file-infobar{display:none!important;}',

    // Neutralize any existing green focus styles from old editors
    '[contenteditable="true"]{outline:none!important;border:none!important;box-shadow:none!important;}',

    // Our subtle editor styling (applies only while edit-mode is ON)
    'html[data-ghostdash-edit-mode="on"] [contenteditable="true"]{border-radius:3px!important;cursor:text!important;}',
    'html[data-ghostdash-edit-mode="on"] [contenteditable="true"]:hover{background-color:rgba(0,145,234,0.08)!important;}',
    'html[data-ghostdash-edit-mode="on"] [contenteditable="true"]:focus{background-color:rgba(0,145,234,0.12)!important;box-shadow:0 0 0 1.5px rgba(0,145,234,0.4)!important;}',

    // Toolbar
    '#ghostdash-toolbar{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;gap:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '#ghostdash-toolbar button{display:flex;align-items:center;gap:6px;padding:10px 14px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s ease;box-shadow:0 6px 20px rgba(0,0,0,.25);}',
    '#ghostdash-edit-toggle{background:#252936;color:#e8eaed;border:1px solid #3a3f52;}',
    '#ghostdash-edit-toggle[data-state="on"]{background:#00aff0;color:#fff;border-color:#00aff0;}',
    '#ghostdash-save{background:#00aff0;color:#fff;}',
    '#ghostdash-save:hover{background:#0091ea;transform:translateY(-1px);}',
    '#ghostdash-reset{background:#252936;color:#9ca3af;border:1px solid #3a3f52;}',
    '#ghostdash-reset:hover{background:#ef4444;color:#fff;border-color:#ef4444;}',
    '@media (max-width:640px){#ghostdash-toolbar{bottom:70px;right:12px}#ghostdash-toolbar button{padding:9px 12px;font-size:12px}}',
  ].join('\n');
  document.head.appendChild(cleanupStyle);

  // ---------- 2) Nav bridge (keep)
  var routes = {
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  };

  document.addEventListener(
    'click',
    function (e) {
      var target = e.target;
      // Never intercept editing clicks
      if (target && target.closest && target.closest('[contenteditable="true"]')) return;

      var el = target;
      while (el && el !== document.body) {
        if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return;

        var name = el.getAttribute && el.getAttribute('data-name');
        if (el.classList && el.classList.contains('l-header__menu__item')) {
          var route = null;
          if (name && routes[name]) {
            route = routes[name];
          } else {
            var textEl = el.querySelector && el.querySelector('.l-header__menu__item__text');
            if (textEl) {
              var text = (textEl.textContent || '').trim();
              if (routes[text]) route = routes[text];
            }
          }
          e.preventDefault();
          e.stopPropagation();
          if (route) window.parent.postMessage({ type: 'navigate', route: route }, '*');
          return;
        }
        if (name && routes[name]) {
          e.preventDefault();
          e.stopPropagation();
          window.parent.postMessage({ type: 'navigate', route: routes[name] }, '*');
          return;
        }
        el = el.parentElement;
      }
    },
    true
  );

  // ---------- 3) Editor core
  var STORAGE_PREFIX = 'ghostdash_editor_v2_';
  var pageName = getPageName();
  var storageKey = STORAGE_PREFIX + pageName;
  var editMode = false;
  var saveTimer = null;

  function getPageName() {
    var path = window.location.pathname;
    if (path.indexOf('statistics') !== -1) return 'statistics';
    if (path.indexOf('statements') !== -1) return 'statements';
    if (path.indexOf('notifications') !== -1) return 'notifications';
    var parts = path.split('/');
    var file = parts[parts.length - 1] || 'page';
    return file.replace('.html', '') || 'page';
  }

  function isExcluded(el) {
    if (!el || el.nodeType !== 1) return true;
    var tag = el.tagName.toLowerCase();

    // Ignore obvious non-text / risky nodes
    if (
      tag === 'script' ||
      tag === 'style' ||
      tag === 'noscript' ||
      tag === 'svg' ||
      tag === 'path' ||
      tag === 'img' ||
      tag === 'video' ||
      tag === 'canvas' ||
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      tag === 'option'
    )
      return true;

    // Keep navigation usable: don't make menu items editable
    if (el.closest && el.closest('.l-sidebar__menu,.l-sidebar__menu__item,.l-header__menu,.l-header__menu__item')) return true;

    // Avoid our toolbar
    if (el.closest && el.closest('#ghostdash-toolbar')) return true;

    return false;
  }

  function isLeafTextElement(el) {
    if (!el) return false;
    // Safer editing: require no element-children (only text nodes)
    if (el.childElementCount && el.childElementCount > 0) return false;
    var txt = (el.textContent || '').trim();
    if (!txt) return false;
    if (txt.length > 120) return false;

    // Heuristics: numbers, currency, percent, dates, months, or short labels
    var hasNumeric = /[0-9]/.test(txt);
    var hasMoneyOrPct = /[$€£¥%]/.test(txt);
    var looksLikeYear = /\b20\d{2}\b/.test(txt);
    var looksLikeMonth = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/i.test(txt);
    var looksLikeDate = /\b\d{1,2}[\/-]\d{1,2}([\/-]\d{2,4})?\b/.test(txt);
    var shortText = txt.length <= 30;

    return hasNumeric || hasMoneyOrPct || looksLikeYear || looksLikeMonth || looksLikeDate || shortText;
  }

  function getDomPath(el) {
    var parts = [];
    var cur = el;
    var depth = 0;
    while (cur && cur.nodeType === 1 && cur !== document.body && depth < 8) {
      var part = cur.tagName.toLowerCase();

      if (cur.id) {
        part += '#' + cssEscape(cur.id);
        parts.unshift(part);
        break;
      }

      // nth-of-type
      var idx = 1;
      var sib = cur;
      while ((sib = sib.previousElementSibling)) {
        if (sib.tagName === cur.tagName) idx++;
      }
      part += ':nth-of-type(' + idx + ')';
      parts.unshift(part);

      cur = cur.parentElement;
      depth++;
    }
    return parts.join('>');
  }

  function cssEscape(s) {
    // Minimal escape for ids
    return String(s).replace(/([ #;?%&,.+*~\\':"!^$\[\]()=>|\/])/g, '\\$1');
  }

  function collectCandidates() {
    var selector = 'span,div,p,td,th,a,strong,b,small,label,time,h1,h2,h3,h4,h5,h6';
    var nodes = document.querySelectorAll(selector);
    var out = [];
    nodes.forEach(function (el) {
      if (isExcluded(el)) return;
      if (!isLeafTextElement(el)) return;
      out.push(el);
    });
    return out;
  }

  function indexCandidates(candidates) {
    // attach stable key for persistence
    candidates.forEach(function (el) {
      if (!el.getAttribute('data-gd-key')) {
        el.setAttribute('data-gd-key', getDomPath(el));
      }
    });
  }

  function applySavedValues(candidates) {
    var raw;
    try {
      raw = localStorage.getItem(storageKey);
    } catch (e) {
      return 0;
    }
    if (!raw) return 0;

    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return 0;
    }

    var count = 0;
    candidates.forEach(function (el) {
      var k = el.getAttribute('data-gd-key');
      if (!k) return;
      if (data[k] !== undefined && data[k] !== (el.textContent || '')) {
        el.textContent = data[k];
        count++;
      }
    });
    return count;
  }

  function saveValuesDebounced() {
    if (saveTimer) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(function () {
      saveValues();
    }, 200);
  }

  function saveValues() {
    var data = {};
    var candidates = collectCandidates();
    indexCandidates(candidates);
    candidates.forEach(function (el) {
      var k = el.getAttribute('data-gd-key');
      if (!k) return;
      data[k] = el.textContent || '';
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('GhostDash: save failed', e);
    }
    showToast('✅ Sauvegardé');
    return Object.keys(data).length;
  }

  function resetValues() {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    location.reload();
  }

  function setEditMode(on) {
    editMode = !!on;
    document.documentElement.setAttribute('data-ghostdash-edit-mode', editMode ? 'on' : 'off');

    var candidates = collectCandidates();
    indexCandidates(candidates);

    candidates.forEach(function (el) {
      if (editMode) {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      } else {
        el.removeAttribute('contenteditable');
      }
    });

    var toggle = document.getElementById('ghostdash-edit-toggle');
    if (toggle) toggle.setAttribute('data-state', editMode ? 'on' : 'off');

    showToast(editMode ? '✏️ Edit mode ON' : '🔒 Edit mode OFF');
  }

  function createToolbar() {
    if (document.getElementById('ghostdash-toolbar')) return;
    var bar = document.createElement('div');
    bar.id = 'ghostdash-toolbar';
    bar.innerHTML = [
      '<button id="ghostdash-edit-toggle" data-state="off" title="Activer/Désactiver le mode édition">',
      '  <span>Edit</span>',
      '</button>',
      '<button id="ghostdash-save" title="Sauvegarder">',
      '  <span>Sauvegarder</span>',
      '</button>',
      '<button id="ghostdash-reset" title="Réinitialiser cette page">',
      '  <span>Reset</span>',
      '</button>',
    ].join('');

    document.body.appendChild(bar);

    document.getElementById('ghostdash-edit-toggle').addEventListener('click', function () {
      setEditMode(!editMode);
    });

    document.getElementById('ghostdash-save').addEventListener('click', function () {
      saveValues();
    });

    document.getElementById('ghostdash-reset').addEventListener('click', function () {
      if (confirm('Réinitialiser toutes les modifications de cette page ?')) resetValues();
    });
  }

  function showToast(msg) {
    var existing = document.getElementById('ghostdash-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'ghostdash-toast';
    toast.textContent = msg;
    toast.style.cssText =
      'position:fixed;bottom:80px;right:20px;z-index:10001;background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 1800);
  }

  function attachAutosave() {
    document.addEventListener(
      'input',
      function (e) {
        if (!editMode) return;
        var t = e.target;
        if (t && t.getAttribute && t.getAttribute('contenteditable') === 'true') {
          saveValuesDebounced();
        }
      },
      true
    );

    document.addEventListener(
      'focusout',
      function (e) {
        if (!editMode) return;
        var t = e.target;
        if (t && t.getAttribute && t.getAttribute('contenteditable') === 'true') {
          saveValuesDebounced();
        }
      },
      true
    );
  }

  function init() {
    document.documentElement.setAttribute('data-ghostdash-edit-mode', 'off');

    createToolbar();
    attachAutosave();

    // Index  apply saved values (without turning edit mode on)
    var candidates = collectCandidates();
    indexCandidates(candidates);
    var restored = applySavedValues(candidates);

    console.log('💎 GhostDash Editor v2 ready:', { pageName: pageName, candidates: candidates.length, restored: restored });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 350);
    });
  } else {
    setTimeout(init, 350);
  }
})();
