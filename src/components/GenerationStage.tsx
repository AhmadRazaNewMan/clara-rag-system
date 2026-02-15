import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playStep, playSuccess, playTick } from '../lib/sound'

interface GenerationStageProps {
  query: string
  documentText: string
  topK: number
  onAnswerReady: (text: string) => void
  answer: string
  onRestart: () => void
}

// Simple mock answer based on query + doc (no real model)
function mockAnswer(query: string, _doc: string): string {
  const q = query.toLowerCase()
  if (q.includes('compress')) {
    return 'CLaRa compresses documents into dense "memory tokens"—continuous vectors in a shared latent space. Instead of storing raw text chunks, it learns to represent content in a compact form (often 16x to 128x compression) while preserving the information needed to answer questions.'
  }
  if (q.includes('retrieval') || q.includes('different')) {
    return 'In traditional RAG, retrieval is discrete: you either select a chunk or you don’t, so the generator can’t send gradients back to the retriever. CLaRa uses a differentiable top-k estimator so the whole pipeline is trained end-to-end—the generator teaches the retriever which memory tokens actually help produce correct answers.'
  }
  if (q.includes('ratio')) {
    return 'CLaRa achieves compression ratios of about 16x to 128x. Documents are compressed into memory tokens via QA-guided and paraphrase-guided semantic compression, so the model keeps what matters for answering while dropping redundancy.'
  }
  return 'CLaRa (Continuous Latent Reasoning) is Apple’s compression-native RAG. It maps documents and queries into a unified latent space, retrieves in that space, and trains retrieval and generation jointly so the system gets better at fetching the right context.'
}

export function GenerationStage({
  query,
  documentText,
  topK,
  onAnswerReady,
  onRestart,
}: GenerationStageProps) {
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'retrieving' | 'generating' | 'done'>('retrieving')
  const fullAnswer = useRef(mockAnswer(query, documentText))

  useEffect(() => {
    fullAnswer.current = mockAnswer(query, documentText)
    setDisplayed('')
    setPhase('retrieving')
    playStep()
    const t1 = setTimeout(() => {
      playStep()
      setPhase('generating')
    }, 800)
    return () => clearTimeout(t1)
  }, [query, documentText])

  useEffect(() => {
    if (phase !== 'generating') return
    const text = fullAnswer.current
    let i = 0
    const id = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i % 6 === 0) playTick()
      if (i >= text.length) {
        clearInterval(id)
        setPhase('done')
        playSuccess()
        onAnswerReady(text)
      }
    }, 18)
    return () => clearInterval(id)
  }, [phase, onAnswerReady])

  return (
    <section className="stage generation-stage">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">5</span> Generation
        </h2>
        <p className="stage-desc">
          Retrieved memory tokens feed the generator. Answer is produced step by step; in CLaRa, training is end-to-end so retrieval and generation improve together.
        </p>
      </motion.div>

      <motion.div
        className="gen-llm-callout glass"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="gen-llm-title">How the LLM contributes here</h3>
        <p className="gen-llm-desc">
          The LLM receives the query plus the top-{topK} retrieved memory tokens as context. It generates the answer token by token (autoregressive). In CLaRa, gradients flow back through a differentiable top-k so the retriever learns to fetch tokens that actually help produce correct answers.
        </p>
      </motion.div>

      <motion.div
        className="generation-flow glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="gen-phase gen-thinking-row">
          <span className={`gen-phase-label ${phase === 'retrieving' ? 'active' : phase === 'generating' || phase === 'done' ? 'done' : ''}`}>
            Retrieving top-{topK}
          </span>
          <span className="gen-phase-arrow">→</span>
          <span className={`gen-phase-label ${phase === 'generating' ? 'active' : phase === 'done' ? 'done' : ''}`}>
            {phase === 'generating' && <span className="thinking-dots"><span /><span /><span /></span>}
            LLM conditioning
          </span>
          <span className="gen-phase-arrow">→</span>
          <span className={`gen-phase-label ${phase === 'done' ? 'active' : ''}`}>
            {phase === 'done' ? 'Done' : 'Generating…'}
          </span>
        </div>

        <div className="gen-answer-wrap">
          <p className="gen-query-display">{query}</p>
          <p className="gen-answer">
            {displayed}
            {(phase === 'generating' || phase === 'done') && (
              <motion.span
                className="gen-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: phase === 'generating' ? Infinity : 0, duration: 0.6 }}
              >
                |
              </motion.span>
            )}
          </p>
        </div>

        <div className="gen-attribution">
          <span className="gen-attribution-label">Grounding</span>
          <span>Answer is grounded in the retrieved memory tokens (simulated here). In real CLaRa, attention over tokens shows which memories contributed.</span>
        </div>
      </motion.div>

      <motion.button
        type="button"
        className="stage-cta"
        onClick={onRestart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Start over
      </motion.button>
    </section>
  )
}
