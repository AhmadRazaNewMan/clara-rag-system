import { Suspense, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playStep } from '../lib/sound'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { LatentSpaceScene } from './three/LatentSpaceScene'

interface LatentSpaceStageProps {
  documentText: string
  compressionRatio: number
  topK: number
  onTopKChange: (n: number) => void
  onQuery: () => void
}

function placeOrbs(count: number): { x: number; y: number; z: number }[] {
  const out: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 + Math.random() * 0.5
    const r = 2 + Math.random() * 1.5
    out.push({
      x: Math.cos(theta) * r + (Math.random() - 0.5),
      y: (Math.random() - 0.5) * 1.5,
      z: Math.sin(theta) * r + (Math.random() - 0.5),
    })
  }
  return out
}

export function LatentSpaceStage({
  documentText,
  compressionRatio,
  topK,
  onTopKChange,
  onQuery,
}: LatentSpaceStageProps) {
  const [showCode, setShowCode] = useState(false)
  const orbCount = Math.max(
    4,
    Math.ceil((documentText?.trim().split(/\s+/).length || 20) / compressionRatio)
  )
  const positions = useMemo(() => placeOrbs(orbCount), [orbCount])

  return (
    <section className="stage latent-stage">
      <motion.div
        className="stage-header latent-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">3</span> Latent space
        </h2>
        <p className="stage-desc">
          Compressed documents live as orbs in a shared vector space. Similar content clusters together. Queries map here too—retrieval is just proximity.
        </p>
      </motion.div>

      <div className="latent-layout">
        <div className="latent-canvas-wrap">
          <Suspense fallback={<div className="latent-fallback">Loading 3D…</div>}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              dpr={[1, 2]}
            >
              <color attach="background" args={['transparent']} />
              <ambientLight intensity={0.4} />
              <pointLight position={[4, 4, 4]} intensity={1} color="#00f5d4" />
              <pointLight position={[-4, -2, 4]} intensity={0.6} color="#7b2cbf" />
              <LatentSpaceScene positions={positions} />
              <OrbitControls
                enableZoom
                enablePan
                minDistance={3}
                maxDistance={12}
                autoRotate
                autoRotateSpeed={0.4}
              />
            </Canvas>
          </Suspense>
        </div>

        <motion.div
          className="latent-controls glass"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="control-group">
            <label>Top-K retrieval</label>
            <input
              type="range"
              min={1}
              max={8}
              value={topK}
              onChange={(e) => onTopKChange(Number(e.target.value))}
            />
            <span className="control-value">{topK}</span>
          </div>
          <p className="control-hint">
            Number of memory tokens sent to the generator. Differentiable top-k in CLaRa lets the generator teach the retriever.
          </p>
          <motion.button
            type="button"
            className="stage-cta"
            onClick={() => {
              playStep()
              onQuery()
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Run a query
          </motion.button>

          <button
            type="button"
            className="dev-snippet-toggle"
            onClick={() => setShowCode((c) => !c)}
          >
            {showCode ? 'Hide' : 'Show'} code
          </button>
          <AnimatePresence>
            {showCode && (
              <motion.pre
                className="dev-snippet glass"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {`# Differentiable top-k (CLaRa)
# Gradients flow from generator → retriever
scores = query_embed @ memory_tokens.T  # [B, N]
top_k_idx = straight_through_top_k(scores, k=${topK})
retrieved = memory_tokens[top_k_idx]  # → generator`}
              </motion.pre>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
