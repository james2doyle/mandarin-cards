<template>
  <div :id="card.id" class="card-wrapper min-h-full px-4 py-20 flex flex-col flex-1 justify-center items-center text-center">
    <div class="card-content flex-1 flex flex-col justify-around">
      <p class="text-gray-500"><small v-text="card.id"></small></p>
      <p class="text-5xl"><strong v-text="card.mandarin"></strong></p>
      <p class="text-2xl bg-yellow-100 p-2 rounded"><strong v-text="card.pinyin"></strong></p>
      <p><em v-text="card.english"></em></p>
    </div>
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
  },
};
</script>
