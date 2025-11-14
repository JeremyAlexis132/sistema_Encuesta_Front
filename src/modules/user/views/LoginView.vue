<template>
  <v-container>
    <v-row
      class="text-center d-flex d-md-none justify-center align-center mt-10"
    >
      <v-col cols="12" md="6" lg="4" xl="4">
        <v-card class="mb-10" elevation="0">
          <!--Contenido que se muestra solo en responsive-->
          <div class="d-flex d-md-none">
            <v-row align="center" justify="center">
              <v-col>
                <div class="font-weight-bold text-h6 text-sm-h5 my-2">
                  Criptografía
                </div>
                <div class="font-weight-bold text-h6 text-sm-h5 my-2">
                  Sistema de encuestas
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center" justify="center">
      <v-col cols="12" md="6" lg="4" xl="4">
        <Login />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Login from "../components/Login.vue";
</script>
