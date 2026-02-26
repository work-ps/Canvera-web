const steps = [
  { num: 1, label: 'Choose' },
  { num: 2, label: 'Specs' },
  { num: 3, label: 'Personalize' },
  { num: 4, label: 'Accessories' },
  { num: 5, label: 'Review' },
]

const checkSvg = (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function StepProgress({ current, onGoTo, maxReached }) {
  return (
    <div className="ab-progress">
      <div className="ab-progress-inner">
        {steps.map((s, i) => {
          const isDone = current > s.num
          const isActive = current === s.num
          const canClick = s.num <= maxReached
          return (
            <div key={s.num} style={{ display: 'contents' }}>
              <button
                className={`ab-step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}${!canClick ? ' disabled' : ''}`}
                onClick={() => canClick && onGoTo(s.num)}
              >
                <span className="ab-step-num">
                  {isDone ? checkSvg : s.num}
                </span>
                <span className="ab-step-label">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <span className={`ab-step-connector${current > s.num ? ' filled' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
