<script setup lang="ts">
import { NButton, NInput, NAlert } from 'naive-ui';
import AppNavbar from '../components/layout/AppNavbar.vue';
import KeyStatusTag from '../components/ui/KeyStatusTag.vue';
import KeyUploadButton from '../components/ui/KeyUploadButton.vue';
import { useCouponCodeInput } from '../composables/useCouponCodeInput.ts';

const { display, valid, result, issuedStr, onInput, confirm } = useCouponCodeInput();
</script>

<template>
  <div class="verify-page">
    <app-navbar />
    <main class="verify-page__container">
      <h2 class="verify-page__heading">Проверка купона</h2>

      <div class="verify-page__key-row">
        <key-status-tag />
        <key-upload-button />
      </div>

      <n-input
        class="verify-page__code"
        :value="display"
        placeholder="PCC-XXXXX-XXXXX-XXXXX"
        @update:value="onInput"
        @keyup.enter="valid && confirm()"
      />
      <n-button type="primary" block :disabled="!valid" @click="confirm">Проверить</n-button>

      <n-alert v-if="result" class="verify-page__result" :type="result.valid ? 'success' : 'error'">
        <template v-if="result.valid">Купон подлинный, выдан {{ issuedStr }}</template>
        <template v-else>Подпись не сходится — возможна подделка</template>
      </n-alert>
    </main>
  </div>
</template>

<style scoped>
.verify-page__container {
  max-width: 480px;
  margin: 40px auto;
  padding: 0 16px;
}

.verify-page__heading {
  margin-top: 0;
}

.verify-page__key-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.verify-page__code {
  margin: 12px 0;
}

.verify-page__result {
  margin-top: 16px;
}
</style>
