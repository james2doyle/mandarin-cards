<script setup lang="ts">
import type { CardType } from "../types";

interface Props {
  card: CardType;
}

defineProps<Props>();
</script>

<template>
  <div :id="String(card.id)" class="flex-1 flex flex-col justify-center items-center text-center">
    <div class="flex-1 w-4/5 sm:w-[450px] min-h-min flex flex-col justify-between md:justify-center md:gap-10 bg-white dark:bg-gray-500 py-20 px-10 rounded-md shadow-lg">
      <p class="text-gray-500 dark:text-white"><small v-text="card.id"></small></p>
      <p class="text-4xl md:text-6xl"><strong v-text="card.mandarin"></strong></p>
      <p class="text-2xl bg-yellow-100 dark:text-black p-2 rounded"><strong v-text="card.pinyin"></strong></p>
      <p class="text-xl bg-blue-50 dark:text-black p-2 rounded"><em v-text="card.english"></em></p>
    </div>
  </div>
</template>

