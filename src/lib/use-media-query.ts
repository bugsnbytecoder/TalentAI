import { useEffect, useState } from 'react';

export function useMediaQuery(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mm = window.matchMedia(q);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    setM(mm.matches);
    mm.addEventListener('change', h);
    return () => mm.removeEventListener('change', h);
  }, [q]);
  return m;
}
