<template>
  <div>
    <NavBar />
    <h1>Sessions</h1>
    <div class="session-container">

      <div class="main-content">
        <div class="session-list">
          <p><strong>Past Sessions:</strong></p>
          <div v-for="session in sessions" :key="session.id">
            <Session_ :sessionId="session.id" :isSelected="false" @select="handleSelectSession" />
          </div>

      </div>
      <div class="session-chart">
        <p><strong>Session Chart:</strong></p>
         <SessionChart v-if="selectedSessionId" :sessionId="selectedSessionId" />
         <p v-else>Select a session to view chart</p>
      </div>
    </div>
      


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
import Session_ from '@/components/Session_.vue'
import SessionChart from '@/components/SessionChart.vue'

</script>

<script>
export default {
  name: "Session"
};
// get session data
// display session data
const user = useCurrentUser();
const selectedSessionId = ref(null)

const sessionsQuery = computed(() => {
  if (!user.value?.uid) return null;
  return query(collection(db, "users", user.value.uid, "sessions"), orderBy("timeStart", "desc"), limit(10));
});

const sessions = useCollection(sessionsQuery)

function handleSelectSession(sessionId) {
  selectedSessionId.value = sessionId
  console.log("Selected session:", sessionId)
}

console.log("Sessions:", sessions.value);





</script>

<style scoped>

.session-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.session-filter {
  margin-bottom: 20px;
}

.session-list {
  margin-bottom: 20px;
  width: 20%;
  /* margin-right: 80%; */
}
.session-chart {
  margin-bottom: 20px;
  width: 80%;
  /* margin-left: 20%; */
}

.main-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
}
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  margin-left: 20px;
  padding-left: 20px;
}

</style>