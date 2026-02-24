export default function StarRating({ rating }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <svg key={i} className="star-filled" viewBox="0 0 14 14">
          <path d="M7 1l1.8 3.6L13 5.2l-3 2.9.7 4.1L7 10.1 3.3 12.2l.7-4.1-3-2.9 4.2-.6L7 1z" fill="currentColor"/>
        </svg>
      )
    } else if (i - rating < 1) {
      stars.push(
        <svg key={i} className="star-half" viewBox="0 0 14 14">
          <path d="M7 1l1.8 3.6L13 5.2l-3 2.9.7 4.1L7 10.1 3.3 12.2l.7-4.1-3-2.9 4.2-.6L7 1z" fill="currentColor" opacity="0.4"/>
          <path d="M7 1v9.1L3.3 12.2l.7-4.1-3-2.9 4.2-.6L7 1z" fill="currentColor"/>
        </svg>
      )
    } else {
      stars.push(
        <svg key={i} className="star-empty" viewBox="0 0 14 14">
          <path d="M7 1l1.8 3.6L13 5.2l-3 2.9.7 4.1L7 10.1 3.3 12.2l.7-4.1-3-2.9 4.2-.6L7 1z" fill="currentColor"/>
        </svg>
      )
    }
  }
  return <div className="pc-stars">{stars}</div>
}
