<template>
  <div id="app" class="min-h-screen p-5 flex flex-col justify-center items-center bg-gray-200 text-gray-900">
    <div v-if="isFetching || !currentCard" class="loading-wrapper w-full text-center">
      <p><strong>Loading...</strong></p>
    </div>
    <div v-if="!isSupported" class="text-sm">
      Your browser does not support SpeechSynthesis API,
      <a
        href="https://caniuse.com/mdn-api_speechsynthesis"
        target="_blank"
      >more details</a>
    </div>
    <div v-else class="controls-wrapper min-h-full w-full flex flex-col flex-1 justify-between">
      <Card
        v-for="card in data"
        v-show="currentCard.id === card.id"
        :key="card.id"
        :card="card"
        @left="prevCard"
        @right="nextCard"
        @play="play"
      />
    </div>
  </div>
</template>

<script>
import { useFetch, useMagicKeys, useSpeechSynthesis } from '@vueuse/core';
import { ref, computed, watch } from '@vue/composition-api';
import Card from 'Components/Card.vue';

const { left, right } = useMagicKeys();
const { isFetching, error, data } = useFetch('data/120-daily-used-short-sentences.json').get().json();

export default {
  name: 'App',
  components: {
    Card,
  },
  setup() {
    const {
      isSupported
    } = useSpeechSynthesis('', {
      lang: 'zh',
      rate: 0.6,
    });

    const currentCardIndex = ref(0);

    const currentCard = computed(() => {
      return data.value ? data.value[currentCardIndex.value] : null;
    });

    const play = () => {
      const { speak } = useSpeechSynthesis(currentCard.value.mandarin, {
        lang: 'zh',
        rate: 0.6,
      });

      speak();
    };

    const nextCard = () => {
      currentCardIndex.value = currentCardIndex.value + 1 > data.value.length ? data.value.length - 1 : currentCardIndex.value + 1;
      play();
    };

    const prevCard = () => {
      currentCardIndex.value = currentCardIndex.value - 1 > 0 ? currentCardIndex.value - 1 : 0;
      play();
    };

    watch(left, (v) => {
      if (v) {
        prevCard();
      }
    });

    watch(right, (v) => {
      if (v) {
        nextCard();
      }
    });

    return {
      isFetching,
      error,
      data,
      isSupported,
      play,
      currentCardIndex,
      currentCard,
      nextCard,
      prevCard,
    };
  },
};
</script>

<style>
  @import './styles/style.css';
</style>
