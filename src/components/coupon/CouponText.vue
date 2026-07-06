<script setup lang="ts">
// Единый рендер текстового узла купона из SvgTextSpec.
// Дефолты соответствуют самому частому случаю: Bahnschrift, белый, anchor start.
import { computed } from 'vue';

import type { SvgTextSpec } from '../../types';
import { letterSpacing } from '../../utils/format';

const props = defineProps<{ spec: SvgTextSpec }>();

const spacing = computed(() => letterSpacing(props.spec.tracking ?? 0, props.spec.size));
</script>

<template>
  <text
    :x="spec.x"
    :y="spec.y"
    :font-size="spec.size"
    :font-family="spec.family ?? 'Bahnschrift'"
    :font-weight="spec.weight ?? 400"
    :font-stretch="`${spec.width ?? 100}%`"
    :letter-spacing="spacing"
    :opacity="spec.opacity ?? 1"
    :fill="spec.color ?? '#ffffff'"
    :text-anchor="spec.anchor ?? 'start'"
    :text-decoration="spec.underline ? 'underline' : 'none'"
    >{{ spec.text }}</text
  >
</template>
