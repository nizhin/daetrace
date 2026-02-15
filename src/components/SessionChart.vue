<template>
  <div class="chart-container">
    <Chart v-if="chartData.labels.length > 0" type="pie" :data="chartData" :options="chartOptions" />
    <p v-else class="no-data">No activity data for this session</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { collection, query, where } from 'firebase/firestore'
import { db } from '@/firebase_conf'
import { useCollection, useCurrentUser } from 'vuefire'
import Chart from 'primevue/chart'

const props = defineProps({
  sessionId: {
    type: String,
    required: true
  }
});

const user = useCurrentUser();

const entriesQuery = computed(() => {
  if (!user.value?.uid || !props.sessionId) return null;
  return query(
    collection(db, "users", user.value.uid, "entries"),
    where("sessionId", "==", props.sessionId)
  )
});

const entries = useCollection(entriesQuery);

const chartData = computed(() => {
  if (!entries.value || entries.value.length === 0) {
    return { labels: [], datasets: [] }
  }

  
  const domainTotals = {}

  entries.value.forEach((entry) => {
    const domain = entry.domain || 'Unknown'
    domainTotals[domain] = (domainTotals[domain] || 0) + (entry.durationSeconds || 0)
  })

  const sorted = Object.entries(domainTotals).sort((a, b) => b[1] - a[1])

  // ttake top 5 just
  const top5 = sorted.slice(0, 5)
  const otherTotal = sorted.slice(5).reduce((sum, [, duration]) => sum + duration, 0)

  const labels = top5.map(([domain]) => domain)
  const data = top5.map(([, duration]) => duration)

  if (otherTotal > 0) {
    labels.push('Other')
    data.push(otherTotal)
  }

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          'green', 
          'blue', 
          'orange', 
          'purple', 
          'red', 
          'grey' 
        ]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const seconds = context.raw
          const minutes = Math.floor(seconds / 60)
          const hours = Math.floor(minutes / 60)
          const remainingMins = minutes % 60
          
          if (hours > 0) {
            return `${context.label}: ${hours}h ${remainingMins}m`
          }
          return `${context.label}: ${minutes}m`
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.no-data {
  color: var(--text-light-color);
  font-style: italic;
}
</style>