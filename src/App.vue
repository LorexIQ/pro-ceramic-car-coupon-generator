<script setup lang="ts">
import { NConfigProvider, NMessageProvider, darkTheme, ruRU, dateRuRU } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';

const overrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#d0d0d0',
    primaryColorHover: '#ffffff',
    primaryColorPressed: '#a0a0a0',
    primaryColorSuppl: '#d0d0d0',
    bodyColor: '#0e0e0e',
    cardColor: '#161616',
    modalColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    borderRadius: '6px'
  }
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="overrides" :locale="ruRU" :date-locale="dateRuRU">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
