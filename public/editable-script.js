(function() {
  if (window.__navInjected) return;
  window.__navInjected = true;

  // ==========================================
  // 1. CLEANUP: Hide artifacts & override FakeDash green styles
  // ==========================================
  var cleanupStyle = document.createElement('style');
  cleanupStyle.textContent = [
    // Hide SingleFile infobar
    'single-file-infobar { display: none !important; }',
    // Override FakeDash green contenteditable styles with subtle, native-looking ones
    '[contenteditable="true"] { border-radius: 3px !important; transition: background 0.15s ease !important; cursor: text !important; outline: none !important; border: none !important; box-shadow: none !important; }',
    '[contenteditable="true"]:hover { background-color: rgba(0, 145, 234, 0.08) !important; box-shadow: none !important; border: none !important; }',
    '[contenteditable="true"]:focus { background-color: rgba(0, 145, 234, 0.12) !important; box-shadow: 0 0 0 1.5px rgba(0, 145, 234, 0.4) !important; border: none !important; }',
    // Kill the old green styles completely
    '.editable[contenteditable="true"]:focus, a[contenteditable="true"]:focus { background-color: rgba(0, 145, 234, 0.12) !important; box-shadow: 0 0 0 1.5px rgba(0, 145, 234, 0.4) !important; border: none !important; }',
  ].join('\n');
  document.head.appendChild(cleanupStyle);

  // ==========================================
  // 2. NAVIGATION BRIDGE (iframe → parent React Router)
  // ==========================================
  var routes = {
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  };

  document.addEventListener('click', function(e) {
    var el = e.target;
    // Don't intercept clicks on contenteditable elements
    if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return;
    while (el && el !== document.body) {
      if (el.getAttribute && el.getAttribute('contenteditable') === 'true') return;
      var name = el.getAttribute && el.getAttribute('data-name');
      if (el.classList && el.classList.contains('l-header__menu__item')) {
        var route = null;
        if (name && routes[name]) {
          route = routes[name];
        } else {
          var textEl = el.querySelector('.l-header__menu__item__text');
          if (textEl) {
            var text = textEl.textContent.trim();
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
  }, true);

  // ==========================================
  // 3. EDITABLE DATA PERSISTENCE (localStorage)
  // ==========================================
  var STORAGE_PREFIX = 'ghostdash_';
  var pageName = getPageName();

  function getPageName() {
    var path = window.location.pathname;
    if (path.indexOf('statistics') !== -1) return 'statistics';
    if (path.indexOf('statements') !== -1) return 'statements';
    if (path.indexOf('notifications') !== -1) return 'notifications';
    // Fallback: use filename
    var parts = path.split('/');
    var file = parts[parts.length - 1] || 'page';
    return file.replace('.html', '');
  }

  function getStorageKey() {
    return STORAGE_PREFIX + pageName;
  }

  function getElementKey(el, index) {
    // Build a stable key from tag + position + nearby class/id info
    var tag = el.tagName.toLowerCase();
    var parent = el.parentElement;
    var parentClass = parent ? (parent.className || '').split(' ')[0] : '';
    var parentId = parent ? (parent.id || '') : '';
    var text = (el.textContent || '').trim().substring(0, 30);
    // Use a combination for stability
    return tag + '_' + (parentId || parentClass || 'root') + '_' + index;
  }

  function getAllEditables() {
    return document.querySelectorAll('[contenteditable="true"]');
  }

  function saveAllValues() {
    var elements = getAllEditables();
    var data = {};
    elements.forEach(function(el, i) {
      var key = getElementKey(el, i);
      data[key] = el.innerHTML;
    });
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(data));
    } catch(e) {
      console.warn('GhostDash: Failed to save', e);
    }
    return Object.keys(data).length;
  }

  function loadAllValues() {
    var raw;
    try {
      raw = localStorage.getItem(getStorageKey());
    } catch(e) {
      return 0;
    }
    if (!raw) return 0;
    var data;
    try {
      data = JSON.parse(raw);
    } catch(e) {
      return 0;
    }
    var elements = getAllEditables();
    var count = 0;
    elements.forEach(function(el, i) {
      var key = getElementKey(el, i);
      if (data[key] !== undefined && data[key] !== el.innerHTML) {
        el.innerHTML = data[key];
        count++;
      }
    });
    return count;
  }

  function resetAllValues() {
    try {
      localStorage.removeItem(getStorageKey());
    } catch(e) {}
    location.reload();
  }

  // ==========================================
  // 4. FLOATING TOOLBAR (Save / Reset)
  // ==========================================
  function createToolbar() {
    var toolbar = document.createElement('div');
    toolbar.id = 'ghostdash-toolbar';
    toolbar.innerHTML = [
      '<button id="ghostdash-save" title="Sauvegarder les modifications">',
      '  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      '  <span>Sauvegarder</span>',
      '</button>',
      '<button id="ghostdash-reset" title="Réinitialiser">',
      '  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>',
      '  <span>Reset</span>',
      '</button>',
    ].join('');

    var toolbarStyle = document.createElement('style');
    toolbarStyle.textContent = [
      '#ghostdash-toolbar {',
      '  position: fixed; bottom: 20px; right: 20px; z-index: 9999;',
      '  display: flex; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '}',
      '#ghostdash-toolbar button {',
      '  display: flex; align-items: center; gap: 6px;',
      '  padding: 10px 18px; border: none; border-radius: 10px;',
      '  font-size: 13px; font-weight: 600; cursor: pointer;',
      '  transition: all 0.2s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.3);',
      '}',
      '#ghostdash-save {',
      '  background: #00aff0; color: white;',
      '}',
      '#ghostdash-save:hover {',
      '  background: #0091ea; transform: translateY(-1px);',
      '  box-shadow: 0 6px 20px rgba(0,175,240,0.4);',
      '}',
      '#ghostdash-reset {',
      '  background: #252936; color: #9ca3af; border: 1px solid #3a3f52 !important;',
      '}',
      '#ghostdash-reset:hover {',
      '  background: #ef4444; color: white; border-color: #ef4444 !important;',
      '}',
      '@media (max-width: 640px) {',
      '  #ghostdash-toolbar { bottom: 70px; right: 12px; }',
      '  #ghostdash-toolbar button { padding: 8px 14px; font-size: 12px; }',
      '  #ghostdash-toolbar button span { display: none; }',
      '}',
    ].join('\n');

    document.head.appendChild(toolbarStyle);
    document.body.appendChild(toolbar);

    document.getElementById('ghostdash-save').addEventListener('click', function() {
      var count = saveAllValues();
      showToast('✅ ' + count + ' éléments sauvegardés');
    });

    document.getElementById('ghostdash-reset').addEventListener('click', function() {
      if (confirm('Réinitialiser toutes les modifications de cette page ?')) {
        resetAllValues();
      }
    });
  }

  // ==========================================
  // 5. TOAST NOTIFICATION
  // ==========================================
  function showToast(msg) {
    var existing = document.getElementById('ghostdash-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'ghostdash-toast';
    toast.textContent = msg;
    toast.style.cssText = [
      'position:fixed; bottom:80px; right:20px; z-index:10001;',
      'background:#10b981; color:white; padding:12px 20px;',
      'border-radius:8px; font-size:14px; font-weight:500;',
      'box-shadow:0 8px 24px rgba(0,0,0,0.3);',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      'animation:ghostdash-toast-in 0.25s ease;',
    ].join('');

    if (!document.getElementById('ghostdash-toast-anim')) {
      var animStyle = document.createElement('style');
      animStyle.id = 'ghostdash-toast-anim';
      animStyle.textContent = '@keyframes ghostdash-toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
      document.head.appendChild(animStyle);
    }

    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  }

  // ==========================================
  // 6. INIT
  // ==========================================
  function init() {
    // Load saved values
    var restored = loadAllValues();
    if (restored > 0) {
      console.log('💎 GhostDash: ' + restored + ' valeurs restaurées (' + pageName + ')');
    }

    // Create toolbar
    createToolbar();

    // Auto-save on blur of any contenteditable
    document.addEventListener('focusout', function(e) {
      if (e.target && e.target.getAttribute && e.target.getAttribute('contenteditable') === 'true') {
        saveAllValues();
      }
    }, true);

    console.log('💎 GhostDash Editor ready (' + pageName + ', ' + getAllEditables().length + ' editable elements)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
