import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './ContactPage.css';

/* Maps ?subject= URL param values → form category option values + display labels */
const SUBJECT_MAP = {
  report:  { value: 'report-issue',  label: 'Report an Issue',   hint: 'Describe the issue and we\'ll look into it right away.' },
  request: { value: 'raise-request', label: 'Raise a Request',   hint: 'Tell us what you need and we\'ll do our best to help.' },
  bulk:    { value: 'bulk-enquiry',  label: 'Bulk Enquiry',      hint: 'Share your requirements and our team will reach out with a custom quote.' },
};

/* ── Toggle component ──────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, id }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      className={`contact-toggle ${checked ? 'contact-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="contact-toggle__thumb" />
    </button>
  );
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const subjectParam  = searchParams.get('subject') || '';
  const subjectMeta   = SUBJECT_MAP[subjectParam] || null;

  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    category: subjectMeta ? subjectMeta.value : '',
    isPhotographer: false,
    studioName: '',
    city: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.isPhotographer && (!form.studioName.trim() || !form.city.trim())) {
      setError('Please fill in your Business / Studio Name and City.');
      return;
    }
    setSent(true);
  };

  return (
    <div className="contact-page">
      <Breadcrumb />

      {/* Main layout */}
      <div className="contact-layout">

        {/* ── Left: heading + contact cards ── */}
        <div className="contact-left">
          <div className="contact-left__header">
            <h1 className="contact-left__title">Get in Touch</h1>
            <p className="contact-left__sub">
              Have questions about our products or services? We'd love to hear from you.
            </p>
          </div>

          {/* WhatsApp card */}
          <div className="contact-channel contact-channel--whatsapp">
            <div className="contact-channel__top">
              <div className="contact-channel__label-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="contact-channel__icon">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.58 3.842 1.583 5.405L2 22l4.734-1.557A9.956 9.956 0 0 0 12.004 22C17.531 22 22 17.527 22 12S17.531 2 12.004 2zm0 18.188a8.155 8.155 0 0 1-4.162-1.14l-.299-.177-3.089 1.016.844-3.08-.196-.315A8.164 8.164 0 0 1 3.84 12c0-4.506 3.666-8.172 8.164-8.172 4.499 0 8.164 3.666 8.164 8.172s-3.665 8.188-8.164 8.188z"/>
                </svg>
                <span className="contact-channel__type">WhatsApp</span>
              </div>
              <p className="contact-channel__number">+91 98765 43210</p>
              <p className="contact-channel__desc">Quick responses, share images directly</p>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel__btn contact-channel__btn--whatsapp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12.004 2C6.477 2 2.004 6.473 2.004 12c0 1.989.58 3.842 1.583 5.405L2 22l4.734-1.557A9.956 9.956 0 0 0 12.004 22C17.531 22 22 17.527 22 12S17.531 2 12.004 2zm0 18.188a8.155 8.155 0 0 1-4.162-1.14l-.299-.177-3.089 1.016.844-3.08-.196-.315A8.164 8.164 0 0 1 3.84 12c0-4.506 3.666-8.172 8.164-8.172 4.499 0 8.164 3.666 8.164 8.172s-3.665 8.188-8.164 8.188z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Toll-Free card */}
          <div className="contact-channel contact-channel--tollfree">
            <div className="contact-channel__top">
              <div className="contact-channel__label-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="contact-channel__icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="contact-channel__type">Toll-Free</span>
              </div>
              <p className="contact-channel__number">1-800-419-0570</p>
              <p className="contact-channel__desc">Available Mon–Sat, 9 AM – 7 PM IST</p>
            </div>
            <a
              href="tel:18004190570"
              className="contact-channel__btn contact-channel__btn--tollfree"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.22 6.22l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Now (Toll-Free)
            </a>
          </div>

          {/* Response footnote */}
          <p className="contact-left__footnote">
            Email support: 24-hour response time · WhatsApp: typically within 2 hours
          </p>
        </div>

        {/* ── Right: message form ── */}
        <div className="contact-right">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="contact-success__title">Message sent!</h2>
              <p className="contact-success__text">
                Thank you, <strong>{form.name.split(' ')[0]}</strong>. We've received your message
                and will get back to you within 24 hours.
              </p>
              <button
                className="contact-success__reset"
                onClick={() => {
                  setSent(false);
                  setForm({ email: '', name: '', phone: '', category: subjectMeta ? subjectMeta.value : '', isPhotographer: false, studioName: '', city: '', message: '' });
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="contact-form-card">
              <div className="contact-form-card__header">
                <h2 className="contact-form-card__title">
                  {subjectMeta ? subjectMeta.label : 'Send us a message'}
                </h2>
                <p className="contact-form-card__sub">
                  {subjectMeta
                    ? subjectMeta.hint
                    : "Fill in the details below and we'll get back to you within 24 hours."}
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                {subjectMeta && (
                  <div className="contact-form__context-pill">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Category pre-selected: <strong>{subjectMeta.label}</strong>
                  </div>
                )}
                {error && (
                  <div className="contact-form__error" role="alert">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="cf-name">
                    Full Name <span className="contact-form__req">*</span>
                  </label>
                  <input
                    id="cf-name"
                    type="text"
                    className="contact-form__input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                </div>

                {/* Phone with country code */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="cf-phone">
                    Phone Number <span className="contact-form__req">*</span>
                  </label>
                  <div className="contact-form__phone-wrap">
                    <div className="contact-form__phone-prefix">
                      <span className="contact-form__phone-flag">IN</span>
                      <span className="contact-form__phone-code">+91</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>
                    <input
                      id="cf-phone"
                      type="tel"
                      className="contact-form__input contact-form__input--phone"
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={set('phone')}
                      autoComplete="tel-national"
                    />
                  </div>
                  <p className="contact-form__field-hint">Preferably your WhatsApp number</p>
                </div>

                {/* Category */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="cf-category">
                    Category
                  </label>
                  <select
                    id="cf-category"
                    className="contact-form__select"
                    value={form.category}
                    onChange={set('category')}
                  >
                    <option value="">Select a category</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="report-issue">Report an Issue</option>
                    <option value="raise-request">Raise a Request</option>
                    <option value="bulk-enquiry">Bulk Enquiry</option>
                    <option value="offer-purchase">Offer / Purchase Related</option>
                  </select>
                </div>

                {/* Photographer toggle */}
                <div className="contact-form__toggle-row">
                  <label className="contact-form__toggle-label" htmlFor="cf-photographer">
                    I am a photographer
                  </label>
                  <Toggle
                    id="cf-photographer"
                    checked={form.isPhotographer}
                    onChange={(val) => setForm((f) => ({ ...f, isPhotographer: val }))}
                  />
                </div>

                {/* Conditional photographer fields */}
                <div className={`contact-form__photographer-fields${form.isPhotographer ? ' contact-form__photographer-fields--visible' : ''}`}>
                  <div className="contact-form__photographer-inner">
                    <div className="contact-form__field">
                      <label className="contact-form__label" htmlFor="cf-studio">
                        Business / Studio Name <span className="contact-form__req">*</span>
                      </label>
                      <input
                        id="cf-studio"
                        type="text"
                        className="contact-form__input"
                        placeholder="e.g. Pixel Perfect Studios"
                        value={form.studioName}
                        onChange={set('studioName')}
                        autoComplete="organization"
                        tabIndex={form.isPhotographer ? 0 : -1}
                      />
                    </div>
                    <div className="contact-form__field">
                      <label className="contact-form__label" htmlFor="cf-city">
                        City / Place <span className="contact-form__req">*</span>
                      </label>
                      <input
                        id="cf-city"
                        type="text"
                        className="contact-form__input"
                        placeholder="e.g. Mumbai, Delhi, Bengaluru"
                        value={form.city}
                        onChange={set('city')}
                        autoComplete="address-level2"
                        tabIndex={form.isPhotographer ? 0 : -1}
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="cf-message">
                    Message <span className="contact-form__req">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    className="contact-form__textarea"
                    placeholder="Tell us how we can help you — whether it's about an order, a product question, or anything else."
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                <button type="submit" className="contact-form__submit">
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
