import { motion } from 'framer-motion'
import { playStep } from '../lib/sound'

interface DocumentStageProps {
  documentText: string
  onDocumentChange: (text: string) => void
  onCompress: () => void
}

const SAMPLE =
  'CLaRa compresses documents into dense memory tokens. Instead of retrieving raw text chunks, both documents and queries live in a unified latent space. The generator can pass feedback to the retriever, so the system learns to retrieve what actually helps generate correct answers. Compression ratios of 16x to 128x are achievable.'

export function DocumentStage({
  documentText,
  onDocumentChange,
  onCompress,
}: DocumentStageProps) {
  const text = documentText || SAMPLE
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const tokenEstimate = Math.ceil(wordCount * 1.3)

  return (
    <section className="stage document-stage">
      <motion.div
        className="stage-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="stage-title">
          <span className="stage-title-accent">1</span> Document
        </h2>
        <p className="stage-desc">
          Raw text is the input. In traditional RAG we’d chunk this and embed each chunk. CLaRa will compress it into memory tokens first.
        </p>
      </motion.div>

      <motion.div
        className="document-editor glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          className="document-textarea"
          value={documentText}
          onChange={(e) => onDocumentChange(e.target.value)}
          placeholder={SAMPLE}
          rows={6}
          spellCheck={false}
        />
        <div className="document-meta">
          <span>~{tokenEstimate} tokens</span>
          <span>→ will compress to memory tokens next</span>
        </div>
      </motion.div>

      <motion.button
        type="button"
        className="stage-cta"
        onClick={() => {
          playStep()
          onCompress()
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Compress to memory tokens
      </motion.button>
    </section>
  )
}
