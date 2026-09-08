import React, { useState, useRef, useEffect } from 'react'
import type { ChatMessage, InnovationFormData } from '../../types/analyzer'
import { ChatService, PRESET_SUGGESTED_PROMPTS } from '../../services/chatService'
import { VoiceInputButton } from './VoiceInputButton'
import EvidencePanel from './EvidencePanel'


interface AskAyuRakshaProps {
  currentFormData?: InnovationFormData
  activeDocumentName?: string
}

export const AskAyuRaksha: React.FC<AskAyuRakshaProps> = ({
  currentFormData,
  activeDocumentName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-001',
      sender: 'bot',
      text: 'Namaste! I am your IP-SAKTI Sahayak AI assistant. You can ask me any question regarding Ayurvedic patentability under Section 3(p)/3(d), Traditional Knowledge prior art, National Biodiversity Authority (NBA) approvals, or cross-border regulatory compliance (FDA/EMA).',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 98,
      reasoning: 'Initialized with codified legal guidelines from the Indian Patent Office, Ministry of AYUSH, and global herbal regulatory authorities.',
      nextStep: 'Type a question or select one of the suggested statutory prompts below.'
    }
  ])

  const [inputQuery, setInputQuery] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [activeReasoningId, setActiveReasoningId] = useState<string | null>(null)
  const [activeSourcesId, setActiveSourcesId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage
    }

    setMessages((prev) => [...prev, userMessage])
    setInputQuery('')
    setIsTyping(true)

    try {
      const botResponse = await ChatService.queryBot(query, {
        language: selectedLanguage,
        uploadedDocName: activeDocumentName,
        currentFormData
      })
      setMessages((prev) => [...prev, botResponse])
    } catch (err) {
      console.error('Chat bot error:', err)
    } finally {
      setIsTyping(false)
    }
  }

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript))
  }

  return (
    <div className="ask-ayu-raksha-container">
      <div className="chat-header">
        <div className="chat-title-group">
          <div className="feature-pill">Feature 13 & 14 • RAG Assistant & Multilingual Voice</div>
          <h2 className="section-title">Ask AYU-RAKSHA (IP-SAKTI Sahayak)</h2>
          <p className="section-subtitle">
            Multilingual AI assistant cited with authentic statutory provisions, patent rules, and pharmacopoeial monographs.
          </p>
        </div>

        <div className="chat-controls-bar">
          {activeDocumentName && (
            <div className="active-doc-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Context: <strong>{activeDocumentName}</strong></span>
            </div>
          )}

          <div className="language-selector-group">
            <span className="lang-icon">🌐</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="chat-lang-dropdown"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Statutory Prompts */}
      <div className="suggested-prompts-tray">
        <span className="tray-label">Suggested Inquiries:</span>
        <div className="prompts-scroll-row">
          {PRESET_SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="prompt-chip-btn"
              onClick={() => handlePromptSelect(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="chat-messages-feed">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot'
          const isReasoningOpen = activeReasoningId === msg.id
          const isSourcesOpen = activeSourcesId === msg.id

          return (
            <div key={msg.id} className={`chat-message-row ${isBot ? 'bot-row' : 'user-row'}`}>
              <div className="message-avatar">
                {isBot ? '🤖' : '👤'}
              </div>

              <div className="message-bubble-container">
                <div className="message-meta-bar">
                  <span className="sender-name">{isBot ? 'IP-SAKTI Sahayak' : 'You'}</span>
                  <span className="msg-timestamp">{msg.timestamp}</span>
                  {msg.confidence && (
                    <span className="confidence-chip">
                      Confidence: {msg.confidence}%
                    </span>
                  )}
                </div>

                <div className="message-text-content">
                  {msg.text.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Bot Reasoning Drawer */}
                {msg.reasoning && (
                  <div className="bot-reasoning-section">
                    <button
                      type="button"
                      className="reasoning-toggle-btn"
                      onClick={() =>
                        setActiveReasoningId(isReasoningOpen ? null : msg.id)
                      }
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      {isReasoningOpen ? 'Hide Analytical Reasoning' : 'Show AI Reasoning Rationale'}
                    </button>

                    {isReasoningOpen && (
                      <div className="reasoning-box">
                        <strong>Reasoning Path:</strong>
                        <p>{msg.reasoning}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bot Sources Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bot-sources-section">
                    <button
                      type="button"
                      className="sources-toggle-btn"
                      onClick={() =>
                        setActiveSourcesId(isSourcesOpen ? null : msg.id)
                      }
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {isSourcesOpen
                        ? 'Hide Statutory Sources'
                        : `View Statutory Sources (${msg.sources.length})`}
                    </button>

                    {isSourcesOpen && (
                      <div className="chat-sources-list">
                        <EvidencePanel
                          evidenceList={msg.sources}
                          title="Statutory Authorities & Citations"
                        />
                      </div>
                    )}

                  </div>
                )}

                {/* Bot Next Step */}
                {msg.nextStep && (
                  <div className="bot-next-step-box">
                    <span className="next-step-tag">Recommended Next Step:</span>
                    <span>{msg.nextStep}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="chat-message-row bot-row typing-row">
            <div className="message-avatar">🤖</div>
            <div className="typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="typing-label">Querying statutory database & TKDL indices...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
      >
        <div className="input-row">
          <input
            type="text"
            placeholder="Ask about Section 3(p), FDA NDI rules, NBA Form III, stability testing..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="chat-text-input"
            disabled={isTyping}
          />

          <VoiceInputButton
            onTranscript={handleVoiceTranscript}
            language={selectedLanguage}
            className="chat-voice-btn"
          />

          <button
            type="submit"
            className="chat-send-btn"
            disabled={!inputQuery.trim() || isTyping}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send
          </button>
        </div>

        <div className="chat-disclaimer-footnote">
          Disclaimer: IP-SAKTI Sahayak provides automated legal & regulatory analysis based on published statutes. It does not constitute formal legal counsel.
        </div>
      </form>
    </div>
  )
}
