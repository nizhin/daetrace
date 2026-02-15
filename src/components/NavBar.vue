<template>
    <div class="card">
        <Menubar :model="items">
            <template #end>
                <Button
                    label="Log Out"
                    icon="pi pi-sign-out"
                    severity="secondary"
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
    { label: 'Home Page', icon: 'pi pi-home', route: '/'}, 
    { label: 'Session Activity', icon: 'pi pi-clock', route: '/session'}, 
    { label: 'Edit Categories', icon: 'pi pi-list', route: '/category'},
])

const logout = () => {
    console.log("Logging out...")
}
</script>

<style scoped>
.navbar-wrap {
    padding: 12px 16px 0;
}

.topbar {
    background: #ffffff;
    border: 1px solid;
}

</style>