<script setup lang="ts">
import { NButton, NDropdown } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Единый источник пунктов навигации: кнопки на десктопе, n-dropdown в burger-меню
const NAV_ITEMS = [
  { label: 'Генератор', key: '/' },
  { label: 'Проверка купона', key: '/verify' },
];

function onMenuSelect(key: string | number) {
  router.push(String(key));
}
</script>

<template>
  <header class="app-navbar">
    <div class="app-navbar__nav">
      <span class="app-navbar__brand">ProCeramicCar</span>
      <nav class="app-navbar__links">
        <n-button
          v-for="item in NAV_ITEMS"
          :key="item.key"
          quaternary
          size="small"
          :type="route.path === item.key ? 'primary' : 'default'"
          @click="router.push(item.key)"
          >{{ item.label }}</n-button
        >
      </nav>
    </div>
    <div class="app-navbar__actions"><slot name="actions" /></div>
    <n-dropdown trigger="click" :options="NAV_ITEMS" @select="onMenuSelect">
      <n-button quaternary size="small" class="app-navbar__burger" aria-label="Меню">☰</n-button>
    </n-dropdown>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 10;

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  padding: 10px 16px;

  background: var(--panel);
  border-bottom: 1px solid var(--border);
}

.app-navbar__nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.app-navbar__brand {
  margin-right: 8px;

  font-weight: 600;
}

.app-navbar__links {
  display: flex;
  gap: 8px;
}

.app-navbar__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.app-navbar__burger {
  display: none;

  font-size: 18px;
}

@media (max-width: 900px) {
  .app-navbar__links,
  .app-navbar__actions {
    display: none;
  }

  .app-navbar__burger {
    display: inline-flex;
  }
}
</style>
