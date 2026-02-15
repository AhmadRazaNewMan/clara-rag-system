# CLaRa — Continuous Latent Reasoning (Visualization)

An immersive, interactive single-page experience that visualizes **Apple’s CLaRa** RAG architecture: documents → compression → latent space → query → generation.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What’s in the experience

1. **Intro** — Hero; “See how it works” (→ System) or “System overview”.
2. **System** — Full RAG pipeline (Document → Tokenize → Encode → Latent space ↔ Query → Similarity → Top-K → Generator → Answer); “What are embeddings?” with 2D viz; “How the LLM contributes”.
3. **Document** — Paste or edit text; token estimate; “Compress to memory tokens”.
4. **Compression** — **System thinking**: Tokenizing… → Encoding… → Compressing… (with sound); word cloud → particles → memory-token orbs; ratio slider; “Enter latent space”.
5. **Latent space** — 3D orbs; orbit/zoom; Top-K; “Show code”; “Run a query”.
6. **Query** — Input question; “Generate answer” → **System thinking**: Encoding query… → Similarity… → Top-K… (with sound), then → Generation.
7. **Generation** — “How the LLM contributes” callout; **thinking steps**: Retrieving → LLM conditioning → Generating; typewriter answer with soft tick sound; “Start over”.

**Sound** — Web Audio: step beeps, whoosh on transitions, success chime, optional typewriter tick (first interaction may be silent due to browser policy).

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Framer Motion** — UI and stage transitions
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D latent space and orbs

## Design

- Dark theme, neon cyan/purple accents, glass panels.
- No backend: compression and answers are simulated (mock answers keyed off query keywords).

Build: `npm run build`. Preview: `npm run preview`.
