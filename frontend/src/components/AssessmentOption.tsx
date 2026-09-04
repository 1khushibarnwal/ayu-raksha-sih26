interface AssessmentOptionProps {
  icon: string
  label: string
  selected: boolean
  onClick: () => void
}

function AssessmentOption({
  icon,
  label,
  selected,
  onClick,
}: AssessmentOptionProps) {
  return (
    <button
      type="button"
      className={`assessment-option ${
        selected
          ? 'assessment-option-selected'
          : ''
      }`}
      onClick={onClick}
    >
      <span className="assessment-option-icon">
        {icon}
      </span>

      <span className="assessment-option-label">
        {label}
      </span>

      <span className="assessment-option-check">
        {selected ? '✓' : ''}
      </span>
    </button>
  )
}

export default AssessmentOption