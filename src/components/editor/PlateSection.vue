<script setup lang="ts">
import { NInput } from 'naive-ui';

import { usePlate } from '../../composables/usePlate';
import EditorSection from '../ui/EditorSection.vue';

const { display, onInput } = usePlate();
</script>

<template>
  <editor-section title="Гос номер владельца">
    <n-input :value="display" placeholder="О 515 ТА 32" @update:value="onInput" />
  </editor-section>
</template>
