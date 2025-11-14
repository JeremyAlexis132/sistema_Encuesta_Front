<template>
  <v-sheet class="d-flex flex-column">
    <v-snackbar
      :timeout="2000"
      :color="color"
      v-model:model-value="props.value"
      location="center"
    >
      <v-row justify="center" align="center">
        <v-col cols="3">
          <v-icon size="50">{{ icon }}</v-icon>
        </v-col>
        <v-col cols="9" class="text-h6"> {{ text }} </v-col>
      </v-row>
    </v-snackbar>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "accent",
  },
  value: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "mdi-alert",
  },
});
</script>