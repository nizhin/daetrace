<template>
  <div>
    <h1 class="mb-4">Session</h1>

    <NavBar />
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

</script>

<script>
export default {
  name: "Session"
};
</script>