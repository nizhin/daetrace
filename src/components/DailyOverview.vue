<template>
    <Card>
        <template #title>Daily Overview</template>
        <template #content>
            <div class="content">
                <div class="doughnut-wrap">
                    <Chart 
                        type="doughnut" 
                        :data="chartData" 
                        :options="chartOptions" />
                    <div class="center-text">
                        <div class="total-time">{{ formatTime(totalTime) }}</div>
                        <div class="total-label">Total Today</div>
                    </div>
                </div>

                <div class="stats-list">
                    <div class="stat-item">
                        <div class="stat-indicator productive"></div>
                        <span class="stat-label">Productive</span>
                        <span class="stat-value">{{ formatTime(categoryTimes.productive) }}</span>
                    </div>

                    <div class="stat-item">
                        <div class="stat-indicator not-productive"></div>
                        <span class="stat-label">Not Productive</span>
                        <span class="stat-value">{{ formatTime(categoryTimes.not_productive) }}</span>
                    </div>

                    <div class="stat-item">
                        <div class="stat-indicator uncategorized"></div>
                        <span class="stat-label">Not Categorized</span>
                        <span class="stat-value">{{ formatTime(categoryTimes.uncategorized) }}</span>
                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase_conf';
import { useCollection, useCurrentUser } from 'vuefire';
import Chart from 'primevue/chart';
import Card from 'primevue/card';


const user = useCurrentUser();
const chartData = ref();
const chartOptions = ref(null);


const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

const entriesQuery = computed(() => {
  if (!user.value?.uid) return null;
  return query(
    collection(db, "users", user.value.uid, "entries"),
    where('date', '>=', todayStart.getTime()),
    where('date', '<=', todayEnd.getTime())
  );
});

const entries = useCollection(entriesQuery);

const domainsQuery = computed(() => {
  if (!user.value?.uid) return null;
  return query(collection(db, "users", user.value.uid, "domains"));
});
const domainCategories = useCollection(domainsQuery);

const categoryTimes = computed(() => {
  if (!entries.value || !domainCategories.value) {
    return { productive: 0, not_productive: 0, uncategorized: 0 };
  }


  const categoryMap = new Map();
  domainCategories.value.forEach(doc => {
    categoryMap.set(doc.id, doc.category || 'uncategorized');
  });


  const times = { productive: 0, not_productive: 0, uncategorized: 0 };
  
  entries.value.forEach(entry => {
    const category = categoryMap.get(entry.domain) || 'uncategorized';
    const duration = entry.durationSeconds || 0;
    times[category] += duration;
  });

  return times;
});

const totalTime = computed(() => {
  return categoryTimes.value.productive + 
         categoryTimes.value.not_productive + 
         categoryTimes.value.uncategorized;
});

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return '0m';
};

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Productive', 'Not Productive', 'Not Categorized'],
        datasets: [
            {
                data: [
                     categoryTimes.value.productive / 60, // Convert to minutes
                  categoryTimes.value.not_productive / 60,
                  categoryTimes.value.uncategorized / 60
                ],
                backgroundColor: [documentStyle.getPropertyValue('--p-green-500'), documentStyle.getPropertyValue('--p-red-500'), documentStyle.getPropertyValue('--p-gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-green-400'), documentStyle.getPropertyValue('--p-red-400'), documentStyle.getPropertyValue('--p-gray-400')],
                borderWidth: 0
            }
        ]
    };
};

const setChartOptions = () => {
    return {
        plugins: {
            legend: {
                display: false
            }
        },
        cutout: '75%'
    };
};

watch([categoryTimes, user], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
}, { immediate: true });
</script>
<style scoped>
.content {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 40px;
}

.doughnut-wrap {
    position: relative;
    width: 260px;
    height: 260px;
}

.center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.total-time {
    font-size: 36px;
    font-weight: bold;
}

.total-label {
    color: #999;
}

.stats-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.stat-indicator.productive {
    background: var(--p-green-500);
}

.stat-indicator.not-productive {
    background: var(--p-red-500);
}

.stat-indicator.uncategorized {
    background: var(--p-gray-500);
}

.stat-label {
    flex: 1;
}

.stat-value {
    font-weight: bold;
}
</style>