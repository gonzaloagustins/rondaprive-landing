import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // When the URL carries a hash anchor (e.g. /industrias#stadiums) let the
    // destination page own the scroll — otherwise we'd snap to top and
    // override its scrollIntoView.
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
