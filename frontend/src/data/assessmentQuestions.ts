import type {
  AssessmentQuestion,
} from '../types/assessment'

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'sleep',
    category: 'SLEEP',
    question: 'How would you describe your typical sleep?',
    description:
      'Think about your average amount of sleep on most nights.',
    options: [
      {
        value: 'less_than_5',
        label: 'Less than 5 hours',
        icon: '🌙',
      },
      {
        value: '5_to_7',
        label: '5 – 7 hours',
        icon: '☾',
      },
      {
        value: '7_to_9',
        label: '7 – 9 hours',
        icon: '✦',
      },
      {
        value: 'more_than_9',
        label: 'More than 9 hours',
        icon: '🌿',
      },
    ],
  },

  {
    id: 'activity',
    category: 'ACTIVITY',
    question: 'How active are you on a typical day?',
    description:
      'Consider walking, exercise, sports, and everyday movement.',
    options: [
      {
        value: 'low',
        label: 'Mostly sedentary',
        icon: '🪴',
      },
      {
        value: 'light',
        label: 'Lightly active',
        icon: '🚶',
      },
      {
        value: 'moderate',
        label: 'Moderately active',
        icon: '🏃',
      },
      {
        value: 'high',
        label: 'Very active',
        icon: '⚡',
      },
    ],
  },

  {
    id: 'stress',
    category: 'MENTAL WELLNESS',
    question: 'How would you describe your current stress level?',
    description:
      'Choose the option that feels closest to your everyday experience.',
    options: [
      {
        value: 'low',
        label: 'Generally calm',
        icon: '🌿',
      },
      {
        value: 'mild',
        label: 'Occasionally stressed',
        icon: '☁️',
      },
      {
        value: 'moderate',
        label: 'Frequently stressed',
        icon: '🌧️',
      },
      {
        value: 'high',
        label: 'Highly stressed',
        icon: '🌪️',
      },
    ],
  },

  {
    id: 'nutrition',
    category: 'NUTRITION',
    question: 'How would you describe your everyday eating habits?',
    description:
      'Think about the overall balance and consistency of your meals.',
    options: [
      {
        value: 'needs_improvement',
        label: 'Could use improvement',
        icon: '🌱',
      },
      {
        value: 'inconsistent',
        label: 'Somewhat inconsistent',
        icon: '🍃',
      },
      {
        value: 'balanced',
        label: 'Mostly balanced',
        icon: '🥗',
      },
      {
        value: 'very_balanced',
        label: 'Very balanced',
        icon: '✨',
      },
    ],
  },

  {
    id: 'water',
    category: 'HYDRATION',
    question: 'How consistently do you stay hydrated?',
    description:
      'Think about your typical daily water intake.',
    options: [
      {
        value: 'rarely',
        label: 'I often forget',
        icon: '💧',
      },
      {
        value: 'sometimes',
        label: 'Sometimes',
        icon: '💦',
      },
      {
        value: 'usually',
        label: 'Usually',
        icon: '🌊',
      },
      {
        value: 'consistently',
        label: 'Very consistently',
        icon: '✨',
      },
    ],
  },

  {
    id: 'goal',
    category: 'WELLNESS GOAL',
    question: 'What would you most like to improve?',
    description:
      'Choose the area you would like AYU to focus on.',
    options: [
      {
        value: 'sleep',
        label: 'Sleep & recovery',
        icon: '☾',
      },
      {
        value: 'fitness',
        label: 'Fitness & activity',
        icon: '🏃',
      },
      {
        value: 'nutrition',
        label: 'Nutrition',
        icon: '🥗',
      },
      {
        value: 'mind',
        label: 'Mind & balance',
        icon: '🌿',
      },
    ],
  },
]