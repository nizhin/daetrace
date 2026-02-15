<!-- filepath: /Users/chestonopsasnick/Documents/Coding_Projects/daetrace/src/components/Session.vue -->
<template>
  <div 
    class="session-card"
    :class="{ selected: isSelected }"
    @click="$emit('select', sessionId)"
  >
    <div>
      <div class="name">{{ session?.name || 'Unnamed Session' }}</div>
      <div class="meta">{{ formatDate(session?.timeStart) }}</div>
      <div class="meta">Duration: {{ formatDuration(session?.actualDuration) }}</div>
    </div>
    <span>›</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { doc } from 'firebase/firestore';
import { db } from '@/firebase_conf';
import { useDocument, useCurrentUser } from 'vuefire';

const props = defineProps({
  sessionId: String,
  isSelected: Boolean
});

defineEmits(['select']);

const user = useCurrentUser();

const sessionRef = computed(() => {
  if (!user.value || !props.sessionId) return null
  return doc(db, 'users', user.value.uid, 'sessions', props.sessionId)
});

const { data: session } = useDocument(sessionRef);

function formatDate(timestamp) {
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
  });
}

function formatDuration(seconds) {
  if (!seconds) return '--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
</script>

<style scoped>
.session-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid white;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  background-color: #F3F9FF;
}

.session-card:hover {
  border-color: #E4F6EF;
  background-color: #DFEBF8;
}

.session-card.selected {
  background-color: #A1ADBC;
  border-color: var(--primary-color);
}

.name {
  font-weight: 600;
}

.meta {
  font-size: 13px;
  color: var(--text-light-color);
}
</style>