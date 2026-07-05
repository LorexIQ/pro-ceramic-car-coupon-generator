<script setup lang="ts">
import { NButton } from 'naive-ui';
import { state } from '../../store';
import { useSignatureKey } from '../../composables/useSignatureKey';
import EditorSection from '../ui/EditorSection.vue';
import KeyStatusTag from '../ui/KeyStatusTag.vue';
import KeyUploadButton from '../ui/KeyUploadButton.vue';

const { createAndDownloadKey, forgetKey } = useSignatureKey();
</script>

<template>
  <editor-section class="signature-section" title="Подпись купона">
    <template v-if="state.keyLoaded">
      <div class="signature-section__row">
        <key-status-tag />
        <n-button size="small" quaternary @click="forgetKey">Забыть ключ</n-button>
      </div>
      <p class="signature-section__hint">Код купона генерируется в момент сохранения PNG или печати — у каждого купона он уникальный.</p>
    </template>
    <template v-else>
      <div class="signature-section__status">
        <key-status-tag />
      </div>
      <div class="signature-section__row">
        <key-upload-button />
        <n-button size="small" quaternary @click="createAndDownloadKey">Создать файл подписи</n-button>
      </div>
    </template>
  </editor-section>
</template>

<style scoped>
.signature-section__row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.signature-section__status {
  margin-bottom: 8px;
}

.signature-section__hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-dim);
}
</style>
