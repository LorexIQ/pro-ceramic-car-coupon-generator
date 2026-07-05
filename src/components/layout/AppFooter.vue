<script setup lang="ts">
const LINKS = {
  telegram: 'https://t.me/LorexIQ',
  github: 'https://github.com/LorexIQ'
} as const;
</script>

<template>
  <footer class="app-footer">
    <div v-if="$slots.default" class="app-footer__actions">
      <slot />
    </div>
    <div class="app-footer__credits">
      <span>By LorexIQ with ❤️</span>
      <a class="app-footer__link" :href="LINKS.telegram" target="_blank" rel="noopener" aria-label="Telegram">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.04 15.51l-.38 5.37c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.65.25 1.91-.9L22.9 3.8c.31-1.4-.51-1.95-1.45-1.6L2.2 9.62c-1.36.53-1.34 1.29-.23 1.63l4.92 1.54L18.3 5.6c.54-.35 1.03-.16.63.19L9.04 15.51z" />
        </svg>
      </a>
      <a class="app-footer__link" :href="LINKS.github" target="_blank" rel="noopener" aria-label="GitHub">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </a>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: var(--panel);
  border-top: 1px solid var(--border);
}

.app-footer__actions {
  display: none;
}

.app-footer__credits {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  font-size: 12px;
  color: var(--text-dim);
}

.app-footer__link {
  display: inline-flex;
  color: var(--text-dim);
  transition: color 0.15s;
}

.app-footer__link:hover {
  color: var(--text);
}

@media (max-width: 900px) {
  .app-footer {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .app-footer__actions {
    display: flex;
    justify-content: center;
  }

  .app-footer__credits {
    margin-left: 0;
  }
}
</style>
