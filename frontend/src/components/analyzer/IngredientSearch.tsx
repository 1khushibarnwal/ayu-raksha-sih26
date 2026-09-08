import { useState, useRef, useEffect } from 'react'
import { ayurvedicIngredientsDatabase, type IngredientItem } from '../../data/ayurvedicIngredients'

interface IngredientSearchProps {
  selectedIngredients: string[]
  onChange: (ingredients: string[]) => void
  error?: string
}

export default function IngredientSearch({
  selectedIngredients,
  onChange,
  error,
}: IngredientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on query
  const filteredSuggestions: IngredientItem[] = searchTerm.trim()
    ? ayurvedicIngredientsDatabase.filter(
        (item) =>
          !selectedIngredients.includes(item.commonName) &&
          (item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.botanicalName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : ayurvedicIngredientsDatabase
        .filter((item) => !selectedIngredients.includes(item.commonName))
        .slice(0, 6)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleAddIngredient(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!selectedIngredients.includes(trimmed)) {
      onChange([...selectedIngredients, trimmed])
    }
    setSearchTerm('')
    setIsDropdownOpen(false)
  }

  function handleRemoveIngredient(nameToRemove: string) {
    onChange(selectedIngredients.filter((i) => i !== nameToRemove))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredSuggestions.length > 0 && searchTerm.trim()) {
        handleAddIngredient(filteredSuggestions[0].commonName)
      } else if (searchTerm.trim()) {
        handleAddIngredient(searchTerm.trim())
      }
    }
  }

  // Quick suggestions
  const quickPills = [
    'Ashwagandha',
    'Turmeric (Haridra)',
    'Neem',
    'Tulsi (Holy Basil)',
    'Brahmi',
    'Shatavari',
    'Triphala',
    'Giloy (Guduchi)',
  ]

  return (
    <div className="analyzer-field-group" ref={containerRef}>
      <div className="analyzer-field-header">
        <label className="analyzer-field-label">
          <span>2. Ingredients / Actives</span>
          <span className="analyzer-required-star">*</span>
        </label>
        <span className="analyzer-field-hint">
          Search botanical or Sanskrit name, or type custom herb & press Enter
        </span>
      </div>

      {/* SELECTED CHIPS / TAGS CONTAINER */}
      <div className="ingredient-chips-container">
        {selectedIngredients.length === 0 ? (
          <div className="ingredient-chips-empty">
            <span>🌿 No ingredients added yet. Search below or click popular suggestions.</span>
          </div>
        ) : (
          <div className="ingredient-chips-list">
            {selectedIngredients.map((ing) => (
              <span key={ing} className="ingredient-chip">
                <span className="ingredient-chip-dot">🌿</span>
                <span className="ingredient-chip-label">{ing}</span>
                <button
                  type="button"
                  className="ingredient-chip-remove"
                  onClick={() => handleRemoveIngredient(ing)}
                  aria-label={`Remove ${ing}`}
                  title={`Remove ${ing}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH INPUT */}
      <div className="ingredient-search-wrapper">
        <div className="ingredient-search-input-box">
          <span className="ingredient-search-icon">🔍</span>
          <input
            type="text"
            className="ingredient-search-input"
            placeholder="Search herb (e.g. Ashwagandha, Turmeric, Withania, Neem)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsDropdownOpen(true)
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm.trim() && (
            <button
              type="button"
              className="ingredient-add-btn"
              onClick={() => handleAddIngredient(searchTerm)}
            >
              + Add
            </button>
          )}
        </div>

        {/* AUTOCOMPLETE DROPDOWN */}
        {isDropdownOpen && (
          <div className="ingredient-autocomplete-dropdown">
            {filteredSuggestions.length > 0 ? (
              <div className="ingredient-suggestions-list">
                <div className="ingredient-dropdown-header">
                  Suggested Ayurvedic Botanicals:
                </div>
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="ingredient-suggestion-item"
                    onClick={() => handleAddIngredient(item.commonName)}
                  >
                    <div className="suggestion-main">
                      <strong className="suggestion-name">{item.commonName}</strong>
                      <span className="suggestion-botanical">({item.botanicalName})</span>
                    </div>
                    <div className="suggestion-meta">
                      <span className="suggestion-cat">{item.category}</span>
                      <span className="suggestion-add-plus">+ Select</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="ingredient-no-match">
                <span>No botanical match found in repository.</span>
                <button
                  type="button"
                  className="ingredient-custom-add-btn"
                  onClick={() => handleAddIngredient(searchTerm)}
                >
                  Add "{searchTerm}" as custom ingredient
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* QUICK SELECTION PILLS */}
      <div className="ingredient-quick-pills">
        <span className="quick-pills-label">Popular Actives:</span>
        <div className="quick-pills-list">
          {quickPills.map((pill) => {
            const isAdded = selectedIngredients.includes(pill)
            return (
              <button
                key={pill}
                type="button"
                className={`quick-pill-btn ${isAdded ? 'added' : ''}`}
                onClick={() => {
                  if (isAdded) {
                    handleRemoveIngredient(pill)
                  } else {
                    handleAddIngredient(pill)
                  }
                }}
              >
                {isAdded ? '✓' : '+'} {pill}
              </button>
            )
          })}
        </div>
      </div>

      {error && <span className="analyzer-error-msg">{error}</span>}
    </div>
  )
}
