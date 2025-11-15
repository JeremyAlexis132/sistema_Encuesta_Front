<template>
  <div>
    <v-navigation-drawer expand-on-hover permanent rail max-width="400" width="100%">
      <v-list>
        <v-list-item prepend-avatar="@/assets/profile.png">
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

        <NavBar :paths="ADMIN_PATHS" />

    </v-navigation-drawer>
    <main class="px-15 py-5" >
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { ADMIN_PATHS } from "@/constants/paths";

</script>