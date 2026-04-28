<script setup lang="ts">
import { computed, ref } from 'vue'
import { PETS, WEAPONS, type PetId, type WeaponId } from '../lib/companions'
import { useRecordsStore } from '../stores/records'

const store = useRecordsStore()

const open = ref(false)
const tab = ref<'pet' | 'weapon'>('pet')

const petId = computed(() => store.chosenPetId)
const weaponId = computed(() => store.chosenWeaponId)

function pickPet(id: PetId) {
  store.choosePet(id)
}
function pickWeapon(id: WeaponId) {
  store.chooseWeapon(id)
}
</script>

<template>
  <div class="wrap">
    <button class="btn" type="button" @click="open = true">择伴</button>

    <transition name="sheet">
      <div v-if="open" class="mask" role="dialog" aria-label="择伴">
        <div class="sheet">
          <div class="head">
            <div class="title">择伴</div>
            <button class="x" type="button" @click="open = false">合</button>
          </div>

          <div class="tabs">
            <button class="t" type="button" :data-on="tab === 'pet'" @click="tab = 'pet'">灵宠</button>
            <button class="t" type="button" :data-on="tab === 'weapon'" @click="tab = 'weapon'">兵器</button>
          </div>

          <div v-if="tab === 'pet'" class="list">
            <button
              v-for="p in PETS"
              :key="p.id"
              class="item"
              type="button"
              :data-on="p.id === petId"
              @click="pickPet(p.id)"
            >
              <div class="nm">{{ p.name }}</div>
              <div class="ds">{{ p.desc }}</div>
            </button>
          </div>

          <div v-else class="list">
            <button
              v-for="w in WEAPONS"
              :key="w.id"
              class="item"
              type="button"
              :data-on="w.id === weaponId"
              @click="pickWeapon(w.id)"
            >
              <div class="nm">{{ w.name }}</div>
              <div class="ds">{{ w.desc }}</div>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.wrap {
  display: inline-flex;
}
.btn {
  appearance: none;
  border: none;
  border-radius: 14px;
  padding: 8px 10px;
  cursor: pointer;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
  color: var(--text-h);
  font-weight: 900;
}

.mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(0, 0, 0, 0.32);
  display: grid;
  align-items: end;
  justify-items: center;
  padding: 12px;
}
.sheet {
  width: min(720px, 100%);
  max-height: 82svh;
  overflow: auto;
  border-radius: 22px;
  background: color-mix(in srgb, var(--paper-2) 70%, var(--bg));
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.35);
  padding: 12px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 6px 10px;
}
.title {
  font-family: var(--hand);
  font-size: 22px;
  color: var(--text-h);
}
.x {
  appearance: none;
  border: none;
  border-radius: 14px;
  padding: 8px 10px;
  cursor: pointer;
  background: color-mix(in srgb, var(--accent-bg) 60%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
  color: var(--text-h);
  font-weight: 900;
}
.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 6px 10px;
}
.t {
  appearance: none;
  border: none;
  border-radius: 16px;
  padding: 10px 0;
  cursor: pointer;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
  color: var(--text-h);
  font-weight: 900;
}
.t[data-on='true'] {
  background: color-mix(in srgb, var(--accent-bg) 70%, var(--bg));
}
.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 0 6px 8px;
}
.item {
  appearance: none;
  border: none;
  border-radius: 18px;
  padding: 12px 12px;
  cursor: pointer;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  text-align: left;
}
.item[data-on='true'] {
  background: color-mix(in srgb, var(--accent-bg) 60%, var(--bg));
}
.nm {
  font-weight: 950;
  color: var(--text-h);
}
.ds {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.75;
}
@media (max-width: 560px) {
  .list {
    grid-template-columns: 1fr;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

