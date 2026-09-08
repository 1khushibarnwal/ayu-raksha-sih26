import type { InnovationProfile } from '../../types/analyzer'

interface InnovationProfileViewProps {
  profile: InnovationProfile
}

export default function InnovationProfileView({
  profile,
}: InnovationProfileViewProps) {
  const ingredients = profile?.ingredients || []
  const noveltyElements = profile?.noveltyElements || []
  const targetMarkets = profile?.targetMarkets || []

  return (
    <section className="innovation-profile-section">
      <div className="profile-section-heading">
        <span className="section-label">INNOVATION PROFILE</span>
        <h2>Submitted Formulation Details</h2>
        <p>A structured snapshot of the innovation data evaluated by AYU-RAKSHA.</p>
      </div>

      <div className="profile-cards-grid">
        {/* PRODUCT TYPE */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">📦</span>
            <span className="profile-card-label">Product Type</span>
          </div>
          <strong className="profile-card-value">{profile?.productType || 'Ayurvedic Proprietary Medicine'}</strong>
          <span className="profile-card-hint">Categorization framework</span>
        </div>

        {/* INGREDIENT SOURCE */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-icon">🌱</span>
            <span className="profile-card-label">Ingredient Source</span>
          </div>
          <strong className="profile-card-value">{profile?.ingredientSource || 'Cultivated'}</strong>
          <span className="profile-card-hint">Provenance & biodiversity status</span>
        </div>

        {/* INGREDIENTS */}
        <div className="profile-card profile-card-wide">
          <div className="profile-card-header">
            <span className="profile-card-icon">🌿</span>
            <span className="profile-card-label">Active Botanical Ingredients</span>
            <span className="profile-count-pill">{ingredients.length} herbs</span>
          </div>
          <div className="profile-chips-wrap">
            {ingredients.map((ing) => (
              <span key={ing} className="profile-chip profile-chip-green">
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* NOVEL ELEMENTS */}
        <div className="profile-card profile-card-wide">
          <div className="profile-card-header">
            <span className="profile-card-icon">✨</span>
            <span className="profile-card-label">Novel Elements Claimed</span>
            <span className="profile-count-pill">{noveltyElements.length} vectors</span>
          </div>
          <div className="profile-chips-wrap">
            {noveltyElements.map((nov) => (
              <span key={nov} className="profile-chip profile-chip-accent">
                ✦ {nov}
              </span>
            ))}
          </div>
        </div>

        {/* TARGET MARKETS */}
        <div className="profile-card profile-card-wide">
          <div className="profile-card-header">
            <span className="profile-card-icon">🌐</span>
            <span className="profile-card-label">Target Jurisdictions</span>
            <span className="profile-count-pill">{targetMarkets.length} markets</span>
          </div>
          <div className="profile-chips-wrap">
            {targetMarkets.map((mkt) => (
              <span key={mkt} className="profile-chip profile-chip-market">
                📍 {mkt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
