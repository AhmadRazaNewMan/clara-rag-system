import { motion } from 'framer-motion'
import { EmbeddingExplainer } from './EmbeddingExplainer'
import { playStep } from '../lib/sound'

interface SystemOverviewProps {
  onNext: () => void
}

const PIPELINE = [
  { id: 'doc', label: 'Document', desc: 'Raw text input.' },
  { id: 'tokenize', label: 'Tokenize', desc: 'Split into subword tokens.' },
  { id: 'encode', label: 'Encode / Compress', desc: 'Encoder turns tokens into dense vectors (memory tokens).' },
  { id: 'latent', label: 'Latent space', desc: 'Vectors live here. Similar content = nearby points.' },
  { id: 'query', label: 'Query', desc: 'User question.' },
  { id: 'query-encode', label: 'Encode query', desc: 'Same encoder maps query into the same space.' },
  { id: 'similarity', label: 'Similarity', desc: 'Score query vs each memory token (e.g. dot product).' },
  { id: 'topk', label: 'Top-K', desc: 'Pick the K highest-scoring memory tokens.' },
  { id: 'gen', label: 'Generator (LLM)', desc: 'LLM conditions on query + retrieved tokens, generates answer.' },
  { id: 'answer', label: 'Answer', desc: 'Generated text. In CLaRa, gradients flow back to improve retrieval.' },
]

export function SystemOverview({ onNext }: SystemOverviewProps) {
  return (
    <section className="stage system-overview">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">⊕</span> System view
        </h2>
        <p className="stage-desc">
          End-to-end flow: how documents become memory tokens, how queries find them, and how the LLM produces the answer.
        </p>
      </motion.div>

      <motion.div
        className="pipeline-wrap glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="pipeline-title">RAG pipeline (CLaRa)</h3>
        <div className="pipeline-flow">
          {PIPELINE.map((step, i) => (
            <motion.div
              key={step.id}
              className="pipeline-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <span className="pipeline-step-num">{i + 1}</span>
              <div className="pipeline-step-content">
                <span className="pipeline-step-label">{step.label}</span>
                <span className="pipeline-step-desc">{step.desc}</span>
              </div>
              {i < PIPELINE.length - 1 && (
                <span className="pipeline-arrow" aria-hidden>→</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <EmbeddingExplainer />

      <motion.div
        className="system-llm-callout glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="system-callout-title">How the LLM contributes</h3>
        <ul className="system-callout-list">
          <li>Receives the query and the top-K retrieved memory tokens as context.</li>
          <li>Generates the answer token by token (autoregressive).</li>
          <li>In CLaRa: training is end-to-end—the LLM’s loss sends gradients back through a differentiable top-k, so the retriever learns to fetch tokens that actually help produce correct answers.</li>
        </ul>
      </motion.div>

      <motion.button
        type="button"
        className="stage-cta"
        onClick={() => {
          playStep()
          onNext()
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Try it with a document
      </motion.button>
    </section>
  )
}
