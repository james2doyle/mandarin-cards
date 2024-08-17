<script setup lang="ts">
import type { CardType } from "./types";
import {
  useMagicKeys,
  useSpeechSynthesis,
  useStepper,
  useSwipe,
} from "@vueuse/core";
import { computed, watch, ref } from "vue";

import PWABadge from "./components/PWABadge.vue";
import Card from "./components/Card.vue";

import data from "./data/120-daily-used-short-sentences.json";

function shuffleArray(array: Array<unknown>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const sentences = shuffleArray(data) as CardType[];

const container = ref(null);
const { direction } = useSwipe(container);

const { left, right, space, enter } = useMagicKeys();

const { current, isFirst, isLast, goToNext, goToPrevious } =
  useStepper<CardType>(sentences);

const speechText = computed(() => {
  return current.value.mandarin;
});

const { isPlaying, isSupported, speak } = useSpeechSynthesis(speechText, {
  lang: "zh",
  rate: 0.5,
});

watch(direction, (swipeDirection) => {
  if (swipeDirection === "right") {
    goToPrevious();
  }

  if (swipeDirection === "left") {
    goToNext();
  }
});

watch(left, (v) => {
  if (v) {
    goToPrevious();
  }
});

watch([space, enter], (v) => {
  if (v) {
    goToNext();
  }
});

watch(right, (v) => {
  if (v) {
    goToNext();
  }
});
</script>

<template>
  <div id="app" ref="container" class="h-full min-h-dvh py-10 flex flex-col">
      <Card
        :key="String(current.id)"
        :card="current"
      />
    <div class="flex justify-around items-center mt-10 px-10">
      <button type="button" :disabled="isFirst" class="disabled:opacity-50 bg-white rounded-full shadow-md flex items-center justify-center size-12 lg:size-16 lg:text-3xl text-center text-xl" @click.prevent="goToPrevious">⏪</button>
      <button v-if="isSupported" type="button" class="bg-white rounded-full shadow-md flex items-center justify-center size-12 lg:size-16 lg:text-3xl text-center text-xl" @click.prevent="speak()">
        <span v-if="isPlaying">🔊</span>
        <span v-else>🔈</span>
      </button>
      <button type="button" :disabled="isLast" class="disabled:opacity-50 bg-white rounded-full shadow-md flex items-center justify-center size-12 lg:size-16 lg:text-3xl text-center text-xl" @click.prevent="goToNext">⏩</button>
    </div>
  </div>
  <PWABadge />
</template>
