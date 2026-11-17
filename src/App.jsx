import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header.jsx';
import { Hero, Introduction, Services, Gallery, Process } from './components/EditorialSections.jsx';
import Contact from './components/Contact.jsx';
import QuoteSection from './components/QuoteBuilder.jsx';
import Footer from './components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 701px)' }, (context) => {
      const { motion, desktop } = context.conditions;
      if (!motion) return;

      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .fromTo('.hero-art', { clipPath: 'inset(5% 0)', scale: 1.035, opacity: 0 }, { clipPath: 'inset(0)', scale: 1, opacity: 1, duration: 1.1 }, 0.1)
        .fromTo('.hero-copy > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.13 }, 0.25);

      // Reveals replay every time an element enters from below and reset when scrolled back above it.
      gsap.set('[data-reveal]', { opacity: 0, y: 28 });
      const show = (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1, overwrite: true });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        onEnter: show,
        onEnterBack: show,
        onLeave: show,
        onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 28, duration: 0.4, ease: 'power1.in', overwrite: true }),
      });

      gsap.utils.toArray('.heading-rule').forEach((rule) => {
        gsap.fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: rule, start: 'top 92%', toggleActions: 'play none play reset' } });
      });

      // Photos are oversized inside their frames so they can drift without exposing edges.
      const drift = desktop ? 7 : 5;
      const zoom = desktop ? 1.18 : 1.14;
      gsap.utils.toArray('.hero-photo, .intro-art .cover-photo, .service-art .cover-photo, .gallery-grid .gallery-photo').forEach((image) => {
        gsap.fromTo(image, { yPercent: -drift, scale: zoom }, { yPercent: drift, scale: zoom, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.to('.hero-copy', { y: desktop ? -50 : -24, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.fromTo('.contact-flourish', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.footer-large-type', { yPercent: -18 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.to('.gallery', { '--ghost-shift': desktop ? '-70px' : '-30px', ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } });

      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      // The horizontal desktop line draws left to right, the stacked mobile line top to bottom.
      gsap.fromTo('.timeline-progress', desktop ? { scaleX: 0, scaleY: 1, transformOrigin: 'left center' } : { scaleY: 0, scaleX: 1, transformOrigin: 'top center' }, { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-steps', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } });
      gsap.utils.toArray('.process-step').forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: 'top 72%', toggleClass: { targets: step, className: 'is-active' } });
      });

      document.querySelectorAll('.primary-navigation > a[href^="#"]:not(.nav-inquire)').forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;
        ScrollTrigger.create({ trigger: section, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => link.classList.toggle('is-active', self.isActive) });
      });
    });
    return () => mm.revert();
  }, []);

  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><Hero /><Introduction /><Services /><Gallery /><Process /><QuoteSection /><Contact /></main><Footer /></>;
}