import type { NoveltyOption } from '../../types/analyzer'

interface NoveltySelectorProps {
  selectedOptions: NoveltyOption[]
  onChange: (options: NoveltyOption[]) => void
  error?: string
}

interface NoveltyItem {
  id: NoveltyOption
  title: string
  desc: string
  icon: string
}

const noveltyOptions: NoveltyItem[] = [
  {
    id: 'Combination',
    title: 'Combination',
    desc: 'Synergistic pairing of distinct traditional herbs not combined classically',
    icon: '🧩',
  },
  {
    id: 'Extraction',
    title: 'Extraction',
    desc: 'Supercritical CO2, ultrasonic, or bio-fractionated solvent extraction',
    icon: '🧪',
  },
  {
    id: 'Manufacturing',
    title: 'Manufacturing',
    desc: 'Modernized GMP micro-encapsulation, spray drying, or bio-processing',
    icon: '⚙️',
  },
  {
    id: 'Therapeutic use',
    title: 'Therapeutic Use',
    desc: 'Novel wellness/clinical indication not specified in classical texts',
    icon: '🎯',
  },
  {
    id: 'Dosage',
    title: 'Dosage',
    desc: 'Concentrated micro-dosing, sustained release, or standardized titration',
    icon: '💊',
  },
  {
    id: 'Formulation',
    title: 'Formulation',
    desc: 'Modern delivery matrix (effervescent, nano-emulsion, gummies, serums)',
    icon: '✨',
  },
  {
    id: 'Packaging',
    title: 'Packaging',
    desc: 'Moisture-barrier nitrogen flushing, smart dosers, or eco-dispensers',
    icon: '📦',
  },
  {
    id: 'Brand',
    title: 'Brand / Trademark',
    desc: 'Distinctive proprietary trademark, certification, or commercial identity',
    icon: '🏷️',
  },
]

export default function NoveltySelector({
  selectedOptions,
  onChange,
  error,
}: NoveltySelectorProps) {
  function handleToggle(item: NoveltyOption) {
    if (selectedOptions.includes(item)) {
      onChange(selectedOptions.filter((opt) => opt !== item))
    } else {
      onChange([...selectedOptions, item])
    }
  }

  return (
    <div className="analyzer-field-group">
      <div className="analyzer-field-header">
        <label className="analyzer-field-label">
          <span>4. What is novel?</span>
          <span className="analyzer-required-star">*</span>
        </label>
        <span className="analyzer-field-hint">
          Select all innovative aspects that distinguish your product (Multi-select)
        </span>
      </div>

      <div className="novelty-grid">
        {noveltyOptions.map((opt) => {
          const isSelected = selectedOptions.includes(opt.id)
          return (
            <button
              key={opt.id}
              type="button"
              className={`novelty-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(opt.id)}
            >
              <div className="novelty-card-top">
                <span className="novelty-icon">{opt.icon}</span>
                <span className={`novelty-checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? '✓' : ''}
                </span>
              </div>
              <strong className="novelty-title">{opt.title}</strong>
              <p className="novelty-desc">{opt.desc}</p>
            </button>
          )
        })}
      </div>

      {error && <span className="analyzer-error-msg">{error}</span>}
    </div>
  )
}
