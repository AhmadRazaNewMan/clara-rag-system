# CLaRa — Continuous Latent Reasoning (Visualization)

[![Live Demo](https://img.shields.io/badge/Live_Demo-CLaRa_RAG-00f5d4?style=for-the-badge&labelColor=0a0a10)](https://clara-rag-system.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-clara--rag--system-7b2cbf?style=for-the-badge&logo=github)](https://github.com/AhmadRazaNewMan/clara-rag-system)

An **interactive, visual** walkthrough of **Apple’s CLaRa** RAG architecture. No PDF required — see how documents become memory tokens, how queries hit the latent space, and how the LLM gets context, step by step.

**Try it:** [clara-rag-system.vercel.app](https://clara-rag-system.vercel.app/)

---

## Original research

This project visualizes the system from:

| Resource | Link |
|----------|------|
| **Paper (arXiv)** | [CLaRa: Bridging Retrieval and Generation with Continuous Latent Reasoning](https://arxiv.org/abs/2511.18659) |
| **PDF** | [arxiv.org/pdf/2511.18659](https://arxiv.org/pdf/2511.18659) |
| **Apple (official code)** | [github.com/apple/ml-clara](https://github.com/apple/ml-clara) |
| **Hugging Face (paper)** | [huggingface.co/papers/2511.18659](https://huggingface.co/papers/2511.18659) |

CLaRa is by **Apple** and **University of Edinburgh**. It compresses documents into “memory tokens,” does retrieval in a shared latent space, and trains retrieval + generation **end-to-end** with a differentiable top-k.

---

## How it works (in the app)

1. **Document** — You paste or type text. The app shows a token estimate and explains that CLaRa will compress it into memory tokens (not raw chunks).
2. **Compression** — Animated “system thinking”: *Tokenizing → Encoding → Compressing*. Words become particles, then **memory-token orbs**. You can change the compression ratio (8×–64×).
3. **Latent space** — A **3D scene** (Three.js) of floating orbs = compressed docs in vector space. You orbit/zoom, set **Top-K**, and see a code snippet for differentiable top-k.
4. **Query** — You ask a question. The app runs a short “Encoding query → Similarity → Top-K” animation (with optional sound).
5. **Full flow (animation)** — A **projector-style 2D view** (inspired by [TensorFlow Embedding Projector](https://projector.tensorflow.org/)): doc points, query point, **similarity lines** to top-K, then arrows “Top-K → LLM” and a typewriter answer. Step-by-step with **Prev/Next** and **Auto-play**.
6. **Generation** — The “LLM” zone shows a typewriter answer grounded in the retrieved context, plus a short note on how the LLM contributes and how gradients flow back in CLaRa.

Everything is **simulated** in the browser (no backend). The goal is to make the pipeline and concepts clear for developers and educators.

---

## What’s in the experience

| Stage | What you get |
|-------|----------------|
| **Intro** | Hero + “See how it works” / “System overview” |
| **System** | Full RAG pipeline diagram, “What are embeddings?” 2D viz, “How the LLM contributes” |
| **Document** | Textarea, token estimate, “Compress to memory tokens” |
| **Compression** | Thinking steps (with sound), word cloud → particles → orbs, ratio slider, “Enter latent space” |
| **Latent space** | 3D orbs, orbit/zoom, Top-K slider, “Show code,” “Run a query” / “See full flow” |
| **Query** | Input + suggestions, “Generate answer” or “See full flow (animation)” |
| **Flow** | 2D embedding view, step-by-step (1–6), arrows, “Top-K → LLM,” typewriter answer, Auto-play / Slow–Medium |
| **Generation** | LLM callout, thinking steps, typewriter answer, “Start over” |

**Sound (Web Audio):** step beeps, whoosh, success chime, optional typewriter tick. First interaction may be silent (browser policy).

---

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Framer Motion** — UI and stage transitions
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D latent space
- **Web Audio API** — sound effects

---

## Run locally

```bash
git clone https://github.com/AhmadRazaNewMan/clara-rag-system.git
cd clara-rag-system
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Build:** `npm run build`  
**Preview:** `npm run preview`

---

## Design

- Dark theme, neon cyan/purple, glass-style panels.
- No server: compression and answers are simulated (mock answers from query keywords).

---

## Topics (for GitHub)

Use these as **repository topics** on GitHub for better discoverability:

`rag` `clara` `apple` `retrieval-augmented-generation` `embeddings` `latent-space` `visualization` `react` `three.js` `machine-learning` `llm` `vector-search` `compression` `tensorflow-projector` `educational`

---

## License

MIT. This is an independent educational visualization; it is not affiliated with or endorsed by Apple.
