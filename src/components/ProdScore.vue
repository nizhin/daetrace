<template>
    <div class="prod-score-card">
        <div class="ring-wrap">
            <Chart
                type="doughnut" 
                :data="chartData" 
                :options="chartOptions" 
                class="ring"
            />
        </div>
        <div class="ring-center">
            <span class="ring-score">{{  score }}</span>
        </div>
    </div>

    <div class="content">
        <div class="title-row">
            <i class="pi pi-chart-line title-icon"></i>
            <span class="title">Productivity Score</span>
        </div>
        <div class="desc">
            Higher is better. based on time spent on productive sites.
        </div>
        <div class="toggle">
            <button class="today active">Today</button>
            <span class="divider"></span>
            <button class="average">Average</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from 'primevue/chart';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref(null);
const score = ref(79);

// score
watch(score, () => {
    chartData.value = setChartData();
})

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Score', 'Remaining'],
        datasets: [
            {
                data: [score.value, 100 - score.value],
                backgroundColor: [green, gray],
                hoverBackgroundColor: [green, gray]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                    color: textColor
                }
            }
        }
    };
};
</script>

<style scoped>
.prod-score-card {
    border-radius: 18px;
    padding: 18px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    width: 30%;
    margin-left: auto;
    align-items: center;
}

.ring-wrap {
    position: relative;
    width: 110px;
    height: 110px;
    flex: 0 0 auto;
}

.ring {
    width: 110px;
    height: 110px;
}

.ring-center {
    position: absolute;
    /* inset: 0; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* pointer-events: none; */
}

.ring-score {
    font-size: 32px;
    font-weight: bold;
    color: #111;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.title-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.title-icon {
    color: #10b981;
    font-size: 17px;
}

</style>
