<template>
    <Card class="focus-card">
        <template #content>
            <div class="card-row">
                <div class="icon-wrapper">
                    <i class="pi pi-bullseye text-green-500 text-lg"></i>
                </div>
                <div class="text-wrapper">
                    <div class="title-text">Focus Session Time</div>
                    <div class="time-text">{{ focusTimeText }}</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { computed } from "vue";
import Card from "primevue/card";

import { collection } from "firebase/firestore";
import { db } from "@/firebase_conf";
import { useCollection, useCurrentUser } from "vuefire";

const user = useCurrentUser();

const sessions = useCollection(
  computed(() => {
    if (!user.value?.uid) return null;
    return collection(db, "users", user.value.uid, "sessions");
  })
);
console.log(sessions.value)
function isToday(ts) {
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

//sum up all of today actualDurations
const focusSeconds = computed(() => {
  if (!sessions.value) return 0;

  return sessions.value
    .filter(s => s.timeStart && isToday(s.timeStart))
    .reduce((sum, s) => sum + (s.actualDuration || 0), 0);
});


const focusTimeText = computed(() => {
  const total = focusSeconds.value;
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);

  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
});
</script>

<style scoped>
.focus-card {
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
    background: #f0fdf4;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-wrapper i {
    color: #50C878;
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