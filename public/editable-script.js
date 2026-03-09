(function () {
  if (window.__ghostdashInjected) return;
  window.__ghostdashInjected = true;

  // =====================================================
  // GhostDash Safe Text Editor (iframe-safe, non-destructive)
  // - Edit mode: click any eligible text to edit via small popover (NO contenteditable)
  // - Persists patches per page via localStorage
  // - Keeps nav bridge
  // =====================================================

  // ---------- 1) Cleanup styles
  var cleanupStyle = document.createElement('style');
  cleanupStyle.id = 'ghostdash-cleanup-style';
  cleanupStyle.textContent = [
    'single-file-infobar{display:none!important;}',

    // Prevent old FakeDash green focus styles from showing
    '[contenteditable="true"],[contenteditable="plaintext-only"]{outline:none!important;border:none!important;box-shadow:none!important;}',

    // Edit mode subtle hover highlight (on candidate elements)
    'html[data-ghostdash-edit-mode="on"] [data-gd-candidate="1"]:hover{background-color:rgba(0,145,234,0.08)!important;border-radius:3px!important;cursor:text!important;}',
    'html[data-ghostdash-edit-mode="on"] [data-gd-active="1"]{background-color:rgba(0,145,234,0.12)!important;box-shadow:0 0 0 1.5px rgba(0,145,234,0.4)!important;border-radius:3px!important;}',

    // Toolbar
    '#ghostdash-toolbar{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;gap:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '#ghostdash-toolbar button{display:flex;align-items:center;gap:6px;padding:10px 14px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s ease;box-shadow:0 6px 20px rgba(0,0,0,.25);}',
    '#ghostdash-edit-toggle{background:#252936;color:#e8eaed;border:1px solid #3a3f52;}',
    '#ghostdash-edit-toggle[data-state="on"]{background:#00aff0;color:#fff;border-color:#00aff0;}',
    '#ghostdash-save{background:#00aff0;color:#fff;}',
    '#ghostdash-save:hover{background:#0091ea;transform:translateY(-1px);}',
    '#ghostdash-reset{background:#252936;color:#9ca3af;border:1px solid #3a3f52;}',
    '#ghostdash-reset:hover{background:#ef4444;color:#fff;border-color:#ef4444;}',

    // Editor popover
    '#ghostdash-editor{position:fixed;z-index:10002;min-width:220px;max-width:320px;background:#1a1d29;color:#e8eaed;border:1px solid #3a3f52;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.45);padding:10px;display:none;}',
    '#ghostdash-editor[data-open="1"]{display:block;}',
    '#ghostdash-editor .gd-title{font-size:12px;font-weight:800;color:#9ca3af;margin:0 0 6px 0;}',
    '#ghostdash-editor input{width:100%;box-sizing:border-box;background:#252936;color:#e8eaed;border:1px solid #3a3f52;border-radius:10px;padding:10px 12px;font-size:14px;outline:none;}',
    '#ghostdash-editor input:focus{border-color:#00aff0;box-shadow:0 0 0 3px rgba(0,175,240,.15)}',
    '#ghostdash-editor .gd-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px;}',
    '#ghostdash-editor .gd-btn{padding:8px 10px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:1px solid transparent;}',
    '#ghostdash-editor .gd-btn-primary{background:#00aff0;color:#fff;}',
    '#ghostdash-editor .gd-btn-secondary{background:transparent;color:#9ca3af;border-color:#3a3f52;}',

    '@media (max-width:640px){#ghostdash-toolbar{bottom:70px;right:12px}#ghostdash-toolbar button{padding:9px 12px;font-size:12px}}',
  ].join('\n');
  document.head.appendChild(cleanupStyle);

  // ---------- 2) Disable any baked-in contenteditable (avoid partial/edit conflicts)
  function disableNativeContentEditable() {
    var els = document.querySelectorAll('[contenteditable="true"],[contenteditable="plaintext-only"]');
    els.forEach(function (el) {
      el.setAttribute('contenteditable', 'false');
    });
  }

  // ---------- 3) Nav bridge (keep)
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
      // Never intercept editor clicks
      if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor')) return;
      if (target && target.closest && target.closest('[data-gd-candidate="1"]') && isEditModeOn()) return;

      var el = target;
      while (el && el !== document.body) {
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

  // ---------- 4) Editor persistence (patches)
  var STORAGE_PREFIX = 'ghostdash_patches_v3_';
  var pageName = getPageName();
  var storageKey = STORAGE_PREFIX + pageName;

  function getPageName() {
    var path = window.location.pathname;
    if (path.indexOf('statistics') !== -1) return 'statistics';
    if (path.indexOf('statements') !== -1) return 'statements';
    if (path.indexOf('notifications') !== -1) return 'notifications';
    var parts = path.split('/');
    var file = parts[parts.length - 1] || 'page';
    return file.replace('.html', '') || 'page';
  }

  function readPatches() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      var obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object') return {};
      return obj;
    } catch (e) {
      return {};
    }
  }

  function writePatches(patches) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(patches));
    } catch (e) {
      console.warn('GhostDash: failed to write patches', e);
    }
  }

  function applyPatches() {
    var patches = readPatches();
    var keys = Object.keys(patches);
    if (keys.length === 0) return 0;

    var applied = 0;
    keys.forEach(function (k) {
      var parts = k.split('||');
      if (parts.length !== 2) return;
      var sel = parts[0];
      var idx = parseInt(parts[1], 10);
      if (!sel || isNaN(idx)) return;

      var el = document.querySelector(sel);
      if (!el) return;
      var nodes = getTextNodes(el);
      if (!nodes[idx]) return;

      var original = nodes[idx].nodeValue || '';
      var m = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      var lead = (m && m[1]) || '';
      var tail = (m && m[3]) || '';
      nodes[idx].nodeValue = lead + String(patches[k]) + tail;
      applied++;
    });

    return applied;
  }

  function resetPatches() {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
    location.reload();
  }

  // ---------- 5) Candidate detection
  function isExcludedElement(el) {
    if (!el || el.nodeType !== 1) return true;

    var tag = el.tagName.toLowerCase();
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

    if (el.closest && el.closest('#ghostdash-toolbar,#ghostdash-editor')) return true;

    // Keep nav usable
    if (el.closest && el.closest('.l-sidebar__menu,.l-sidebar__menu__item,.l-header__menu,.l-header__menu__item')) return true;

    return false;
  }

  function isEligibleText(text) {
    if (!text) return false;
    var t = String(text).trim();
    if (!t) return false;
    // Allow up to 200 chars (covers long banners like "YOU ARE IN THE TOP 100%...")
    if (t.length > 200) return false;

    var hasNumeric = /[0-9]/.test(t);
    var hasMoneyOrPct = /[$€£¥%]/.test(t);
    var looksLikeYear = /\b20\d{2}\b/.test(t);
    var looksLikeMonth = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/i.test(t);
    var looksLikeDate = /\b\d{1,2}[\/-]\d{1,2}([\/-]\d{2,4})?\b/.test(t);
    // Accept any text up to 80 chars (covers labels like "Current balance", "Pending balance", names, etc.)
    var shortText = t.length <= 80;

    return hasNumeric || hasMoneyOrPct || looksLikeYear || looksLikeMonth || looksLikeDate || shortText;
  }

  function markCandidates() {
    // Strategy: find ALL text nodes on the page, then mark their closest eligible ancestor
    var selector = 'span,div,p,td,th,a,strong,b,small,label,time,h1,h2,h3,h4,h5,h6,li';
    var nodes = document.querySelectorAll(selector);
    var marked = 0;

    nodes.forEach(function (el) {
      if (isExcludedElement(el)) return;
      // Skip huge containers (likely layout divs) but allow moderate nesting
      if (el.childElementCount > 8) return;

      // Check if this element has at least one direct text node with eligible content
      var hasDirectText = false;
      for (var i = 0; i < el.childNodes.length; i++) {
        var cn = el.childNodes[i];
        if (cn.nodeType === Node.TEXT_NODE) {
          var t = (cn.nodeValue || '').trim();
          if (t && isEligibleText(t)) {
            hasDirectText = true;
            break;
          }
        }
      }

      // Also mark if innerText is eligible and element is relatively small
      if (!hasDirectText) {
        var txt = (el.innerText || el.textContent || '').trim();
        if (isEligibleText(txt) && el.childElementCount <= 3) {
          hasDirectText = true;
        }
      }

      if (hasDirectText) {
        el.setAttribute('data-gd-candidate', '1');
        marked++;
      }
    });

    return marked;
  }

  function getTextNodes(el) {
    var out = [];
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }

  function getDomSelector(el) {
    // Build a stable CSS selector: prefer #id else build a nth-of-type chain
    var parts = [];
    var cur = el;
    var depth = 0;

    while (cur && cur.nodeType === 1 && cur !== document.body && depth < 10) {
      var part = cur.tagName.toLowerCase();

      if (cur.id) {
        part += '#' + cssEscape(cur.id);
        parts.unshift(part);
        break;
      }

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
    return String(s).replace(/([ #;?%&,.+*~\\':"!^$\[\]()=>|\/])/g, '\\$1');
  }

  // ---------- 6) Editor UI  interactions
  function isEditModeOn() {
    return document.documentElement.getAttribute('data-ghostdash-edit-mode') === 'on';
  }

  function setEditMode(on) {
    document.documentElement.setAttribute('data-ghostdash-edit-mode', on ? 'on' : 'off');
    var toggle = document.getElementById('ghostdash-edit-toggle');
    if (toggle) toggle.setAttribute('data-state', on ? 'on' : 'off');

    if (on) {
      markCandidates();
      showToast('✏️ Edit mode ON');
    } else {
      closeEditor();
      showToast('🔒 Edit mode OFF');
    }
  }

  function createToolbar() {
    if (document.getElementById('ghostdash-toolbar')) return;
    var bar = document.createElement('div');
    bar.id = 'ghostdash-toolbar';
    bar.innerHTML = [
      '<button id="ghostdash-edit-toggle" data-state="off" title="Activer/Désactiver le mode édition"><span>Edit</span></button>',
      '<button id="ghostdash-save" title="Sauvegarder"><span>Sauvegarder</span></button>',
      '<button id="ghostdash-reset" title="Réinitialiser"><span>Reset</span></button>',
    ].join('');
    document.body.appendChild(bar);

    document.getElementById('ghostdash-edit-toggle').addEventListener('click', function () {
      setEditMode(!isEditModeOn());
    });

    document.getElementById('ghostdash-save').addEventListener('click', function () {
      showToast('✅ Déjà sauvegardé (auto)');
    });

    document.getElementById('ghostdash-reset').addEventListener('click', function () {
      if (confirm('Réinitialiser toutes les modifications de cette page ?')) resetPatches();
    });
  }

  function createEditor() {
    if (document.getElementById('ghostdash-editor')) return;
    var ed = document.createElement('div');
    ed.id = 'ghostdash-editor';
    ed.innerHTML = [
      '<div class="gd-title">Modifier la valeur</div>',
      '<input id="ghostdash-editor-input" type="text" />',
      '<div class="gd-actions">',
      '  <button class="gd-btn gd-btn-secondary" id="ghostdash-editor-cancel" type="button">Annuler</button>',
      '  <button class="gd-btn gd-btn-primary" id="ghostdash-editor-ok" type="button">OK</button>',
      '</div>',
    ].join('');
    document.body.appendChild(ed);

    document.getElementById('ghostdash-editor-cancel').addEventListener('click', closeEditor);
    document.getElementById('ghostdash-editor-ok').addEventListener('click', commitEditor);

    var input = document.getElementById('ghostdash-editor-input');
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEditor();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeEditor();
      }
    });
  }

  var active = {
    el: null,
    textNode: null,
    textIndex: -1,
    selector: '',
    patchKey: '',
  };

  function openEditorForTextNode(textNode, anchorEl, x, y) {
    if (!textNode || !anchorEl) return;
    if (isExcludedElement(anchorEl)) return;

    var value = (textNode.nodeValue || '').trim();
    if (!value) return;

    createEditor();

    // Make sure anchor is marked and highlighted
    anchorEl.setAttribute('data-gd-active', '1');

    var selector = getDomSelector(anchorEl);
    var nodes = getTextNodes(anchorEl);
    var idx = nodes.indexOf(textNode);
    if (idx < 0) return;

    active.el = anchorEl;
    active.textNode = textNode;
    active.textIndex = idx;
    active.selector = selector;
    active.patchKey = selector + '||' + String(idx);

    var ed = document.getElementById('ghostdash-editor');
    var input = document.getElementById('ghostdash-editor-input');

    input.value = value;
    ed.setAttribute('data-open', '1');

    // Position near click; keep inside viewport
    var left = Math.min(window.innerWidth - 340, Math.max(10, x - 160));
    var top = Math.min(window.innerHeight - 140, Math.max(10, y + 12));
    ed.style.left = left + 'px';
    ed.style.top = top + 'px';

    setTimeout(function () {
      input.focus();
      input.select();
    }, 0);
  }

  function closeEditor() {
    var ed = document.getElementById('ghostdash-editor');
    if (ed) ed.removeAttribute('data-open');

    if (active.el) active.el.removeAttribute('data-gd-active');

    active.el = null;
    active.textNode = null;
    active.textIndex = -1;
    active.selector = '';
    active.patchKey = '';
  }

  function commitEditor() {
    var input = document.getElementById('ghostdash-editor-input');
    if (!input || !active.textNode || !active.patchKey) return;

    var newVal = String(input.value);

    // Preserve original surrounding whitespace
    var original = active.textNode.nodeValue || '';
    var m = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    var lead = (m && m[1]) || '';
    var tail = (m && m[3]) || '';

    active.textNode.nodeValue = lead + newVal + tail;

    var patches = readPatches();
    patches[active.patchKey] = newVal;
    writePatches(patches);

    closeEditor();
    showToast('✅ Sauvegardé');
  }

  function getTextNodeFromPoint(e) {
    var x = e.clientX;
    var y = e.clientY;

    var node = null;
    if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(x, y);
      node = pos && pos.offsetNode;
    } else if (document.caretRangeFromPoint) {
      var range = document.caretRangeFromPoint(x, y);
      node = range && range.startContainer;
    }

    if (!node) return null;

    if (node.nodeType === Node.TEXT_NODE) return node;

    // If element node, try to get first eligible text node inside
    if (node.nodeType === Node.ELEMENT_NODE) {
      var texts = getTextNodes(node);
      if (texts.length) return texts[0];
    }

    return null;
  }

  function attachEditClick() {
    document.addEventListener(
      'click',
      function (e) {
        if (!isEditModeOn()) return;
        var target = e.target;
        if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor')) return;

        var textNode = getTextNodeFromPoint(e);
        if (!textNode) return;

        // Choose a safe anchor element close to the text node
        var anchor = textNode.parentElement;
        while (anchor && anchor !== document.body) {
          if (anchor.getAttribute && anchor.getAttribute('data-gd-candidate') === '1') break;
          if (isExcludedElement(anchor)) return;
          anchor = anchor.parentElement;
        }
        if (!anchor || anchor === document.body) return;

        e.preventDefault();
        e.stopPropagation();
        openEditorForTextNode(textNode, anchor, e.clientX, e.clientY);
      },
      true
    );

    document.addEventListener(
      'keydown',
      function (e) {
        if (e.key === 'Escape') closeEditor();
      },
      true
    );
  }

  // ---------- 7) Toast
  function showToast(msg) {
    var existing = document.getElementById('ghostdash-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'ghostdash-toast';
    toast.textContent = msg;
    toast.style.cssText =
      'position:fixed;bottom:80px;right:20px;z-index:10001;background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:800;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 1600);
  }

  // ---------- 8) Init
  function init() {
    document.documentElement.setAttribute('data-ghostdash-edit-mode', 'off');

    disableNativeContentEditable();
    createToolbar();
    createEditor();
    attachEditClick();

    var applied = applyPatches();
    var marked = markCandidates();

    console.log('💎 GhostDash Editor v3 ready', {
      pageName: pageName,
      candidates: marked,
      patchesApplied: applied,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 350);
    });
  } else {
    setTimeout(init, 350);
  }
})();
