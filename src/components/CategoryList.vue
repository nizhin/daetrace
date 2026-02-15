<template>
    <div class="card">
        <DataTable :value="sessions">
            <Column field="domain" header="Domain"></Column>
            <Column field="timeSpent" header="Time Spent"></Column>
            <Column field="visits" header="Visits"></Column>
            <Column header="Category">
                <template #body="{ data }">
                    <Select
                        v-model="data.category"
                        :options="categoryOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-56"
                        :pt="{
                            root: { class : categoryClass(data.category) },
                            label: { class: 'font-semibold' }
                        }"
                    ></Select>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const sessions = ref([
    {
        domain: "youtube.com",
        timeSpent: "1h 12m",
        visits: "3",
        category: "productive"
    },
]);

const categoryOptions = [
    { label: "Productive", value: "productive"},
    {label: "Not Productive", value: "not_productive"},
    {label: "Not Categorized", value: "not_categorized"},
];

// styling based on category value
const categoryClass = (cat) => {
    if (cat === 'productive') return 'rounded-full bg-emerald-100 text-emerald-700 border-emerald-200' 
    if (cat === 'not_productive') return 'rounded-full bg-red-100 text-red-700 border-red-200' 
    return 'rounded-full bg-gray-100 text-gray-700 border-gray-200'
};

</script>
