<template>
    <div class="card relative flex justify-center items-center w-28 h-28">
        <Chart
            type="doughnut" 
            :data="chartData" 
            :options="chartOptions" 
            class="w-28 h-28"
        />
        
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span class="text-3xl font-bold text-neutral-900">{{  score }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

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
