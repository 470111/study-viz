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
  <SectHeader sect="万法殿" subtitle="自定义" subject-id="custom" />
  <div class="stack">
    <WeeklyReportCard subject-id="custom" />
    <StageCard subject-id="custom" />
    <TimerCard subject-id="custom" />
    <CheckinCard subject-id="custom" />
    <DrillCard subject-id="custom" />
    <InsightCard subject-id="custom" />
    <WrongbookCard subject-id="custom" />
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 12px;
}
</style>

