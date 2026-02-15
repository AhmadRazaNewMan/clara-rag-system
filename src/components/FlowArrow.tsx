import { motion } from 'framer-motion'

interface FlowArrowProps {
  label: string
  show: boolean
  delay?: number
  direction?: 'right' | 'down'
  className?: string
}

export function FlowArrow({ label, show, delay = 0, direction = 'right', className = '' }: FlowArrowProps) {
  if (!show) return null

  return (
    <motion.div
      className={`flow-arrow flow-arrow--${direction} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.35 }}
    >
      <span className="flow-arrow-label">{label}</span>
      {direction === 'right' && (
        <svg viewBox="0 0 56 16" className="flow-arrow-svg">
          <path d="M0,8 L44,8 L44,4 L52,8 L44,12 L44,8" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {direction === 'down' && (
        <svg viewBox="0 0 16 56" className="flow-arrow-svg flow-arrow-svg--down">
          <path d="M8,0 L8,44 L4,44 L8,52 L12,44 L8,44" fill="none" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </motion.div>
  )
}
