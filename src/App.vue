<script setup lang="ts">
import RealmRitual from './components/RealmRitual.vue'
</script>

<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>
    <RealmRitual />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1 1 auto;
  padding: 16px 14px;
  box-sizing: border-box;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
}
</style>
