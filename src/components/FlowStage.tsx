/**
 * Full RAG flow: embedding space → query → similarity → top-K → LLM → answer.
 * Step-by-step animation with arrows and labels (developer-friendly, projector-style).
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { playStep, playSuccess, playTick } from '../lib/sound'
import { EmbeddingProjector2D } from './EmbeddingProjector2D'
import { FlowArrow } from './FlowArrow'

const FLOW_STEPS = [
  { id: 1, label: 'Documents in embedding space', desc: 'Memory tokens (compressed docs) live as points. Similar content = nearby.' },
  { id: 2, label: 'Query encoded', desc: 'Your question is encoded into the same space → query point appears.' },
  { id: 3, label: 'Similarity computed', desc: 'System scores query vs each point (e.g. dot product). Lines show top-K nearest.' },
  { id: 4, label: 'Top-K selected', desc: 'Differentiable top-k picks the K highest-scoring memory tokens (highlighted).' },
  { id: 5, label: 'Feed to LLM', desc: 'Retrieved tokens + query go to the generator (LLM) as context.' },
  { id: 6, label: 'Answer generated', desc: 'LLM produces the answer token by token, grounded in retrieved context.' },
]

function mockAnswer(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('compress')) return 'CLaRa compresses documents into dense memory tokens in a shared latent space, often 16x–128x compression.'
  if (q.includes('retrieval') || q.includes('different')) return 'CLaRa uses differentiable top-k so gradients flow from the generator back to the retriever—end-to-end learning.'
  if (q.includes('ratio')) return 'CLaRa achieves ~16x to 128x compression via QA-guided and paraphrase-guided semantic compression.'
  return 'CLaRa maps documents and queries into a unified latent space and trains retrieval + generation jointly.'
}

interface FlowStageProps {
  query: string
  documentText: string
  topK: number
  onContinueToGeneration: () => void
}

export function FlowStage({ query, documentText, topK, onContinueToGeneration }: FlowStageProps) {
  const [step, setStep] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [speed, setSpeed] = useState<'slow' | 'medium'>('slow')
  const [displayedAnswer, setDisplayedAnswer] = useState('')
  const fullAnswer = useRef(mockAnswer(query || 'What is CLaRa?'))

  const pointCount = Math.max(4, Math.ceil((documentText?.trim().split(/\s+/).length || 20) / 16))
  const topKIndices = [0, 1, 2, 3].slice(0, topK)

  const duration = speed === 'slow' ? 2200 : 1200

  useEffect(() => {
    fullAnswer.current = mockAnswer(query || 'What is CLaRa?')
  }, [query])

  const typewriterStarted = useRef(false)

  useEffect(() => {
    if (step === 6 && !typewriterStarted.current) {
      typewriterStarted.current = true
      setDisplayedAnswer('')
      const text = fullAnswer.current
      let i = 0
      const id = setInterval(() => {
        i += 1
        setDisplayedAnswer(text.slice(0, i))
        if (i % 5 === 0) playTick()
        if (i >= text.length) {
          clearInterval(id)
          playSuccess()
        }
      }, 20)
      return () => clearInterval(id)
    }
    if (step < 6) typewriterStarted.current = false
  }, [step])

  useEffect(() => {
    if (!autoPlay || step >= 6) return
    playStep()
    const t = setTimeout(() => setStep((s) => s + 1), duration)
    return () => clearTimeout(t)
  }, [autoPlay, step, duration])

  const goNext = () => {
    if (step >= 6) return
    playStep()
    setStep((s) => s + 1)
  }

  const goPrev = () => {
    if (step <= 1) return
    setStep((s) => s - 1)
    if (step === 6) setDisplayedAnswer('')
  }

  return (
    <section className="stage flow-stage">
      <motion.div className="stage-header" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="stage-title">
          <span className="stage-title-accent">↬</span> Full flow (animation)
        </h2>
        <p className="stage-desc">
          Step-by-step: how the query interacts with embeddings, how top-K is fetched, and how the result feeds the LLM. Inspired by{' '}
          <a href="https://projector.tensorflow.org/" target="_blank" rel="noopener noreferrer" className="flow-link">
            TensorFlow Embedding Projector
          </a>
          .
        </p>
      </motion.div>

      <div className="flow-controls glass">
        <div className="flow-step-indicator">
          {FLOW_STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`flow-step-dot ${step >= s.id ? 'active' : ''} ${step === s.id ? 'current' : ''}`}
              onClick={() => setStep(s.id)}
              title={s.label}
            >
              {s.id}
            </button>
          ))}
        </div>
        <div className="flow-speed-row">
          <label>Speed:</label>
          <select value={speed} onChange={(e) => setSpeed(e.target.value as 'slow' | 'medium')}>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
          </select>
          <button type="button" className="flow-autoplay-btn" onClick={() => setAutoPlay((a) => !a)}>
            {autoPlay ? 'Pause' : 'Auto-play'}
          </button>
          <button type="button" className="flow-prev-btn" onClick={goPrev} disabled={step <= 1}>
            Prev
          </button>
          <button type="button" className="flow-next-btn" onClick={goNext} disabled={step >= 6}>
            Next
          </button>
        </div>
      </div>

      <div className="flow-content">
        <div className="flow-viz-row">
          <div className="flow-step-card glass">
            <span className="flow-step-num">Step {step}</span>
            <h3 className="flow-step-title">{FLOW_STEPS[step - 1]?.label}</h3>
            <p className="flow-step-desc">{FLOW_STEPS[step - 1]?.desc}</p>
          </div>
          <FlowArrow label="Query → same space" show={step >= 2} delay={0.2} direction="right" />
          <div className="flow-projector-wrap">
            <EmbeddingProjector2D
              pointCount={pointCount}
              queryLabel={step >= 2 ? (query || 'Your query') : null}
              topKIndices={topKIndices}
              step={step}
              width={440}
              height={340}
            />
          </div>
        </div>

        <div className="flow-arrow-down-wrap">
          <FlowArrow label="Top-K → Generator (LLM)" show={step >= 5} delay={0.1} direction="down" />
        </div>

        <motion.div
          className="flow-llm-zone glass"
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 5 ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="flow-llm-title">Generator (LLM)</h3>
          <p className="flow-llm-hint">Receives query + top-{topK} memory tokens → generates answer</p>
          {step >= 6 && (
            <div className="flow-answer-wrap">
              <p className="flow-query-display">Q: {query || 'What is CLaRa?'}</p>
              <p className="flow-answer">
                {displayedAnswer}
                <motion.span
                  className="flow-cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                >
                  |
                </motion.span>
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {step >= 6 && (
        <motion.button
          type="button"
          className="stage-cta glow-cyan"
          onClick={onContinueToGeneration}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue to generation stage
        </motion.button>
      )}
    </section>
  )
}
