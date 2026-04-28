<script setup lang="ts">
import SectHeader from '../components/SectHeader.vue'
import StageCard from '../components/StageCard.vue'
import TimerCard from '../components/TimerCard.vue'
import CheckinCard from '../components/CheckinCard.vue'
import DrillCard from '../components/DrillCard.vue'
import InsightCard from '../components/InsightCard.vue'
import WrongbookCard from '../components/WrongbookCard.vue'
import WeeklyReportCard from '../components/WeeklyReportCard.vue'
</script>

<template>
  <SectHeader sect="万言楼" subtitle="英语" subject-id="english" />
  <div class="stack">
    <WeeklyReportCard subject-id="english" />
    <StageCard subject-id="english" />
    <TimerCard subject-id="english" />
    <CheckinCard subject-id="english" />
    <DrillCard subject-id="english" />
    <InsightCard subject-id="english" />
    <WrongbookCard subject-id="english" />
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 12px;
}
</style>

