<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRecordsStore } from '../stores/records'
import { PETS, WEAPONS } from '../lib/companions'

const store = useRecordsStore()

const petName = computed(() => PETS.find((p) => p.id === store.chosenPetId)?.name ?? '灵宠')
const weaponName = computed(() => WEAPONS.find((w) => w.id === store.chosenWeaponId)?.name ?? '兵器')

const petLvl = computed(() => store.petLevel)
const petPct = computed(() => store.petLevelPct)
const weaponPct = computed(() => store.weaponPct)

const fxPet = ref(false)
const fxWeapon = ref(false)

const prevPetXp = ref(store.petXp ?? 0)
const prevFeng = ref(store.weaponFeng ?? 0)

watch(
  () => store.petXp,
  (n) => {
    const next = n ?? 0
    if (next > prevPetXp.value) {
      fxPet.value = false
      requestAnimationFrame(() => (fxPet.value = true))
      window.setTimeout(() => (fxPet.value = false), 520)
    }
    prevPetXp.value = next
  },
)

watch(
  () => store.weaponFeng,
  (n) => {
    const next = n ?? 0
    if (next > prevFeng.value) {
      fxWeapon.value = false
      requestAnimationFrame(() => (fxWeapon.value = true))
      window.setTimeout(() => (fxWeapon.value = false), 520)
    }
    prevFeng.value = next
  },
)

function drawWeapon() {
  store.consumeWeaponFeng()
  fxWeapon.value = false
  requestAnimationFrame(() => (fxWeapon.value = true))
  window.setTimeout(() => (fxWeapon.value = false), 700)
}
</script>

<template>
  <div class="row" aria-label="随行灵宠与兵器">
    <div class="slot" :data-fx="fxPet">
      <div class="top">
        <div class="nm">{{ petName }}</div>
        <div class="tag">灵宠·第{{ petLvl }}阶</div>
      </div>
      <div class="bar">
        <i class="fill" :style="{ width: `${Math.round(petPct * 100)}%` }" />
      </div>
    </div>

    <button class="slot weapon" type="button" :data-fx="fxWeapon" :data-ready="weaponPct >= 1" @click="drawWeapon">
      <div class="top">
        <div class="nm">{{ weaponName }}</div>
        <div class="tag">{{ weaponPct >= 1 ? '锋芒已满·出鞘' : '锋芒未满' }}</div>
      </div>
      <div class="bar">
        <i class="fill" :style="{ width: `${Math.round(weaponPct * 100)}%` }" />
      </div>
      <div class="hint">轻点以出鞘</div>
    </button>
  </div>
</template>

<style scoped>
.row {
  display: inline-flex;
  align-items: stretch;
  gap: 10px;
}
.slot {
  width: 220px;
  border-radius: 18px;
  padding: 10px 10px 8px;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
}
.weapon {
  appearance: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.nm {
  font-weight: 950;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag {
  font-size: 12px;
  opacity: 0.78;
  white-space: nowrap;
}
.bar {
  height: 10px;
  border-radius: 999px;
  margin-top: 8px;
  background: color-mix(in srgb, var(--paper-2) 66%, transparent);
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 70%, var(--text-h));
  transition: width 420ms ease;
}
.hint {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
.slot[data-ready='true'] .hint {
  opacity: 0.95;
}
.slot[data-fx='true'] {
  animation: pulse 520ms ease;
}
.slot.weapon[data-ready='true'] {
  background: color-mix(in srgb, var(--accent-bg) 62%, var(--bg));
}
.slot.weapon[data-ready='true'] .fill {
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 30%, white));
}
@keyframes pulse {
  0% {
    transform: translateY(0);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  }
  40% {
    transform: translateY(-1px);
    box-shadow: 0 26px 60px rgba(0, 0, 0, 0.16);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  }
}
@media (max-width: 980px) {
  .row {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  .slot {
    width: 100%;
  }
}
</style>

