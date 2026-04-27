/**
 * FABAssistant — "Cana"
 * Canvera's context-aware smart assistant · Fin-class UX
 *
 * Architecture:
 *   Two-view panel: Home screen → Chat screen (slide transition)
 *   Message clustering: consecutive same-sender messages grouped
 *   Session memory: conversation restored from sessionStorage on re-open
 *   Resolution flow: 👍 / 👎 after substantive answers
 *   Proactive engagement: time-on-page (25s) + scroll-depth (60%) triggers
 *
 *   assistantEngine.js → page context, intent detection, response generation
 *   FABAssistant.jsx   → UI, state, conversation orchestration
 */

import { useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getPageContext, detectIntent, getResponse } from './assistantEngine';
import './FABAssistant.css';

/* ══════════════════════════════════════════════════════════════════
   STATE MANAGEMENT
══════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'cnv_cana_msgs';
const NOTIF_KEY   = 'cnv_fab_notif';

const initialState = { messages: [], quickReplies: [], input: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'PUSH': {
      const next = [...state.messages, action.msg];
      // Persist non-typing messages to session
      try {
        const toSave = next.filter(m => m.id !== '__typing');
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (_) {}
      return { ...state, messages: next };
    }
    case 'POP_TYPING':
      return { ...state, messages: state.messages.filter(m => m.id !== '__typing') };
    case 'SET_QR':
      return { ...state, quickReplies: action.qr };
    case 'SET_INPUT':
      return { ...state, input: action.value };
    case 'RESTORE':
      return { ...state, messages: action.msgs };
    case 'RESET':
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      return initialState;
    default:
      return state;
  }
}

let msgSeq = 1000;
function makeMsg(from, payload) {
  return { id: ++msgSeq, from, ts: Date.now(), ...payload };
}

/* ══════════════════════════════════════════════════════════════════
   MESSAGE CLUSTERING
   Groups consecutive same-sender messages into a cluster.
   Each cluster renders the avatar once (bottom-aligned for bot).
══════════════════════════════════════════════════════════════════ */
function clusterMessages(messages) {
  const clusters = [];
  let current = null;
  for (const msg of messages) {
    if (!current || current.from !== msg.from) {
      current = { from: msg.from, msgs: [msg], id: msg.id };
      clusters.push(current);
    } else {
      current.msgs.push(msg);
    }
  }
  return clusters;
}

/* ══════════════════════════════════════════════════════════════════
   BUBBLE RENDERERS
══════════════════════════════════════════════════════════════════ */

function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p
      )}
    </>
  );
}

function TypingDots() {
  return (
    <div className="cab__bubble cab__bubble--typing" aria-label="Cana is typing">
      <span className="cab__dot" /><span className="cab__dot" /><span className="cab__dot" />
    </div>
  );
}

function TextBubble({ msg }) {
  return (
    <div className="cab__bubble cab__bubble--bot">
      <RichText text={msg.text} />
    </div>
  );
}

function ListBubble({ msg }) {
  return (
    <div className="cab__bubble cab__bubble--bot cab__bubble--list">
      <ul className="cab__list">
        {msg.items.map((item, i) => (
          <li key={i} className="cab__list-item">
            <span className="cab__list-bullet" aria-hidden="true">›</span>
            <span><RichText text={item} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionBubble({ msg, onNavigate }) {
  return (
    <button className="cab__action-btn" onClick={() => onNavigate(msg.path)}>
      {msg.label}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function ProductsBubble({ msg, onNavigate }) {
  return (
    <div className="cab__products-row">
      {msg.products.map(p => (
        <button key={p.id} className="cab__product-card"
          onClick={() => onNavigate(`/products/${p.slug}`)}>
          <div className="cab__product-img">
            <img src={p.image} alt={p.name} loading="lazy" />
            {p.badge && (
              <span className={`cab__product-badge cab__product-badge--${p.badge}`}>
                {p.badge}
              </span>
            )}
          </div>
          <div className="cab__product-body">
            <p className="cab__product-collection">{p.collection}</p>
            <p className="cab__product-name">{p.name}</p>
            <p className="cab__product-price">from ₹{p.price?.toLocaleString('en-IN')}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ContactBubble({ msg }) {
  return (
    <div className="cab__contact-card">
      <p className="cab__contact-label">Connect with our team</p>
      <div className="cab__contact-options">
        {msg.options.map((opt, i) => (
          <a key={i} href={opt.href} target="_blank" rel="noopener noreferrer"
            className={`cab__contact-opt${opt.primary ? ' cab__contact-opt--primary' : ''}`}>
            <span className="cab__contact-opt-icon">{opt.icon}</span>
            <span className="cab__contact-opt-body">
              <span className="cab__contact-opt-label">{opt.label}</span>
              {opt.sub && <span className="cab__contact-opt-sub">{opt.sub}</span>}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="cab__contact-arrow">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function BotBubble({ msg, onNavigate }) {
  if (msg.id === '__typing') return <TypingDots />;
  switch (msg.type) {
    case 'text':     return <TextBubble     msg={msg} />;
    case 'list':     return <ListBubble     msg={msg} />;
    case 'action':   return <ActionBubble   msg={msg} onNavigate={onNavigate} />;
    case 'products': return <ProductsBubble msg={msg} onNavigate={onNavigate} />;
    case 'contact':  return <ContactBubble  msg={msg} />;
    default:         return null;
  }
}

/* ══════════════════════════════════════════════════════════════════
   MESSAGE CLUSTER COMPONENT
══════════════════════════════════════════════════════════════════ */
function MessageCluster({ cluster, onNavigate }) {
  const isBot = cluster.from === 'bot';

  if (!isBot) {
    return (
      <div className="cab__cluster cab__cluster--user">
        {cluster.msgs.map(msg => (
          <div key={msg.id} className="cab__bubble cab__bubble--user">{msg.text}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="cab__cluster cab__cluster--bot">
      {/* Avatar — bottom-aligned with the cluster, shown once */}
      <div className="cab__cluster-avatar" aria-hidden="true">C</div>
      <div className="cab__cluster-content">
        {cluster.msgs.map(msg => (
          <BotBubble key={msg.id} msg={msg} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RESOLUTION BAR — "Was this helpful?"
══════════════════════════════════════════════════════════════════ */
function ResolutionBar({ onYes, onNo }) {
  return (
    <div className="cab-resolution" role="group" aria-label="Feedback">
      <span className="cab-resolution__label">Was this helpful?</span>
      <button className="cab-resolution__btn cab-resolution__btn--yes" onClick={onYes}
        aria-label="Yes, helpful">
        👍
      </button>
      <button className="cab-resolution__btn cab-resolution__btn--no" onClick={onNo}
        aria-label="No, need more help">
        👎
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PROACTIVE BUBBLE — floats above the FAB
══════════════════════════════════════════════════════════════════ */
function ProactiveBubble({ message, onOpen, onDismiss }) {
  return (
    <div className="cab-proactive" role="complementary">
      <div className="cab-proactive__inner" onClick={onOpen} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onOpen()}>
        <div className="cab-proactive__avatar" aria-hidden="true">C</div>
        <div className="cab-proactive__content">
          <p className="cab-proactive__name">Cana · Canvera</p>
          <p className="cab-proactive__text">{message}</p>
        </div>
      </div>
      <button className="cab-proactive__dismiss" onClick={e => { e.stopPropagation(); onDismiss(); }}
        aria-label="Dismiss">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME SCREEN
══════════════════════════════════════════════════════════════════ */
function HomeScreen({ context, user, onStartChat, onAction }) {
  const userName = user?.name?.split(' ')[0] || '';
  const greeting = userName ? `Hi ${userName}! 👋` : 'Hi there! 👋';

  return (
    <div className="cab-home">
      {/* Hero */}
      <div className="cab-home__hero">
        <div className="cab-home__hero-brand">
          <span className="cab-home__hero-avatar">C</span>
          <span className="cab-home__hero-name">Cana · Canvera</span>
        </div>
        <h2 className="cab-home__hero-greeting">{greeting}</h2>
        <p className="cab-home__hero-sub">How can we help you today?</p>
      </div>

      {/* Scrollable body */}
      <div className="cab-home__body">
        {/* Action cards */}
        <div className="cab-home__actions">
          {context.homeActions.map((action, i) => (
            <button key={i} className="cab-home__card" onClick={() => onAction(action)}>
              <span className="cab-home__card-icon">{action.icon}</span>
              <span className="cab-home__card-text">
                <span className="cab-home__card-label">{action.label}</span>
                <span className="cab-home__card-desc">{action.desc}</span>
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="cab-home__card-arrow" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Message CTA */}
        <div className="cab-home__cta">
          <button className="cab-home__cta-btn" onClick={onStartChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Send us a message
          </button>
          <p className="cab-home__cta-meta">
            <span className="cab-home__online-dot" aria-hidden="true" />
            Online · Typically replies in minutes
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="cab__footer">
        <a href="https://wa.me/919108108108" target="_blank" rel="noopener noreferrer"
          className="cab__footer-link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
        <span className="cab__footer-sep">·</span>
        <a href="tel:+919108108108" className="cab__footer-link">📞 Call Us</a>
        <span className="cab__footer-sep">·</span>
        <span className="cab__footer-brand">Canvera AI</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT SCREEN
══════════════════════════════════════════════════════════════════ */
function ChatScreen({
  state, dispatch, context, clusters,
  showResolution, onResolutionYes, onResolutionNo,
  onBack, onNavigate, bodyRef, inputRef, onSend, onQR,
}) {
  const hasMessages = state.messages.length > 0;

  return (
    <div className="cab-chat">
      {/* Chat header */}
      <div className="cab-chat__header">
        <button className="cab-chat__back" onClick={onBack} aria-label="Back to home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div className="cab-chat__agent">
          <div className="cab-chat__agent-avatar">C</div>
          <div className="cab-chat__agent-info">
            <span className="cab-chat__agent-name">Cana</span>
            <span className="cab-chat__agent-status">
              <span className="cab__status-dot" aria-hidden="true" />
              Online
            </span>
          </div>
        </div>
        <span className="cab__context-chip" title="Your current page">{context.page}</span>
      </div>

      {/* Messages */}
      <div className="cab__body" ref={bodyRef} role="log" aria-live="polite" aria-label="Conversation">
        {!hasMessages && (
          <div className="cab__empty">
            <div className="cab__empty-avatar">C</div>
            <p className="cab__empty-title">Start the conversation</p>
            <p className="cab__empty-sub">Ask me anything about albums, orders, pricing, or support.</p>
          </div>
        )}
        {clusters.map((cluster, i) => (
          <MessageCluster key={cluster.id || i} cluster={cluster} onNavigate={onNavigate} />
        ))}

        {/* Resolution bar */}
        {showResolution && state.messages.length > 0 && (
          <ResolutionBar onYes={onResolutionYes} onNo={onResolutionNo} />
        )}
      </div>

      {/* Quick replies */}
      {state.quickReplies.length > 0 && (
        <div className="cab__qr-rail">
          <div className="cab__qr-scroll">
            {state.quickReplies.map(qr => (
              <button key={qr} className="cab__qr-chip" onClick={() => onQR(qr)}>{qr}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="cab__input-bar">
        <input
          ref={inputRef}
          className="cab__input"
          type="text"
          value={state.input}
          placeholder="Ask anything…"
          onChange={e => {
            dispatch({ type: 'SET_INPUT', value: e.target.value });
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
          }}
          autoComplete="off"
          spellCheck={false}
          aria-label="Type your message"
        />
        <button
          className={`cab__send${state.input.trim() ? ' cab__send--active' : ''}`}
          onClick={onSend}
          aria-label="Send message"
          disabled={!state.input.trim()}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function FABAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isPhotographer, isVerified } = useAuth();
  const { items: cart }  = useCart();

  const [open,             setOpen]             = useState(false);
  const [view,             setView]             = useState('home'); // 'home' | 'chat'
  const [hasNotif,         setHasNotif]         = useState(false);
  const [proactiveVisible, setProactiveVisible] = useState(false);
  const [showResolution,   setShowResolution]   = useState(false);
  const [state,            dispatch]            = useReducer(reducer, initialState);

  const bodyRef      = useRef(null);
  const inputRef     = useRef(null);
  const notifTimer   = useRef(null);
  const greetedFor   = useRef(''); // last pathname greeted on

  /* ── Hidden on auth pages ── */
  const hidden = ['/login', '/signup'].includes(location.pathname);

  /* ── Page context — recomputes on navigation or auth change ── */
  const context = useMemo(
    () => getPageContext(location.pathname, { isPhotographer, isVerified }),
    [location.pathname, isPhotographer, isVerified]
  );

  /* ── Clustered messages for render ── */
  const clusters = useMemo(
    () => clusterMessages(state.messages),
    [state.messages]
  );

  /* ── Restore session memory on mount ── */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const msgs = JSON.parse(saved);
        if (msgs.length > 0) dispatch({ type: 'RESTORE', msgs });
      }
    } catch (_) {}
  }, []);

  /* ── Scroll to bottom helper ── */
  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (bodyRef.current)
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }, []);

  /* ── Deliver bot response with cascading typing simulation ── */
  const deliverResponse = useCallback((msgs, qr, resolvable) => {
    setShowResolution(false);
    dispatch({ type: 'PUSH', msg: { id: '__typing', from: 'bot', type: 'typing' } });
    scrollBottom();

    let delay = 800;
    msgs.forEach((m, i) => {
      const msgDelay = delay;
      setTimeout(() => {
        if (i === 0) dispatch({ type: 'POP_TYPING' });
        dispatch({ type: 'PUSH', msg: makeMsg('bot', m) });
        if (i < msgs.length - 1) {
          dispatch({ type: 'PUSH', msg: { id: '__typing', from: 'bot', type: 'typing' } });
        }
        scrollBottom();
      }, msgDelay);
      delay += 650 + Math.min(m?.text?.length || 0, 100) * 5;
    });

    // After last message
    setTimeout(() => {
      dispatch({ type: 'POP_TYPING' });
      if (qr?.length) dispatch({ type: 'SET_QR', qr });
      if (resolvable) setShowResolution(true);
      scrollBottom();
    }, delay);
  }, [scrollBottom]);

  /* ── Send greeting when entering chat (once per page) ── */
  const deliverGreeting = useCallback(() => {
    if (greetedFor.current === location.pathname) return;
    greetedFor.current = location.pathname;
    deliverResponse(
      [{ type: 'text', text: context.greeting }],
      context.quickReplies,
      false
    );
  }, [location.pathname, context, deliverResponse]);

  /* ── Context-change nudge (when chat is open and user navigates) ── */
  useEffect(() => {
    if (!open || view !== 'chat') return;
    if (greetedFor.current === location.pathname) return;
    greetedFor.current = location.pathname;
    deliverResponse(
      [{ type: 'text', text: `You've moved to **${context.page}**. ${context.greeting}` }],
      context.quickReplies,
      false
    );
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Proactive: time-on-page trigger (25s) ── */
  useEffect(() => {
    if (open || sessionStorage.getItem(NOTIF_KEY)) return;

    notifTimer.current = setTimeout(() => {
      setHasNotif(true);
      setProactiveVisible(true);
      sessionStorage.setItem(NOTIF_KEY, '1');
    }, 25000);

    return () => clearTimeout(notifTimer.current);
  }, [location.pathname, open]);

  /* ── Proactive: scroll-depth trigger (60%) ── */
  useEffect(() => {
    if (open || sessionStorage.getItem(NOTIF_KEY)) return;

    const handleScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (depth > 0.6) {
        clearTimeout(notifTimer.current);
        setHasNotif(true);
        setProactiveVisible(true);
        sessionStorage.setItem(NOTIF_KEY, '1');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, open]);

  /* ── Cart abandonment: suggest help after 30s on checkout with items ── */
  useEffect(() => {
    if (open || location.pathname !== '/checkout') return;
    if (cart?.length === 0 || sessionStorage.getItem(NOTIF_KEY)) return;

    const t = setTimeout(() => {
      setHasNotif(true);
      setProactiveVisible(true);
      sessionStorage.setItem(NOTIF_KEY, '1');
    }, 30000);

    return () => clearTimeout(t);
  }, [location.pathname, open, cart]);

  /* ── Process user message ── */
  const processMessage = useCallback((text) => {
    if (!text.trim()) return;
    dispatch({ type: 'SET_QR', qr: [] });
    dispatch({ type: 'PUSH', msg: makeMsg('user', { type: 'text', text }) });
    dispatch({ type: 'SET_INPUT', value: '' });
    setShowResolution(false);
    scrollBottom();

    const intent   = detectIntent(text);
    const response = getResponse(intent, context, user, text);
    deliverResponse(response.messages, response.quickReplies, !!response.resolvable);
  }, [context, user, deliverResponse, scrollBottom]);

  /* ── Resolution handlers ── */
  const handleResolutionYes = useCallback(() => {
    setShowResolution(false);
    dispatch({ type: 'PUSH', msg: makeMsg('bot', { type: 'text', text: "Glad I could help! 😊 Anything else?" }) });
    dispatch({ type: 'SET_QR', qr: context.quickReplies });
    scrollBottom();
  }, [context.quickReplies, scrollBottom]);

  const handleResolutionNo = useCallback(() => {
    setShowResolution(false);
    deliverResponse(
      [
        { type: 'text', text: "No worries — let me connect you with someone who can help directly:" },
        { type: 'contact', options: [
          { icon: '💬', label: 'WhatsApp Support', sub: 'Fastest response — usually in minutes', href: `https://wa.me/919108108108?text=Hi, I need more help with: `, primary: true },
          { icon: '📞', label: 'Call Us',          sub: 'Mon–Sat, 9 AM–7 PM IST',               href: 'tel:+919108108108', primary: false },
        ]},
      ],
      [],
      false
    );
  }, [deliverResponse]);

  /* ── Open/close ── */
  const handleOpen = useCallback(() => {
    setOpen(true);
    setHasNotif(false);
    setProactiveVisible(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    dispatch({ type: 'SET_QR', qr: [] });
  }, []);

  /* ── Navigate to home screen's action ── */
  const handleHomeAction = useCallback((action) => {
    setView('chat');
    setTimeout(() => {
      const intent   = detectIntent(action.intent);
      const response = getResponse(intent, context, user, action.intent);
      deliverResponse(response.messages, response.quickReplies, !!response.resolvable);
    }, 320);
  }, [context, user, deliverResponse]);

  /* ── Start conversation from home CTA ── */
  const handleStartChat = useCallback(() => {
    setView('chat');
    setTimeout(() => {
      deliverGreeting();
      inputRef.current?.focus();
    }, 320);
  }, [deliverGreeting]);

  /* ── Back to home ── */
  const handleBack = useCallback(() => {
    setView('home');
    dispatch({ type: 'SET_QR', qr: [] });
    setShowResolution(false);
  }, []);

  /* ── Navigate (from inside assistant) ── */
  const handleNav = useCallback((path) => {
    navigate(path);
    setOpen(false);
  }, [navigate]);

  /* ── Quick reply ── */
  const handleQR = useCallback((label) => {
    setView('chat'); // ensure we're in chat view
    processMessage(label);
  }, [processMessage]);

  if (hidden) return null;

  return (
    <div className="cab-root" role="complementary" aria-label="Cana — Canvera Assistant">

      {/* ── Proactive bubble ── */}
      {proactiveVisible && !open && (
        <ProactiveBubble
          message={context.proactiveMsg}
          onOpen={handleOpen}
          onDismiss={() => setProactiveVisible(false)}
        />
      )}

      {/* ── Chat panel ── */}
      <div
        className={`cab__panel${open ? ' cab__panel--open' : ''}`}
        aria-hidden={!open}
        aria-modal={open}
        role="dialog"
        aria-label="Cana chat panel"
      >
        {/* Close button (top-right, always reachable) */}
        {open && (
          <button className="cab__panel-close" onClick={handleClose} aria-label="Close assistant">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Two-view slider */}
        <div className={`cab-views cab-views--${view}`}>
          <HomeScreen
            context={context}
            user={user}
            onStartChat={handleStartChat}
            onAction={handleHomeAction}
          />
          <ChatScreen
            state={state}
            dispatch={dispatch}
            context={context}
            clusters={clusters}
            showResolution={showResolution}
            onResolutionYes={handleResolutionYes}
            onResolutionNo={handleResolutionNo}
            onBack={handleBack}
            onNavigate={handleNav}
            bodyRef={bodyRef}
            inputRef={inputRef}
            onSend={() => processMessage(state.input)}
            onQR={handleQR}
          />
        </div>
      </div>

      {/* ── FAB button ── */}
      <button
        className={`cab__fab${open ? ' cab__fab--open' : ''}`}
        onClick={open ? handleClose : handleOpen}
        aria-label={open ? 'Close Cana assistant' : 'Open Cana assistant'}
        aria-expanded={open}
        aria-controls="cab-panel"
      >
        {!open && hasNotif && (
          <span className="cab__notif-badge" aria-label="New message">1</span>
        )}

        {/* Chat icon — shown when closed */}
        <span className={`cab__fab-icon${open ? ' cab__fab-icon--hidden' : ''}`} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>

        {/* Close icon — shown when open */}
        <span className={`cab__fab-icon${!open ? ' cab__fab-icon--hidden' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>

        {/* Tooltip — only visible when closed */}
        {!open && <span className="cab__fab-tooltip" aria-hidden="true">Ask Cana</span>}
      </button>

    </div>
  );
}
