<template>
  <v-layout>
    <v-card class="my-4 mx-4 px-4 py-4" height="auto" max-width="400" width="100%" elevation="5">
      <v-card-title class="my-5 text-wrap">Sistema de encuestas</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="validateForm" v-model="valid">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <v-text-field
                required
                v-model="username"
                :rules="[rules.requerido]"
                label="Usuario"
                preppend-inner-icon="mdi-email"
                variant=outlined
                density="compact"
                maxlength="100"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
            <v-text-field
              required
              v-model="password"
              :rules="[rules.requerido]"
              @click:append-inner="show = !show"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Contraseña"
              variant="outlined"
              density="compact"
              maxlength="100"
              @keyup.enter="validateForm"
            ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <v-btn
                rounded
                color="primary"
                :disabled="!valid"
                block
                @click="validateForm"
              >
                Ingresar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <SnackBar :text="messageAlert" :value="activatorAlert" :color="colorAlert" />
    </v-card>
  </v-layout>
</template>


<script setup>
import { ref } from 'vue'
import { rules } from "@/constants/rules";
import router from "@/router";
import SnackBar from "@/components/SnackBar.vue";
import { userLogin } from "@/services/userServices.mjs";
const username = ref("");
const valid = ref(false);
const password = ref("");
const show = ref(false)

const activatorAlert = ref(false);
const messageAlert = ref("");
const colorAlert = ref("");

  const validateForm = async () => {
    console.log("Intento de login");
    router.push({ path: "/panel" });
    // await userLogin({
    //   usuario: username.value,
    //   password: password.value,
    // })
    // .then((response) =>{
    //   if (response?.data?.replyCode === 200){
    //     sessionStorage.setItem("token", response.data?.data?.token);
    //     activateSnack("Inicio de sesión exitoso", "success");
    //     router.push({ path: "/panel" });
    //     return;
    //   }
    //   activateSnack(response?.data?.replyText ?? "Datos de acceso inválidos", "info");
    // })
    // .catch((error) => {
    //   activateSnack("Ocurrió un error al iniciar sesión", "error");
    // });
  }

const activateSnack = (messageParam, color = "primary") => {
  messageAlert.value = messageParam;
  colorAlert.value = color;
  activatorAlert.value = true;
  setTimeout(() => {
    activatorAlert.value = false;
  }, 5000);
};
</script>
