<script setup lang="ts">
import { NButton } from 'naive-ui';
import { state } from '../../store';
import KeyStatusTag from '../ui/KeyStatusTag.vue';

defineProps<{ busy: boolean }>();
const emit = defineEmits<{ print: []; export: [] }>();
</script>

<template>
  <div class="coupon-actions">
    <key-status-tag />
    <div class="coupon-actions__buttons">
      <n-button size="small" secondary :loading="busy" :disabled="!state.keyLoaded" @click="emit('print')">Печать</n-button>
      <n-button size="small" type="primary" :loading="busy" :disabled="!state.keyLoaded" @click="emit('export')">Скачать PNG</n-button>
    </div>
  </div>
</template>

<style scoped>
.coupon-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.coupon-actions__buttons {
  display: flex;
  gap: 8px;
}

@media (max-width: 900px) {
  .coupon-actions {
    flex-direction: column;
  }
}
</style>
