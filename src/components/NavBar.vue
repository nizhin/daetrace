<template>
    <div class="card">
        <Menubar :model="items" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
    { label: 'Dashboard', icon: 'pi pi-home', route: '/'}, 
    { label: 'Session', icon: 'pi pi-clock', route: '/session'}, 
    { label: 'Category', icon: 'pi pi-list', route: '/category'},
])
</script>