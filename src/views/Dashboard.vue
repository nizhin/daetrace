
<template>

 <div class="dashboard-container">
        <h1 class="mb-4">Dashboard</h1>

        <NavBar />
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


const user = useCurrentUser();

const entriesQuery = query(collection(db, "users", user.value.uid, "entries"), orderBy('startTime', 'desc', limit(50)));
const entries = useCollection(entriesQuery);


</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}
</style>

