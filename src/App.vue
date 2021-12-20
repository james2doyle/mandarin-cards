<template>
  <div id="app" class="flex-1 w-full flex flex-col items-stretch">
    <div v-if="!isSupported" class="text-sm">
      Your browser does not support SpeechSynthesis API, <a href="https://caniuse.com/mdn-api_speechsynthesis" target="_blank">more details</a>
    </div>
    <div v-else ref="wrapper" class="controls-wrapper flex-1 flex flex-col">
      <Card
        v-for="card in data"
        v-show="currentCard.id === card.id"
        :key="card.id"
        :card="card"
        @left="prevCard"
        @right="nextCard"
        @play="play(0.3)"
      />
    </div>
  </div>
</template>

<script>
import { useMagicKeys, useSpeechSynthesis, usePointerSwipe } from '@vueuse/core';
import { ref, computed, watch } from '@vue/composition-api';
import Card from 'Components/Card.vue';

const { left, right, space, enter } = useMagicKeys();
// const { isFetching, error, data } = useFetch('data/120-daily-used-short-sentences.json').get().json();

const data = ref(require('../public/data/120-daily-used-short-sentences.json'));

export default {
  name: 'App',
  components: {
    Card,
  },
  setup() {
    // just check for support
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

    const play = (rate = 0.6) => {
      const { speak } = useSpeechSynthesis(currentCard.value.mandarin, {
        lang: 'zh',
        rate,
      });

      speak();
    };

    const nextCard = () => {
      currentCardIndex.value = currentCardIndex.value + 1 > data.value.length ? data.value.length - 1 : currentCardIndex.value + 1;
      play();
    };

    const prevCard = () => {
      currentCardIndex.value = currentCardIndex.value - 1 < 0 ? data.value.length - 1 : currentCardIndex.value - 1;
      play();
    };

    const wrapper = ref(null);

    usePointerSwipe(wrapper, {
      onSwipeEnd(_, direction) {
        if (direction === 'LEFT') {
          nextCard();
        }

        if (direction === 'RIGHT') {
          prevCard();
        }
      }
    });

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

    watch(enter, (v) => {
      if (v) {
        nextCard();
      }
    });

    watch(space, (v) => {
      if (v) {
        play();
      }
    });

    return {
      wrapper,
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
