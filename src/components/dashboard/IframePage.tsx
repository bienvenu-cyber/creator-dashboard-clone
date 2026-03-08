import { useRef, useCallback } from 'react';

const IFRAME_OVERRIDE_CSS = `
  /* Hide the OF sidebar - React app provides its own */
  .l-header__menu,
  .l-sidebar,
  single-file-infobar,
  .b-mobile-menu,
  #avatarModal {
    display: none !important;
  }

  /* Make content full width */
  .l-wrapper {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  .l-wrapper__holder-content {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 16px !important;
  }
  .l-wrapper__content {
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Hide right sidebar on smaller screens */
  @media (max-width: 1003px) {
    .l-wrapper__sidebar {
      display: none !important;
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .l-wrapper__holder-content {
      padding: 0 8px !important;
    }
    .l-wrapper__sidebar {
      display: none !important;
    }
    .b-tabs__nav {
      overflow-x: auto !important;
      flex-wrap: nowrap !important;
      -webkit-overflow-scrolling: touch;
    }
    .b-tabs__nav__item {
      white-space: nowrap !important;
      flex-shrink: 0 !important;
    }
    /* Statements page responsive */
    .b-statements__aside {
      width: 100% !important;
      min-width: unset !important;
    }
    .b-statements__content {
      width: 100% !important;
    }
    .b-statements {
      flex-direction: column !important;
    }
    /* Statistics page responsive */
    .b-statistics-page-content__wrapper {
      flex-direction: column !important;
    }
    .b-statistics-page-content__aside {
      width: 100% !important;
      min-width: unset !important;
    }
    /* Table overflow */
    table {
      display: block !important;
      overflow-x: auto !important;
    }
  }

  @media (max-width: 480px) {
    .l-wrapper__holder-content {
      padding: 0 4px !important;
    }
    .b-stats-row__value,
    .b-earning-table td {
      font-size: 13px !important;
    }
  }

  /* Ensure body has no extra margin */
  body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }
`;

interface IframePageProps {
  src: string;
  title: string;
}

export function IframePage({ src, title }: IframePageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const style = doc.createElement('style');
        style.textContent = IFRAME_OVERRIDE_CSS;
        doc.head.appendChild(style);
      }
    } catch (e) {
      console.warn('Could not inject styles into iframe:', e);
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      onLoad={handleLoad}
      className="w-full border-0"
      style={{ height: '100vh', minHeight: '100vh' }}
    />
  );
}
