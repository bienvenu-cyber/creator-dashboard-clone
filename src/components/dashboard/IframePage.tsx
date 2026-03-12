import { useRef, useCallback, useEffect } from 'react';


interface IframePageProps {
  src: string;
  title: string;
}

// The entire editable-script.js content is injected inline to bypass CSP
// (CSP in HTML files blocks external script-src but allows 'unsafe-inline')
const GHOSTDASH_SCRIPT = `
(function () {
  if (window.__ghostdashInjected) return;
  window.__ghostdashInjected = true;

  // ---------- 1) Styles
  var s = document.createElement('style');
  s.id = 'ghostdash-cleanup-style';
  s.textContent = [
    'single-file-infobar{display:none!important;}',
    '[contenteditable="true"],[contenteditable="plaintext-only"]{outline:none!important;border:none!important;box-shadow:none!important;}',
    '[data-gd-candidate="1"]{cursor:pointer!important;transition:background .15s ease;}',
    '[data-gd-candidate="1"]:hover{background-color:rgba(0,145,234,0.08)!important;border-radius:3px!important;}',
    '[data-gd-active="1"]{background-color:rgba(0,145,234,0.12)!important;box-shadow:0 0 0 1.5px rgba(0,145,234,0.4)!important;border-radius:3px!important;}',
    '#ghostdash-toolbar{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;gap:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '#ghostdash-toolbar button{display:flex;align-items:center;gap:6px;padding:10px 14px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s ease;box-shadow:0 6px 20px rgba(0,0,0,.25);}',
    '#ghostdash-reset{background:#252936;color:#9ca3af;border:1px solid #3a3f52;}',
    '#ghostdash-reset:hover{background:#ef4444;color:#fff;border-color:#ef4444;}',
     '#ghostdash-editor-panel{position:fixed;z-index:10002;min-width:240px;max-width:380px;background:#1a1d29;color:#e8eaed;border:1px solid #3a3f52;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.5);display:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-height:80vh;overflow:hidden;flex-direction:column;}',
     '#ghostdash-editor-panel[data-open="1"]{display:flex;}',
     '#ghostdash-editor-panel:not([data-open="1"]){pointer-events:none;}',
     '#ghostdash-editor-panel .gd-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 8px;border-bottom:1px solid #2a2e3d;flex-shrink:0;}',
     '#ghostdash-editor-panel .gd-header-title{font-size:13px;font-weight:800;color:#00aff0;}',
     '#ghostdash-editor-panel .gd-header-close{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:18px;padding:2px 6px;border-radius:6px;}',
     '#ghostdash-editor-panel .gd-header-close:hover{background:#252936;color:#e8eaed;}',
     '#ghostdash-editor-panel .gd-tabs{display:flex;gap:0;border-bottom:1px solid #2a2e3d;flex-shrink:0;}',
     '#ghostdash-editor-panel .gd-tab{flex:1;padding:8px 10px;font-size:11px;font-weight:700;text-align:center;cursor:pointer;border:none;background:transparent;color:#9ca3af;border-bottom:2px solid transparent;transition:all .15s ease;}',
     '#ghostdash-editor-panel .gd-tab.active{color:#00aff0;border-bottom-color:#00aff0;background:rgba(0,175,240,.06);}',
     '#ghostdash-editor-panel .gd-tab:hover:not(.active){color:#e8eaed;background:rgba(255,255,255,.04);}',
     '#ghostdash-editor-panel .gd-fields{padding:10px 14px;overflow-y:auto;flex:1;min-height:0;}',
     '#ghostdash-editor-panel .gd-field{margin-bottom:10px;}',
     '#ghostdash-editor-panel .gd-field:last-child{margin-bottom:0;}',
     '#ghostdash-editor-panel .gd-field-label{font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}',
     '#ghostdash-editor-panel .gd-field-input{width:100%;box-sizing:border-box;background:#252936;color:#e8eaed;border:1px solid #3a3f52;border-radius:10px;padding:9px 12px;font-size:14px;outline:none;}',
     '#ghostdash-editor-panel .gd-field-input:focus{border-color:#00aff0;box-shadow:0 0 0 3px rgba(0,175,240,.15);}',
     '#ghostdash-editor-panel .gd-footer{display:flex;gap:8px;justify-content:flex-end;padding:8px 14px 12px;border-top:1px solid #2a2e3d;flex-shrink:0;}',
     '#ghostdash-editor-panel .gd-btn{padding:8px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;border:1px solid transparent;transition:all .15s ease;}',
     '#ghostdash-editor-panel .gd-btn-save{background:#00aff0;color:#fff;}',
     '#ghostdash-editor-panel .gd-btn-save:hover{background:#0091ea;}',
     '#ghostdash-editor-panel .gd-btn-reset{background:transparent;color:#ef4444;border-color:#3a3f52;}',
     '#ghostdash-editor-panel .gd-btn-reset:hover{background:#ef4444;color:#fff;border-color:#ef4444;}',
     '#ghostdash-editor-panel .gd-btn-close{background:transparent;color:#9ca3af;border-color:#3a3f52;}',
     '#ghostdash-editor-panel .gd-btn-close:hover{background:#252936;color:#e8eaed;}',
     '#ghostdash-hint{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9998;background:#252936;color:#9ca3af;padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,.3);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;opacity:0;transition:opacity .3s ease;pointer-events:none;}',
     '#ghostdash-hint[data-show="1"]{opacity:1;}',
     // Theme toggle
     '#ghostdash-editor-panel .gd-theme-toggle{display:flex;align-items:center;gap:8px;padding:6px 14px;border-top:1px solid #2a2e3d;flex-shrink:0;}',
     '#ghostdash-editor-panel .gd-theme-toggle label{font-size:11px;font-weight:700;color:#9ca3af;cursor:pointer;}',
     '#ghostdash-editor-panel .gd-theme-switch{position:relative;width:36px;height:20px;background:#3a3f52;border-radius:10px;cursor:pointer;transition:background .2s;}',
     '#ghostdash-editor-panel .gd-theme-switch.active{background:#00aff0;}',
     '#ghostdash-editor-panel .gd-theme-switch-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;}',
     '#ghostdash-editor-panel .gd-theme-switch.active .gd-theme-switch-knob{transform:translateX(16px);}',
     // Chart overlay
     '.gd-chart-editable{cursor:pointer!important;position:relative!important;}',
     '.gd-chart-editable:hover{outline:2px dashed rgba(0,175,240,.4)!important;outline-offset:2px!important;}',
     '.gd-chart-edit-overlay{position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;pointer-events:none;}',
     '.gd-chart-edit-overlay.active{pointer-events:auto;}',
     '.gd-chart-point{position:absolute;width:14px;height:14px;background:#00aff0;border:2px solid #fff;border-radius:50%;cursor:grab;transform:translate(-50%,-50%);z-index:11;box-shadow:0 2px 8px rgba(0,0,0,.3);}',
     '.gd-chart-point:active{cursor:grabbing;background:#0091ea;transform:translate(-50%,-50%) scale(1.2);}',
     '.gd-chart-point:hover{background:#0091ea;transform:translate(-50%,-50%) scale(1.15);}',
     // Month inputs in chart form
     '#ghostdash-editor-panel .gd-month-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}',
     '#ghostdash-editor-panel .gd-month-item{display:flex;flex-direction:column;gap:2px;}',
     '#ghostdash-editor-panel .gd-month-item.current{border:1px solid #00aff0;border-radius:8px;padding:4px;background:rgba(0,175,240,.08);}',
     '#ghostdash-editor-panel .gd-month-label{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;}',
     '#ghostdash-editor-panel .gd-month-input{width:100%;box-sizing:border-box;background:#252936;color:#e8eaed;border:1px solid #3a3f52;border-radius:6px;padding:6px 8px;font-size:12px;outline:none;}',
     '#ghostdash-editor-panel .gd-month-input:focus{border-color:#00aff0;}',
     '#ghostdash-editor-panel .gd-annual-row{display:flex;gap:8px;align-items:center;margin-bottom:10px;}',
     '#ghostdash-editor-panel .gd-annual-input{flex:1;box-sizing:border-box;background:#252936;color:#e8eaed;border:1px solid #3a3f52;border-radius:10px;padding:9px 12px;font-size:14px;outline:none;}',
     '#ghostdash-editor-panel .gd-annual-input:focus{border-color:#00aff0;}',
     '#ghostdash-editor-panel .gd-distribute-btn{background:#00aff0;color:#fff;border:none;border-radius:10px;padding:9px 14px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;}',
     '#ghostdash-editor-panel .gd-distribute-btn:hover{background:#0091ea;}',
     '@media (max-width:640px){#ghostdash-toolbar{bottom:70px;right:12px}#ghostdash-toolbar button{padding:9px 12px;font-size:12px}#ghostdash-editor-panel{left:8px!important;right:8px!important;top:auto!important;bottom:80px!important;max-width:none!important;max-height:60vh!important;border-radius:14px 14px 14px 14px;}}',
     // Mobile bottom nav: force fixed positioning immediately, no scroll dependency
     '@media (max-width:1003.98px){.l-header__menu{position:fixed!important;bottom:0!important;left:0!important;right:0!important;z-index:9999!important;display:flex!important;visibility:visible!important;opacity:1!important;transform:none!important;transition:none!important;padding-bottom:env(safe-area-inset-bottom)!important;}}',
     '@media (max-width:1003.98px){body{padding-bottom:calc(60px + env(safe-area-inset-bottom))!important;}}',
  ].join('\\n');
  document.head.appendChild(s);

  // ---------- 1b) Force mobile bottom nav visibility immediately (no scroll/delay dependency)
  function forceBottomNav() {
    var nav = document.querySelector('.l-header__menu');
    if (!nav) return;
    if (window.innerWidth <= 1003) {
      nav.style.setProperty('position', 'fixed', 'important');
      nav.style.setProperty('bottom', '0', 'important');
      nav.style.setProperty('left', '0', 'important');
      nav.style.setProperty('right', '0', 'important');
      nav.style.setProperty('z-index', '9999', 'important');
      nav.style.setProperty('display', 'flex', 'important');
      nav.style.setProperty('visibility', 'visible', 'important');
      nav.style.setProperty('opacity', '1', 'important');
      nav.style.setProperty('transform', 'none', 'important');
      nav.style.setProperty('padding-bottom', 'env(safe-area-inset-bottom)', 'important');
    }
  }
  forceBottomNav();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceBottomNav);
  }
  window.addEventListener('load', forceBottomNav);
  var navObserver = new MutationObserver(forceBottomNav);
  navObserver.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function() { navObserver.disconnect(); }, 5000);

  // ---------- 2) Disable native contenteditable
  function disableNativeContentEditable() {
    document.querySelectorAll('[contenteditable="true"],[contenteditable="plaintext-only"]').forEach(function (el) {
      el.setAttribute('contenteditable', 'false');
    });
  }

  // ---------- 3) Nav bridge
  var isMobilePage = window.location.pathname.indexOf('-mobile') !== -1;
  var isOnStatisticsMobile = window.location.pathname.indexOf('statistics-mobile') !== -1;
  var isOnStatementsMobile = window.location.pathname.indexOf('statements-mobile') !== -1;

  var routes = {
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  };

  if (isMobilePage) {
    if (isOnStatementsMobile) {
      routes.Home = '/my/statistics/overview/earnings';
    } else {
      routes.Home = '/my/statements/earnings';
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target;
    if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor-panel,[data-gd-avatar]')) return;

    // Block ALL external links
    var linkEl = target && target.closest && target.closest('a[href]');
    if (linkEl) {
      var linkHref = linkEl.getAttribute('href') || '';
      if (linkHref.indexOf('http') === 0 || linkHref.indexOf('//') === 0) {
        e.preventDefault(); e.stopPropagation();
        return;
      }
    }

    var el = target;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return;
      var name = el.getAttribute && el.getAttribute('data-name');
      if (name && routes[name]) {
        e.preventDefault(); e.stopPropagation();
        if (isMobilePage && name !== 'Home') return;
        window.parent.postMessage({ type: 'navigate', route: routes[name] }, '*');
        return;
      }
      if (el.classList && el.classList.contains('l-header__menu__item')) {
        e.preventDefault(); e.stopPropagation();
        var navName = el.getAttribute && el.getAttribute('data-name');
        if (!navName) {
          var textEl = el.querySelector && el.querySelector('.l-header__menu__item__text');
          if (textEl) navName = (textEl.textContent || '').trim();
        }
        if (isMobilePage && navName !== 'Home') return;
        var route = navName && routes[navName] ? routes[navName] : null;
        if (route) window.parent.postMessage({ type: 'navigate', route: route }, '*');
        return;
      }
      if (el.tagName === 'A' && el.href) {
        var href = el.getAttribute('href') || '';
        if (href.indexOf('/my/') === 0 || href.indexOf('/my/') > 0) {
          e.preventDefault(); e.stopPropagation();
          if (isMobilePage) return;
          for (var rName in routes) {
            if (href.indexOf(routes[rName]) !== -1) {
              window.parent.postMessage({ type: 'navigate', route: routes[rName] }, '*');
              return;
            }
          }
          window.parent.postMessage({ type: 'navigate', route: '/my/statistics/overview/earnings' }, '*');
          return;
        }
      }
      el = el.parentElement;
    }
  }, true);

  // ---------- 4) Persistence
  var STORAGE_PREFIX = 'ghostdash_patches_v3_';
  var pageName = (function () {
    var p = window.location.pathname;
    if (p.indexOf('statistics') !== -1) return 'statistics';
    if (p.indexOf('statements') !== -1) return 'statements';
    if (p.indexOf('notifications') !== -1) return 'notifications';
    return p.split('/').pop().replace('.html', '') || 'page';
  })();
  var storageKey = STORAGE_PREFIX + pageName;

  function readPatches() {
    try { var r = localStorage.getItem(storageKey); return r ? JSON.parse(r) : {}; } catch (e) { return {}; }
  }
  function writePatches(p) {
    try { localStorage.setItem(storageKey, JSON.stringify(p)); } catch (e) {}
  }
  function getTextNodes(el) {
    var out = [];
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return (n && n.nodeValue && n.nodeValue.trim()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n; while ((n = w.nextNode())) out.push(n);
    return out;
  }
  function applyPatches() {
    var patches = readPatches();
    var keys = Object.keys(patches);
    if (!keys.length) return 0;
    var applied = 0;
    keys.forEach(function (k) {
      var parts = k.split('||');
      if (parts.length !== 2) return;
      var sel = parts[0], idx = parseInt(parts[1], 10);
      if (!sel || isNaN(idx)) return;
       try {
         var el = document.querySelector(sel);
         if (!el) return;
         var nodes = getTextNodes(el);
         var newVal = String(patches[k]);
         if (nodes[idx]) {
           var orig = nodes[idx].nodeValue || '';
           var m = orig.match(/^(\\s*)([\\s\\S]*?)(\\s*)$/);
           nodes[idx].nodeValue = ((m && m[1]) || '') + newVal + ((m && m[3]) || '');
           if (el.childElementCount === 0 && el.childNodes.length === 1) {
             el.textContent = newVal;
           }
         } else if (el.childElementCount === 0) {
           el.textContent = newVal;
         }
         applied++;
       } catch(e) {}
    });
    return applied;
  }
  function resetPatches() {
    try { localStorage.removeItem(storageKey); } catch (e) {}
    location.reload();
  }

  // ---------- 5) Candidate detection
  function isExcluded(el) {
    if (!el || el.nodeType !== 1) return true;
    var tag = el.tagName.toLowerCase();
    if ('script,style,noscript,svg,path,img,video,canvas,input,textarea,select,option'.indexOf(tag) !== -1) return true;
    if (el.closest && el.closest('#ghostdash-toolbar,#ghostdash-editor-panel,#ghostdash-hint')) return true;
    if (el.closest && el.closest('.l-sidebar__menu,.l-sidebar__menu__item,.l-header__menu,.l-header__menu__item')) return true;
    return false;
  }
  function isEligibleText(t) {
    if (!t) return false;
    t = String(t).trim();
    if (!t || t.length > 200) return false;
    return /[0-9]/.test(t) || /[\\$\\€\\£\\¥%]/.test(t) || /\\b20\\d{2}\\b/.test(t) ||
      /\\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\\b/i.test(t) ||
      /\\b\\d{1,2}[\\/\\-]\\d{1,2}/.test(t) || t.length <= 80;
  }
  function markCandidates() {
    var sel = 'span,div,p,td,th,a,strong,b,small,label,time,h1,h2,h3,h4,h5,h6,li';
    var nodes = document.querySelectorAll(sel);
    var marked = 0;
    nodes.forEach(function (el) {
      if (isExcluded(el)) return;
      if (el.childElementCount > 8) return;
      var ok = false;
      for (var i = 0; i < el.childNodes.length; i++) {
        var cn = el.childNodes[i];
        if (cn.nodeType === Node.TEXT_NODE && (cn.nodeValue || '').trim() && isEligibleText(cn.nodeValue)) { ok = true; break; }
      }
      if (!ok) {
        var txt = (el.innerText || el.textContent || '').trim();
        if (isEligibleText(txt) && el.childElementCount <= 3) ok = true;
      }
      if (ok) { el.setAttribute('data-gd-candidate', '1'); marked++; }
    });
    return marked;
  }
  function getDomSelector(el) {
    var parts = [];
    var cur = el, depth = 0;
    while (cur && cur.nodeType === 1 && cur !== document.body && depth < 10) {
      var part = cur.tagName.toLowerCase();
      if (cur.id) { part += '#' + cssEsc(cur.id); parts.unshift(part); break; }
      var idx = 1, sib = cur;
      while ((sib = sib.previousElementSibling)) { if (sib.tagName === cur.tagName) idx++; }
      part += ':nth-of-type(' + idx + ')';
      parts.unshift(part);
      cur = cur.parentElement; depth++;
    }
    return parts.join('>');
  }
  function cssEsc(s) { return String(s).replace(/([ #;?%&,.+*~\\\\\\\\'":\\!\\^\\$\\[\\]\\(\\)=>|\\/])/g, '\\\\$1'); }

  // ---------- 6) Smart grouping
  function detectPattern(text) {
    text = text.trim();
    if (/^\\$[\\d,]+\\.?\\d*$/.test(text)) return 'money_usd';
    if (/^\\€[\\d,]+\\.?\\d*$/.test(text)) return 'money_eur';
    if (/^[\\d,]+\\.?\\d*%$/.test(text)) return 'percentage';
    if (/^\\d{1,2}[\\s\\/\\-](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text)) return 'date';
    if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text)) return 'date';
    if (/^[\\d,]+$/.test(text)) return 'number';
    return 'text';
  }

  function findRelatedFields(clickedEl, clickedTextNode) {
    var fields = [];
    var clickedText = (clickedTextNode.nodeValue || '').trim();
    var clickedPattern = detectPattern(clickedText);
    var container = clickedEl;
    var containerSelectors = ['.b-stats__item', '.b-table__row', '.b-earnings', '.b-payout', 'tr', '.m-card', '.b-card', '.b-balance'];
    for (var i = 0; i < containerSelectors.length; i++) {
      var c = clickedEl.closest && clickedEl.closest(containerSelectors[i]);
      if (c) { container = c; break; }
    }
    if (container === clickedEl) {
      container = clickedEl.parentElement && clickedEl.parentElement.parentElement && clickedEl.parentElement.parentElement.parentElement || clickedEl.parentElement || clickedEl;
    }
    var candidates = container.querySelectorAll('[data-gd-candidate="1"]');
    if (!candidates.length) candidates = container.querySelectorAll('span,div,p,td,th,strong,b,small,label,h1,h2,h3,h4');
    var seen = new Set();
    candidates.forEach(function (el) {
      if (isExcluded(el)) return;
      var textNodes = getTextNodes(el);
      textNodes.forEach(function (tn, idx) {
        var val = (tn.nodeValue || '').trim();
        if (!val || !isEligibleText(val)) return;
        var selector = getDomSelector(el);
        var key = selector + '||' + idx;
        if (seen.has(key)) return;
        seen.add(key);
        var pattern = detectPattern(val);
        var label = findLabelFor(el, tn, val);
        fields.push({
          textNode: tn, element: el, value: val, pattern: pattern,
          patchKey: key, label: label, isClicked: (tn === clickedTextNode),
        });
      });
    });
    fields.sort(function (a, b) {
      if (a.isClicked && !b.isClicked) return -1;
      if (!a.isClicked && b.isClicked) return 1;
      if (a.pattern === clickedPattern && b.pattern !== clickedPattern) return -1;
      if (a.pattern !== clickedPattern && b.pattern === clickedPattern) return 1;
      return 0;
    });
    return fields.slice(0, 12);
  }

  function findLabelFor(el, textNode, value) {
    var prev = el.previousElementSibling;
    if (prev) {
      var pt = (prev.innerText || prev.textContent || '').trim();
      if (pt && pt.length < 40 && pt !== value) return pt;
    }
    var parent = el.parentElement;
    if (parent) {
      var pp = parent.previousElementSibling;
      if (pp) {
        var ppt = (pp.innerText || pp.textContent || '').trim();
        if (ppt && ppt.length < 40 && ppt !== value) return ppt;
      }
      var labelEl = parent.querySelector('.b-tabs__nav__link--active, .m-sm-title, label, .b-stats__item__label, th');
      if (labelEl) {
        var lt = (labelEl.innerText || labelEl.textContent || '').trim();
        if (lt && lt.length < 40 && lt !== value) return lt;
      }
    }
    return value.length > 25 ? value.substring(0, 22) + '...' : value;
  }

  // ---------- 7) Multi-field Editor Panel with Tabs (Edit + Chart)
  var activeFields = [];
  var currentTab = 'edit'; // 'edit' or 'chart'

  function createEditorPanel() {
    if (document.getElementById('ghostdash-editor-panel')) return;
    var panel = document.createElement('div');
    panel.id = 'ghostdash-editor-panel';
    panel.innerHTML = '<div class="gd-header">' +
      '<span class="gd-header-title">Ghostdash</span>' +
      '<button class="gd-header-close" id="gd-panel-close">\\u2715</button>' +
      '</div>' +
      '<div class="gd-tabs">' +
      '<button class="gd-tab active" id="gd-tab-edit" data-tab="edit">\\u270f\\ufe0f Edit</button>' +
      '<button class="gd-tab" id="gd-tab-chart" data-tab="chart">\\ud83d\\udcc8 Chart</button>' +
      '</div>' +
      '<div class="gd-fields" id="gd-fields-container"></div>' +
      '<div class="gd-fields" id="gd-chart-container" style="display:none;"></div>' +
      '<div class="gd-theme-toggle" id="gd-theme-row">' +
      '<label>\\ud83c\\udf19 Dark Mode</label>' +
      '<div class="gd-theme-switch" id="gd-theme-switch"><div class="gd-theme-switch-knob"></div></div>' +
      '</div>' +
      '<div class="gd-footer">' +
      '<button class="gd-btn gd-btn-reset" id="gd-panel-reset">Reset</button>' +
      '<button class="gd-btn gd-btn-close" id="gd-panel-cancel">Fermer</button>' +
      '<button class="gd-btn gd-btn-save" id="gd-panel-save">\\u2714 Sauvegarder</button>' +
      '</div>';
    document.body.appendChild(panel);
    document.getElementById('gd-panel-close').addEventListener('click', closePanel);
    document.getElementById('gd-panel-cancel').addEventListener('click', closePanel);
    document.getElementById('gd-panel-save').addEventListener('click', function() {
      if (currentTab === 'edit') commitPanel();
      else commitChartEdits();
    });
    document.getElementById('gd-panel-reset').addEventListener('click', function () {
      if (confirm('R\\u00e9initialiser toutes les modifications de cette page ?')) resetPatches();
    });

    // Tab switching
    document.getElementById('gd-tab-edit').addEventListener('click', function() { switchTab('edit'); });
    document.getElementById('gd-tab-chart').addEventListener('click', function() { switchTab('chart'); });

    // Theme toggle
    var isDark = document.documentElement.classList.contains('m-mode-dark');
    var themeSwitch = document.getElementById('gd-theme-switch');
    if (isDark) themeSwitch.classList.add('active');
    themeSwitch.addEventListener('click', function() {
      var html = document.documentElement;
      html.classList.toggle('m-mode-dark');
      themeSwitch.classList.toggle('active');
      var nowDark = html.classList.contains('m-mode-dark');
      try { localStorage.setItem('dark_mode', nowDark ? '1' : ''); } catch(e) {}
      // Notify parent to sync theme across iframes
      try { window.parent.postMessage({ type: 'ghostdash-theme-changed', dark: nowDark }, '*'); } catch(e) {}
    });
  }

  function switchTab(tab) {
    currentTab = tab;
    var editTab = document.getElementById('gd-tab-edit');
    var chartTab = document.getElementById('gd-tab-chart');
    var fieldsC = document.getElementById('gd-fields-container');
    var chartC = document.getElementById('gd-chart-container');
    if (tab === 'edit') {
      editTab.classList.add('active'); chartTab.classList.remove('active');
      fieldsC.style.display = ''; chartC.style.display = 'none';
    } else {
      chartTab.classList.add('active'); editTab.classList.remove('active');
      fieldsC.style.display = 'none'; chartC.style.display = '';
      buildChartForm();
    }
  }

   function openPanel(fields, x, y) {
     createEditorPanel();
     activeFields = fields;
     currentTab = 'edit';
     switchTab('edit');
     fields.forEach(function (f) { f.element.setAttribute('data-gd-active', '1'); });

     var container = document.getElementById('gd-fields-container');
     container.innerHTML = '';
     fields.forEach(function (f, i) {
       var div = document.createElement('div');
       div.className = 'gd-field';
       var labelDiv = document.createElement('div');
       labelDiv.className = 'gd-field-label';
       labelDiv.textContent = f.label;
       labelDiv.title = f.label;
       var input = document.createElement('input');
       input.className = 'gd-field-input';
       input.type = 'text';
       input.value = f.value;
       input.setAttribute('data-field-index', String(i));
       input.addEventListener('keydown', function (e) {
         if (e.key === 'Enter') { e.preventDefault(); commitPanel(); }
         if (e.key === 'Escape') { e.preventDefault(); closePanel(); }
       });
       div.appendChild(labelDiv);
       div.appendChild(input);
       container.appendChild(div);
     });

     var panel = document.getElementById('ghostdash-editor-panel');
     panel.setAttribute('data-open', '1');

     var isMobile = window.innerWidth <= 640;
     if (!isMobile) {
       panel.style.left = '0px';
       panel.style.top = '0px';
       panel.style.right = 'auto';
       panel.style.bottom = 'auto';
       var pRect = panel.getBoundingClientRect();
       var pw = pRect.width || 300;
       var ph = pRect.height || 200;
       var vw = window.innerWidth;
       var vh = window.innerHeight;
       var left = x - pw / 2;
       var top = y + 16;
       if (top + ph > vh - 10) top = Math.max(10, y - ph - 16);
       if (left + pw > vw - 10) left = vw - pw - 10;
       if (left < 10) left = 10;
       if (top + ph > vh - 10) top = vh - ph - 10;
       if (top < 10) top = 10;
       panel.style.left = left + 'px';
       panel.style.top = top + 'px';
     } else {
       panel.style.left = '';
       panel.style.top = '';
       panel.style.right = '';
       panel.style.bottom = '';
     }

     setTimeout(function () {
       var firstInput = container.querySelector('.gd-field-input');
       if (firstInput) { firstInput.focus(); firstInput.select(); }
     }, 50);
   }

  function isPanelOpen() {
    var panel = document.getElementById('ghostdash-editor-panel');
    return !!(panel && panel.getAttribute('data-open') === '1');
  }

  function closePanel() {
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
    pendingClickEvent = null;
    var panel = document.getElementById('ghostdash-editor-panel');
    if (panel) {
      panel.removeAttribute('data-open');
      panel.style.left = '';
      panel.style.top = '';
      panel.style.right = '';
      panel.style.bottom = '';
    }
    activeFields.forEach(function (f) { f.element.removeAttribute('data-gd-active'); });
    activeFields = [];
    activeChartContainer = null;
  }

   function commitPanel() {
     var patches = readPatches();
     var inputs = document.querySelectorAll('#gd-fields-container .gd-field-input');
     var changed = 0;
     inputs.forEach(function (input) {
       var idx = parseInt(input.getAttribute('data-field-index'), 10);
       var field = activeFields[idx];
       if (!field) return;
       var newVal = String(input.value).trim();
       var oldVal = field.value;
       if (newVal !== oldVal) {
         var orig = field.textNode.nodeValue || '';
         var m = orig.match(/^(\\s*)([\\s\\S]*?)(\\s*)$/);
         field.textNode.nodeValue = ((m && m[1]) || '') + newVal + ((m && m[3]) || '');
         var el = field.element;
         if (el && el.childNodes.length === 1 && el.childNodes[0] === field.textNode) {
           // handled
         } else if (el && el.childElementCount === 0) {
           el.textContent = newVal;
         }
         patches[field.patchKey] = newVal;
         field.value = newVal;
         changed++;
       }
     });
     if (changed > 0) {
       writePatches(patches);
       showToast('\\u2705 ' + changed + ' valeur' + (changed > 1 ? 's' : '') + ' sauvegard\\u00e9e' + (changed > 1 ? 's' : ''));
     }
     closePanel();
   }

  // ---------- 7b) Chart Editing System
  var CHART_STORAGE_KEY = 'ghostdash_chart_data_';
  var MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var activeChartContainer = null;

  function getChartStorageKey(chartEl) {
    var id = chartEl.id || getDomSelector(chartEl);
    return CHART_STORAGE_KEY + pageName + '_' + id.replace(/[^a-zA-Z0-9]/g, '_');
  }

  function parseChartData(chartEl) {
    // Extract data from Highcharts SVG points
    var points = chartEl.querySelectorAll('.highcharts-point');
    var data = [];
    points.forEach(function(pt) {
      var label = pt.getAttribute('aria-label') || '';
      // aria-label format: "Day, Date, Time, VALUE . Series Name."
      var valMatch = label.match(/,\\s*([\\d.]+)\\s*\\./);
      var val = valMatch ? parseFloat(valMatch[1]) : 0;
      data.push(val);
    });
    return data;
  }

  function getChartDimensions(chartEl) {
    var svg = chartEl.querySelector('svg.highcharts-root');
    if (!svg) return null;
    var w = parseInt(svg.getAttribute('width')) || 568;
    var h = parseInt(svg.getAttribute('height')) || 150;

    // Get Y axis scale from labels
    var yLabels = chartEl.querySelectorAll('.highcharts-yaxis-labels text');
    var maxY = 0;
    yLabels.forEach(function(lbl) {
      var txt = (lbl.textContent || '').replace(/[^\\d.]/g, '');
      var v = parseFloat(txt);
      if (!isNaN(v) && v > maxY) maxY = v;
    });
    if (maxY === 0) maxY = 1;

    // Plot area (usually full width of SVG in these charts)
    var plotBg = chartEl.querySelector('.highcharts-plot-background');
    var plotX = 0, plotY = 0, plotW = w, plotH = h - 1;
    if (plotBg) {
      plotX = parseInt(plotBg.getAttribute('x')) || 0;
      plotY = parseInt(plotBg.getAttribute('y')) || 0;
      plotW = parseInt(plotBg.getAttribute('width')) || w;
      plotH = parseInt(plotBg.getAttribute('height')) || (h - 1);
    }
    return { w: w, h: h, maxY: maxY, plotX: plotX, plotY: plotY, plotW: plotW, plotH: plotH };
  }

  function redrawChart(chartEl, monthlyValues) {
    var dims = getChartDimensions(chartEl);
    if (!dims) return;

    var numPoints = monthlyValues.length;
    if (numPoints === 0) return;

    var maxVal = Math.max.apply(null, monthlyValues);
    if (maxVal === 0) maxVal = 1;
    // Add 20% headroom
    var yMax = maxVal * 1.2;

    var svg = chartEl.querySelector('svg.highcharts-root');
    if (!svg) return;

    // Build path points
    var pathParts = [];
    var areaDown = [];
    var xStep = dims.plotW / (numPoints > 1 ? numPoints - 1 : 1);

    for (var i = 0; i < numPoints; i++) {
      var x = dims.plotX + i * xStep;
      var yVal = monthlyValues[i] || 0;
      var y = dims.plotY + dims.plotH - (yVal / yMax) * dims.plotH;
      if (y < dims.plotY) y = dims.plotY;
      if (i === 0) pathParts.push('M ' + x + ' ' + y);
      else pathParts.push('L ' + x + ' ' + y);
      areaDown.unshift('L ' + x + ' ' + (dims.plotY + dims.plotH));
    }

    var graphD = pathParts.join(' ');
    var areaD = graphD + ' ' + areaDown.join(' ') + ' Z';

    // Update area path
    var areaPath = svg.querySelector('.highcharts-area');
    if (areaPath) areaPath.setAttribute('d', areaD);

    // Update graph path
    var graphPaths = svg.querySelectorAll('.highcharts-graph, .highcharts-tracker-line');
    graphPaths.forEach(function(p) { p.setAttribute('d', graphD); });

    // Update point markers
    var markerGroup = svg.querySelector('.highcharts-markers');
    if (markerGroup) {
      // Remove old points
      var oldPoints = markerGroup.querySelectorAll('.highcharts-point');
      oldPoints.forEach(function(p) { p.remove(); });
      // Remove halo
      var halo = markerGroup.querySelector('.highcharts-halo');
      if (halo) halo.remove();

      for (var j = 0; j < numPoints; j++) {
        var px = dims.plotX + j * xStep;
        var pyVal = monthlyValues[j] || 0;
        var py = dims.plotY + dims.plotH - (pyVal / yMax) * dims.plotH;
        if (py < dims.plotY) py = dims.plotY;
        var point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', String(px));
        point.setAttribute('cy', String(py));
        point.setAttribute('r', '4');
        point.setAttribute('fill', '#00AFF0');
        point.setAttribute('stroke', '#fff');
        point.setAttribute('stroke-width', '2');
        point.setAttribute('class', 'highcharts-point');
        point.setAttribute('data-gd-chart-idx', String(j));
        point.style.cursor = 'pointer';
        markerGroup.appendChild(point);
      }
    }

    // Update Y-axis labels
    var yLabels = svg.querySelectorAll('.highcharts-yaxis-labels text');
    var labelCount = yLabels.length;
    if (labelCount > 0) {
      for (var k = 0; k < labelCount; k++) {
        var fraction = k / (labelCount - 1);
        var labelVal = fraction * yMax;
        yLabels[k].textContent = labelVal >= 1 ? '$' + Math.round(labelVal).toLocaleString() : '$' + labelVal.toFixed(2);
      }
    }

    // Save to localStorage
    var key = getChartStorageKey(chartEl);
    try { localStorage.setItem(key, JSON.stringify(monthlyValues)); } catch(e) {}
  }

  function buildChartForm() {
    var container = document.getElementById('gd-chart-container');
    if (!container) return;
    container.innerHTML = '';

    var currentMonth = new Date().getMonth(); // 0-based

    // Load saved monthly data
    var chartEls = document.querySelectorAll('[data-highcharts-chart]');
    var targetChart = activeChartContainer || (chartEls.length > 0 ? chartEls[0] : null);
    var savedKey = targetChart ? getChartStorageKey(targetChart) : null;
    var savedData = null;
    if (savedKey) {
      try { var s = localStorage.getItem(savedKey); if (s) savedData = JSON.parse(s); } catch(e) {}
    }

    var monthValues = savedData && savedData.length === 12 ? savedData : [0,0,0,0,0,0,0,0,0,0,0,0];

    // Annual input row
    var annualRow = document.createElement('div');
    annualRow.className = 'gd-annual-row';
    var annualInput = document.createElement('input');
    annualInput.className = 'gd-annual-input';
    annualInput.type = 'number';
    annualInput.placeholder = 'Annual figure ($)';
    annualInput.value = '';
    var distBtn = document.createElement('button');
    distBtn.className = 'gd-distribute-btn';
    distBtn.textContent = 'Distribute';
    annualRow.appendChild(annualInput);
    annualRow.appendChild(distBtn);
    container.appendChild(annualRow);

    // Info text
    var info = document.createElement('div');
    info.style.cssText = 'font-size:10px;color:#9ca3af;margin-bottom:8px;';
    info.textContent = 'Enter annual total and distribute, or edit each month individually.';
    container.appendChild(info);

    // Month grid
    var grid = document.createElement('div');
    grid.className = 'gd-month-grid';
    grid.id = 'gd-month-grid';

    MONTH_NAMES.forEach(function(name, idx) {
      var item = document.createElement('div');
      item.className = 'gd-month-item';
      if (idx === currentMonth) item.classList.add('current');
      var label = document.createElement('div');
      label.className = 'gd-month-label';
      label.textContent = name + (idx === currentMonth ? ' \\u2b50' : '');
      var input = document.createElement('input');
      input.className = 'gd-month-input';
      input.type = 'number';
      input.step = '0.01';
      input.value = monthValues[idx] > 0 ? monthValues[idx].toFixed(2) : '';
      input.placeholder = '0.00';
      input.setAttribute('data-month-idx', String(idx));
      input.addEventListener('input', function() {
        // Live update chart
        updateChartFromMonthInputs(targetChart);
      });
      item.appendChild(label);
      item.appendChild(input);
      grid.appendChild(item);
    });
    container.appendChild(grid);

    // Distribute button handler
    distBtn.addEventListener('click', function() {
      var annual = parseFloat(annualInput.value);
      if (isNaN(annual) || annual <= 0) {
        showToast('Enter a valid annual amount');
        return;
      }
      var perMonth = annual / 12;
      var inputs = grid.querySelectorAll('.gd-month-input');
      inputs.forEach(function(inp) {
        inp.value = perMonth.toFixed(2);
      });
      updateChartFromMonthInputs(targetChart);
      showToast('\\ud83d\\udcca Distributed $' + annual.toLocaleString() + ' across 12 months');
    });
  }

  function updateChartFromMonthInputs(chartEl) {
    if (!chartEl) return;
    var inputs = document.querySelectorAll('#gd-month-grid .gd-month-input');
    var values = [];
    inputs.forEach(function(inp) {
      values.push(parseFloat(inp.value) || 0);
    });
    redrawChart(chartEl, values);
  }

  function commitChartEdits() {
    var chartEls = document.querySelectorAll('[data-highcharts-chart]');
    var targetChart = activeChartContainer || (chartEls.length > 0 ? chartEls[0] : null);
    if (targetChart) {
      updateChartFromMonthInputs(targetChart);
      showToast('\\u2705 Chart updated');
    }
    closePanel();
  }

  // Setup chart click handlers
  function setupChartEditing() {
    var charts = document.querySelectorAll('[data-highcharts-chart]');
    charts.forEach(function(chartEl) {
      chartEl.classList.add('gd-chart-editable');
      chartEl.style.cursor = 'pointer';

      // Load saved chart data
      var key = getChartStorageKey(chartEl);
      try {
        var saved = localStorage.getItem(key);
        if (saved) {
          var data = JSON.parse(saved);
          if (data && data.length) redrawChart(chartEl, data);
        }
      } catch(e) {}

      chartEl.addEventListener('click', function(e) {
        // Skip if clicking inside editor panel
        if (e.target.closest && e.target.closest('#ghostdash-editor-panel')) return;
        e.preventDefault();
        e.stopPropagation();

        activeChartContainer = chartEl;
        createEditorPanel();
        var panel = document.getElementById('ghostdash-editor-panel');
        panel.setAttribute('data-open', '1');
        switchTab('chart');

        // Position
        var isMobile = window.innerWidth <= 640;
        if (!isMobile) {
          panel.style.left = '0px';
          panel.style.top = '0px';
          panel.style.right = 'auto';
          panel.style.bottom = 'auto';
          var pRect = panel.getBoundingClientRect();
          var pw = pRect.width || 300;
          var ph = pRect.height || 200;
          var vw = window.innerWidth;
          var vh = window.innerHeight;
          var left = e.clientX - pw / 2;
          var top = e.clientY + 16;
          if (top + ph > vh - 10) top = Math.max(10, e.clientY - ph - 16);
          if (left + pw > vw - 10) left = vw - pw - 10;
          if (left < 10) left = 10;
          if (top + ph > vh - 10) top = vh - ph - 10;
          if (top < 10) top = 10;
          panel.style.left = left + 'px';
          panel.style.top = top + 'px';
        } else {
          panel.style.left = '';
          panel.style.top = '';
          panel.style.right = '';
          panel.style.bottom = '';
        }
      }, true);
    });
  }

   // ---------- 8) Click & Double-click handlers
   var clickTimer = null;
   var pendingClickEvent = null;

   function getTextNodeFromPoint(e) {
     var x = e.clientX, y = e.clientY, node = null;
     if (document.caretPositionFromPoint) {
       var pos = document.caretPositionFromPoint(x, y);
       node = pos && pos.offsetNode;
     } else if (document.caretRangeFromPoint) {
       var range = document.caretRangeFromPoint(x, y);
       node = range && range.startContainer;
     }
     if (!node) return null;
     if (node.nodeType === Node.TEXT_NODE) return node;
     if (node.nodeType === Node.ELEMENT_NODE) {
       var texts = getTextNodes(node);
       if (texts.length) return texts[0];
     }
     return null;
   }

   function handleEditTrigger(e) {
     var target = e.target;
     if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor-panel,[data-gd-avatar]')) return;
     // Skip chart containers — they have their own handler
     if (target && target.closest && target.closest('[data-highcharts-chart]')) return;

     var textNode = getTextNodeFromPoint(e);
     if (!textNode && target && !isExcluded(target)) {
       var texts = getTextNodes(target);
       if (texts.length === 1) textNode = texts[0];
     }
     if (!textNode) return;

     var directParent = textNode.parentElement;
     var anchor = null;
     var walk = directParent;
     while (walk && walk !== document.body) {
       if (walk.getAttribute && walk.getAttribute('data-gd-candidate') === '1') { anchor = walk; break; }
       walk = walk.parentElement;
     }
     if (!anchor && directParent && !isExcluded(directParent)) anchor = directParent;
     if (!anchor) return;

     e.preventDefault();
     e.stopPropagation();

     closePanel();
     var fields = findRelatedFields(anchor, textNode);
     if (!fields.length) return;
     openPanel(fields, e.clientX, e.clientY);
   }

   function attachClickEdit() {
     document.addEventListener('dblclick', function (e) {
       if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; pendingClickEvent = null; }
       handleEditTrigger(e);
     }, true);

    document.addEventListener('click', function (e) {
      var target = e.target;
      var inPanel = target && target.closest && target.closest('#ghostdash-editor-panel');
      var inToolbar = target && target.closest && target.closest('#ghostdash-toolbar');
      var inAvatar = target && target.closest && target.closest('[data-gd-avatar]');
      var inChart = target && target.closest && target.closest('[data-highcharts-chart]');

      if (isPanelOpen() && !inPanel && !inToolbar && !inChart) {
        closePanel();
      }

      if (inPanel || inToolbar || inAvatar || inChart) return;
      if (target && target.closest && target.closest('.l-sidebar__menu,.l-header__menu,.l-header__menu__item,.b-tabs__nav')) return;

      var link = target && target.closest && target.closest('a[href]');
      if (link) return;

      var candidate = target && target.closest && target.closest('[data-gd-candidate="1"]');
      if (!candidate) return;

      pendingClickEvent = e;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(function () {
        if (pendingClickEvent) {
          handleEditTrigger(pendingClickEvent);
          pendingClickEvent = null;
        }
        clickTimer = null;
      }, 300);
    }, true);

     document.addEventListener('keydown', function (e) {
       if (e.key === 'Escape') closePanel();
     }, true);
   }

  // ---------- 8b) New Post button → opens editor on mobile
  function setupNewPostButton() {
    var postBtn = document.querySelector('.PostsCreate, [data-name="PostsCreate"]');
    if (!postBtn) return;

    postBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      // If panel is already open, close it
      if (isPanelOpen()) {
        closePanel();
        return;
      }

      // Open editor with all candidates on the page
      createEditorPanel();
      var allCandidates = document.querySelectorAll('[data-gd-candidate="1"]');
      if (allCandidates.length === 0) {
        markCandidates();
        allCandidates = document.querySelectorAll('[data-gd-candidate="1"]');
      }

      // Gather first few editable fields
      var fields = [];
      var seen = new Set();
      var limit = 12;
      allCandidates.forEach(function(el) {
        if (fields.length >= limit) return;
        if (isExcluded(el)) return;
        var textNodes = getTextNodes(el);
        textNodes.forEach(function(tn, idx) {
          if (fields.length >= limit) return;
          var val = (tn.nodeValue || '').trim();
          if (!val || !isEligibleText(val)) return;
          var selector = getDomSelector(el);
          var key = selector + '||' + idx;
          if (seen.has(key)) return;
          seen.add(key);
          var label = findLabelFor(el, tn, val);
          fields.push({
            textNode: tn, element: el, value: val, pattern: detectPattern(val),
            patchKey: key, label: label, isClicked: false,
          });
        });
      });

      if (fields.length > 0) {
        // Center on screen for mobile
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 3;
        openPanel(fields, cx, cy);
      } else {
        // No editable fields, still open chart form
        var panel = document.getElementById('ghostdash-editor-panel');
        if (!panel) createEditorPanel();
        panel = document.getElementById('ghostdash-editor-panel');
        panel.setAttribute('data-open', '1');
        switchTab('chart');
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        panel.style.bottom = '';
      }
    }, true);
  }

  // ---------- 9) Toolbar removed (reset accessible via editor panel only)
  function createToolbar() {
    // No floating toolbar - clean UI
  }

  function showHint() {
    if (document.getElementById('ghostdash-hint')) return;
    var hint = document.createElement('div');
    hint.id = 'ghostdash-hint';
    hint.textContent = '\\ud83d\\udca1 Cliquez ou double-cliquez sur un texte pour le modifier';
    document.body.appendChild(hint);
    setTimeout(function () { hint.setAttribute('data-show', '1'); }, 300);
    setTimeout(function () { hint.removeAttribute('data-show'); }, 4000);
    setTimeout(function () { hint.remove(); }, 4500);
  }

  // ---------- 10) Toast
  function showToast(msg) {
    var existing = document.getElementById('ghostdash-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'ghostdash-toast';
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:10001;background:#10b981;color:#fff;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:800;box-shadow:0 8px 24px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 1600);
  }

  // ---------- 11) Avatar Editor
  var AVATAR_STORAGE_KEY = 'ghostdash_avatar_data';

  function setupAvatarEditing() {
    var avatarStyle = document.createElement('style');
    avatarStyle.textContent = [
      '.gd-avatar-editable{cursor:pointer!important;position:relative!important;transition:filter .2s ease!important;}',
      '.gd-avatar-editable:hover{filter:brightness(0.7)!important;}',
      '.gd-avatar-overlay{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;pointer-events:none;z-index:10;}',
      '.gd-avatar-editable:hover .gd-avatar-overlay{opacity:1;}',
      '.gd-avatar-overlay-icon{background:rgba(0,0,0,0.6);color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;}',
      'button.m-avatar-item{cursor:pointer!important;-webkit-tap-highlight-color:transparent;}',
      'button.m-avatar-item .g-avatar__img-wrapper{cursor:pointer!important;position:relative!important;transition:filter .2s ease!important;}',
      'button.m-avatar-item:active .g-avatar__img-wrapper{filter:brightness(0.7)!important;}',
      'button.m-avatar-item .gd-avatar-overlay{opacity:0;transition:opacity .2s ease;}',
      'button.m-avatar-item:active .gd-avatar-overlay{opacity:1;}',
    ].join('\\n');
    document.head.appendChild(avatarStyle);

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    var DEFAULT_AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#1a1a1a" width="100" height="100"/><circle cx="50" cy="38" r="18" fill="#3a3a3a"/><ellipse cx="50" cy="85" rx="30" ry="25" fill="#3a3a3a"/></svg>');

    function isPlaceholderGif(src) {
      if (!src) return true;
      return src.indexOf('R0lGODlhAQAB') !== -1 || src.indexOf('data:image/gif;base64,R0lGOD') !== -1;
    }

    function applyAvatar(dataUrl) {
      var allAvatarImgs = document.querySelectorAll(
        'button.m-avatar-item img,' +
        '.g-avatar__img-wrapper img,' +
        '.g-avatar img'
      );
      allAvatarImgs.forEach(function(img) {
        img.src = dataUrl;
        img.srcset = '';
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = 'inherit';
      });
    }

    function loadSavedAvatar() {
      var saved = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) { applyAvatar(saved); return true; }
      return false;
    }

    function injectDefaultAvatarIfNeeded() {
      var allAvatarImgs = document.querySelectorAll(
        'button.m-avatar-item img,' +
        '.g-avatar__img-wrapper img,' +
        '.g-avatar img'
      );
      allAvatarImgs.forEach(function(img) {
        if (isPlaceholderGif(img.src)) {
          img.src = DEFAULT_AVATAR_PLACEHOLDER;
          img.srcset = '';
          img.style.objectFit = 'cover';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.borderRadius = 'inherit';
        }
      });
    }

    if (!loadSavedAvatar()) { injectDefaultAvatarIfNeeded(); }

    window.addEventListener('storage', function(e) {
      if (e.key === AVATAR_STORAGE_KEY && e.newValue) applyAvatar(e.newValue);
    });

    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'ghostdash-avatar-sync' && e.data.dataUrl) {
        applyAvatar(e.data.dataUrl);
        localStorage.setItem(AVATAR_STORAGE_KEY, e.data.dataUrl);
      }
      // Theme sync
      if (e.data && e.data.type === 'ghostdash-theme-sync') {
        if (e.data.dark) document.documentElement.classList.add('m-mode-dark');
        else document.documentElement.classList.remove('m-mode-dark');
        try { localStorage.setItem('dark_mode', e.data.dark ? '1' : ''); } catch(err) {}
        // Update toggle if panel exists
        var sw = document.getElementById('gd-theme-switch');
        if (sw) {
          if (e.data.dark) sw.classList.add('active');
          else sw.classList.remove('active');
        }
      }
    });

    fileInput.addEventListener('change', function() {
      if (!fileInput.files || !fileInput.files[0]) return;
      var file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) { showToast('Image trop lourde (max 5MB)'); return; }
      var reader = new FileReader();
      reader.onload = function(ev) {
        var dataUrl = ev.target.result;
        localStorage.setItem(AVATAR_STORAGE_KEY, dataUrl);
        applyAvatar(dataUrl);
        showToast('\\u2705 Avatar mis \\u00e0 jour !');
        try { window.parent.postMessage({ type: 'ghostdash-avatar-changed', dataUrl: dataUrl }, '*'); } catch(err) {}
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });

    // Mobile avatar button
    var mobileAvatarBtn = document.querySelector('button.m-avatar-item');
    if (mobileAvatarBtn) {
      var mobileAvatarWrapper = mobileAvatarBtn.querySelector('.g-avatar__img-wrapper');
      if (mobileAvatarWrapper && !mobileAvatarWrapper.dataset.gdAvatar) {
        mobileAvatarWrapper.dataset.gdAvatar = '1';
        mobileAvatarWrapper.classList.add('gd-avatar-editable');
        mobileAvatarWrapper.style.position = 'relative';
        var mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'gd-avatar-overlay';
        mobileOverlay.innerHTML = '<div class="gd-avatar-overlay-icon" style="width:20px;height:20px;font-size:11px;">\\ud83d\\udcf7</div>';
        mobileAvatarWrapper.appendChild(mobileOverlay);
      }
      mobileAvatarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      }, true);
    }

    // Desktop avatars
    var desktopAvatars = document.querySelectorAll('.g-avatar__img-wrapper img, .g-avatar img');
    desktopAvatars.forEach(function(el) {
      if (mobileAvatarBtn && mobileAvatarBtn.contains(el)) return;
      var wrapper = el.closest('.g-avatar__img-wrapper') || el.closest('.g-avatar') || el;
      if (wrapper.dataset.gdAvatar) return;
      wrapper.dataset.gdAvatar = '1';
      wrapper.classList.add('gd-avatar-editable');
      wrapper.style.position = 'relative';
      var overlay = document.createElement('div');
      overlay.className = 'gd-avatar-overlay';
      overlay.innerHTML = '<div class="gd-avatar-overlay-icon">\\ud83d\\udcf7</div>';
      wrapper.appendChild(overlay);
      wrapper.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      }, true);
    });
  }

  // ---------- 12) Init
  function init() {
    disableNativeContentEditable();
    createToolbar();
    createEditorPanel();
    attachClickEdit();
    var applied = applyPatches();
    var marked = markCandidates();
    setupAvatarEditing();
    setupChartEditing();
    setupNewPostButton();
    showHint();
    console.log('\\ud83d\\udc8e GhostDash Editor v7 ready', { pageName: pageName, candidates: marked, patchesApplied: applied });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 350); });
  } else {
    setTimeout(init, 350);
  }
})();
`;

export function IframePage({ src, title }: IframePageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const script = doc.createElement('script');
      script.textContent = GHOSTDASH_SCRIPT;
      doc.body.appendChild(script);
    } catch (e) {
      console.warn('IframePage: Could not inject script', e);
    }
  }, []);

  // Broadcast avatar changes and theme changes from any iframe to all others
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ghostdash-avatar-changed' && e.data?.dataUrl) {
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach((f) => {
          if (f !== iframeRef.current) {
            try {
              f.contentWindow?.postMessage({ type: 'ghostdash-avatar-sync', dataUrl: e.data.dataUrl }, '*');
            } catch (err) { /* ignore */ }
          }
        });
      }
      if (e.data?.type === 'ghostdash-theme-changed') {
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach((f) => {
          if (f !== iframeRef.current) {
            try {
              f.contentWindow?.postMessage({ type: 'ghostdash-theme-sync', dark: e.data.dark }, '*');
            } catch (err) { /* ignore */ }
          }
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className="w-full border-0"
      style={{ height: '100vh', minHeight: '100vh' }}
      onLoad={handleLoad}
    />
  );
}
