<template>
  <div class="card">
    <div class="header">
      <h2>Daily Focus Score</h2>
      <span class="trend" :class="{ negative: trend < 0 }">
        {{ trend >= 0 ? "+" : "" }}{{ trend }} this week
      </span>
    </div>

    <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />

    <div class="stats">
      <div class="stat">
        <span class="label">Today</span>
        <span class="value">{{ today }}</span>
      </div>

      <div class="stat">
        <span class="label">Avg</span>
        <span class="value">{{ avg }}</span>
      </div>

      <div class="stat">
        <span class="label">Trend</span>
        <span class="value" :class="{ negative: trend < 0 }">
          {{ trend >= 0 ? "+" : "" }}{{ trend }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Chart from "primevue/chart";

const scores = [68, 72, 75, 70, 79, 76, 79];

const today = scores[scores.length - 1];
const avg = Math.round(scores.reduce((a, b) => a + b)/scores.length);
const this_week = scores.slice(-3).reduce((a, b) => a + b)/3 //change this to 7 once we have actual data to capture weekly
const last_week = scores.slice(0, 3).reduce((a, b) => a + b)/3
const trend = Math.round(
  this_week - last_week
);

const chartData = ref({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: "Focus Score",
    data: scores,
    fill: true,
    tension: 0.3,
    borderColor: "#10b981",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    pointBackgroundColor: "#10b981",
    pointBorderColor: "#fff",
    pointBorderWidth: 2,
    pointRadius: 4
  }]
});

const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 25 },
      grid: { color: "#f0f0f0" }
    }
  }
});
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  font-size: 30px;
  font-weight: 600;
}

.trend {
  font-size: 20px;
  color: #10b981;
}

.chart {
  height: 300px;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 150px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 13px;
  color: #6b7280;
}

.value {
  font-size: 24px;
  font-weight: 600;
}

/*
.trend.negative {
  color: #ef4444;
}
.value.negative {
  color: #ef4444;
}
*/
</style>