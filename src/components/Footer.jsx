import { ArrowUpRight } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { asset } from '../data/asset.js';

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand"><a className="wordmark footer-wordmark" href="#top" aria-label="Flores Events, back to top"><img className="wordmark-logo" src={asset('/images/logo-events.png')} alt="" width="1700" height="980" loading="lazy" /></a><p>{siteContent.brand.statement}</p></div>
      <div className="footer-links"><p className="eyebrow">Pages</p><a href="#services">Services</a><a href="#gallery">Gallery</a><a href="#process">Our process</a><a href="#contact">Contact</a></div>
      <div className="footer-links footer-contact"><p className="eyebrow">Contact</p><span>{siteContent.brand.email}</span><span>{siteContent.brand.phone}</span><span>{siteContent.brand.social} <ArrowUpRight size={13} aria-hidden="true" /></span></div>
      <a className="back-to-top" href="#top" aria-label="Back to top">↑</a>
    </div>
    <ul className="footer-services" aria-label="Services"><li>Catering</li><li>Desserts</li><li>Decor</li></ul>
    <div className="footer-large-type" aria-hidden="true">Flores Events</div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Flores Events</span><span>Serving the Antelope Valley, CA</span></div>
  </footer>;
}