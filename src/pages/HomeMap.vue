<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const bgVideoUrl = '/4月28日.mp4'
</script>

<template>
  <div class="wrap">
    <header class="hero">
      <div class="title">洞府山门</div>
      <div class="sub">点选山河，入各宗修行。</div>
    </header>

    <section class="map">
      <video class="bg" :src="bgVideoUrl" autoplay muted loop playsinline preload="auto" />

      <button class="poi poi-math" type="button" @click="router.push('/math')">
        <div class="poi-name">天算宗</div>
      </button>
      <button class="poi poi-408" type="button" @click="router.push('/cs408')">
        <div class="poi-name">机枢阁</div>
      </button>
      <button class="poi poi-en" type="button" @click="router.push('/english')">
        <div class="poi-name">万言楼</div>
      </button>
      <button class="poi poi-custom" type="button" @click="router.push('/custom')">
        <div class="poi-name">万法殿</div>
      </button>
    </section>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  min-height: 100svh;
}

.hero .title {
  font-size: 22px;
  font-weight: 900;
  color: var(--text-h);
}
.hero .sub {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.8;
}
.hero {
  position: fixed;
  left: 16px;
  top: 14px;
  z-index: 5;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
}
.hero .title {
  color: rgba(255, 255, 255, 0.98);
}

.map {
  position: fixed;
  inset: 0;
  overflow: hidden;
  height: 100svh;
  width: 100vw;
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 铺满屏幕但不拉伸（保持长宽比） */
  filter: saturate(0.9) contrast(1.06);
}

.poi {
  position: absolute;
  border: none;
  background: transparent;
  padding: 6px 8px;
  text-align: center;
  cursor: pointer;
}
.poi-name {
  font-weight: 700;
  font-size: 44px;
  line-height: 1;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.98);
  /* Webfont first to ensure consistent "wild cursive" style */
  font-family: 'Zhi Mang Xing', 'STXingkai', 'FZShuTi', 'STKaiti', 'KaiTi', 'DFKai-SB', cursive;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.25),
    0 14px 34px rgba(0, 0, 0, 0.38);
}
@media (max-width: 560px) {
  .poi-name {
    font-size: 40px;
    letter-spacing: 1.5px;
  }
}
.poi:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 6px;
  border-radius: 10px;
}

.poi-math {
  left: 44%;
  top: 26%;
  transform: translateX(-50%);
}
.poi-408 {
  right: 18%;
  top: 28%;
}
.poi-en {
  left: 18%;
  top: 30%;
}
.poi-custom {
  right: 14%;
  top: 44%;
}
</style>

