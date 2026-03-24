import { useWindowScroll } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const [_, scrollTo] = useWindowScroll();
  const location = useLocation();

  useEffect(() => {
    scrollTo({ top: 0, left: 0 });
  }, [location, scrollTo]);

  return null;
}
