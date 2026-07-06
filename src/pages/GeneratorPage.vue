<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { nextTick, ref } from 'vue';

import CouponActions from '../components/coupon/CouponActions.vue';
import CouponSvg from '../components/coupon/CouponSvg.vue';
import PhoneSection from '../components/editor/PhoneSection.vue';
import PlateSection from '../components/editor/PlateSection.vue';
import PresetsSection from '../components/editor/PresetsSection.vue';
import SignatureSection from '../components/editor/SignatureSection.vue';
import TitleSection from '../components/editor/TitleSection.vue';
import AppFooter from '../components/layout/AppFooter.vue';
import AppNavbar from '../components/layout/AppNavbar.vue';
import { useSignatureKey } from '../composables/useSignatureKey';
import { state } from '../store';
import { exportPng, printCoupon } from '../utils/export';

const busy = ref(false);
const message = useMessage();
const { regenerateCode } = useSignatureKey();

async function run(fn: () => Promise<void>) {
  if (!state.keyLoaded) {
    message.error('Сначала загрузите файл подписи — купон выдаётся только с кодом');

    return;
  }

  busy.value = true;

  try {
    await regenerateCode(); // уникальный код на момент выдачи купона
    await nextTick(); // SVG успел отрисовать код перед экспортом
    await fn();
  } catch {
    message.error('Не удалось подготовить купон — попробуйте ещё раз');
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="generator-page">
    <app-navbar>
      <template #actions>
        <coupon-actions :busy="busy" @print="run(printCoupon)" @export="run(exportPng)" />
      </template>
    </app-navbar>
    <div class="generator-page__content">
      <aside class="generator-page__editor">
        <presets-section />
        <title-section />
        <phone-section />
        <plate-section />
        <signature-section />
      </aside>
      <div class="generator-page__main">
        <main class="generator-page__preview">
          <coupon-svg class="generator-page__coupon" />
        </main>
        <app-footer>
          <coupon-actions :busy="busy" @print="run(printCoupon)" @export="run(exportPng)" />
        </app-footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generator-page {
  display: flex;
  flex-direction: column;

  height: 100dvh;
}

.generator-page__content {
  display: flex;
  flex: 1;

  min-height: 0;
}

.generator-page__editor {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;

  width: 360px;
  padding: 16px;

  overflow-y: auto;

  background: var(--panel);
  border-right: 1px solid var(--border);
}

.generator-page__main {
  display: flex;

  flex: 1;
  flex-direction: column;

  min-width: 0;
  min-height: 0;
}

.generator-page__preview {
  display: flex;

  flex: 1;

  align-items: center;
  justify-content: center;

  min-height: 0;

  padding: 24px;

  overflow: auto;
}

.generator-page__coupon {
  width: auto;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
}

@media (max-width: 900px) {
  .generator-page__content {
    flex-direction: column;

    overflow-y: auto;
  }

  .generator-page__editor {
    width: 100%;

    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .generator-page__main {
    flex: none;
  }

  .generator-page__preview {
    flex: none;

    height: auto;

    padding: 12px;

    overflow: visible;
  }

  .generator-page__coupon {
    width: 100%;
    height: auto;
    max-height: none;
  }
}
</style>
