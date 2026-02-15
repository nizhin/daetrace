<template>
    <div class="card">
        <Menubar :model="items">
            <template #end>
                <Button
                    label="Log Out"
                    icon="pi pi-sign-out"
                    @click="logout"
                />
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

const items = ref([
    { label: 'Dashboard', icon: 'pi pi-home', route: '/'}, 
    { label: 'Session', icon: 'pi pi-clock', route: '/session'}, 
    { label: 'Category', icon: 'pi pi-list', route: '/category'},
])

const logout = () => {
    console.log("Logging out...")
}
</script>