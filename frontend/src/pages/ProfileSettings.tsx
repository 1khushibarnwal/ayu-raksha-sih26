import { useState, useEffect } from 'react'
import type {
  UserProfile,
  UserPreferences,
  UserRole,
} from '../types/analyzer'
import {
  getUserProfile,
  saveUserProfile,
  getUserPreferences,
  saveUserPreferences,
  clearUserData,
} from '../services/userService'
import { getSavedInnovations } from '../services/innovationStoreService'
import { getExpertRequests } from '../services/expertService'
import Navbar from '../components/Navbar'

const userRoles: UserRole[] = [
  'Ayurvedic Practitioner (Vaidya)',
  'Pharma / Biotech Researcher',
  'Startup Founder',
  'AYUSH Manufacturer',
  'IP Attorney / Patent Agent',
  'Academic / Student',
  'Regulatory Consultant',
]

const jurisdictionOptions = [
  'India (IPO/AYUSH/NBA)',
  'USA (USPTO/FDA)',
  'EU (EPO/EMA)',
  'WIPO / International',
  'Japan (JPO/MHLW)',
  'Australia (IP Australia/TGA)',
]

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile())
  const [preferences, setPreferences] = useState<UserPreferences>(getUserPreferences())
  const [activeTab, setActiveTab] = useState<'profile' | 'ai_rigor' | 'notifications' | 'privacy'>('profile')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [storageStats, setStorageStats] = useState({ innovations: 0, requests: 0 })

  useEffect(() => {
    setProfile(getUserProfile())
    setPreferences(getUserPreferences())
    setStorageStats({
      innovations: getSavedInnovations().length,
      requests: getExpertRequests().length,
    })
  }, [])

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    saveUserProfile(profile)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  function handlePrefsSave(e: React.FormEvent) {
    e.preventDefault()
    saveUserPreferences(preferences)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  function toggleJurisdiction(j: string) {
    const current = profile.primaryJurisdictions || []
    const updated = current.includes(j) ? current.filter((x) => x !== j) : [...current, j]
    setProfile({ ...profile, primaryJurisdictions: updated })
  }

  function handleExportData() {
    const data = {
      profile,
      preferences,
      innovations: getSavedInnovations(),
      expertRequests: getExpertRequests(),
      exportedAt: new Date().toISOString(),
      platform: 'AYU-RAKSHA / IP-SAKTI Sahayak v2.4',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ayu_raksha_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClearData() {
    if (
      window.confirm(
        'Are you sure you want to clear all locally cached innovations, expert requests, and reset settings to default?'
      )
    ) {
      clearUserData()
      setProfile(getUserProfile())
      setPreferences(getUserPreferences())
      setStorageStats({ innovations: 0, requests: 0 })
      alert('Local storage has been reset.')
    }
  }

  return (
    <div className="page-wrapper settings-page">
      <Navbar />

      <main className="container main-content">
        {saveSuccess && (
          <div className="portfolio-toast">
            <span>✓</span> Preferences and profile settings saved successfully!
          </div>
        )}

        <section className="analyzer-banner no-print">
          <div className="analyzer-banner-content">
            <div className="analyzer-badge">
              <span className="badge-icon">⚙️</span>
              <span>USER PROFILE & AI CONFIGURATION</span>
            </div>
            <h1 className="analyzer-banner-title">Profile & Preferences</h1>
            <p className="analyzer-banner-desc">
              Customize your institutional identity, configure AI statutory reasoning rigor, manage jurisdiction priorities, and control data privacy governance.
            </p>
          </div>
        </section>

        <div className="settings-layout-grid">
          {/* SIDEBAR TABS */}
          <div className="settings-sidebar">
            <div className="user-profile-summary-card">
              <div className="user-avatar-circle">
                <span>{profile.fullName.charAt(0) || 'U'}</span>
              </div>
              <h4 className="user-name">{profile.fullName}</h4>
              <span className="user-role-badge">{profile.role}</span>
              <p className="user-org">{profile.organization}</p>
            </div>

            <nav className="settings-nav-list">
              <button
                type="button"
                className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                👤 Identity & Organization
              </button>
              <button
                type="button"
                className={`settings-nav-btn ${activeTab === 'ai_rigor' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai_rigor')}
              >
                ⚖️ AI Reasoning & Abstention
              </button>
              <button
                type="button"
                className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                🔔 Alerts & Notifications
              </button>
              <button
                type="button"
                className={`settings-nav-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                🔒 Data Privacy & Export
              </button>
            </nav>
          </div>

          {/* MAIN SETTINGS FORM */}
          <div className="settings-main-card">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="settings-form">
                <div className="settings-section-header">
                  <h3>Institutional & Professional Identity</h3>
                  <p>Used to auto-populate expert requests, patent dossiers, and compliance filings.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Legal Name / Title</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      required
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Official Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Organization / University / Enterprise</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                      required
                      className="settings-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Primary Role / Persona</label>
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value as UserRole })}
                      className="settings-select"
                    >
                      {userRoles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Preferred User Interface Language</label>
                  <div className="lang-radio-group">
                    <label className={`lang-radio-card ${profile.preferredLanguage === 'en' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="lang"
                        value="en"
                        checked={profile.preferredLanguage === 'en'}
                        onChange={() => setProfile({ ...profile, preferredLanguage: 'en' })}
                      />
                      <span>English (Default)</span>
                    </label>
                    <label className={`lang-radio-card ${profile.preferredLanguage === 'hi' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="lang"
                        value="hi"
                        checked={profile.preferredLanguage === 'hi'}
                        onChange={() => setProfile({ ...profile, preferredLanguage: 'hi' })}
                      />
                      <span>हिन्दी (Hindi)</span>
                    </label>
                    <label className={`lang-radio-card ${profile.preferredLanguage === 'bn' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="lang"
                        value="bn"
                        checked={profile.preferredLanguage === 'bn'}
                        onChange={() => setProfile({ ...profile, preferredLanguage: 'bn' })}
                      />
                      <span>বাংলা (Bengali)</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Primary Jurisdictions of Practice</label>
                  <p className="form-help">Select the statutory regimes you monitor most frequently.</p>
                  <div className="jurisdictions-checkbox-grid">
                    {jurisdictionOptions.map((j) => (
                      <label key={j} className="jurisdiction-checkbox-item">
                        <input
                          type="checkbox"
                          checked={profile.primaryJurisdictions.includes(j)}
                          onChange={() => toggleJurisdiction(j)}
                        />
                        <span>{j}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="settings-submit-row">
                  <button type="submit" className="primary-button">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'ai_rigor' && (
              <form onSubmit={handlePrefsSave} className="settings-form">
                <div className="settings-section-header">
                  <h3>AI Statutory Reasoning & Abstention Guardrails</h3>
                  <p>Fine-tune how conservatively AYU-RAKSHA evaluates patentability and when it abstains.</p>
                </div>

                <div className="form-group">
                  <label>Statutory Reasoning Rigor</label>
                  <div className="rigor-options-grid">
                    <label className={`rigor-card ${preferences.reasoningRigor === 'conservative' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="rigor"
                        value="conservative"
                        checked={preferences.reasoningRigor === 'conservative'}
                        onChange={() => setPreferences({ ...preferences, reasoningRigor: 'conservative' })}
                      />
                      <div>
                        <strong>Conservative Statutory (Recommended for Filing)</strong>
                        <p>Strictly tests Section 3(p) objections and mandates primary pharmacological synergy evidence.</p>
                      </div>
                    </label>

                    <label className={`rigor-card ${preferences.reasoningRigor === 'balanced' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="rigor"
                        value="balanced"
                        checked={preferences.reasoningRigor === 'balanced'}
                        onChange={() => setPreferences({ ...preferences, reasoningRigor: 'balanced' })}
                      />
                      <div>
                        <strong>Balanced Standard</strong>
                        <p>Evaluates commercial viability alongside patentability; benchmarks against published precedents.</p>
                      </div>
                    </label>

                    <label className={`rigor-card ${preferences.reasoningRigor === 'exploratory' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="rigor"
                        value="exploratory"
                        checked={preferences.reasoningRigor === 'exploratory'}
                        onChange={() => setPreferences({ ...preferences, reasoningRigor: 'exploratory' })}
                      />
                      <div>
                        <strong>Exploratory R&D Mode</strong>
                        <p>Optimized for early screening; suggests expansive claim possibilities without blocking on strict citations.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Abstention Sensitivity Threshold</label>
                  <p className="form-help">
                    Controls when the system abstains from definitive conclusions and prompts Human Expert Escalation.
                  </p>
                  <select
                    value={preferences.abstentionSensitivity}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        abstentionSensitivity: e.target.value as any,
                      })
                    }
                    className="settings-select"
                  >
                    <option value="strict">Strict (Abstain if botanical origin or test data is unverified)</option>
                    <option value="standard">Standard (Abstain only on critical legal conflicts or missing actives)</option>
                    <option value="relaxed">Relaxed (Provide best-effort estimate with disclaimer)</option>
                  </select>
                </div>

                <div className="settings-submit-row">
                  <button type="submit" className="primary-button">
                    Update Reasoning Preferences
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handlePrefsSave} className="settings-form">
                <div className="settings-section-header">
                  <h3>Alerts & Automated Regulatory Notifications</h3>
                  <p>Choose which updates trigger email and dashboard notification banners.</p>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div>
                      <strong>Gazette & Regulatory Amendment Alerts</strong>
                      <p>Receive notifications when Ayush, CDSCO, or FSSAI amend traditional medicine regulations.</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts.regulatoryChanges}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            emailAlerts: {
                              ...preferences.emailAlerts,
                              regulatoryChanges: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="slider round" />
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div>
                      <strong>Human Expert Response Updates</strong>
                      <p>Instant notifications when an assigned patent attorney reviews your escalated inquiry.</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts.expertResponses}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            emailAlerts: {
                              ...preferences.emailAlerts,
                              expertResponses: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="slider round" />
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div>
                      <strong>High Prior-Art Risk Watchlist Alerts</strong>
                      <p>Get notified if new TKDL disclosures conflict with formulations in your saved portfolio.</p>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts.highRiskAlerts}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            emailAlerts: {
                              ...preferences.emailAlerts,
                              highRiskAlerts: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="slider round" />
                    </label>
                  </div>
                </div>

                <div className="settings-submit-row">
                  <button type="submit" className="primary-button">
                    Save Alert Preferences
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-form">
                <div className="settings-section-header">
                  <h3>Data Governance & Portfolio Export</h3>
                  <p>Control client-side data isolation, backup your innovation portfolio, or reset local cache.</p>
                </div>

                <div className="storage-summary-box">
                  <h4>Local Storage Usage</h4>
                  <div className="storage-metrics-row">
                    <div className="storage-metric">
                      <span className="metric-num">{storageStats.innovations}</span>
                      <span className="metric-text">Saved Innovations</span>
                    </div>
                    <div className="storage-metric">
                      <span className="metric-num">{storageStats.requests}</span>
                      <span className="metric-text">Expert Requests</span>
                    </div>
                    <div className="storage-metric">
                      <span className="metric-num">Client-Only</span>
                      <span className="metric-text">Zero-Cloud Retention Mode</span>
                    </div>
                  </div>
                </div>

                <div className="privacy-actions-section">
                  <div className="privacy-action-card">
                    <div>
                      <strong>Export Innovation Portfolio & Dossiers</strong>
                      <p>Download complete JSON archive including version snapshots, evidence citations, and expert notes.</p>
                    </div>
                    <button type="button" className="primary-button export-btn" onClick={handleExportData}>
                      📥 Export JSON Archive
                    </button>
                  </div>

                  <div className="privacy-action-card danger-card">
                    <div>
                      <strong>Reset Local Cache & Demonstration Data</strong>
                      <p>Wipes all stored formulation snapshots and restores default demo state.</p>
                    </div>
                    <button type="button" className="secondary-button delete-danger-btn" onClick={handleClearData}>
                      🗑️ Clear Local Storage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">✦</span>
          <strong>AYU-RAKSHA</strong>
        </div>
        <p>AI-Powered Ayurvedic Innovation & Traditional Knowledge Protection.</p>
        <span className="footer-copy">© 2026 AYU-RAKSHA</span>
      </footer>
    </div>
  )
}
