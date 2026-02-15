import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playStep, playWhoosh } from '../lib/sound'

interface QueryStageProps {
  query: string
  onQueryChange: (q: string) => void
  onGenerate: () => void
}

const SUGGESTIONS = [
  'What does CLaRa compress?',
  'How is retrieval different from traditional RAG?',
  'What is the compression ratio?',
]

const QUERY_THINKING = [
  'Encoding query…',
  'Computing similarity…',
  'Selecting top-K…',
]

export function QueryStage({ query, onQueryChange, onGenerate }: QueryStageProps) {
  const [thinking, setThinking] = useState(false)
  const [thinkingStep, setThinkingStep] = useState(0)

  useEffect(() => {
    if (!thinking) return
    if (thinkingStep >= QUERY_THINKING.length) {
      playWhoosh()
      onGenerate()
      return
    }
    playStep()
    const t = setTimeout(() => setThinkingStep((s) => s + 1), 500)
    return () => clearTimeout(t)
  }, [thinking, thinkingStep, onGenerate])

  const handleGenerate = () => {
    if (!query.trim()) return
    setThinking(true)
    setThinkingStep(0)
  }

  return (
    <section className="stage query-stage">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">4</span> Query
        </h2>
        <p className="stage-desc">
          Your question is mapped into the same latent space. The differentiable top-k selector picks the most relevant memory tokens—gradients flow back so retrieval improves over time.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {thinking ? (
          <motion.div
            key="thinking"
            className="query-thinking glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="query-thinking-title">System thinking</h3>
            <div className="thinking-steps-row">
              {QUERY_THINKING.map((step, i) => (
                <span
                  key={step}
                  className={`thinking-step ${i < thinkingStep ? 'done' : i === thinkingStep ? 'active' : ''}`}
                >
                  {i === thinkingStep && <span className="thinking-dots"><span /><span /><span /></span>}
                  {step}
                </span>
              ))}
            </div>
            <div className="thinking-progress">
              <motion.div
                className="thinking-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(thinkingStep / QUERY_THINKING.length) * 100}%` }}
                transition={{ duration: 0.25 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="query-input-wrap glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="query-label">Ask something</label>
            <input
              type="text"
              className="query-input"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="e.g. What does CLaRa compress?"
              autoFocus
            />
            <div className="query-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="query-suggestion"
                  onClick={() => onQueryChange(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!thinking && (
        <motion.button
          type="button"
          className="stage-cta"
          onClick={handleGenerate}
          disabled={!query.trim()}
          whileHover={{ scale: query.trim() ? 1.02 : 1 }}
          whileTap={{ scale: query.trim() ? 0.98 : 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Generate answer
        </motion.button>
      )}
    </section>
  )
}
