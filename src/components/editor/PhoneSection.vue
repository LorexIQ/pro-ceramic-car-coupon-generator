<script setup lang="ts">
import { NInput, NFormItem } from 'naive-ui';
import { usePhone } from '../../composables/usePhone';
import EditorSection from '../ui/EditorSection.vue';

const { display, onInput, error } = usePhone();
</script>

<template>
  <editor-section title="Телефон">
    <n-form-item
      :show-label="false"
      :show-feedback="!!error"
      :validation-status="error ? 'error' : undefined"
      :feedback="error ?? undefined"
    >
      <n-input :value="display" placeholder="+7 (___) ___-__-__" @update:value="onInput" />
    </n-form-item>
  </editor-section>
</template>
