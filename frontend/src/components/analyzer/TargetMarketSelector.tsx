import type { TargetMarket } from '../../types/analyzer'

interface TargetMarketSelectorProps {
  selectedMarkets: TargetMarket[]
  onChange: (markets: TargetMarket[]) => void
  error?: string
}

interface MarketOption {
  id: TargetMarket
  name: string
  region: string
  flag: string
  framework: string
}

const marketOptions: MarketOption[] = [
  {
    id: 'India',
    name: 'India',
    region: 'Domestic / AYUSH',
    flag: '🇮🇳',
    framework: 'Drugs & Cosmetics Act 1940 / FSSAI',
  },
  {
    id: 'USA',
    name: 'USA',
    region: 'North America',
    flag: '🇺🇸',
    framework: 'US FDA Dietary Supplement (DSHEA 1994)',
  },
  {
    id: 'EU',
    name: 'European Union',
    region: 'Europe / EMA',
    flag: '🇪🇺',
    framework: 'Traditional Herbal Medicinal Products Directive (THMPD)',
  },
  {
    id: 'Japan',
    name: 'Japan',
    region: 'Asia-Pacific / PMDA',
    flag: '🇯🇵',
    framework: 'Kampo & Foods with Function Claims (FFC)',
  },
  {
    id: 'Australia',
    name: 'Australia',
    region: 'Oceania / TGA',
    flag: '🇦🇺',
    framework: 'Therapeutic Goods Administration (Complementary Medicine)',
  },
  {
    id: 'Others',
    name: 'Global / Others',
    region: 'International',
    flag: '🌐',
    framework: 'WHO Guidelines on Traditional Medicine',
  },
]

export default function TargetMarketSelector({
  selectedMarkets,
  onChange,
  error,
}: TargetMarketSelectorProps) {
  function handleToggle(market: TargetMarket) {
    if (selectedMarkets.includes(market)) {
      onChange(selectedMarkets.filter((m) => m !== market))
    } else {
      onChange([...selectedMarkets, market])
    }
  }

  return (
    <div className="analyzer-field-group">
      <div className="analyzer-field-header">
        <label className="analyzer-field-label">
          <span>5. Select target markets</span>
          <span className="analyzer-required-star">*</span>
        </label>
        <span className="analyzer-field-hint">
          Choose regions for targeted regulatory & patent risk analysis (Multi-select)
        </span>
      </div>

      <div className="markets-grid">
        {marketOptions.map((opt) => {
          const isSelected = selectedMarkets.includes(opt.id)
          return (
            <button
              key={opt.id}
              type="button"
              className={`market-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(opt.id)}
            >
              <div className="market-card-top">
                <span className="market-flag">{opt.flag}</span>
                <span className={`market-checkbox ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? '✓' : ''}
                </span>
              </div>
              <strong className="market-name">{opt.name}</strong>
              <span className="market-region">{opt.region}</span>
              <span className="market-framework">{opt.framework}</span>
            </button>
          )
        })}
      </div>

      {error && <span className="analyzer-error-msg">{error}</span>}
    </div>
  )
}
