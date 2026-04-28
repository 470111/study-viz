<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Option<T extends string> = { value: T; label: string }

const props = defineProps<{
  modelValue: string
  options: Option<string>[]
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const currentLabel = computed(() => props.options.find((o) => o.value === props.modelValue)?.label ?? props.modelValue)

function toggle() {
  open.value = !open.value
}

function pick(v: string) {
  emit('update:modelValue', v)
  open.value = false
}

function onDoc(e: MouseEvent) {
  if (!open.value) return
  const el = root.value
  if (!el) return
  if (e.target instanceof Node && !el.contains(e.target)) open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onDoc)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDoc)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="wrap">
    <div v-if="label" class="lab">{{ label }}</div>
    <button class="btn" type="button" :aria-expanded="open" @click="toggle">
      <span class="txt">{{ currentLabel }}</span>
      <span class="arr" aria-hidden="true">▾</span>
    </button>

    <transition name="ink">
      <div v-if="open" class="menu" role="listbox">
        <button
          v-for="o in options"
          :key="o.value"
          class="opt"
          type="button"
          :data-active="o.value === modelValue"
          @click="pick(o.value)"
        >
          <span class="dot" aria-hidden="true" />
          <span class="ol">{{ o.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
}
.lab {
  font-size: 12px;
  opacity: 0.75;
  margin-bottom: 6px;
}
.btn {
  width: 100%;
  appearance: none;
  border: none;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
}
.txt {
  font-weight: 850;
}
.arr {
  opacity: 0.7;
}
.menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 20;
  border: none;
  border-radius: 18px;
  background: color-mix(in srgb, var(--paper-2) 62%, var(--bg));
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.22);
  overflow: hidden;
  padding: 8px;
}
.opt {
  width: 100%;
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text-h);
  padding: 10px 10px;
  border-radius: 14px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 10px;
  align-items: center;
}
.opt:hover {
  background: color-mix(in srgb, var(--ink-weak) 70%, transparent);
}
.opt[data-active='true'] {
  background: color-mix(in srgb, var(--accent-bg) 70%, transparent);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent);
  opacity: 0.45;
}
.opt[data-active='true'] .dot {
  opacity: 0.95;
}
.ol {
  font-weight: 850;
}

.ink-enter-active,
.ink-leave-active {
  transition: transform 160ms ease, opacity 160ms ease;
}
.ink-enter-from,
.ink-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

