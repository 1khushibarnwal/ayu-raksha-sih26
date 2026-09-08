import type { UserProfile, UserPreferences } from '../types/analyzer'

const PROFILE_KEY = 'ayuraksha_user_profile_v1'
const PREFS_KEY = 'ayuraksha_user_preferences_v1'

const defaultProfile: UserProfile = {
  id: 'USR-2026-IND-01',
  fullName: 'Dr. Ananya Sharma',
  email: 'ananya.sharma@ayurvedalabs.in',
  organization: 'AyurVeda Advanced Formulations Ltd.',
  role: 'Pharma / Biotech Researcher',
  preferredLanguage: 'en',
  primaryJurisdictions: ['India (IPO/AYUSH/NBA)', 'USA (USPTO/FDA)', 'EU (EPO/EMA)'],
  avatarUrl: '',
  memberSince: 'January 2026',
}

const defaultPreferences: UserPreferences = {
  reasoningRigor: 'conservative',
  abstentionSensitivity: 'standard',
  emailAlerts: {
    regulatoryChanges: true,
    expertResponses: true,
    highRiskAlerts: true,
  },
  dataRetentionMode: 'local_storage',
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) {
      return { ...defaultProfile, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.error('Failed to load user profile:', err)
  }
  saveUserProfile(defaultProfile)
  return defaultProfile
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile()
  const updated = { ...current, ...profile }
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save user profile:', err)
  }
  return updated
}

export function getUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (raw) {
      return { ...defaultPreferences, ...JSON.parse(raw) }
    }
  } catch (err) {
    console.error('Failed to load user preferences:', err)
  }
  saveUserPreferences(defaultPreferences)
  return defaultPreferences
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences()
  const updated = { ...current, ...prefs }
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save user preferences:', err)
  }
  return updated
}

export function clearUserData(): void {
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(PREFS_KEY)
  localStorage.removeItem('ayuraksha_saved_innovations_v1')
  localStorage.removeItem('ayuraksha_expert_requests_v1')
}
