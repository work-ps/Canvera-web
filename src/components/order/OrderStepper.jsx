const STEPS = ['Files', 'Paper', 'Cover', 'Accessories', 'Review']

export default function OrderStepper({ current, completedSteps = [], onStepClick }) {
  return (
    <div className="oc-stepper">
      {STEPS.map((label, i) => {
        const isActive = i === current
        const isComplete = completedSteps.includes(i)
        const isFuture = !isActive && !isComplete
        const canClick = isComplete || i <= Math.max(...completedSteps, current)

        return (
          <div key={label} className="oc-stepper-item">
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
                  <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </button>
            <span className={`oc-stepper-label${isActive ? ' oc-stepper-label--active' : ''}${isComplete ? ' oc-stepper-label--complete' : ''}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { STEPS }
