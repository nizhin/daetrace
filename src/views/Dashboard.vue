<template>
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

const user = useCurrentUser();

const entriesQuery = query(collection(db, "users", user.value.uid, "entries"), orderBy('startTime', 'desc', limit(50)));
const entries = useCollection(entriesQuery);


</script>
