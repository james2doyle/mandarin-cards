<script setup lang="ts">
import { computed, ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";

// check for updates every hour
const period = 60 * 60 * 1000;

const swActivated = ref(false);

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 * @param {string} swUrl
 * @param {ServiceWorkerRegistration} r
 */
function registerPeriodicSync(swUrl, r) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (period <= 0) return;
    if (r?.active?.state === "activated") {
      swActivated.value = true;
      registerPeriodicSync(period, swUrl, r);
    } else if (r?.installing) {
      r.installing.addEventListener("statechange", (e) => {
        /** @type {ServiceWorker} */
        const sw = e.target;
        swActivated.value = sw.state === "activated";
        if (swActivated.value) registerPeriodicSync(period, swUrl, r);
      });
    }
  },
});

const title = computed(() => {
  if (offlineReady.value) return "App ready to work offline";
  if (needRefresh.value)
    return "New content available, click on reload button to update.";
  return "";
});

function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="pwa-toast" aria-labelledby="toast-message" role="alert">
    <div class="message">
      <span id="toast-message">
        {{ title }}
      </span>
    </div>
    <div class="buttons">
      <button v-if="needRefresh" type="button" class="reload" @click="updateServiceWorker()">
        Reload
      </button>
      <button type="button" @click="close">
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
.pwa-toast {
  @apply fixed right-0 top-0 z-10 m-4 py-2 px-3 text-white bg-gray-700 border border-gray-600 rounded text-left shadow-md grid;
}

.pwa-toast .message {
  @apply mb-2;
}

.pwa-toast .buttons {
  @apply flex;
}

.pwa-toast button {
  @apply border border-gray-600 outline-none mr-2 rounded py-1 px-3;
}

.pwa-toast button.reload {
  @apply block;
}
</style>
