import { useRef, useCallback } from 'react';

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
     '#ghostdash-editor-panel .gd-header-title{font-size:13px;font-weight:800;color:#00aff0;}',
     '#ghostdash-editor-panel .gd-header-close{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:18px;padding:2px 6px;border-radius:6px;}',
     '#ghostdash-editor-panel .gd-header-close:hover{background:#252936;color:#e8eaed;}',
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
     '@media (max-width:640px){#ghostdash-toolbar{bottom:70px;right:12px}#ghostdash-toolbar button{padding:9px 12px;font-size:12px}#ghostdash-editor-panel{left:8px!important;right:8px!important;top:auto!important;bottom:8px!important;max-width:none!important;max-height:70vh!important;border-radius:14px 14px 14px 14px;}}',
  ].join('\\n');
  document.head.appendChild(s);

  // ---------- 2) Disable native contenteditable
  function disableNativeContentEditable() {
    document.querySelectorAll('[contenteditable="true"],[contenteditable="plaintext-only"]').forEach(function (el) {
      el.setAttribute('contenteditable', 'false');
    });
  }

  // ---------- 3) Nav bridge
  var routes = {
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  };

  document.addEventListener('click', function (e) {
    var target = e.target;
    if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor-panel')) return;

    var el = target;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return;
      var name = el.getAttribute && el.getAttribute('data-name');
      if (name && routes[name]) {
        e.preventDefault(); e.stopPropagation();
        window.parent.postMessage({ type: 'navigate', route: routes[name] }, '*');
        return;
      }
      if (el.classList && el.classList.contains('l-header__menu__item')) {
        var route = null;
        if (name && routes[name]) { route = routes[name]; }
        else {
          var textEl = el.querySelector && el.querySelector('.l-header__menu__item__text');
          if (textEl) { var txt = (textEl.textContent || '').trim(); if (routes[txt]) route = routes[txt]; }
        }
        e.preventDefault(); e.stopPropagation();
        if (route) window.parent.postMessage({ type: 'navigate', route: route }, '*');
        return;
      }
      if (el.tagName === 'A' && el.href) {
        var href = el.getAttribute('href') || '';
        if (href.indexOf('/my/') === 0 || href.indexOf('/my/') > 0) {
          e.preventDefault(); e.stopPropagation();
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
           // Also set textContent for simple elements
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

  // ---------- 6) Smart grouping: find related editable values near clicked element
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

    // Find the closest "container" (card, table row, section)
    var container = clickedEl;
    var containerSelectors = ['.b-stats__item', '.b-table__row', '.b-earnings', '.b-payout', 'tr', '.m-card', '.b-card', '.b-balance'];
    for (var i = 0; i < containerSelectors.length; i++) {
      var c = clickedEl.closest && clickedEl.closest(containerSelectors[i]);
      if (c) { container = c; break; }
    }
    // If no specific container found, go up 3 levels
    if (container === clickedEl) {
      container = clickedEl.parentElement && clickedEl.parentElement.parentElement && clickedEl.parentElement.parentElement.parentElement || clickedEl.parentElement || clickedEl;
    }

    // Collect all candidate elements within the container
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
        // Find a label for this field
        var label = findLabelFor(el, tn, val);
        fields.push({
          textNode: tn,
          element: el,
          value: val,
          pattern: pattern,
          patchKey: key,
          label: label,
          isClicked: (tn === clickedTextNode),
        });
      });
    });

    // Sort: clicked item first, then same pattern, then by DOM order
    fields.sort(function (a, b) {
      if (a.isClicked && !b.isClicked) return -1;
      if (!a.isClicked && b.isClicked) return 1;
      if (a.pattern === clickedPattern && b.pattern !== clickedPattern) return -1;
      if (a.pattern !== clickedPattern && b.pattern === clickedPattern) return 1;
      return 0;
    });

    // Limit to reasonable number
    return fields.slice(0, 12);
  }

  function findLabelFor(el, textNode, value) {
    // Check previous sibling text
    var prev = el.previousElementSibling;
    if (prev) {
      var pt = (prev.innerText || prev.textContent || '').trim();
      if (pt && pt.length < 40 && pt !== value) return pt;
    }
    // Check parent's previous sibling
    var parent = el.parentElement;
    if (parent) {
      var pp = parent.previousElementSibling;
      if (pp) {
        var ppt = (pp.innerText || pp.textContent || '').trim();
        if (ppt && ppt.length < 40 && ppt !== value) return ppt;
      }
      // Check for label-like class
      var labelEl = parent.querySelector('.b-tabs__nav__link--active, .m-sm-title, label, .b-stats__item__label, th');
      if (labelEl) {
        var lt = (labelEl.innerText || labelEl.textContent || '').trim();
        if (lt && lt.length < 40 && lt !== value) return lt;
      }
    }
    // Fallback: use truncated value as label
    return value.length > 25 ? value.substring(0, 22) + '...' : value;
  }

  // ---------- 7) Multi-field Editor Panel
  var activeFields = [];

  function createEditorPanel() {
    if (document.getElementById('ghostdash-editor-panel')) return;
    var panel = document.createElement('div');
    panel.id = 'ghostdash-editor-panel';
    panel.innerHTML = '<div class="gd-header"><span class="gd-header-title">\\u270f\\ufe0f Modifier</span><button class="gd-header-close" id="gd-panel-close">\\u2715</button></div>' +
      '<div class="gd-fields" id="gd-fields-container"></div>' +
      '<div class="gd-footer">' +
      '<button class="gd-btn gd-btn-reset" id="gd-panel-reset">Reset</button>' +
      '<button class="gd-btn gd-btn-close" id="gd-panel-cancel">Fermer</button>' +
      '<button class="gd-btn gd-btn-save" id="gd-panel-save">\\u2714 Sauvegarder</button>' +
      '</div>';
    document.body.appendChild(panel);
    document.getElementById('gd-panel-close').addEventListener('click', closePanel);
    document.getElementById('gd-panel-cancel').addEventListener('click', closePanel);
    document.getElementById('gd-panel-save').addEventListener('click', commitPanel);
    document.getElementById('gd-panel-reset').addEventListener('click', function () {
      if (confirm('R\\u00e9initialiser toutes les modifications de cette page ?')) resetPatches();
    });
  }

   function openPanel(fields, x, y) {
     createEditorPanel();
     activeFields = fields;
     // Mark active elements
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

     // Smart positioning: ensure panel stays within viewport
     var isMobile = window.innerWidth <= 640;
     if (!isMobile) {
       // Reset for measurement
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
       // If panel would overflow bottom, show above click point
       if (top + ph > vh - 10) top = Math.max(10, y - ph - 16);
       // Clamp horizontal
       if (left + pw > vw - 10) left = vw - pw - 10;
       if (left < 10) left = 10;
       // Clamp vertical
       if (top + ph > vh - 10) top = vh - ph - 10;
       if (top < 10) top = 10;
       panel.style.left = left + 'px';
       panel.style.top = top + 'px';
     } else {
       // Mobile: bottom sheet style (handled by CSS)
       panel.style.left = '';
       panel.style.top = '';
       panel.style.right = '';
       panel.style.bottom = '';
     }

     // Focus clicked field
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
         // Update the text node
         var orig = field.textNode.nodeValue || '';
         var m = orig.match(/^(\\s*)([\\s\\S]*?)(\\s*)$/);
         field.textNode.nodeValue = ((m && m[1]) || '') + newVal + ((m && m[3]) || '');
         // Also try to update the element directly if text node didn't visually change
         // This handles cases where innerText is used for rendering
         var el = field.element;
         if (el && el.childNodes.length === 1 && el.childNodes[0] === field.textNode) {
           // Already handled via textNode
         } else if (el && el.childElementCount === 0) {
           // Simple text-only element, set textContent directly
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
     if (target && target.closest && target.closest('#ghostdash-toolbar,#ghostdash-editor-panel')) return;

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
     // Double-click: immediate edit
     document.addEventListener('dblclick', function (e) {
       if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; pendingClickEvent = null; }
       handleEditTrigger(e);
     }, true);

    // Single click: close panel on outside click OR delayed edit on candidate
    document.addEventListener('click', function (e) {
      var target = e.target;
      var inPanel = target && target.closest && target.closest('#ghostdash-editor-panel');
      var inToolbar = target && target.closest && target.closest('#ghostdash-toolbar');

      // Close when clicking anywhere outside panel/toolbar
      if (isPanelOpen() && !inPanel && !inToolbar) {
        closePanel();
      }

      // Skip toolbar/panel/nav elements for edit trigger
      if (inPanel || inToolbar) return;
      if (target && target.closest && target.closest('.l-sidebar__menu,.l-header__menu,.l-header__menu__item,.b-tabs__nav')) return;

      // Skip links
      var link = target && target.closest && target.closest('a[href]');
      if (link) return;

      // Only trigger edit on candidates
      var candidate = target && target.closest && target.closest('[data-gd-candidate="1"]');
      if (!candidate) return;

      // Use a delay to let dblclick cancel single click
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

  // ---------- 9) Toolbar (simplified - just Reset button + hint)
  function createToolbar() {
    if (document.getElementById('ghostdash-toolbar')) return;
    var bar = document.createElement('div');
    bar.id = 'ghostdash-toolbar';
    bar.innerHTML = '<button id="ghostdash-reset"><span>\\ud83d\\uddd1 Reset</span></button>';
    document.body.appendChild(bar);
    document.getElementById('ghostdash-reset').addEventListener('click', function () {
      if (confirm('R\\u00e9initialiser toutes les modifications ?')) resetPatches();
    });
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

  // ---------- 11) Init
  function init() {
    disableNativeContentEditable();
    createToolbar();
    createEditorPanel();
    attachClickEdit();
    var applied = applyPatches();
    var marked = markCandidates();
    showHint();
    console.log('\\ud83d\\udc8e GhostDash Editor v6 ready', { pageName: pageName, candidates: marked, patchesApplied: applied });
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

      // Inject script inline to bypass CSP (which blocks external script-src)
      const script = doc.createElement('script');
      script.textContent = GHOSTDASH_SCRIPT;
      doc.body.appendChild(script);
    } catch (e) {
      // Cross-origin iframes will throw - that's OK for same-origin HTML files
      console.warn('IframePage: Could not inject script', e);
    }
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
