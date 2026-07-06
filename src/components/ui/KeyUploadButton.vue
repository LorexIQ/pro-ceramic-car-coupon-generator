<script setup lang="ts">
// Кнопка «Загрузить файл подписи» + скрытый input и обратная связь через message
import { NButton, useMessage } from 'naive-ui';
import { ref } from 'vue';

import { useSignatureKey } from '../../composables/useSignatureKey';

const { loadKeyFile } = useSignatureKey();
const message = useMessage();
const fileInput = ref<HTMLInputElement>();

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];

  input.value = '';

  if (!file) return;

  const ok = await loadKeyFile(file);

  if (ok) message.success('Файл подписи загружен');
  else message.error('Это не файл подписи ProCeramicCar');
}
</script>

<template>
  <n-button size="small" secondary @click="fileInput?.click()">Загрузить файл подписи</n-button>
  <input ref="fileInput" type="file" accept=".sig,application/json" hidden @change="onFile" />
</template>
