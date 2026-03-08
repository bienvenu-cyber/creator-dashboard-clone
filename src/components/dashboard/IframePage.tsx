import { useCallback } from 'react';
import { NAV_ROUTES } from '@/pages/DashboardLayout';

interface IframePageProps {
  src: string;
  title: string;
}

const NAV_SCRIPT = `
(function() {
  if (window.__navInjected) return;
  window.__navInjected = true;
  
  var routes = ${JSON.stringify({
    Home: '/my/statistics/overview/earnings',
    Notifications: '/my/notifications',
    Statements: '/my/statements/earnings',
    Statistics: '/my/statistics/overview/earnings',
  })};

  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el !== document.body) {
      var name = el.getAttribute && el.getAttribute('data-name');
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
`;

export function IframePage({ src, title }: IframePageProps) {
  const onLoad = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const doc = e.currentTarget.contentDocument;
      if (doc) {
        const script = doc.createElement('script');
        script.textContent = NAV_SCRIPT;
        doc.body.appendChild(script);
      }
    } catch (err) {
      // cross-origin, skip
    }
  }, []);

  return (
    <iframe
      src={src}
      title={title}
      className="w-full border-0"
      style={{ height: '100vh', minHeight: '100vh' }}
      onLoad={onLoad}
    />
  );
}
