import { useEffect, useState } from 'react';

function readHash() {
  if (typeof window === 'undefined') return '/';
  const h = window.location.hash.replace(/^#/, '') || '/';
  return h;
}

export function useRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  return [route, navigate];
}
