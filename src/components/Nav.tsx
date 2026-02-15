import { motion } from 'framer-motion'
import type { StageId } from '../types'

interface NavProps {
  stages: { id: StageId; label: string }[]
  current: StageId
  onSelect: (id: StageId) => void
}

export function Nav({ stages, current, onSelect }: NavProps) {
  return (
    <nav className="nav glass">
      <div className="nav-brand">CLaRa</div>
      <div className="nav-links">
        {stages.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`nav-link ${current === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {current === id && (
              <motion.span
                layoutId="nav-pill"
                className="nav-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="nav-link-text">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
