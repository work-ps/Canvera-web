/**
 * ScrollToTop — scrolls window to (0,0) on every route change.
 * Drop inside <BrowserRouter> so it has access to useLocation.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}
