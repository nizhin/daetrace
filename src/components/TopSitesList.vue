<template>

         <DataTable :value="topSites" tableStyle="min-width: 50rem">
            <Column field="domain" header="Domain"></Column>
            <Column field="timeSpent" header="Time Spent">
                <template #body="{ data }">
                    {{ formatTime(data.timeSpent) }}
                </template>
            </Column>
            <Column field="category" header="Category"></Column>
            <Column field="percent" header="% of Total">
                <template #body="{ data }">
                    {{ data.percent }}%
                </template>
            </Column>
        </DataTable>
</template>

<script setup>
import { ref, computed, watch} from 'vue';
import { collection, query } from 'firebase/firestore';
import { db } from '@/firebase_conf';
import { useCollection, useCurrentUser } from 'vuefire';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const user = useCurrentUser()


const entriesQuery = computed(() => {
  if (!user.value?.uid) return null;
  return query(collection(db, "users", user.value.uid, "entries"));
});


const entries = useCollection(entriesQuery);

const domainsQuery = computed(() => {
  if (!user.value?.uid) return null;
  return query(collection(db, "users", user.value.uid, "domains"));
});

  const domainCategories = useCollection(domainsQuery);


 const topSites = computed(() => {
    if (!entries.value || entries.value.length === 0) return [];
  const domainMap = new Map()
  let totalTime = 0;

  const categoryMap = new Map()
  if (domainCategories.value) {
    domainCategories.value.forEach(domainDoc => {
      categoryMap.set(domainDoc.id, domainDoc.category || 'uncategorized')
    })
  }


  entries.value.forEach(entry => {
    const timeSpent = entry.durationSeconds || 0;
    totalTime += timeSpent;
    if (!domainMap.has(entry.domain)) {
      domainMap.set(entry.domain, {
        domain: entry.domain,
        timeSpent: 0,
        category: categoryMap.get(entry.domain) || 'uncategorized'
      })
    }
    
    domainMap.get(entry.domain).timeSpent += timeSpent;
  })

  

   return Array.from(domainMap.values())
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 10)
    .map(site => ({
      ...site,
      percent: ((site.timeSpent / totalTime) * 100).toFixed(1)
    }));
});


const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

</script>

<style scoped>
.top-sites-card {
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 24px;
    padding: 26px 28px 30px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    width: 100%;
    margin-left: auto;
}

.title {
    margin: 0 0 18px 0;
    font-size: 30px;
    font-weight: bold;
    color: black;
}

</style>