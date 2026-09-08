import type { IngredientSource } from '../../types/analyzer'

interface IngredientSourceSelectorProps {
  value: IngredientSource | ''
  onChange: (val: IngredientSource) => void
  error?: string
}

interface SourceOption {
  value: IngredientSource
  title: string
  desc: string
  icon: string
  note?: string
}

const sourceOptions: SourceOption[] = [
  {
    value: 'Cultivated',
    title: 'Cultivated',
    desc: 'GAP-certified agricultural farm or contract farming',
    icon: '🌱',
    note: 'Standard CoA & GACP records required',
  },
  {
    value: 'Wild sourced',
    title: 'Wild Sourced',
    desc: 'Harvested from natural forest habitats / wild flora',
    icon: '🌲',
    note: 'May trigger NBA / ABS compliance (BD Act 2002)',
  },
  {
    value: 'Traditional community',
    title: 'Traditional Community',
    desc: 'Obtained with indigenous or local tribal community knowledge',
    icon: '🤝',
    note: 'Section 3 & 6 Access & Benefit Sharing (ABS) required',
  },
  {
    value: 'Supplier',
    title: 'Commercial Supplier',
    desc: 'Certified raw botanical vendor or standardized extract maker',
    icon: '🏭',
    note: 'Vendor batch qualification & pharmacopoeial test',
  },
  {
    value: 'Unknown',
    title: 'Unknown / Sourcing Pending',
    desc: 'Supply chain provenance to be determined later',
    icon: '❓',
    note: 'Verification recommended prior to IP filing',
  },
]

export default function IngredientSourceSelector({
  value,
  onChange,
  error,
}: IngredientSourceSelectorProps) {
  return (
    <div className="analyzer-field-group">
      <div className="analyzer-field-header">
        <label className="analyzer-field-label">
          <span>3. Ingredient Source</span>
          <span className="analyzer-required-star">*</span>
        </label>
        <span className="analyzer-field-hint">
          Origin of botanical raw materials (crucial for biodiversity & IP clearances)
        </span>
      </div>

      <div className="source-options-grid">
        {sourceOptions.map((opt) => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              className={`source-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(opt.value)}
            >
              <div className="source-card-top">
                <span className="source-card-icon">{opt.icon}</span>
                <span className="source-card-radio">
                  {isSelected && <span className="source-card-radio-inner" />}
                </span>
              </div>
              <strong className="source-card-title">{opt.title}</strong>
              <p className="source-card-desc">{opt.desc}</p>
              {opt.note && <span className="source-card-note">{opt.note}</span>}
            </button>
          )
        })}
      </div>

      {error && <span className="analyzer-error-msg">{error}</span>}
    </div>
  )
}
