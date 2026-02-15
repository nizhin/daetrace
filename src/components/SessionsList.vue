<template>
    <Card class="rounded-2xl border border-neutral-200 shadow-sm">
        <template #title>Simple Card</template>
        <template #content>
            <div class="flex items-center">
                <i class="pi pi-calendar text-xl text-neutral-700"></i>
                <h2 class="text-xl font-semibold text-neutral-900">Filter by Date</h2>
            </div>

            <div class="flex flex-wrap items-center gap-3">
                <Button
                    label="All Time"
                    class="rounded-xl"
                    :severity="selected"
                >
                </Button>
            </div>
        </template>
    </Card>
</template>

<script setup>
</script>
