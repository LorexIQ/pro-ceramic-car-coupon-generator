<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NInput, NTag } from 'naive-ui';
import { usePresets } from '../../composables/usePresets';
import EditorSection from '../ui/EditorSection.vue';

const { all, apply, saveCurrent, remove } = usePresets();
const newName = ref('');

function save() {
  saveCurrent(newName.value);
  newName.value = '';
}
</script>

<template>
  <editor-section class="presets-section" title="Пресеты">
    <div class="presets-section__list">
      <n-tag
        v-for="p in all"
        :key="p.name"
        :closable="!p.builtin"
        class="presets-section__item"
        @close="remove(p.name)"
        @click="apply(p)"
      >{{ p.name }}</n-tag>
    </div>
    <div class="presets-section__save-row">
      <n-input v-model:value="newName" size="small" placeholder="Имя нового пресета" @keyup.enter="save" />
      <n-button size="small" secondary :disabled="!newName.trim()" @click="save">Сохранить</n-button>
    </div>
  </editor-section>
</template>

<style scoped>
.presets-section__list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.presets-section__item {
  cursor: pointer;
}

.presets-section__save-row {
  display: flex;
  gap: 8px;
}
</style>
