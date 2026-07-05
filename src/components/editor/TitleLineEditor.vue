<script setup lang="ts">
import { NInput, NSelect, NSlider, NColorPicker, NSwitch, NButton, NButtonGroup } from 'naive-ui';
import type { TitleLine } from '../../types';

// line — reactive-объект из store: редактируется на месте, компонент лишь отображает его
const props = defineProps<{ line: TitleLine; index: number; count: number }>();
const emit = defineEmits<{ remove: []; move: [dir: -1 | 1] }>();

const weightOptions = [
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'SemiBold', value: 600 },
  { label: 'Bold', value: 700 }
];
const widthOptions = [
  { label: 'Condensed', value: 75 },
  { label: 'SemiCondensed', value: 87.5 },
  { label: 'Normal', value: 100 }
];
const alignOptions = [
  { label: '⇤', value: 'left' },
  { label: '↔', value: 'center' },
  { label: '⇥', value: 'right' }
] as const;
</script>

<template>
  <div class="line-editor">
    <div class="line-editor__row">
      <n-input v-model:value="props.line.text" placeholder="Текст строки" size="small" />
      <n-button-group size="small">
        <n-button :disabled="index === 0" @click="emit('move', -1)">↑</n-button>
        <n-button :disabled="index === count - 1" @click="emit('move', 1)">↓</n-button>
        <n-button :disabled="count === 1" @click="emit('remove')">✕</n-button>
      </n-button-group>
    </div>
    <div class="line-editor__row">
      <n-select v-model:value="props.line.weight" :options="weightOptions" size="small" />
      <n-select v-model:value="props.line.width" :options="widthOptions" size="small" />
    </div>
    <label class="line-editor__label">Размер: {{ Math.round(props.line.size) }}px</label>
    <n-slider v-model:value="props.line.size" :min="40" :max="400" :step="1" />
    <label class="line-editor__label">Прозрачность: {{ Math.round(props.line.opacity * 100) }}%</label>
    <n-slider v-model:value="props.line.opacity" :min="0" :max="1" :step="0.01" />
    <label class="line-editor__label">Межбуквенный интервал: {{ props.line.tracking }}</label>
    <n-slider v-model:value="props.line.tracking" :min="-200" :max="700" :step="5" />
    <label class="line-editor__label">Отступ сверху: {{ Math.round(props.line.spacingBefore) }}px</label>
    <n-slider v-model:value="props.line.spacingBefore" :min="-100" :max="400" :step="1" />
    <div class="line-editor__row">
      <n-color-picker v-model:value="props.line.color" :show-alpha="false" size="small" />
      <div class="line-editor__align">
        <n-button-group size="small">
          <n-button
            v-for="a in alignOptions"
            :key="a.value"
            :type="props.line.align === a.value ? 'primary' : 'default'"
            @click="props.line.align = a.value"
          >{{ a.label }}</n-button>
        </n-button-group>
      </div>
      <label class="line-editor__label line-editor__underline">Подчёркивание <n-switch v-model:value="props.line.underline" size="small" /></label>
    </div>
  </div>
</template>

<style scoped>
.line-editor {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
}

.line-editor__row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 8px;
}

.line-editor__label {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-dim);
}

.line-editor__underline {
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 0;
}

.line-editor__align {
  flex-shrink: 0;
}
</style>
