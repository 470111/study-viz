<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRecordsStore } from '../stores/records'
import { computed } from 'vue'
import CompanionPicker from './CompanionPicker.vue'
import CompanionGrowth from './CompanionGrowth.vue'
import { PETS, WEAPONS } from '../lib/companions'

const props = defineProps<{
  sect: string
  subtitle: string
  subjectId?: 'math' | 'cs408' | 'english' | 'custom'
}>()

const router = useRouter()
const store = useRecordsStore()
const realmText = computed(() => {
  const r = store.realm
  return `${r.name}·${r.step}`
})

const petName = computed(() => PETS.find((p) => p.id === store.chosenPetId)?.name ?? '灵宠')
const weaponName = computed(() => WEAPONS.find((w) => w.id === store.chosenWeaponId)?.name ?? '兵器')
</script>

<template>
  <header class="hdr">
    <button class="back" type="button" @click="router.push('/')">归山</button>
    <div class="mid">
      <div class="sect">{{ sect }}</div>
      <div class="sub">{{ subtitle }}</div>
    </div>
    <div class="right">
      <div class="mini" aria-label="随行">
        <span class="m">{{ petName }}</span>
        <span class="dot">·</span>
        <span class="m">{{ weaponName }}</span>
      </div>
      <div class="realm" aria-label="境界">{{ realmText }}</div>
      <CompanionGrowth />
      <CompanionPicker />
    </div>
  </header>
</template>

<style scoped>
.hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 14px;
}
.back {
  appearance: none;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-h);
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 750;
  font-size: 15px;
}
.mid {
  flex: 1 1 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.sect {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-h);
  letter-spacing: 0.2px;
}
.sub {
  font-size: 15px;
  opacity: 0.8;
}
.right {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.mini {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: 13px;
  opacity: 0.85;
  max-width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m {
  font-weight: 900;
  color: var(--text-h);
}
.dot {
  opacity: 0.6;
}
.realm {
  font-family: var(--hand);
  font-size: 18px;
  color: var(--text-h);
  opacity: 0.95;
  padding: 6px 8px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--accent-bg) 55%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
}
</style>

