<template>
  <!-- Single-level navigation item -->
  <v-list-item
    :title="item.name || item.title"
    :prepend-icon="item.icon || 'mdi-subdirectory-arrow-right'"
    class="text-caption wrap-title"
    :class="{ 'v-list-item--active': isActive }"
    @click="() => item.path && router.push(item.path)"
  />
</template>

<script setup>
import { defineProps, computed } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";

const props = defineProps({
  item: Object,
});

const route = useRoute();

const isActive = computed(() => {
  if (!props.item || !props.item.path) return false;
  const itemPath = props.item.path.startsWith('/') ? props.item.path : `/${props.item.path}`;
  return itemPath === route.path;
});
</script>

<style scoped>
.wrap-title .v-list-item-title {
  white-space: normal !important;
  line-height: 1.2;
}

/* Estilo para el item activo */
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-item--active .v-list-item-title {
  font-weight: 600;
}
</style>