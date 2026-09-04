import { useState } from 'react'
import { Link } from 'react-router-dom'

import AssessmentOption from '../components/AssessmentOption'
import AssessmentProgress from '../components/AssessmentProgress'

import {
  assessmentQuestions,
} from '../data/assessmentQuestions'

import type {
  AssessmentAnswers,
} from '../types/assessment'

const initialAnswers: AssessmentAnswers = {
  sleep: '',
  activity: '',
  stress: '',
  nutrition: '',
  water: '',
  goal: '',
}

function Assessment() {
  const [currentStep, setCurrentStep] =
    useState(0)

  const [answers, setAnswers] =
    useState<AssessmentAnswers>(
      initialAnswers,
    )

  const [completed, setCompleted] =
    useState(false)

  const question =
    assessmentQuestions[currentStep]

  const selectedAnswer =
    answers[question.id]

  const totalSteps =
    assessmentQuestions.length

  const isLastStep =
    currentStep === totalSteps - 1

  function handleSelect(
    value: string,
  ) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }))
  }

  function handleNext() {
    if (!selectedAnswer) return

    if (isLastStep) {
      setCompleted(true)
      return
    }

    setCurrentStep(
      (previous) => previous + 1,
    )
  }

  function handleBack() {
    if (currentStep === 0) return

    setCurrentStep(
      (previous) => previous - 1,
    )
  }

  if (completed) {
    return (
      <div className="assessment-page">

        <div className="assessment-complete">

          <div className="assessment-complete-icon">
            ✦
          </div>

          <span className="section-label">
            ASSESSMENT COMPLETE
          </span>

          <h1>
            Thank you for sharing. 🌿
          </h1>

          <p>
            AYU now has a better understanding
            of your wellness patterns. Your
            personalized journey starts here.
          </p>

          <div className="assessment-complete-actions">

            <Link
              to="/dashboard"
              className="assessment-primary-button"
            >
              Return to Dashboard
              <span>→</span>
            </Link>

            <button
              type="button"
              className="assessment-secondary-button"
              onClick={() => {
                setAnswers(initialAnswers)
                setCurrentStep(0)
                setCompleted(false)
              }}
            >
              Retake Assessment
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="assessment-page">

      <div className="assessment-container">

        {/* TOP */}

        <div className="assessment-top">

          <Link
            to="/dashboard"
            className="assessment-back"
          >
            ← Dashboard
          </Link>

          <span className="assessment-brand">
            AYU
          </span>

        </div>

        {/* INTRO */}

        <div className="assessment-intro">

          <span className="section-label">
            AYU HEALTH ASSESSMENT
          </span>

          <h1>
            Let's understand you. 🌿
          </h1>

          <p>
            A few thoughtful questions to help
            AYU understand your everyday
            wellness patterns.
          </p>

        </div>

        {/* PROGRESS */}

        <AssessmentProgress
          current={currentStep + 1}
          total={totalSteps}
        />

        {/* QUESTION */}

        <section className="assessment-question">

          <div className="assessment-question-heading">

            <span className="assessment-category">
              {question.category}
            </span>

            <h2>
              {question.question}
            </h2>

            {question.description && (
              <p>
                {question.description}
              </p>
            )}

          </div>

          <div className="assessment-options">

            {question.options.map(
              (option) => (
                <AssessmentOption
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  selected={
                    selectedAnswer ===
                    option.value
                  }
                  onClick={() =>
                    handleSelect(
                      option.value,
                    )
                  }
                />
              ),
            )}

          </div>

        </section>

        {/* CONTROLS */}

        <div className="assessment-controls">

          <button
            type="button"
            className="assessment-back-button"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            ← Back
          </button>

          <button
            type="button"
            className="assessment-next-button"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {isLastStep
              ? 'Complete Assessment'
              : 'Continue'}
            <span>→</span>
          </button>

        </div>

      </div>

    </div>
  )
}

export default Assessment