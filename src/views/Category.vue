<template>
<NavBar></NavBar>
   <div class="category-container">
    <h1>Edit Categories</h1>
    <p>Edit the categories for the domain by changing the category tab.</p>
      <div class="stats-grid">
      <Card>
        <template #content>
          <div>Total Domains</div>
          <div>{{ domains.length }}</div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div>Productive</div>
          <div>{{ productiveCount }}</div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div>Not Productive</div>
          <div>{{ notProductiveCount }}</div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div>Not Categorized</div>
          <div>{{ notCategorizedCount }}</div>
        </template>
      </Card>
    </div>

      <div class="search-container">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchQuery" placeholder="Search domains..." class="w-full" />
      </IconField>
    </div>


     <Card>
      <template #content>
        <DataTable 
          :value="filteredDomains" 
          :rows="10"
          :paginator="true"
          sortField="timeSpent" 
          :sortOrder="-1"
        >
          <Column field="domain" header="Domain" :sortable="true">
            <template #body="{ data }">
              <div class="domain-cell">
                <span>{{ data.domain }}</span>
              </div>
            </template>
          </Column>

          <Column field="timeSpent" header="Time Spent" :sortable="true">
            <template #body="{ data }">
              {{formatTime(data.timeSpent) }} 
            </template>
          </Column>

          <Column field="visits" header="Visits" :sortable="true">
            <template #body="{ data }">
              {{ data.visits }} visits
            </template>
          </Column>

          <Column field="category" header="Category">
            <template #body="{ data }">
              <Select 
                v-model="data.category" 
                :options="categoryOptions" 
                @change="updateCategory(data)"
                optionLabel="label"
                optionValue="value"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>


</template>

<script setup>
  import { ref, computed } from 'vue'
  import { collection, query, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore'
  import { db } from '@/firebase_conf'
  import { useCollection, useCurrentUser } from 'vuefire'
  import Card from 'primevue/card'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import IconField from 'primevue/iconfield'
  import InputIcon from 'primevue/inputicon'
  import NavBar from '@/components/NavBar.vue'


  const user = useCurrentUser();
  const searchQuery = ref('');


  const categoryOptions = ref([
  { label: 'Productive', value: 'productive' },
  { label: 'Not Productive', value: 'not_productive' },
  { label: 'Not Categorized', value: 'uncategorized' }
])

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


 const domains = computed(() => {
  const domainMap = new Map()

  const categoryMap = new Map()
  if (domainCategories.value) {
    domainCategories.value.forEach(domainDoc => {
      categoryMap.set(domainDoc.id, domainDoc.category || 'uncategorized')
    })
  }


  entries.value.forEach(entry => {
    if (!domainMap.has(entry.domain)) {
      domainMap.set(entry.domain, {
        id: entry.id,
        domain: entry.domain,
        timeSpent: 0,
        visits: 0,
        category: categoryMap.get(entry.domain) || 'uncategorized'
      })
    }
    
    const domain = domainMap.get(entry.domain)
    domain.timeSpent += entry.durationSeconds || 0
    domain.visits += 1
  })

  return Array.from(domainMap.values())
})


const filteredDomains = computed(() => {
  if (!searchQuery.value) return domains.value
  return domains.value.filter(d => 
    d.domain.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const productiveCount = computed(() => 
  domains.value.filter(d => d.category === 'productive').length
)


const notProductiveCount = computed(() => 
  domains.value.filter(d => d.category === 'not_productive').length
)

const notCategorizedCount = computed(() => 
  domains.value.filter(d => d.category === 'uncategorized').length
)


const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}


const updateCategory = async (domainData) => {
  if (!user.value?.uid) return

  const domainDocRef = doc(db, 'users', user.value.uid, 'domains', domainData.domain)
  await setDoc(domainDocRef, {
    category: domainData.category,
    name: domainData.domain
  })
}



</script>


<style scoped>
.category-container {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-container {
  margin-bottom: 1rem;
}

.domain-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>