<template>
  <v-list density="compact" nav>
    <!-- Panel inicial -->
    <v-list-item
      prepend-icon="mdi-home"
      title="Inicio"
      class="text-body-2 mt-4"
      :class="{ 'v-list-item--active': route.path === '/panel' }"
      @click="() => router.push('/panel')"
    />

    <!-- Items de navegación: un solo nivel -->
    <v-list-item
      v-for="(item, i) in paths"
      :key="i"
      :title="item.name || item.title"
      :prepend-icon="item.icon || 'mdi-subdirectory-arrow-right'"
      class="text-caption mt-2"
      :class="{ 'v-list-item--active': isActive(item) }"
      @click="() => item.path && router.push(item.path)"
    />

    <!-- Cerrar sesión -->
    <v-list-item
      prepend-icon="mdi-logout"
      title="Cerrar Sesión"
      class="text-body-2 mt-4"
      @click="logout()"
    />
  </v-list>
</template>

<script setup>
import { logout } from "@/helpers/functions";
import router from "@/router";
import { useRoute } from "vue-router";

const props = defineProps({
  paths: {
    type: Array,
    required: true,
  },
});

const route = useRoute();

function normalizePath(p) {
  if (!p) return "";
  return p.startsWith("/") ? p : `/${p}`;
}

function isActive(item) {
  if (!item || !item.path) return false;
  return normalizePath(item.path) === route.path;
}
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-item--active .v-list-item-title {
  font-weight: 600;
}
</style>