import { motion } from 'framer-motion'

interface HeroProps {
  onEnter: () => void
  onSystemView: () => void
}

export function Hero({ onEnter, onSystemView }: HeroProps) {
  return (
    <section className="hero">
      <motion.div
        className="hero-bg-orb"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="hero-title">
          <span className="hero-title-main">CLaRa</span>
          <span className="hero-title-sub">Continuous Latent Reasoning</span>
        </h1>
        <p className="hero-tagline">
          Apple’s compression-native RAG. Documents → memory tokens → latent space → answers.
        </p>
        <div className="hero-cta-row">
          <motion.button
            type="button"
            className="hero-cta"
            onClick={onEnter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            See how it works
          </motion.button>
          <motion.button
            type="button"
            className="hero-cta-secondary"
            onClick={onSystemView}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            System overview
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>Scroll or use nav to explore</span>
      </motion.div>
    </section>
  )
}
