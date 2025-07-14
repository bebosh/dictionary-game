<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGame } from './composables/useGame'
import GameDisplay from './components/GameDisplay.vue'
import VirtualKeyboard from './components/VirtualKeyboard.vue'
import GameSettings from './components/GameSettings.vue'

const {
  gameState,
  currentGuess,
  isGameOver,
  submitGuess,
  resetGame,
  setLanguage,
  setMaxRounds,
  addLetter,
  deleteLetter,
  clearGuess
} = useGame()

const showSettings = ref(false)
const isDarkMode = ref(false)

// Theme management
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const body = document.body
  const root = document.documentElement
  
  // Always override system preference with our controls
  root.classList.add('dark-theme-override')
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    body.classList.add('dark-theme')
  } else {
    isDarkMode.value = false
    body.classList.remove('dark-theme')
  }
})

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  
  const body = document.body
  const root = document.documentElement
  
  if (isDarkMode.value) {
    body.classList.add('dark-theme')
    root.classList.add('dark-theme-override')
    localStorage.setItem('theme', 'dark')
  } else {
    body.classList.remove('dark-theme')
    root.classList.add('dark-theme-override') // Always override system preference
    localStorage.setItem('theme', 'light')
  }
}

// Computed property for used letters in virtual keyboard
const usedLetters = computed(() => {
  return gameState.userGuesses.flatMap(guess => guess.split(''))
})

// Event handlers
function handleKeyPress(key: string) {
  addLetter(key)
}

function handleEnter() {
  submitGuess()
}

function handleBackspace() {
  deleteLetter()
}

function handleClear() {
  clearGuess()
}

function handleNewGame() {
  resetGame()
}

function handleApplySettings(settings: { language: any; maxRounds: number }) {
  setMaxRounds(settings.maxRounds)
  setLanguage(settings.language)
}

// Keyboard event listener for physical keyboard
function handleKeydown(event: KeyboardEvent) {
  if (isGameOver.value) return
  
  const key = event.key.toLowerCase()
  
  if (key === 'enter') {
    event.preventDefault()
    submitGuess()
  } else if (key === 'backspace') {
    event.preventDefault()
    deleteLetter()
  } else if (key === 'escape') {
    event.preventDefault()
    clearGuess()
  } else if (/^[a-z]$/.test(key)) {
    event.preventDefault()
    addLetter(key)
  }
}

// Add keyboard event listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<template>
  <div id="app">
    <!-- Top Bar with Theme Toggle and Settings -->
    <div class="top-bar">
      <button 
        class="theme-toggle"
        @click="toggleTheme"
        :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
      
      <button 
        class="settings-button"
        @click="showSettings = true"
        aria-label="Open game settings"
      >
        ⚙️ Settings
      </button>
    </div>

    <!-- Main Game Area -->
    <main class="main-content">
      <GameDisplay
        :game-state="gameState"
        :current-guess="currentGuess"
        :is-game-over="isGameOver"
        @update:current-guess="currentGuess = $event"
        @submit-guess="submitGuess"
        @new-game="handleNewGame"
      />
      
      <VirtualKeyboard
        :language="gameState.language"
        :used-letters="usedLetters"
        @key-press="handleKeyPress"
        @enter="handleEnter"
        @backspace="handleBackspace"
        @clear="handleClear"
      />
    </main>

    <!-- Settings Modal -->
    <GameSettings
      v-if="showSettings"
      :language="gameState.language"
      :max-rounds="gameState.maxRounds"
      @close="showSettings = false"
      @apply-settings="handleApplySettings"
    />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.theme-toggle,
.settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.theme-toggle {
  padding: 12px;
  font-size: 18px;
  margin-right: 12px;
}

.theme-toggle:hover,
.settings-button:hover {
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  border-color: var(--border-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.theme-toggle:active,
.settings-button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16px 16px;
}
</style>
