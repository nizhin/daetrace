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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";
import Button from "primevue/button";

const router = useRouter();

const items = ref([
  {
    label: "Home Page",
    icon: "pi pi-home",
    command: () => router.push("/")
  },
  {
    label: "Session Activity",
    icon: "pi pi-clock",
    command: () => router.push("/session")
  },
  {
    label: "Edit Categories",
    icon: "pi pi-list",
    command: () => router.push("/category")
  }
]);

const logout = () => {
  router.push("/login");
};
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