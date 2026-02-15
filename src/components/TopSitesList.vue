<template>
    <div class="top-sites-card">
        <h2 class="title">Top Sites</h2>
        <DataTable :value="doms">
            <Column field="domain" header="Domain" bodyStyle="text-align:center"></Column>
            <Column field="timeSpent" header="Time Spent"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="percent" header="% of Total"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const doms = ref([
    {
        domain: "youtube.com",
        timeSpent: "1h 12m",
        category: "Not Productive",
        percent: "25%"
    }
]);

</script>

<style scoped>
.top-sites-card {
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 24px;
    padding: 26px 28px 30px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    width: 100%;
    margin-left: auto;
}

.title {
    margin: 0 0 18px 0;
    font-size: 30px;
    font-weight: bold;
    color: black;
}

</style>