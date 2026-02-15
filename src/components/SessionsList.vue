<template>
    <Card class="rounded-2xl border border-neutral-200 shadow-sm">
        <template #title>Simple Card</template>
        <template #content>
            <div>
                <i class="pi pi-calendar"></i>
                <h2>Filter by Date</h2>
            </div>

            <div>
                <Button label="All Time" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
</script>
