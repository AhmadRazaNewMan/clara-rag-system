export type StageId =
  | 'hero'
  | 'system'
  | 'document'
  | 'compression'
  | 'latent'
  | 'query'
  | 'flow'
  | 'generation'

export interface MemoryToken {
  id: string
  label: string
  x: number
  y: number
  z: number
  relevance?: number
  selected?: boolean
}
