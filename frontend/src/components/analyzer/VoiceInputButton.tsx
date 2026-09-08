import React, { useState, useEffect } from 'react'
import { SpeechService } from '../../services/speechProvider'

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'en',
  className = ''
}) => {
  const [isListening, setIsListening] = useState<boolean>(false)
  const [isSupported, setIsSupported] = useState<boolean>(true)

  useEffect(() => {
    setIsSupported(SpeechService.isSupported())
  }, [])

  const toggleListening = () => {
    if (isListening) {
      SpeechService.stopListening()
      setIsListening(false)
    } else {
      setIsListening(true)
      SpeechService.startListening({
        language,
        onResult: (transcript: string, isFinal?: boolean) => {
          onTranscript(transcript)
          if (isFinal) {
            setIsListening(false)
          }
        },
        onError: (err: string) => {
          console.warn('Speech recognition error:', err)
          setIsListening(false)
        },
        onEnd: () => {
          setIsListening(false)
        }
      })
    }
  }

  if (!isSupported) {
    return (
      <button
        type="button"
        className={`voice-btn voice-btn-disabled ${className}`}
        title="Voice input not supported in this browser"
        disabled
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`voice-btn ${isListening ? 'listening-pulse' : ''} ${className}`}
      onClick={toggleListening}
      title={isListening ? 'Stop listening' : `Voice input (${SpeechService.getProviderName()})`}
    >
      {isListening ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <rect x="9" y="9" width="6" height="6" fill="#e53e3e" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  )
}
