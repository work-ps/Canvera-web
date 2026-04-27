import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: 'var(--header-height)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-8) var(--side-padding)',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '80px', fontWeight: 'var(--weight-bold)', color: 'var(--neutral-200)', lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: 'var(--text-heading-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>Page not found</h1>
      <p style={{ fontSize: 'var(--text-body-base)', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.6 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
        height: '44px', padding: '0 var(--space-6)',
        background: 'var(--interactive-primary)',
        color: 'var(--text-inverse)',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-sm)',
        textDecoration: 'none',
      }}>← Back to Home</Link>
    </div>
  );
}
