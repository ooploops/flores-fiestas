import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { openQuote } from '../data/quote.js';

function SectionHeading({ eyebrow, children, className = '' }) {
  return <div className={`section-heading ${className}`}><p className="eyebrow" data-reveal>{eyebrow}</p><h2 data-reveal>{children}</h2><span className="heading-rule" aria-hidden="true" />
  </div>;
}

export function Hero() {
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow">Flores Events <span /> Catering, Desserts &amp; Decor</p>
      <h1 id="hero-title">Every celebration,<br /><em>beautifully</em> styled.</h1>
      <div className="hero-lower"><p>Catering, dessert tables, and decor for weddings, birthdays, and every occasion in between.</p>
        <div className="hero-actions"><button type="button" className="text-link" onClick={() => openQuote()}>Build your quote <ArrowRight size={16} aria-hidden="true" /></button><a className="text-link hero-secondary" href="#gallery">See our work</a></div>
      </div>
    </div>
    <div className="hero-art">
      <div className="hero-art-inner">
        <img className="hero-photo" src={siteContent.hero.image} alt={siteContent.hero.alt} width="1400" height="935" fetchPriority="high" />
        <span className="scene-label"><span>Stock photo placeholder</span></span>
      </div>
    </div>
    <a className="scroll-cue" href="#introduction"><span>Scroll</span><ArrowDown size={15} strokeWidth={1.4} aria-hidden="true" /></a>
  </section>;
}

export function Introduction() {
  return <section className="introduction section-pad" id="introduction">
    <div className="intro-grid"><SectionHeading eyebrow="About us" className="intro-heading">Great parties start with <em>the details.</em></SectionHeading>
      <div className="intro-copy" data-reveal><p>Flores Events caters the food and styles dessert tables, decor, and table settings. We keep everything personal, warm, and elegant.</p><a href="#process" className="underlined-link">How it works <span aria-hidden="true">↗</span></a></div>
    </div>
    <div className="intro-art" data-reveal>
      <img className="cover-photo" src={siteContent.intro.image} alt={siteContent.intro.alt} loading="lazy" style={{ objectPosition: siteContent.intro.focus }} />
      <span className="intro-image-caption"><span>Stock photo placeholder</span></span>
    </div>
  </section>;
}

export function Services() {
  return <section className="services section-pad" id="services">
    <div className="services-heading-row"><SectionHeading eyebrow="Services">What we <em>offer.</em></SectionHeading><p className="services-intro" data-reveal>Choose one, or combine them.</p></div>
    <div className="service-list">{siteContent.services.map((service) => <article className="service-row" key={service.number} data-reveal>
      <span className="service-number">{service.number}</span>
      <div className="service-art" aria-hidden="true"><img className="cover-photo" src={service.image} alt="" loading="lazy" style={{ objectPosition: service.focus }} /><span className="service-art-caption">Stock photo placeholder</span></div>
      <div className="service-description"><h3>{service.title}</h3><p>{service.description}</p></div><button type="button" className="service-link" onClick={() => openQuote({ answers: { services: [service.quote] }, step: 'event' })} aria-label={`Get a quote for ${service.title}`}><ArrowUpRight size={19} strokeWidth={1.4} /></button>
    </article>)}</div>
  </section>;
}

function GalleryArtwork({ item }) {
  return <span className="gallery-art"><img className="gallery-photo" src={item.image} alt={item.alt} loading="lazy" style={{ objectPosition: item.focus }} /><span className="gallery-label">Stock photo placeholder</span></span>;
}

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const closeButton = useRef(null);
  const opener = useRef(null);
  const activeItem = activeIndex === null ? null : siteContent.gallery[activeIndex];

  const openViewer = (index, event) => {
    opener.current = event.currentTarget;
    setActiveIndex(index);
  };
  const closeViewer = () => {
    setActiveIndex(null);
    opener.current?.focus();
  };

  useEffect(() => {
    if (activeIndex === null) return undefined;
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeViewer();
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % siteContent.gallery.length);
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + siteContent.gallery.length) % siteContent.gallery.length);
      if (event.key === 'Tab') {
        const controls = document.querySelectorAll('.lightbox button');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('lightbox-open');
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('lightbox-open'); };
  }, [activeIndex]);

  return <section className="gallery section-pad" id="gallery">
    <div className="gallery-heading-row"><SectionHeading eyebrow="Gallery">Ideas for <em>your event.</em></SectionHeading><p data-reveal>A few styles to get you started.</p></div>
    <div className="gallery-grid">{siteContent.gallery.map((item, index) => <button className={`gallery-item gallery-${item.shape}`} type="button" key={item.title} onClick={(event) => openViewer(index, event)} aria-label={`View photo: ${item.title}`} data-reveal>
      <GalleryArtwork item={item} /><span className="gallery-caption"><span>{item.title}</span><span>{item.detail}</span></span>
    </button>)}</div>
    {activeItem && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${activeItem.title} photo`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeViewer(); }}>
      <button className="lightbox-close" ref={closeButton} type="button" aria-label="Close image viewer" onClick={closeViewer}><X size={22} /></button>
      <button className="lightbox-arrow prev" type="button" aria-label="Previous photo" onClick={() => setActiveIndex((index) => (index - 1 + siteContent.gallery.length) % siteContent.gallery.length)}><ArrowLeft size={20} /></button>
      <GalleryArtwork item={activeItem} /><div className="lightbox-caption"><span>{activeItem.title}</span><button type="button" className="lightbox-plan" onClick={() => { setActiveIndex(null); openQuote({ answers: { event: activeItem.occasion }, step: 'guests' }); }}>Plan something like this</button><span>{activeIndex + 1} / {siteContent.gallery.length}</span></div>
      <button className="lightbox-arrow next" type="button" aria-label="Next photo" onClick={() => setActiveIndex((index) => (index + 1) % siteContent.gallery.length)}><ArrowRight size={20} /></button>
    </div>}
  </section>;
}

export function Process() {
  return <section className="process section-pad" id="process">
    <div className="process-heading-row"><SectionHeading eyebrow="How it works">Three <em>simple steps.</em></SectionHeading></div>
    <div className="process-steps">
      {siteContent.process.map((step) => <article className="process-step" key={step.number}><span className="process-number">{step.number}</span><h3 data-reveal>{step.title}</h3><p data-reveal>{step.description}</p></article>)}
    </div>
    <div className="process-cta" data-reveal><button type="button" className="quote-btn" onClick={() => openQuote()}>Build your quote <ArrowRight size={16} aria-hidden="true" /></button></div>
  </section>;
}