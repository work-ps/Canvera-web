export default function CanveraLogo({ height = 26, className = '', style = {} }) {
  return (
    <img
      src="/canvera_logo.png"
      alt="Canvera"
      height={height}
      className={className}
      style={{ display: 'block', ...style }}
    />
  )
}
