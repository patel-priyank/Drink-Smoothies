import { useEffect, useRef } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Create from './pages/Create';
import Home from './pages/Home';
import Update from './pages/Update';

const App = () => {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const setNavHeight = () => {
      const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;

      document.documentElement.style.setProperty('--nav-height', `${Math.ceil(navHeight)}px`);
    };

    setNavHeight();

    const handleLoad = () => setNavHeight();

    window.addEventListener('resize', setNavHeight);
    window.addEventListener('load', handleLoad);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        setNavHeight();
      });
    }

    return () => {
      window.removeEventListener('resize', setNavHeight);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <BrowserRouter>
      <nav ref={navRef}>
        <h1>Drink Smoothies</h1>

        <div className="links">
          <Link to="/">Smoothies</Link>
          <Link to="/create">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
