(function() {
  if (window.__navInjected) return;
  window.__navInjected = true;

  var routes = {
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  };

  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
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
})();
