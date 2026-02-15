/**
 * Web Audio API sound effects. AudioContext is resumed on first user gesture (browser policy).
 */

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return ctx
}

function beep(frequency: number, durationMs: number, type: OscillatorType = 'sine', volume = 0.15): void {
  const context = getContext()
  if (!context) return
  try {
    const now = context.currentTime
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.connect(gain)
    gain.connect(context.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, now)
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000)
    osc.start(now)
    osc.stop(now + durationMs / 1000)
  } catch {
    // ignore
  }
}

/** Resume context on first user interaction (required by browsers). Call from onClick etc. */
export function resumeAudio(): void {
  const context = getContext()
  if (context?.state === 'suspended') context.resume()
}

/** Short step / UI advance (e.g. next phase) */
export function playStep(): void {
  resumeAudio()
  beep(520, 60, 'sine', 0.12)
}

/** Success / completion */
export function playSuccess(): void {
  resumeAudio()
  beep(640, 80, 'sine', 0.12)
  setTimeout(() => beep(880, 100, 'sine', 0.1), 90)
}

/** Whoosh / transition (sweep) */
export function playWhoosh(): void {
  resumeAudio()
  const context = getContext()
  if (!context) return
  try {
    const now = context.currentTime
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.connect(gain)
    gain.connect(context.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.linearRampToValueAtTime(800, now + 0.15)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    // ignore
  }
}

/** Soft tick (e.g. typewriter) */
export function playTick(): void {
  resumeAudio()
  beep(320, 25, 'sine', 0.06)
}
