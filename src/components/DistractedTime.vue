<template>
    <Card class="distracted-card">
        <template #content>
            <div class="card-row">
                <div class="icon-wrapper">
                    <i class="pi pi-eye-slash text-red-500 text-lg"></i>
                </div>
                <div class="text-wrapper">
                    <div class="title-text">Non-Focus Time</div>
                    <div class="time-text">{{ distractedTimeText }}</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { computed } from "vue";
import { collection, query } from "firebase/firestore";
import { useCollection, useCurrentUser } from "vuefire";
import { db } from "@/firebase_conf";
import Card from "primevue/card";

const user = useCurrentUser();

const entries = useCollection(
  computed(() => {
    if (!user.value?.uid) return null;
    return query(collection(db, "users", user.value.uid, "entries"));
  })
);

const sessions = useCollection(
  computed(() => {
    if (!user.value?.uid) return null;
    return query(collection(db, "users", user.value.uid, "sessions"));
  })
);

const isTodayMs = (ms) => {
  const d = new Date(ms);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const activeSecondsToday = computed(() => {
  if (!entries.value) return 0;
  return entries.value
    .filter((e) => e.date && isTodayMs(e.date))
    .reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
});

const focusSecondsToday = computed(() => {
  if (!sessions.value) return 0;
  return sessions.value
    .filter((s) => s.timeStart && isTodayMs(s.timeStart))
    .reduce((sum, s) => sum + (s.actualDuration || 0), 0);
});

const distractedSecondsToday = computed(() =>
  Math.max(0, activeSecondsToday.value - focusSecondsToday.value)
);

const distractedTimeText = computed(() =>
  formatTime(distractedSecondsToday.value)
);
</script>

<style scoped>
.distracted-card {
    border-radius: 18px;
    padding: 18px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    width: 100%;
    margin-left: auto;
}

.card-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.icon-wrapper {
    background: #ffe9e9;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.icon-wrapper i {
    color: #f80000;
    font-size: 1.1rem;
}

.title-text {
    font-weight: 100;
    font-size: 16px;
    color: #555;
}

.time-text {
    font-size: 20px;
    font-weight: bold;
    color: #111;
    margin-top: 4px;
}
</style>