<template>
    <div class="card flex justify-center">
        <Chart 
            type="doughnut" 
            :data="chartData" 
            :options="chartOptions" 
            class="w-full md:w-[30rem]" 
        />

        <div class="absolute inset=0 flex flex-col items-center justify-center pointer-events-none">
            <p class="text-2xl font-semibold text-neutral-900">
                6h 32m
            </p>
            <p class="text-sm text-neutral-500">Total Today</p>
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
