import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { asset } from '../data/asset.js';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const navigation = useRef(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    requestAnimationFrame(() => navigation.current?.querySelector('a')?.focus());
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const links = navigation.current?.querySelectorAll('a');
        if (!links?.length) return;
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('menu-open');
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.classList.remove('menu-open'); };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <span className="scroll-progress" aria-hidden="true" />
    <a className="wordmark" href="#top" aria-label="Flores Fiestas home" onClick={closeMenu}><img className="wordmark-logo" src={asset('/images/logo.png')} alt="" width="1850" height="1620" /></a>
    <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
      {menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
    </button>
    <nav ref={navigation} id="primary-navigation" className={`primary-navigation${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
      {siteContent.navigation.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
      <a className="nav-inquire" href="#contact" onClick={closeMenu}>Inquire <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" /></a>
    </nav>
  </header>;
}