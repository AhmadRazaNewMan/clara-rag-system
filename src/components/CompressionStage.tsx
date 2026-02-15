import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playStep, playWhoosh, playSuccess } from '../lib/sound'

interface CompressionStageProps {
  documentText: string
  compressionRatio: number
  onRatioChange: (n: number) => void
  onEnterLatentSpace: () => void
}

function getWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean).slice(0, 80)
}

const THINKING_STEPS = [
  { id: 'tokenize', label: 'Tokenizing…', desc: 'Splitting text into subword tokens' },
  { id: 'encode', label: 'Encoding…', desc: 'Encoder turns tokens into dense vectors' },
  { id: 'compress', label: 'Compressing…', desc: 'Reducing to memory tokens (QA-guided)' },
]

export function CompressionStage({
  documentText,
  compressionRatio,
  onRatioChange,
  onEnterLatentSpace,
}: CompressionStageProps) {
  const words = getWords(documentText || 'CLaRa compresses documents into memory tokens.')
  const [phase, setPhase] = useState<'words' | 'thinking' | 'flying' | 'orbs'>('words')
  const [thinkingStep, setThinkingStep] = useState(0)
  const [orbCount, setOrbCount] = useState(0)
  const targetOrbs = Math.max(2, Math.ceil(words.length / compressionRatio))

  useEffect(() => {
    if (phase !== 'orbs') return
    const step = targetOrbs / 30
    let n = 0
    const id = setInterval(() => {
      n += step
      setOrbCount(Math.min(targetOrbs, Math.floor(n)))
      if (n >= targetOrbs) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [phase, targetOrbs])

  useEffect(() => {
    if (phase !== 'thinking') return
    if (thinkingStep >= THINKING_STEPS.length) {
      playWhoosh()
      setPhase('flying')
      return
    }
    playStep()
    const t = setTimeout(() => setThinkingStep((s) => s + 1), 700)
    return () => clearTimeout(t)
  }, [phase, thinkingStep])

  return (
    <section className="stage compression-stage">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">2</span> Compression
        </h2>
        <p className="stage-desc">
          Words collapse into dense memory tokens. Same information, far fewer vectors. This is the core of CLaRa.
        </p>
      </motion.div>

      <div className="compression-viz">
        <div className="compression-ratio-control glass">
          <label>
            Compression ratio: <strong>{compressionRatio}x</strong>
          </label>
          <input
            type="range"
            min={8}
            max={64}
            step={4}
            value={compressionRatio}
            onChange={(e) => onRatioChange(Number(e.target.value))}
          />
        </div>

        {phase === 'thinking' && (
          <motion.div
            className="thinking-bar-wrap glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="thinking-steps-row">
              {THINKING_STEPS.map((step, i) => (
                <span
                  key={step.id}
                  className={`thinking-step ${i < thinkingStep ? 'done' : i === thinkingStep ? 'active' : ''}`}
                >
                  {i === thinkingStep && <span className="thinking-dots"><span /><span /><span /></span>}
                  {step.label}
                </span>
              ))}
            </div>
            <div className="thinking-progress">
              <motion.div
                className="thinking-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(thinkingStep / THINKING_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {phase === 'words' && (
          <motion.div
            className="word-cloud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {words.slice(0, 24).map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                className="word-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                {w}
              </motion.span>
            ))}
            {words.length > 24 && <span className="word-tag">+{words.length - 24}...</span>}
          </motion.div>
        )}

        {phase === 'flying' && (
          <motion.div
            className="particles-flying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {words.slice(0, 12).map((w, i) => (
              <motion.span
                key={`f-${i}`}
                className="particle-word"
                initial={{ x: -80, y: 0, opacity: 1 }}
                animate={{
                  x: 80,
                  y: (i % 3 - 1) * 40,
                  opacity: 0.3,
                  scale: 0.6,
                }}
                transition={{ duration: 1.2, delay: i * 0.05 }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {phase === 'orbs' && (
            <motion.div
              className="orbs-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: orbCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="memory-orb-preview"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.03 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="compression-actions">
        {phase === 'words' && (
          <motion.button
            type="button"
            className="stage-cta"
            onClick={() => {
              playStep()
              setPhase('thinking')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start compression
          </motion.button>
        )}
        {phase === 'thinking' && (
          <p className="thinking-hint">System: tokenize → encode → compress</p>
        )}
        {phase === 'flying' && (
          <motion.button
            type="button"
            className="stage-cta"
            onClick={() => {
              playStep()
              setPhase('orbs')
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Form memory tokens
          </motion.button>
        )}
        {phase === 'orbs' && (
          <motion.button
            type="button"
            className="stage-cta glow-cyan"
            onClick={() => {
              playSuccess()
              onEnterLatentSpace()
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter latent space
          </motion.button>
        )}
      </div>
    </section>
  )
}
