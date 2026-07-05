<script setup lang="ts">
// Индикатор наличия ключа подписи — один и тот же в навбаре, футере, редакторе и на странице проверки
import { NTag } from 'naive-ui';
import { state } from '../../store';
</script>

<template>
  <n-tag size="small" :type="state.keyLoaded ? 'success' : 'warning'">
    {{ state.keyLoaded ? 'Ключ загружен' : 'Ключ не загружен' }}
  </n-tag>
</template>
