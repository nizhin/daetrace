<template>

  <div class="dashboard-container">
    <NavBar />

    <div class="header">
      <h1 class="welcome">Welcome Alex</h1>
      <div class="date-text">Sunday, February 15, 2026</div>
    </div>

    <div class="layout">
      <div class="left-cards">
        <DailyOverview/>
      </div>

      <div class="right-cards">
        <FocusTime />
        <DistractedTime />
        <!-- <ProdScore /> -->
      </div>

      <div class="top-sites-container">
        <TopSitesList />  
      </div>

    </div>
  </div>

  <div>
  <h3>Recent Entries</h3>
      <div v-for="entry in entries" :key="entry.id">
        <p>{{ entry.domain }} - {{ entry.durationSeconds }}s</p>
        <small>{{ new Date(entry.startTime).toLocaleString() }}</small>
      </div>
  </div>


</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { doc, getDoc, setDoc, collection, query, where, orderBy, limit} from 'firebase/firestore'
import { db } from '@/firebase_conf'
import { useCollection, useCurrentUser } from 'vuefire'
import { useRouter } from 'vue-router'
import DailyOverview from '@/components/DailyOverview.vue'
import NavBar from '@/components/NavBar.vue'
import FocusTime from '@/components/FocusTime.vue'
import DistractedTime from '@/components/DistractedTime.vue'
import ProdScore from '@/components/ProdScore.vue'
import TopSitesList from '@/components/TopSitesList.vue'

const user = useCurrentUser();

const entriesQuery = query(collection(db, "users", user.value.uid, "entries"), orderBy('startTime', 'desc', limit(50)));
const entries = useCollection(entriesQuery);

</script>

<style scoped>
.dashboard-container {
  padding: 28px 40px;
}

.header {
 margin-top: 20px;
 margin-bottom: 20px;
}

.welcome {
  font-size: 40px;
  font-weight: bold;
  margin: 0;
}

.date-text {
  margin-top: 5px;
  font-size: 18px;
  color: gray;
  font-weight: 400;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 28px;
  align-items: start;
}

.left-cards {
  grid-column: 1;
}

.right-cards {
  display: flex;
  grid-column: 2;
  flex-direction: column;
  gap: 24px;
}

.top-sites-container {
  grid-column: 1 / -1;
}

</style>

