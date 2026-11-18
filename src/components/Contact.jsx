import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { siteContent } from '../data/siteContent.js';
import { openQuote } from '../data/quote.js';

const emptyForm = { name: '', email: '', phone: '', eventType: '', eventDate: '', guestCount: '', message: '' };

export default function Contact() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitted(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!values.eventType) nextErrors.eventType = 'Please choose an event type.';
    if (!values.message.trim()) nextErrors.message = 'Please add a few details.';
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) { document.getElementById(firstInvalid)?.focus(); return; }
    setSubmitted(true);
  };
  const fieldProps = (name) => ({ id: name, name, value: values[name], onChange: updateValue, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined });

  return <section className="contact section-pad" id="contact">
    <div className="contact-intro"><p className="eyebrow" data-reveal>Questions?</p><h2 data-reveal>Say<br /><em>hello.</em></h2><p className="contact-lede" data-reveal>Prefer to talk first? Send us a message and we'll be in touch. We serve Lancaster, Palmdale, Rosamond, Acton, and nearby Antelope Valley communities.</p><button type="button" className="text-link contact-quote-link" onClick={() => openQuote()} data-reveal>Or build a quote instead <ArrowRight size={15} aria-hidden="true" /></button><span className="contact-flourish" aria-hidden="true">F</span></div>
    <div className="contact-form-wrap" data-reveal><div className="form-topline"><span>Inquiry form</span><span>Demo</span></div>
      {submitted ? <div className="form-success" role="status" aria-live="polite"><span className="success-mark"><Check size={22} strokeWidth={1.5} /></span><p className="eyebrow">Thank you</p><h3>Your inquiry is ready.</h3><p>This is a website preview, so no message has been sent yet.</p><button type="button" className="text-link" onClick={() => { setValues(emptyForm); setSubmitted(false); }}>Start another inquiry <ArrowRight size={15} /></button></div> : <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field"><label htmlFor="name">Your name <span>*</span></label><input {...fieldProps('name')} autoComplete="name" placeholder="Full name" />{errors.name && <span className="field-error" id="name-error">{errors.name}</span>}</div>
          <div className="form-field"><label htmlFor="email">Email address <span>*</span></label><input {...fieldProps('email')} type="email" autoComplete="email" placeholder="you@example.com" />{errors.email && <span className="field-error" id="email-error">{errors.email}</span>}</div>
        </div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="phone">Phone number <span className="optional">Optional</span></label><input {...fieldProps('phone')} type="tel" autoComplete="tel" placeholder="(000) 000-0000" /></div>
          <div className="form-field"><label htmlFor="eventType">Event type <span>*</span></label><select {...fieldProps('eventType')}><option value="">Choose an event type</option>{siteContent.eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>{errors.eventType && <span className="field-error" id="eventType-error">{errors.eventType}</span>}</div>
        </div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="eventDate">Event date <span className="optional">Optional</span></label><input {...fieldProps('eventDate')} type="date" /></div>
          <div className="form-field"><label htmlFor="guestCount">Guest count <span className="optional">Optional</span></label><input {...fieldProps('guestCount')} type="number" min="1" inputMode="numeric" placeholder="e.g. 40" /></div>
        </div>
        <div className="form-field form-message"><label htmlFor="message">Event details <span>*</span></label><textarea {...fieldProps('message')} rows="3" placeholder="What are you planning, and which city is it in?" />{errors.message && <span className="field-error" id="message-error">{errors.message}</span>}</div>
        <div className="form-submit-row"><p>Fields marked <span>*</span> are required.</p><button className="submit-button" type="submit">Send inquiry <ArrowRight size={16} aria-hidden="true" /></button></div>
        <p className="demo-note">Demo form: nothing is sent or saved.</p>
      </form>}
    </div>
  </section>;
}