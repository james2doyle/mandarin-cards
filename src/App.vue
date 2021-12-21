<template>
  <div id="app" class="h-full flex flex-col justify-between">
    <VueTinder ref="tinder" key-name="id" :queue="queue" :allow-super="false" :offset-y="10" @submit="onSubmit">
      <template slot-scope="scope">
        <Card
          :key="scope.data.id"
          :card="scope.data"
        />
      </template>
      <div slot="like" class="like-pointer">⏩</div>
      <div slot="nope" class="nope-pointer">⏪</div>
    </VueTinder>
    <div class="btns flex justify-around items-center mt-10 px-10">
      <button type="button" :class="{ 'opacity-50': history.length < 1 }" class="bg-white rounded-full shadow-md p-2 w-16 h-16 text-center text-3xl" @click.prevent="decide('rewind')">⏪</button>
      <button v-if="isSupported" type="button" class="bg-white rounded-full shadow-md p-2 w-12 h-12 text-center text-2xl" @click.prevent="speak()">
        <span v-if="isPlaying">🔊</span>
        <span v-else>🔈</span>
      </button>
      <button type="button" class="bg-white rounded-full shadow-md p-4 w-16 h-16 text-center text-3xl" @click.prevent="decide('like')">⏩</button>
    </div>
  </div>
</template>

<script>
import { useMagicKeys, useSpeechSynthesis } from '@vueuse/core';
import { ref, computed, watch } from '@vue/composition-api';
import VueTinder from 'vue-tinder';
import Card from 'Components/Card.vue';

const { left, right, space, enter } = useMagicKeys();
// const { isFetching, error, data } = useFetch('data/120-daily-used-short-sentences.json').get().json();

const source = require('../public/data/120-daily-used-short-sentences.json');

export default {
  name: 'App',
  components: {
    VueTinder,
    Card,
  },
  setup() {
    const tinder = ref(null);
    const history = ref([]);
    const offset = ref(0);
    const queue = ref(source);

    const speechText = computed(() => {
      return queue.value[0].mandarin;
    });

    const { isPlaying, isSupported, speak } = useSpeechSynthesis(speechText, {
      lang: 'zh',
      rate: 0.5,
    });

    const onSubmit = ({ item, type }) => {
      if (type === 'like') {
        history.value.push(item);
      }

      if (type === 'rewind') {
        tinder.value.rewind([history.value.pop()]);
      }

      speak();
    };

    const decide = async (choice) => {
      if (choice === 'rewind') {
        if (history.value.length) {
          tinder.value.rewind([history.value.pop()]);
        }

        return;
      }

      if (choice === 'play') {
        speak();

        return;
      }

      tinder.value.decide(choice);
    };

    watch(left, (v) => {
      if (v) {
        tinder.value.decide('rewind');
      }
    });

    watch([space, enter], (v) => {
      if (v) {
        speak();
      }
    });

    watch(right, (v) => {
      if (v) {
        tinder.value.decide('like');
      }
    });

    return {
      tinder,
      onSubmit,
      decide,
      history,
      queue,
      offset,
      isPlaying,
      isSupported,
      speak,
    };
  },
};
</script>

<style>
@import './styles/style.css';
</style>
