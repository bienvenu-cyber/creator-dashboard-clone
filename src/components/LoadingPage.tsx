import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingPageProps {
  duration?: number;
}

export function LoadingPage({ duration = 2500 }: LoadingPageProps) {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (showLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <iframe
          src="/loading.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          title="Loading"
        />
      </div>
    );
  }

  return <Navigate to="/" replace />;
}

export default LoadingPage;
