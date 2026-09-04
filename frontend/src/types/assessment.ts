export interface AssessmentAnswers {
  sleep: string
  activity: string
  stress: string
  nutrition: string
  water: string
  goal: string
}

export interface AssessmentQuestion {
  id: keyof AssessmentAnswers
  category: string
  question: string
  description?: string
  options: AssessmentOption[]
}

export interface AssessmentOption {
  value: string
  label: string
  icon: string
}