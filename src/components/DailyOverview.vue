<template>
    <div class="overview-card">
        <h2 class="card-title">Daily Overview</h2>

        <div class="content">
            <div class="doughnut-wrap">
                <Chart 
                    type="doughnut" 
                    :data="chartData" 
                    :options="chartOptions" 
                    class="donut" 
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref(null);

const prod = 100;
const notProd = 50;
const notCat = 20;

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['Productive', 'Not Productive', 'Not Categorized'],
        datasets: [
            {
                data: [prod, notProd, notCat],
                backgroundColor: [documentStyle.getPropertyValue('--p-green-500'), documentStyle.getPropertyValue('--p-red-500'), documentStyle.getPropertyValue('--p-gray-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--p-green-400'), documentStyle.getPropertyValue('--p-red-400'), documentStyle.getPropertyValue('--p-gray-400')],
                borderWidth: 0
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
.overview-card {
    background: white;
    border: 1px solid #eee;
    border-radius: 22px;
    padding: 26px 28px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    min-height: 420px;
}

.card-title {
    margin: 0 0 18px 0;
    font-size: 30px;
    font-weight: 800;
    color: black;
}

.content {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 38px;
    align-items: center;
}

.doughnut-wrap {
    position: relative;
    width: 240px;
    height: 240px;
    margin-left: 12px;
}

</style>