export type Language = 'english' | 'italian'

export interface GameState {
  targetWord: string
  language: Language
  currentRound: number
  maxRounds: number
  userGuesses: string[]
  gameRange: {
    start: string
    end: string
  }
  gameStatus: 'playing' | 'won' | 'lost'
  isLoading: boolean
}

export interface GameSettings {
  language: Language
  maxRounds: number
}

export const KEYBOARD_LAYOUTS = {
  english: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ],
  italian: [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]
} as const
