import type { ProductType } from '../../types/analyzer'

interface ProductTypeSelectorProps {
  value: ProductType | ''
  onChange: (val: ProductType) => void
  error?: string
}

interface ProductTypeOption {
  type: ProductType
  title: string
  desc: string
  icon: string
}

const productTypeOptions: ProductTypeOption[] = [
  {
    type: 'Classical',
    title: 'Classical',
    desc: 'Codified formulations from ancient Samhitas & First Schedule texts',
    icon: '📜',
  },
  {
    type: 'Proprietary',
    title: 'Proprietary',
    desc: 'Patent or proprietary ASU medicine with innovative formulation',
    icon: '⚗️',
  },
  {
    type: 'New formulation',
    title: 'New Formulation',
    desc: 'Novel combination of traditional herbs for modern lifestyle care',
    icon: '✨',
  },
  {
    type: 'Phytopharmaceutical',
    title: 'Phytopharmaceutical',
    desc: 'Standardized botanical fractions with defined chemical markers',
    icon: '🔬',
  },
  {
    type: 'Ayurveda-Aahar',
    title: 'Ayurveda-Aahar',
    desc: 'Ayurvedic health food and nutraceuticals under FSSAI 2022',
    icon: '🍃',
  },
  {
    type: 'Cosmetic',
    title: 'Cosmetic',
    desc: 'Herbal cosmeceuticals, dermal formulations & topical care',
    icon: '🌸',
  },
  {
    type: 'Other',
    title: 'Other',
    desc: 'Custom ASU hybrid, adjuvant or botanical device innovation',
    icon: '📦',
  },
  {
    type: 'Not sure',
    title: 'Not sure',
    desc: 'Let AYU-RAKSHA AI classify based on your ingredients and novelty',
    icon: '🧭',
  },
]

export default function ProductTypeSelector({
  value,
  onChange,
  error,
}: ProductTypeSelectorProps) {
  return (
    <div className="analyzer-field-group">
      <div className="analyzer-field-header">
        <label className="analyzer-field-label">
          <span>1. Product Type</span>
          <span className="analyzer-required-star">*</span>
        </label>
        <span className="analyzer-field-hint">
          Select the category that best describes your product
        </span>
      </div>

      <div className="product-type-grid">
        {productTypeOptions.map((opt) => {
          const isSelected = value === opt.type
          return (
            <button
              key={opt.type}
              type="button"
              className={`product-type-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(opt.type)}
            >
              <div className="product-type-card-top">
                <span className="product-type-icon">{opt.icon}</span>
                <span className="product-type-radio">
                  {isSelected && <span className="product-type-radio-inner" />}
                </span>
              </div>
              <strong className="product-type-title">{opt.title}</strong>
              <p className="product-type-desc">{opt.desc}</p>
            </button>
          )
        })}
      </div>

      {error && <span className="analyzer-error-msg">{error}</span>}
    </div>
  )
}
