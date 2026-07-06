<script setup lang="ts">
// Секция панели редактора: единый заголовок + произвольное содержимое
defineProps<{ title: string }>();
</script>

<template>
  <section class="editor-section">
    <h3 class="editor-section__title">{{ title }}</h3>
    <slot />
  </section>
</template>

<style scoped>
.editor-section__title {
  margin: 0 0 8px;

  font-size: 14px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
