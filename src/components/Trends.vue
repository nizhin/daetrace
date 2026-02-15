<template>
  <div class="card">
    <h2>Weekly Activity Trends</h2>
    <Chart type="line" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Chart from "primevue/chart";

const chartData = ref({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Productive",
      data: [200, 240, 60, 160, 180, 165, 220],
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      tension: 0.4,
      pointRadius: 4
    },
    {
      label: "Not Productive",
      data: [20, 24, 160, 10, 80, 65, 50],
      borderColor: "#ef4444",
      backgroundColor: "#ef4444",
      tension: 0.4,
      pointRadius: 4
    },
    {
      label: "Uncategorized",
      data: [30, 44, 16, 100, 58, 35, 20],
      borderColor: "#9ca3af",
      backgroundColor: "#9ca3af",
      tension: 0.4,
      pointRadius: 4
    }
  ]
});

const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} mins`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value} mins`
      },
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
}

h2 {
  margin: 0 0 16px 0;
  font-size: 30px;
  font-weight: 600;
}

.chart {
  height: 300px;
}
</style>