<template>
  <div class="game-settings">
    <div class="settings-header">
      <h2 class="settings-title">Game Settings</h2>
      <button 
        class="close-button"
        @click="$emit('close')"
        aria-label="Close settings"
      >
        ✕
      </button>
    </div>

    <div class="settings-content">
      <!-- Language Selection -->
      <div class="setting-group">
        <label class="setting-label">Language</label>
        <div class="language-options">
          <button
            class="language-button"
            :class="{ active: modelLanguage === 'english' }"
            @click="updateLanguage('english')"
          >
            English
          </button>
          <button
            class="language-button"
            :class="{ active: modelLanguage === 'italian' }"
            @click="updateLanguage('italian')"
          >
            Italian
          </button>
        </div>
      </div>

      <!-- Max Rounds Setting -->
      <div class="setting-group">
        <label class="setting-label" for="max-rounds">
          Maximum Rounds: {{ modelMaxRounds }}
        </label>
        <input
          id="max-rounds"
          v-model.number="modelMaxRounds"
          type="range"
          min="5"
          max="50"
          step="5"
          class="rounds-slider"
          @input="updateMaxRounds"
        />
        <div class="rounds-labels">
          <span>5</span>
          <span>25</span>
          <span>50</span>
        </div>
      </div>

      <!-- Game Rules -->
      <div class="setting-group">
        <h3 class="rules-title">How to Play</h3>
        <div class="rules-content">
          <p class="rule-item">
            🎯 <strong>Goal:</strong> Find the hidden word within the given number of rounds.
          </p>
          <p class="rule-item">
            📏 <strong>Range:</strong> The game starts with A ↔ Z (or Zona for Italian).
          </p>
          <p class="rule-item">
            🔍 <strong>Guess:</strong> Type a word and the range will narrow based on alphabetical order.
          </p>
          <p class="rule-item">
            ✅ <strong>Example:</strong> If the target is "BANANA" and you guess "CAR", 
            the new range becomes A ↔ CAR.
          </p>
          <p class="rule-item">
            🎮 <strong>Controls:</strong> Use the virtual keyboard or type directly.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="settings-actions">
        <button 
          class="action-button secondary"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button 
          class="action-button primary"
          @click="applySettings"
        >
          Apply Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Language } from '../types/game'

interface Props {
  language: Language
  maxRounds: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:language': [language: Language]
  'update:max-rounds': [rounds: number]
  'close': []
  'apply-settings': [settings: { language: Language; maxRounds: number }]
}>()

// Local state for form
const modelLanguage = ref<Language>(props.language)
const modelMaxRounds = ref(props.maxRounds)

// Watch for prop changes
watch(() => props.language, (newLanguage) => {
  modelLanguage.value = newLanguage
})

watch(() => props.maxRounds, (newMaxRounds) => {
  modelMaxRounds.value = newMaxRounds
})

function updateLanguage(language: Language) {
  modelLanguage.value = language
}

function updateMaxRounds(event: Event) {
  const target = event.target as HTMLInputElement
  modelMaxRounds.value = parseInt(target.value)
}

function applySettings() {
  emit('apply-settings', {
    language: modelLanguage.value,
    maxRounds: modelMaxRounds.value
  })
  emit('close')
}
</script>

<style scoped>
.game-settings {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.settings-content {
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-secondary);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.settings-title {
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-primary), #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.close-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  border: 1px solid var(--border-primary);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
  font-weight: 600;
}

.close-button:hover {
  background: linear-gradient(145deg, var(--border-secondary), var(--border-primary));
  color: var(--text-primary);
  transform: scale(1.05);
}

.setting-group {
  margin-bottom: 32px;
}

.setting-label {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.language-options {
  display: flex;
  gap: 12px;
}

.language-button {
  flex: 1;
  padding: 16px 24px;
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
  cursor: pointer;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
}

.language-button:not(.active) {
  color: var(--text-secondary);
}

.language-button:not(.active):hover {
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  border-color: var(--text-muted);
  transform: translateY(-1px);
}

.language-button.active {
  background: linear-gradient(145deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border-color: var(--accent-secondary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.rounds-slider {
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, var(--border-secondary), var(--border-primary));
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  outline: none;
  margin: 16px 0;
}

.rounds-slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(145deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
}

.rounds-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}

.rounds-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  margin-top: 8px;
}

.rules-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 16px;
}

.rules-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  padding: 12px 16px;
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.settings-actions {
  display: flex;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

.action-button {
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 16px;
}

.action-button.secondary {
  background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-button.secondary:hover {
  background: linear-gradient(145deg, #e5e7eb, #d1d5db);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button.primary {
  background: linear-gradient(145deg, #3b82f6, #2563eb);
  color: white;
  border: 1px solid #2563eb;
}

.action-button.primary:hover {
  background: linear-gradient(145deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.action-button:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .settings-content {
    padding: 24px 20px;
    margin: 8px;
  }
  
  .settings-title {
    font-size: 1.5rem;
  }
  
  .language-button {
    padding: 12px 16px;
  }
  
  .action-button {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .setting-group {
    margin-bottom: 24px;
  }
}
</style>
