<template>
    <Card class="focus-card">
        <template #content>
            <div class="card-row">
                <div class="icon-wrapper">
                    <i class="pi pi-bullseye text-green-500 text-lg"></i>
                </div>
                <div class="text-wrapper">
                    <div class="title-text">Focus Time</div>
                    <div class="time-text">3h 9m</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card'
</script>

<style scoped>
.focus-card {
    border-radius: 18px;
    padding: 18px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    width: 30%;
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
