<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRecordsStore } from '../stores/records'

const store = useRecordsStore()
const show = ref(false)
const text = ref('')

const realm = computed(() => store.realm.name)
const seen = computed(() => store.realmSeen ?? '炼气')

watch(
  () => realm.value,
  (now) => {
    const rank = store.realmRank
    if ((rank as any)[now] > (rank as any)[seen.value]) {
      text.value = `破境·${now}`
      show.value = true
      store.markRealmSeen(now as any)
      window.setTimeout(() => (show.value = false), 2200)
    }
  },
  { immediate: true },
)
</script>

<template>
  <transition name="ritual">
    <div v-if="show" class="mask" aria-live="polite">
      <div class="ink" />
      <div class="word">{{ text }}</div>
      <div class="sub">道成于恒</div>
    </div>
  </transition>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-content: center;
  pointer-events: none;
}
.ink {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(600px 420px at 50% 45%, rgba(0, 0, 0, 0.35), transparent 62%),
    radial-gradient(900px 600px at 50% 55%, rgba(0, 0, 0, 0.22), transparent 70%);
  opacity: 0.75;
}
.word {
  position: relative;
  font-family: var(--hand);
  font-size: 58px;
  color: rgba(251, 246, 234, 0.95);
  letter-spacing: 4px;
  text-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
  text-align: center;
}
.sub {
  position: relative;
  margin-top: 12px;
  font-size: 14px;
  opacity: 0.85;
  color: rgba(251, 246, 234, 0.88);
  text-align: center;
  letter-spacing: 3px;
}

.ritual-enter-active,
.ritual-leave-active {
  transition: opacity 260ms ease;
}
.ritual-enter-from,
.ritual-leave-to {
  opacity: 0;
}
</style>

