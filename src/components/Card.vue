<template>
  <div :id="card.id" class="card-wrapper m-5 p-4 flex flex-col flex-1 justify-center items-center text-center rounded shadow-md bg-white relative">
    <button type="button" class="left-panel absolute top-0 left-0 bottom-0 w-1/3" @click.prevent="$emit('left')"></button>
    <button type="button" class="right-panel absolute top-0 bottom-0 right-0 w-1/3" @click.prevent="$emit('right')"></button>
    <div class="card-content space-y-10">
      <p class="text-gray-500"><small v-text="card.id"></small></p>
      <p class="text-5xl"><strong v-text="card.mandarin"></strong></p>
      <p class="text-2xl bg-yellow-100 p-2 rounded"><strong v-text="card.pinyin"></strong></p>
      <p><em v-text="card.english"></em></p>
    </div>
    <button type="button" class="text-5xl mt-10" @click.prevent="$emit('play')">
      <span v-if="isPlaying">🔊</span>
      <span v-else>🔈</span>
    </button>
  </div>
</template>

<script>

export default {
  name: 'Card',
  props: {
    card: {
      type: Object,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
