<script setup lang="ts">
import { NButton } from 'naive-ui';
import { state } from '../../store';
import { lineId } from '../../constants/layout';
import { useTitleStorage } from '../../composables/useTitleStorage';
import EditorSection from '../ui/EditorSection.vue';
import TitleLineEditor from './TitleLineEditor.vue';

useTitleStorage();

function addLine() {
  state.title.lines.push({
    id: lineId(),
    text: 'Новая строка',
    weight: 300,
    width: 75,
    size: 100,
    opacity: 0.85,
    color: '#ffffff',
    underline: false,
    tracking: -40,
    spacingBefore: 100,
    align: 'center'
  });
}

function removeLine(i: number) {
  state.title.lines.splice(i, 1);
}

function moveLine(i: number, dir: -1 | 1) {
  const lines = state.title.lines;
  const [l] = lines.splice(i, 1);
  lines.splice(i + dir, 0, l);
}
</script>

<template>
  <editor-section class="title-section" title="Заголовок">
    <div class="title-section__lines">
      <title-line-editor
        v-for="(line, i) in state.title.lines"
        :key="line.id"
        :line="line"
        :index="i"
        :count="state.title.lines.length"
        @remove="removeLine(i)"
        @move="(dir) => moveLine(i, dir)"
      />
    </div>
    <n-button block dashed size="small" @click="addLine">+ Добавить строку</n-button>
  </editor-section>
</template>

<style scoped>
.title-section__lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
