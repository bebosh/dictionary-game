<template>
  <div class="virtual-keyboard">
    <div 
      v-for="(row, rowIndex) in keyboardLayout" 
      :key="rowIndex"
      class="keyboard-row"
    >
      <button
        v-for="key in row"
        :key="key"
        class="keyboard-key"
        :class="{ used: isKeyUsed(key) }"
        @click="$emit('key-press', key)"
      >
        {{ key.toUpperCase() }}
      </button>
    </div>
    
    <!-- Special keys row -->
    <div class="keyboard-row">
      <button
        class="keyboard-key special-key"
        @click="$emit('enter')"
      >
        ENTER
      </button>
      
      <button
        class="keyboard-key special-key"
        @click="$emit('backspace')"
      >
        ⌫
      </button>
      
      <button
        class="keyboard-key special-key"
        @click="$emit('clear')"
      >
        CLEAR
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Language } from '../types/game'
import { KEYBOARD_LAYOUTS } from '../types/game'

interface Props {
  language: Language
  usedLetters: string[]
}

const props = defineProps<Props>()

defineEmits<{
  'key-press': [key: string]
  'enter': []
  'backspace': []
  'clear': []
}>()

const keyboardLayout = computed(() => {
  return KEYBOARD_LAYOUTS[props.language]
})

function isKeyUsed(key: string): boolean {
  return props.usedLetters.includes(key.toLowerCase())
}
</script>

<style scoped>
.virtual-keyboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  padding: 16px;
  background-color: var(--bg-keyboard);
  border-radius: 12px;
  border: 1px solid var(--border-secondary);
  box-shadow: var(--shadow-sm);
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.keyboard-key {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  padding: 12px;
  background: linear-gradient(145deg, var(--bg-surface), var(--bg-surface-alt));
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  border-bottom-width: 3px;
  border-bottom-color: var(--border-secondary);
}

.keyboard-key:hover {
  background: linear-gradient(145deg, var(--bg-surface-alt), var(--border-secondary));
  border-color: var(--accent-primary);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  border-bottom-width: 4px;
}

.keyboard-key:active {
  background: linear-gradient(145deg, var(--border-secondary), var(--border-primary));
  transform: translateY(1px);
  box-shadow: 
    0 2px 3px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
}

.keyboard-key.used {
  background: linear-gradient(145deg, var(--text-secondary), var(--text-primary));
  color: var(--bg-surface);
  border-color: var(--text-secondary);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1);
  border-bottom-width: 2px;
}

.keyboard-key.used:hover {
  background: linear-gradient(145deg, var(--text-primary), #1f2937);
  border-color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.25),
    0 4px 6px rgba(0, 0, 0, 0.15);
  border-bottom-width: 3px;
}

.special-key {
  padding: 12px 24px;
  min-width: 80px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(145deg, var(--accent-primary), var(--accent-secondary));
  color: #000000 !important;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

body.dark-theme .special-key {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.special-key:hover {
  background: linear-gradient(145deg, var(--accent-secondary), #1d4ed8);
  border-color: #1d4ed8;
  color: #000000 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

body.dark-theme .special-key:hover {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.special-key:active {
  background: linear-gradient(145deg, #1d4ed8, #1e40af);
  color: #000000 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
}

body.dark-theme .special-key:active {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .keyboard-key {
    min-width: 32px;
    height: 40px;
    padding: 8px;
    font-size: 12px;
  }
  
  .special-key {
    min-width: 64px;
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .keyboard-row {
    gap: 4px;
  }
  
  .virtual-keyboard {
    gap: 8px;
    padding: 12px;
  }
}

/* Hover glow effect */
.keyboard-key::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.keyboard-key:hover::before {
  opacity: 1;
}
</style>
