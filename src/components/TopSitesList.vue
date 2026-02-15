<template>
    <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="domain" header="Domain"></Column>
            <Column field="timeSpent" header="Time Spent"></Column>
            <Column field="Category" header="Category"></Column>
            <Column field="percent" header="% of Total"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sessions = ref([
    {
        domain: "youtube.com",
        timeSpent: "1h 12m",
        category: "Not Productive",
        percent: "25%"
    }
]);

</script>
