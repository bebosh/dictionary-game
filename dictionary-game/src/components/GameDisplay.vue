<template>
  <div class="game-display">
    <!-- Game Header -->
    <div class="game-header">
      <div class="title-container">
        <h1 class="game-title">Dictionary Game</h1>
        <div class="info-tooltip-container">
          <button 
            class="info-button"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
            @click="showTooltip = !showTooltip"
            aria-label="Game information"
          >
            ℹ️
          </button>
          <div v-if="showTooltip" class="tooltip">
            <h4>How to Play:</h4>
            <p>🎯 Find the hidden word by narrowing down the alphabetical range</p>
            <p>📝 Each guess narrows the search range</p>
            <p>⌨️ Use keyboard or virtual keys</p>
          </div>
        </div>
      </div>
      <div class="game-info">
        <span class="language-indicator">
          {{ gameState.language.toUpperCase() }}
        </span>
        <span class="rounds-indicator">
          Round {{ gameState.currentRound }} / {{ gameState.maxRounds }}
        </span>
      </div>
    </div>

    <!-- Current Range Display -->
    <div class="range-display">
      <div class="range-item">
        <span class="range-label">Start:</span>
        <span class="range-value">{{ gameState.gameRange.start.toUpperCase() }}</span>
      </div>
      <div class="range-separator">↔</div>
      <div class="range-item">
        <span class="range-label">End:</span>
        <span class="range-value">{{ gameState.gameRange.end.toUpperCase() }}</span>
      </div>
    </div>

    <!-- Current Guess Input -->
    <div class="guess-input-container">
      <div class="guess-input">
        <input
          :value="currentGuess"
          type="text"
          placeholder="Type your guess..."
          class="guess-field"
          :disabled="isGameOver"
          @keyup.enter="$emit('submit-guess')"
          @input="handleInput"
        />
        <button
          class="submit-button"
          :disabled="!currentGuess.trim() || isGameOver"
          @click="$emit('submit-guess')"
        >
          Submit
        </button>
      </div>
    </div>

    <!-- Game Status -->
    <div v-if="isGameOver" class="game-status">
      <div v-if="gameState.gameStatus === 'won'" class="status-won">
        <h2 class="status-title">🎉 Congratulations!</h2>
        <p class="status-message">
          You found the word <strong>{{ gameState.targetWord.toUpperCase() }}</strong> 
          in {{ gameState.userGuesses.length }} 
          {{ gameState.userGuesses.length === 1 ? 'guess' : 'guesses' }}!
        </p>
      </div>
      
      <div v-else-if="gameState.gameStatus === 'lost'" class="status-lost">
        <h2 class="status-title">😔 Game Over</h2>
        <p class="status-message">
          The word was <strong>{{ gameState.targetWord.toUpperCase() }}</strong>. 
          Better luck next time!
        </p>
      </div>

      <button class="new-game-button" @click="$emit('new-game')">
        Start New Game
      </button>
    </div>

    <!-- Previous Guesses -->
    <div v-if="gameState.userGuesses.length > 0" class="previous-guesses">
      <h3 class="guesses-title">Previous Guesses:</h3>
      <div class="guesses-list">
        <div
          v-for="(guess, index) in gameState.userGuesses"
          :key="index"
          class="guess-item"
        >
          <span class="guess-number">{{ index + 1 }}.</span>
          <span class="guess-word">{{ guess.toUpperCase() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GameState } from '../types/game'

interface Props {
  gameState: GameState
  currentGuess: string
  isGameOver: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:current-guess': [value: string]
  'submit-guess': []
  'new-game': []
}>()

const showTooltip = ref(false)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  // Only allow letters and basic punctuation
  const cleanValue = target.value.replace(/[^a-zA-Z]/g, '').toLowerCase()
  emit('update:current-guess', cleanValue)
}
</script>

<style scoped>
.game-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  padding: 16px;
}

.game-header {
  text-align: center;
  margin-bottom: 32px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.game-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.info-tooltip-container {
  position: relative;
}

.info-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-button:hover {
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.tooltip {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tooltip-bg, #ffffff);
  border: 2px solid var(--tooltip-border, #d1d5db);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--tooltip-shadow, 0 8px 16px rgba(0, 0, 0, 0.15));
  z-index: 1000;
  min-width: 280px;
  animation: fadeIn 0.2s ease;
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--tooltip-bg, #ffffff);
}

.tooltip h4 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--tooltip-heading, #374151);
}

.tooltip p {
  margin: 8px 0;
  font-size: 16px;
  color: var(--tooltip-text, #6b7280);
  line-height: 1.5;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.game-info {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
}

.language-indicator,
.rounds-indicator {
  padding: 8px 16px;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.range-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25));
  border-radius: 16px;
  border: 1px solid var(--accent-primary);
  box-shadow: var(--shadow-md);
}

.range-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.range-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 4px;
}

.range-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-secondary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.range-separator {
  font-size: 2rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.guess-input-container {
  width: 100%;
  margin-bottom: 32px;
}

.guess-input {
  display: flex;
  gap: 12px;
}

.guess-field {
  flex: 1;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.guess-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.guess-field:disabled {
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  color: var(--text-muted);
  cursor: not-allowed;
}

.guess-field::placeholder {
  color: var(--text-muted);
  font-weight: 500;
}

.submit-button {
  padding: 16px 24px;
  background: linear-gradient(145deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
  min-width: 100px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(145deg, var(--accent-secondary), #1d4ed8);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.submit-button:disabled {
  background: linear-gradient(145deg, var(--border-secondary), var(--border-primary));
  color: var(--text-muted);
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm);
}

.previous-guesses {
  width: 100%;
  margin-bottom: 32px;
}

.guesses-title {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 16px;
  text-align: center;
}

.guesses-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.guess-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  border-radius: 8px;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.guess-number {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.guess-word {
  font-weight: 700;
  color: #374151;
}

.game-status {
  text-align: center;
  padding: 32px;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 16px;
  border: 1px solid #d1d5db;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.status-won {
  color: #059669;
}

.status-lost {
  color: #dc2626;
}

.status-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.status-message {
  color: #374151;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.6;
}

.new-game-button {
  padding: 16px 32px;
  background: linear-gradient(145deg, #059669, #047857);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.new-game-button:hover {
  background: linear-gradient(145deg, #047857, #065f46);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.new-game-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .game-title {
    font-size: 2rem;
  }
  
  .range-value {
    font-size: 1.5rem;
  }
  
  .guess-field {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .submit-button {
    padding: 12px 20px;
    min-width: 80px;
  }
  
  .range-display {
    padding: 16px;
    gap: 16px;
  }
  
  .game-status {
    padding: 24px 16px;
  }
}
</style>
