import { ref, computed, reactive } from 'vue'
import type { GameState, Language } from '../types/game'
import { englishWords } from '../data/english-words'
import { italianWords } from '../data/italian-words'

export function useGame() {
  // Game state
  const gameState = reactive<GameState>({
    targetWord: '',
    language: 'english',
    currentRound: 0,
    maxRounds: 20,
    userGuesses: [],
    gameRange: {
      start: 'a',
      end: 'zyzzyva'
    },
    gameStatus: 'playing',
    isLoading: false
  })

  const currentGuess = ref('')

  // Computed properties
  const wordsArray = computed(() => {
    return gameState.language === 'english' ? englishWords : italianWords
  })

  const isGameOver = computed(() => {
    return gameState.gameStatus !== 'playing'
  })

  const remainingRounds = computed(() => {
    return gameState.maxRounds - gameState.currentRound
  })

  // Game functions
  function getRandomWord(words: string[]): string {
    return words[Math.floor(Math.random() * words.length)]
  }

  function startNewGame(language: Language = 'english', maxRounds: number = 20) {
    gameState.language = language
    gameState.maxRounds = maxRounds
    gameState.targetWord = getRandomWord(wordsArray.value)
    gameState.currentRound = 0
    gameState.userGuesses = []
    gameState.gameRange = {
      start: 'a',
      end: gameState.language === 'english' ? 'zyzzyva' : 'zona'
    }
    gameState.gameStatus = 'playing'
    currentGuess.value = ''
  }

  function submitGuess() {
    if (!currentGuess.value.trim() || isGameOver.value) return

    const guess = currentGuess.value.toLowerCase().trim()
    
    // Check if the guess is the target word
    if (guess === gameState.targetWord) {
      gameState.gameStatus = 'won'
      gameState.userGuesses.push(guess)
      currentGuess.value = ''
      return
    }

    // Add guess to history
    gameState.userGuesses.push(guess)
    gameState.currentRound++

    // Update the game range based on the guess
    updateGameRange(guess)

    // Check if max rounds reached
    if (gameState.currentRound >= gameState.maxRounds) {
      gameState.gameStatus = 'lost'
    }

    currentGuess.value = ''
  }

  function updateGameRange(guess: string) {
    const target = gameState.targetWord

    if (guess < target) {
      // Guess is before target, so update start range
      gameState.gameRange.start = guess
    } else if (guess > target) {
      // Guess is after target, so update end range
      gameState.gameRange.end = guess
    }
  }

  function resetGame() {
    startNewGame(gameState.language, gameState.maxRounds)
  }

  function setLanguage(language: Language) {
    gameState.language = language
    startNewGame(language, gameState.maxRounds)
  }

  function setMaxRounds(rounds: number) {
    gameState.maxRounds = rounds
  }

  // Keyboard functions
  function addLetter(letter: string) {
    if (isGameOver.value) return
    currentGuess.value += letter
  }

  function deleteLetter() {
    if (isGameOver.value) return
    currentGuess.value = currentGuess.value.slice(0, -1)
  }

  function clearGuess() {
    currentGuess.value = ''
  }

  // Initialize game
  startNewGame()

  return {
    // State
    gameState,
    currentGuess,
    
    // Computed
    isGameOver,
    remainingRounds,
    wordsArray,
    
    // Actions
    startNewGame,
    submitGuess,
    resetGame,
    setLanguage,
    setMaxRounds,
    addLetter,
    deleteLetter,
    clearGuess
  }
}
