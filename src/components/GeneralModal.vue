<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="model" activator="parent" max-width="650">
      <template v-slot:default="{ isActive }">
        <v-card rounded="lg">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h5 text-medium-emphasis ps-2">
              <slot name="title"></slot>
            </div>

            <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
          </v-card-title>

          <v-divider class="mb-4"></v-divider>

          <v-card-text>
            <slot name="content"></slot>
          </v-card-text>

          <v-card-actions class="my-2 d-flex justify-end">
            <slot name="actions"></slot>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
const model = defineModel()
</script>