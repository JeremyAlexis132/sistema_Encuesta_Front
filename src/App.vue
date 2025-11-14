<template>
  <v-app>
    <v-app-bar
    color="primary"
      elevation="0"
      height="110"
      class="d-none d-md-block header"
      position="0"
    >
      <Header />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import Header from "./components/Header.vue";
</script>
