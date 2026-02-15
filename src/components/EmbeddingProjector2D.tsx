/**
 * Projector-style 2D embedding view (inspired by TensorFlow Embedding Projector).
 * Shows doc points, query point, similarity lines, top-K highlight, hover labels.
 */

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface EmbeddingPoint {
  id: string
  label: string
  x: number
  y: number
  selected?: boolean
}

interface EmbeddingProjector2DProps {
  pointCount: number
  queryLabel: string | null
  topKIndices: number[]
  step: number
  width?: number
  height?: number
}

function placePoints2D(count: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
    const r = 0.35 + Math.random() * 0.25
    out.push({ x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r })
  }
  return out
}

export function EmbeddingProjector2D({
  pointCount,
  queryLabel,
  topKIndices,
  step,
  width = 420,
  height = 320,
}: EmbeddingProjector2DProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)

  const positions = useMemo(() => placePoints2D(pointCount), [pointCount])
  const points: EmbeddingPoint[] = useMemo(
    () =>
      positions.map((pos, i) => ({
        id: `doc-${i}`,
        label: `Doc ${i + 1}`,
        x: pos.x,
        y: pos.y,
        selected: topKIndices.includes(i),
      })),
    [positions, topKIndices]
  )

  const queryPos = queryLabel ? { x: 0.5 + 0.15, y: 0.22, label: queryLabel } : null

  const padding = 40
  const scale = (v: number, axis: 'x' | 'y') =>
    axis === 'x' ? padding + v * (width - 2 * padding) : height - (padding + v * (height - 2 * padding))

  return (
    <div className="embedding-projector-wrap">
      <div className="embedding-projector-title">
        <span>Embedding space</span>
        <span className="embedding-projector-hint">(like TensorFlow Projector — 2D projection)</span>
      </div>
      <svg
        width={width}
        height={height}
        className="embedding-projector-svg"
        onMouseLeave={() => setHoverId(null)}
      >
        <defs>
          <linearGradient id="projBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0.04" />
          </linearGradient>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="var(--neon-cyan)" />
          </marker>
        </defs>
        <rect width={width} height={height} fill="url(#projBg)" rx="8" />
        <rect width={width} height={height} fill="none" stroke="var(--glass-border)" rx="8" strokeWidth="1" />

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line
              x1={padding}
              y1={scale(t, 'y')}
              x2={width - padding}
              y2={scale(t, 'y')}
              stroke="var(--glass-border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <line
              x1={scale(t, 'x')}
              y1={padding}
              x2={scale(t, 'x')}
              y2={height - padding}
              stroke="var(--glass-border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </g>
        ))}

        {/* Document points (step >= 1) */}
        {step >= 1 &&
          points.map((p, i) => (
            <g
              key={p.id}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{ cursor: 'pointer' }}
            >
              {step >= 4 && p.selected && (
                <motion.circle
                  r="14"
                  cx={scale(p.x, 'x')}
                  cy={scale(p.y, 'y')}
                  fill="var(--neon-cyan)"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              <motion.circle
                r={p.selected && step >= 4 ? 8 : 6}
                cx={scale(p.x, 'x')}
                cy={scale(p.y, 'y')}
                fill={p.selected && step >= 4 ? 'var(--neon-cyan)' : 'var(--neon-cyan)'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                style={{
                  filter: p.selected && step >= 4 ? 'drop-shadow(0 0 8px var(--neon-cyan))' : undefined,
                }}
              />
              {(hoverId === p.id || (step >= 5 && p.selected)) && (
                <text
                  x={scale(p.x, 'x')}
                  y={scale(p.y, 'y') - 12}
                  textAnchor="middle"
                  className="embedding-point-label"
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}

        {/* Similarity lines: query → top-K (step >= 3) */}
        {step >= 3 &&
          queryPos &&
          topKIndices.slice(0, 4).map((idx, i) => {
            const p = points[idx]
            if (!p) return null
            const x1 = scale(queryPos.x, 'x')
            const y1 = scale(queryPos.y, 'y')
            const x2 = scale(p.x, 'x')
            const y2 = scale(p.y, 'y')
            const d = `M ${x1} ${y1} L ${x2} ${y2}`
            return (
              <motion.path
                key={`line-${idx}`}
                d={d}
                fill="none"
                stroke="var(--neon-magenta)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{ opacity: 0.8 }}
              />
            )
          })}

        {/* Query point (step >= 2) */}
        {step >= 2 && queryPos && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <circle
              r="10"
              cx={scale(queryPos.x, 'x')}
              cy={scale(queryPos.y, 'y')}
              fill="var(--neon-magenta)"
              className="embedding-query-dot"
            />
            <text
              x={scale(queryPos.x, 'x')}
              y={scale(queryPos.y, 'y') - 14}
              textAnchor="middle"
              className="embedding-query-label"
            >
              Query
            </text>
          </motion.g>
        )}
      </svg>

      <AnimatePresence>
        {hoverId && (
          <motion.div
            className="embedding-tooltip glass"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {points.find((p) => p.id === hoverId)?.label ?? hoverId}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
