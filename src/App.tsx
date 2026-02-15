import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hero } from './components/Hero'
import { SystemOverview } from './components/SystemOverview'
import { DocumentStage } from './components/DocumentStage'
import { CompressionStage } from './components/CompressionStage'
import { LatentSpaceStage } from './components/LatentSpaceStage'
import { QueryStage } from './components/QueryStage'
import { GenerationStage } from './components/GenerationStage'
import { Nav } from './components/Nav'
import type { StageId } from './types'

const STAGES: { id: StageId; label: string }[] = [
  { id: 'hero', label: 'Intro' },
  { id: 'system', label: 'System' },
  { id: 'document', label: 'Document' },
  { id: 'compression', label: 'Compression' },
  { id: 'latent', label: 'Latent Space' },
  { id: 'query', label: 'Query' },
  { id: 'generation', label: 'Generation' },
]

export default function App() {
  const [stage, setStage] = useState<StageId>('hero')
  const [documentText, setDocumentText] = useState('')
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [compressionRatio, setCompressionRatio] = useState(16)
  const [topK, setTopK] = useState(4)

  const goTo = useCallback((id: StageId) => setStage(id), [])

  return (
    <>
      <Nav stages={STAGES} current={stage} onSelect={goTo} />
      <main className="main">
        <AnimatePresence mode="wait">
          {stage === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onEnter={() => goTo('system')} onSystemView={() => goTo('system')} />
            </motion.div>
          )}
          {stage === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SystemOverview onNext={() => goTo('document')} />
            </motion.div>
          )}
          {stage === 'document' && (
            <motion.div
              key="document"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <DocumentStage
                documentText={documentText}
                onDocumentChange={setDocumentText}
                onCompress={() => goTo('compression')}
              />
            </motion.div>
          )}
          {stage === 'compression' && (
            <motion.div
              key="compression"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CompressionStage
                documentText={documentText}
                compressionRatio={compressionRatio}
                onRatioChange={setCompressionRatio}
                onEnterLatentSpace={() => goTo('latent')}
              />
            </motion.div>
          )}
          {stage === 'latent' && (
            <motion.div
              key="latent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', minHeight: '100vh' }}
            >
              <LatentSpaceStage
                documentText={documentText}
                compressionRatio={compressionRatio}
                topK={topK}
                onTopKChange={setTopK}
                onQuery={() => goTo('query')}
              />
            </motion.div>
          )}
          {stage === 'query' && (
            <motion.div
              key="query"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QueryStage
                query={query}
                onQueryChange={setQuery}
                onGenerate={() => goTo('generation')}
              />
            </motion.div>
          )}
          {stage === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GenerationStage
                query={query}
                documentText={documentText}
                topK={topK}
                onAnswerReady={setAnswer}
                answer={answer}
                onRestart={() => goTo('hero')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
