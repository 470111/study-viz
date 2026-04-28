<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Tab = { to: string; label: string; subtitle: string }

const tabs: Tab[] = [
  { to: '/math', label: '天算宗', subtitle: '数学' },
  { to: '/cs408', label: '机枢阁', subtitle: '408' },
  { to: '/english', label: '万言楼', subtitle: '英语' },
  { to: '/custom', label: '万法殿', subtitle: '自定义' },
]

const route = useRoute()
const router = useRouter()
const activePath = computed(() => (typeof route.path === 'string' ? route.path : ''))
</script>

<template>
  <nav class="tabbar" aria-label="主导航">
    <button
      v-for="t in tabs"
      :key="t.to"
      class="tab"
      type="button"
      :data-active="activePath === t.to"
      @click="router.push(t.to)"
    >
      <div class="label">{{ t.label }}</div>
      <div class="subtitle">{{ t.subtitle }}</div>
    </button>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px 10px calc(10px + env(safe-area-inset-bottom));
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  border-top: 1px solid var(--border);
  backdrop-filter: blur(10px);
}

.tab {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  padding: 10px 8px;
  border-radius: 12px;
  text-align: center;
  color: var(--text);
  cursor: pointer;
}

.tab[data-active='true'] {
  border-color: var(--accent-border);
  background: var(--accent-bg);
  color: var(--text-h);
}

.label {
  font-weight: 650;
  font-size: 14px;
  line-height: 1.1;
}

.subtitle {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.75;
}
</style>

