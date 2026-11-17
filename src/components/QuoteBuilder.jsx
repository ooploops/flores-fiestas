import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { MAX_GUESTS, buildQuote, desserts, menus, money, services } from '../data/pricing.js';
import { asset } from '../data/asset.js';

const initial = { event: '', guests: '', services: [], menus: [], dishes: [], desserts: [], pieces: 3 };
const PIECE_CHOICES = [2, 3, 4, 5, 6];
const GUEST_CHIPS = [25, 50, 100, 150, 200, 250];

const getSteps = (a) => [
  'welcome', 'event', 'guests', 'services',
  ...(a.services.includes('catering') ? ['menus', ...menus.filter((m) => a.menus.includes(m.id)).map((m) => `dishes-${m.id}`)] : []),
  ...(a.services.includes('dessert') ? ['desserts', 'pieces'] : []),
  'summary',
];

const guestCount = (a) => {
  const n = Number(a.guests);
  return Number.isInteger(n) && n >= 1 && n <= MAX_GUESTS ? n : 0;
};

function isValid(stepId, a) {
  if (stepId === 'event') return Boolean(a.event);
  if (stepId === 'guests') return guestCount(a) > 0;
  if (stepId === 'services') return a.services.length > 0;
  if (stepId === 'menus') return a.menus.length > 0;
  if (stepId.startsWith('dishes-')) return menus.find((m) => `dishes-${m.id}` === stepId).dishes.some((d) => a.dishes.includes(d.id));
  if (stepId === 'desserts') return a.desserts.length > 0;
  return true;
}

const Price = ({ value, unit }) => <span className="quote-price">{money(value)}<small>{unit}</small></span>;

function Overlay({ onClose }) {
  const [a, setA] = useState(initial);
  const [stepId, setStepId] = useState('welcome');
  const [dir, setDir] = useState('fwd');
  const dialogRef = useRef(null);
  const stepRef = useRef(null);
  const timer = useRef(null);

  const steps = getSteps(a);
  const index = Math.max(0, steps.indexOf(stepId));
  const valid = isValid(stepId, a);
  const n = guestCount(a);
  const quote = buildQuote({ ...a, guests: n });
  const showRunning = n > 0 && quote.lines.length > 0 && !['welcome', 'event', 'guests', 'summary'].includes(stepId);

  const go = (delta) => {
    const target = steps[index + delta];
    if (!target) return;
    setDir(delta > 0 ? 'fwd' : 'back');
    setStepId(target);
  };
  const next = () => { if (valid) go(1); };
  const toggle = (key, id) => setA((c) => ({ ...c, [key]: c[key].includes(id) ? c[key].filter((x) => x !== id) : [...c[key], id] }));
  const pickEvent = (value) => {
    setA((c) => ({ ...c, event: value }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setDir('fwd'); setStepId('guests'); }, 280);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const target = stepRef.current;
    (target?.querySelector('input') || target)?.focus({ preventScroll: true });
  }, [stepId]);

  const hotkeys = (() => {
    if (stepId === 'event') return siteContent.eventTypes.map((t) => () => pickEvent(t));
    if (stepId === 'services') return services.map((s) => () => toggle('services', s.id));
    if (stepId === 'menus') return menus.map((m) => () => toggle('menus', m.id));
    if (stepId.startsWith('dishes-')) return menus.find((m) => `dishes-${m.id}` === stepId).dishes.map((d) => () => toggle('dishes', d.id));
    if (stepId === 'desserts') return desserts.map((d) => () => toggle('desserts', d.id));
    if (stepId === 'pieces') return PIECE_CHOICES.map((p) => () => setA((c) => ({ ...c, pieces: p })));
    return [];
  })();

  const onKeyDown = (event) => {
    if (event.key === 'Escape') { onClose(); return; }
    if (event.key === 'Tab') {
      const items = [...dialogRef.current.querySelectorAll('button:not([disabled]), input, a[href]')];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    const typing = event.target.tagName === 'INPUT';
    if (event.key === 'Enter' && event.target.closest('.quote-options, .quote-cards, .quote-tiles, .quote-chips')) { event.preventDefault(); next(); return; }
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && stepId !== 'summary') { event.preventDefault(); next(); return; }
    if (!typing && !event.metaKey && !event.ctrlKey && /^[a-z]$/i.test(event.key)) {
      hotkeys[event.key.toUpperCase().charCodeAt(0) - 65]?.();
    }
  };

  const summaryText = () => [
    `Quote estimate: ${a.event}, ${n} guests`,
    `${money(quote.perGuest)} per person, ${money(quote.total)} total`,
    ...quote.lines.map((l) => `- ${l.label}${l.detail ? ` (${l.detail})` : ''}`),
  ].join('\n');

  const sendQuote = () => {
    window.dispatchEvent(new CustomEvent('prefill-quote', { detail: { eventType: a.event, guestCount: String(n), message: summaryText() } }));
    onClose();
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const key = (i) => <span className="quote-key" aria-hidden="true">{String.fromCharCode(65 + i)}</span>;
  const check = <span className="quote-check" aria-hidden="true"><Check size={14} strokeWidth={2.4} /></span>;
  const hasMenu = stepId.startsWith('dishes-') ? menus.find((m) => `dishes-${m.id}` === stepId) : null;

  const head = (title, hint) => <><p className="quote-count">{index} <ArrowRight size={12} aria-hidden="true" /></p><h2 id="quote-title">{title}</h2>{hint && <p className="quote-hint">{hint}</p>}</>;
  const cont = (label = 'OK') => <div className="quote-actions"><button type="button" className="quote-btn" disabled={!valid} onClick={next}>{label} <Check size={16} aria-hidden="true" /></button><span className="quote-enter">press <b>Enter</b></span></div>;

  let body;
  if (stepId === 'welcome') {
    body = <><p className="eyebrow">Build a quote</p><h2 id="quote-title" className="quote-big">Let's build<br />your <em>package.</em></h2><p className="quote-hint">Answer a few quick questions and see your price per person.</p><div className="quote-actions"><button type="button" className="quote-btn" onClick={() => go(1)}>Start <ArrowRight size={16} aria-hidden="true" /></button><span className="quote-enter">press <b>Enter</b></span></div></>;
  } else if (stepId === 'event') {
    body = <>{head('What are you celebrating?', 'Choose one.')}<div className="quote-options quote-options-3">{siteContent.eventTypes.map((t, i) => <button type="button" key={t} className={`quote-option${a.event === t ? ' is-selected' : ''}`} aria-pressed={a.event === t} onClick={() => pickEvent(t)}>{key(i)}<span>{t}</span>{check}</button>)}</div></>;
  } else if (stepId === 'guests') {
    body = <>{head('How many guests?', `We serve up to ${MAX_GUESTS} guests.`)}
      <label className="quote-guest-field"><span className="visually-hidden">Number of guests</span><input type="number" inputMode="numeric" min="1" max={MAX_GUESTS} value={a.guests} placeholder="0" onChange={(e) => setA((c) => ({ ...c, guests: e.target.value }))} aria-invalid={Boolean(a.guests) && !n} aria-describedby="guest-error" /></label>
      <p className="quote-error" id="guest-error" role="alert">{a.guests && !n ? `Please enter a number from 1 to ${MAX_GUESTS}.` : ''}</p>
      <div className="quote-chips">{GUEST_CHIPS.map((c) => <button type="button" key={c} className={`quote-chip${Number(a.guests) === c ? ' is-selected' : ''}`} onClick={() => setA((s) => ({ ...s, guests: String(c) }))}>{c}</button>)}</div>
      {cont()}</>;
  } else if (stepId === 'services') {
    body = <>{head('What do you need?', 'Choose one or both.')}<div className="quote-cards quote-cards-2">{services.map((s, i) => <button type="button" key={s.id} className={`quote-card${a.services.includes(s.id) ? ' is-selected' : ''}`} aria-pressed={a.services.includes(s.id)} onClick={() => toggle('services', s.id)}><span className="quote-card-img"><img src={s.image} alt="" style={{ objectPosition: s.focus }} />{key(i)}{check}</span><span className="quote-card-body"><strong>{s.name}</strong><small>{s.blurb}</small></span></button>)}</div>{cont()}</>;
  } else if (stepId === 'menus') {
    body = <>{head('Which menu?', 'Choose one or both.')}<div className="quote-cards quote-cards-2">{menus.map((m, i) => <button type="button" key={m.id} className={`quote-card${a.menus.includes(m.id) ? ' is-selected' : ''}`} aria-pressed={a.menus.includes(m.id)} onClick={() => toggle('menus', m.id)}><span className="quote-card-img"><img src={m.image} alt="" />{key(i)}{check}</span><span className="quote-card-body"><strong>{m.name}</strong><small>{m.dishes.map((d) => d.name).join(', ')}</small></span></button>)}</div>{cont()}</>;
  } else if (hasMenu) {
    body = <><div className="quote-split"><span className="quote-split-img"><img src={hasMenu.image} alt="" /></span><div>{head(`What from the ${hasMenu.name} menu?`, 'Priced per person. Choose as many as you like.')}<div className="quote-options">{hasMenu.dishes.map((d, i) => <button type="button" key={d.id} className={`quote-option${a.dishes.includes(d.id) ? ' is-selected' : ''}`} aria-pressed={a.dishes.includes(d.id)} onClick={() => toggle('dishes', d.id)}>{key(i)}<span>{d.name}</span><Price value={d.price} unit="/person" />{check}</button>)}</div>{cont()}</div></div></>;
  } else if (stepId === 'desserts') {
    body = <>{head('Build your dessert table.', 'Priced per piece. Choose as many as you like.')}<div className="quote-tiles">{desserts.map((d, i) => <button type="button" key={d.id} className={`quote-tile${a.desserts.includes(d.id) ? ' is-selected' : ''}`} aria-pressed={a.desserts.includes(d.id)} onClick={() => toggle('desserts', d.id)}><span className="quote-tile-img"><img src={d.image} alt="" loading="lazy" />{key(i)}{check}</span><span className="quote-tile-body"><strong>{d.name}</strong><Price value={d.price} unit="/piece" /></span></button>)}</div>{cont()}</>;
  } else if (stepId === 'pieces') {
    const each = Math.ceil((n * a.pieces) / Math.max(a.desserts.length, 1));
    body = <>{head('How many pieces per guest?', 'We suggest 3 to start.')}<div className="quote-chips quote-chips-lg">{PIECE_CHOICES.map((p, i) => <button type="button" key={p} className={`quote-chip${a.pieces === p ? ' is-selected' : ''}`} aria-pressed={a.pieces === p} onClick={() => setA((c) => ({ ...c, pieces: p }))}>{p}</button>)}</div><p className="quote-note">That's {n * a.pieces} pieces in total, about {each} of each treat.</p>{cont('See my quote')}</>;
  } else {
    body = <><p className="eyebrow">Your estimate</p><h2 id="quote-title" className="visually-hidden">Your quote estimate</h2>
      <div className="quote-summary"><div className="quote-hero-price" aria-live="polite"><p className="quote-per">{money(quote.perGuest)}<span> per person</span></p><p className="quote-total">{money(quote.total)} total for {n} guests</p><p className="quote-fine">Estimate based on your choices. Final pricing is confirmed with Flores Fiestas.</p>
      <div className="quote-actions"><button type="button" className="quote-btn" onClick={sendQuote}>Send this quote <ArrowRight size={16} aria-hidden="true" /></button><button type="button" className="quote-link" onClick={() => { setA(initial); setDir('back'); setStepId('welcome'); }}>Start over</button></div></div>
      <ul className="quote-lines">{quote.lines.map((l) => <li key={l.key}><span>{l.label}{l.detail && <small>{l.detail}</small>}</span><span className="quote-line-price"><b>{money(l.perGuest)}</b> per person<small>{money(l.total)}</small></span></li>)}</ul></div></>;
  }

  const progress = steps.length > 1 ? index / (steps.length - 1) : 0;

  return (
    <div className="quote-overlay" role="dialog" aria-modal="true" aria-labelledby="quote-title" ref={dialogRef} onKeyDown={onKeyDown}>
      <div className="quote-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <header className="quote-top"><img src={asset('/images/logo.png')} alt="Flores Fiestas" width="1850" height="1620" /><button type="button" className="quote-close" aria-label="Close quote builder" onClick={onClose}><X size={20} /></button></header>
      <div className="quote-stage"><section key={stepId} ref={stepRef} tabIndex={-1} className={`quote-step is-${dir}`}>{body}</section></div>
      <footer className="quote-bottom">
        <div className="quote-running" aria-live="polite">{showRunning && <><b>{money(quote.perGuest)}<span> per person</span></b><small>{money(quote.total)} total</small></>}</div>
        <div className="quote-nav"><button type="button" aria-label="Previous question" disabled={index === 0} onClick={() => go(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next question" disabled={!valid || stepId === 'summary'} onClick={next}><ArrowRight size={18} /></button></div>
      </footer>
    </div>
  );
}

export default function QuoteSection() {
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('lightbox-open');
    return () => document.body.classList.remove('lightbox-open');
  }, [open]);
  const close = () => { setOpen(false); opener.current?.focus(); };

  return (
    <section className="quote section-pad" id="quote">
      <div className="quote-inner">
        <div className="quote-copy">
          <p className="eyebrow" data-reveal>Get a quote</p>
          <h2 data-reveal>Build your <em>package.</em></h2>
          <span className="heading-rule" aria-hidden="true" />
          <p className="quote-lede" data-reveal>Pick your menu and desserts, then see your price per person.</p>
          <ul className="quote-points" data-reveal><li>Up to {MAX_GUESTS} guests</li><li>Italian and Mexican menus</li><li>Dessert tables, built your way</li></ul>
          <button ref={opener} type="button" className="quote-btn" onClick={() => setOpen(true)} data-reveal>Start building <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
        <div className="quote-collage" aria-hidden="true">
          <img src={asset('/images/quote/menu-italian.jpg')} alt="" loading="lazy" /><img src={asset('/images/quote/d-cannoli.jpg')} alt="" loading="lazy" /><img src={asset('/images/quote/menu-mexican.jpg')} alt="" loading="lazy" />
          <span>Stock photo placeholders</span>
        </div>
      </div>
      {open && createPortal(<Overlay onClose={close} />, document.body)}
    </section>
  );
}
