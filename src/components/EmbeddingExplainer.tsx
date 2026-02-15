import { motion } from 'framer-motion'

interface EmbeddingExplainerProps {
  compact?: boolean
}

/** What are embeddings: text → vector → position in space; similar = close. */
export function EmbeddingExplainer({ compact }: EmbeddingExplainerProps) {
  const points = [
    { label: 'doc A', x: 15, y: 25, color: 'var(--neon-cyan)' },
    { label: 'doc B', x: 28, y: 22, color: 'var(--neon-cyan)' },
    { label: 'query', x: 22, y: 55, color: 'var(--neon-magenta)' },
  ]

  return (
    <motion.div
      className={`embedding-explainer glass ${compact ? 'embedding-explainer-compact' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="embedding-explainer-title">What are embeddings?</h3>
      <p className="embedding-explainer-desc">
        Text is turned into a list of numbers (a vector). That vector is a point in a high-dimensional space.
        Similar meaning → close together. The system finds the nearest points to your query.
      </p>
      <div className="embedding-explainer-viz">
        <svg viewBox="0 0 100 80" className="embedding-svg">
          <defs>
            <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="90" height="70" fill="url(#embGrad)" rx="4" />
          {points.map((p, i) => (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
            >
              <circle cx={p.x} cy={p.y} r="5" fill={p.color} className="embedding-dot" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" className="embedding-label">{p.label}</text>
            </motion.g>
          ))}
          <motion.path
            d="M 22 55 L 20 35"
            stroke="var(--neon-magenta)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          />
          <text x="12" y="43" className="embedding-hint">nearest</text>
        </svg>
      </div>
      <p className="embedding-explainer-note">
        In CLaRa, documents are compressed into dense “memory tokens” (vectors) and stored in this shared latent space. Queries are encoded the same way—retrieval is finding the closest memory tokens.
      </p>
    </motion.div>
  )
}
