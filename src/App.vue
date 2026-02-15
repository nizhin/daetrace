<script setup>
import NavBar from '@/components/NavBar.vue'
import DistractedTime from '@/components/DistractedTime.vue';
import FocusTime from '@/components/FocusTime.vue';
import ProdScore from '@/components/ProdScore.vue';
import TopSitesList from './components/TopSitesList.vue';
</script>

<template>
  <NavBar/>
  <div class="right-container">
    <FocusTime/>
    <DistractedTime/>
    <ProdScore/>
  </div>
  <div class="top-sites-container">
    <TopSitesList/>
  </div>
</template>

<style>
body {
  font-family: 'Inter'
}

.overview-container {
  display: flex;
  gap: 24px;
}

.right-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 48px; 
  gap: 24px;
}

.top-sites-container {
  display: flex;
  gap: 24px;
}
</style>
