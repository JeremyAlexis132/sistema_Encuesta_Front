<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h2 class="v-heading text-h2 text-sm-h2 mb-4" color="grey lighten-2">
          404
        </h2>
        <h4 class="text-h4 text-sm-h4 mb-4" color="grey lighten-2">
          Esta página no está disponible
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PageNotFound",
  created() {
    setTimeout(() => {
      this.$router.push({ path: "/" });
    }, 5000);
  },
};
</script>
