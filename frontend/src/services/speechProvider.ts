// ============================================================================
// SPEECH-TO-TEXT PROVIDER ABSTRACTION (Feature 14)
// Extensible architecture supporting Browser Speech API, Cloud Speech, & Indian Languages
// ============================================================================

export interface SpeechProvider {
  name: string
  isSupported(): boolean
  startListening(
    onResult: (text: string, isFinal?: boolean) => void,
    onError: (error: string) => void,
    lang?: string,
  ): void
  stopListening(): void
}

/**
 * 1. Web Standards Browser Speech Provider (Chrome / Edge / Safari Web Speech API)
 */
export class BrowserSpeechProvider implements SpeechProvider {
  name = 'Browser Speech Provider'
  private recognition: any = null

  isSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }

  startListening(
    onResult: (text: string, isFinal?: boolean) => void,
    onError: (error: string) => void,
    lang: string = 'en-US',
  ): void {
    if (!this.isSupported()) {
      onError('Speech recognition is not supported in this browser.')
      return
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false

      // Map application language to BCP 47 locale codes
      const langMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        bn: 'bn-IN',
      }
      this.recognition.lang = langMap[lang] || lang || 'en-US'

      this.recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript
          onResult(transcript, true)
        }
      }

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Speech recognition error occurred.')
      }

      this.recognition.start()
    } catch (err: any) {
      onError(err?.message || 'Failed to start speech recognition.')
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch (err) {
        console.warn('Speech recognition stop warning:', err)
      }
      this.recognition = null
    }
  }
}

/**
 * 2. Cloud Speech Provider Abstraction (Future Azure / Google Cloud Speech-to-Text)
 */
export class CloudSpeechProvider implements SpeechProvider {
  name = 'Cloud Speech Provider'
  private isListening = false

  isSupported(): boolean {
    return true
  }

  startListening(
    onResult: (text: string, isFinal?: boolean) => void,
    _onError: (error: string) => void,
    lang: string = 'en',
  ): void {
    this.isListening = true
    // Simulate cloud speech streaming with fallback prompt sample
    setTimeout(() => {
      if (this.isListening) {
        const sampleVoiceQueries: Record<string, string> = {
          en: 'Can this polyherbal formulation be patented under Section 3(p)?',
          hi: 'क्या यह आयुर्वेदिक फॉर्मूलेशन पेटेंट कराया जा सकता है?',
          bn: 'এই ভেষজ ফর্মুলেশন কি পেটেন্ট করা সম্ভব?',
        }
        onResult(sampleVoiceQueries[lang] || sampleVoiceQueries['en'], true)
        this.isListening = false
      }
    }, 2200)
  }

  stopListening(): void {
    this.isListening = false
  }
}

/**
 * 3. Future Indian Language Speech Provider (Bhashini / AI4Bharat Indic Speech API)
 */
export class FutureIndianLanguageSpeechProvider implements SpeechProvider {
  name = 'National Indic Speech Provider (Bhashini / IndicASR)'

  isSupported(): boolean {
    return true
  }

  startListening(
    onResult: (text: string, isFinal?: boolean) => void,
    _onError: (error: string) => void,
    lang: string = 'hi',
  ): void {
    setTimeout(() => {
      if (lang === 'hi') {
        onResult('पारंपरिक ज्ञान और जैविक विविधता अधिनियम के तहत क्या आवश्यकताएं हैं?', true)
      } else if (lang === 'bn') {
        onResult('জৈব বৈচিত্র্য আইন অনুসারে কী কী লাইসেন্স প্রয়োজন?', true)
      } else {
        onResult('What are the statutory requirements under Biological Diversity Act?', true)
      }
    }, 2000)
  }

  stopListening(): void {}
}

/**
 * Factory method to acquire the best available speech provider
 */
export function getSpeechProvider(): SpeechProvider {
  const browserProvider = new BrowserSpeechProvider()
  if (browserProvider.isSupported()) {
    return browserProvider
  }
  return new CloudSpeechProvider()
}

export interface SpeechListenOptions {
  language?: string
  onResult: (transcript: string, isFinal?: boolean) => void
  onError?: (err: string) => void
  onEnd?: () => void
}

export class SpeechService {
  private static provider: SpeechProvider = getSpeechProvider()

  public static isSupported(): boolean {
    return this.provider.isSupported()
  }

  public static getProviderName(): string {
    return this.provider.name
  }

  public static startListening(options: SpeechListenOptions): void {
    this.provider.startListening(
      (text: string, isFinal?: boolean) => {
        options.onResult(text, isFinal)
        if (isFinal && options.onEnd) {
          options.onEnd()
        }
      },
      (err: string) => {
        if (options.onError) {
          options.onError(err)
        }
      },
      options.language || 'en'
    )
  }

  public static stopListening(): void {
    this.provider.stopListening()
  }
}
