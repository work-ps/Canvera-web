const STEPS = [
  { label: 'Files', icon: (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <path d="M4 3h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 3v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )},
  { label: 'Paper', icon: (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 7h6M7 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )},
  { label: 'Cover', icon: (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 13l3-4 2 2 3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )},
  { label: 'Accessories', icon: (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )},
  { label: 'Review', icon: (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )},
]

export default function OrderStepper({ current, completedSteps = [], onStepClick }) {
  return (
    <div className="oc-stepper">
      {STEPS.map((step, i) => {
        const isActive = i === current
        const isComplete = completedSteps.includes(i)
        const isFuture = !isActive && !isComplete
        const canClick = isComplete || i <= Math.max(...completedSteps, current)

        return (
          <div key={step.label} className="oc-stepper-item">
            {i > 0 && (
              <div className={`oc-stepper-line${isComplete || isActive ? ' oc-stepper-line--done' : ''}`} />
            )}
            <button
              className={`oc-stepper-circle${isActive ? ' oc-stepper-circle--active' : ''}${isComplete ? ' oc-stepper-circle--complete' : ''}${isFuture ? ' oc-stepper-circle--future' : ''}`}
              onClick={() => canClick && onStepClick?.(i)}
              disabled={!canClick}
              aria-current={isActive ? 'step' : undefined}
            >
              {isComplete ? (
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                step.icon
              )}
            </button>
            <span className={`oc-stepper-label${isActive ? ' oc-stepper-label--active' : ''}${isComplete ? ' oc-stepper-label--complete' : ''}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { STEPS }
