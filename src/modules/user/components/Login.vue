<template>
  <v-layout>
    <v-card class="my-4 mx-4 px-4 py-4" height="auto" max-width="400" width="100%" elevation="5">
      <v-card-title class="my-5 text-wrap">Sistema de encuestas</v-card-title>
      
      <v-tabs v-model="tab" color="primary" align-tabs="center">
        <v-tab value="login">Iniciar Sesión</v-tab>
        <v-tab value="register">Registrarse</v-tab>
      </v-tabs>
      
      <v-card-text>
        <v-window v-model="tab">
          <!-- Tab de Login -->
          <v-window-item value="login">
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
          </v-window-item>
          
          <!-- Tab de Registro -->
          <v-window-item value="register">
            <div v-if="!publicKey" class="mt-4">
              <v-text-field 
                v-model="numeroCuentaUsuario" 
                label="Numero de cuenta del usuario"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-text-field 
                v-model="correoUsuario" 
                label="Correo del usuario"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-text-field 
                v-model="contrasenaUsuario" 
                label="Contraseña del usuario" 
                type="password"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-btn color="primary" block @click="agregarUsuario()">
                Registrar
              </v-btn>
            </div>
            
            <div v-else class="pa-2 mt-4">
              <v-alert type="success" variant="tonal" class="mb-4">
                <v-alert-title class="text-subtitle-1 mb-2">Usuario creado exitosamente</v-alert-title>
                <div class="text-caption">La llave pública ha sido generada. Descarga el archivo y guárdalo en un lugar seguro.</div>
              </v-alert>
              
              <v-card variant="outlined" class="pa-3 mb-4">
                <div class="text-caption mb-2 font-weight-bold">Información del Usuario:</div>
                <div class="text-caption mb-1">
                  <strong>Número de Cuenta:</strong> {{ publicKeyData.usuario?.numeroCuenta }}
                </div>
                <div class="text-caption mb-3">
                  <strong>Correo:</strong> {{ publicKeyData.usuario?.correo }}
                </div>
                <div class="text-caption mb-2 font-weight-bold">Archivo de Llave Pública:</div>
                <div class="text-caption mb-3" style="font-family: monospace; word-break: break-all;">
                  {{ publicKeyData.publicKeyFile }}
                </div>
                <v-btn 
                  color="primary" 
                  prepend-icon="mdi-download"
                  @click="descargarPublicKey()"
                  block
                  size="small"
                >
                  Descargar Llave Pública
                </v-btn>
              </v-card>
              
              <v-btn color="success" block @click="cerrarRegistro()">
                Ir a Iniciar Sesión
              </v-btn>
            </div>
          </v-window-item>
        </v-window>
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
import { userLogin, crearUsuarioService } from "@/services/userServices.mjs";
import { baseURL } from "@/general";

const tab = ref("login");
const username = ref("");
const valid = ref(false);
const password = ref("");
const show = ref(false);

// Variables para registro
const numeroCuentaUsuario = ref("");
const correoUsuario = ref("");
const contrasenaUsuario = ref("");
const publicKey = ref("");
const publicKeyData = ref(null);

const activatorAlert = ref(false);
const messageAlert = ref("");
const colorAlert = ref("");

  const validateForm = async () => {
    await userLogin({
      numeroCuenta: username.value,
      password: password.value,
    })
    .then((response) =>{
      if (response?.request?.status === 200){
        sessionStorage.setItem("token", response.data?.token);
        activateSnack("Inicio de sesión exitoso", "success");
        router.push({ path: "/panel" });
        return;
      }
      activateSnack(response?.data?.replyText ?? "Datos de acceso inválidos", "info");
    })
    .catch((error) => {
      activateSnack("Ocurrió un error al iniciar sesión", "error");
    });
  }

const agregarUsuario = () => {
  if (numeroCuentaUsuario.value.trim() === "" || correoUsuario.value.trim() === "" || contrasenaUsuario.value.trim() === "") {
    activateSnack("Por favor, ingresa todos los datos.", "accent");
    return;
  }
  const nuevoUsuario = {
    numeroCuenta: numeroCuentaUsuario.value,
    correo: correoUsuario.value,
    contrasenaUsuario: contrasenaUsuario.value,
  };
  crearUsuarioService({
    numeroCuenta: nuevoUsuario.numeroCuenta,
    correo: nuevoUsuario.correo,
    password: nuevoUsuario.contrasenaUsuario,
  })
    .then((response) => {
      if (response?.request?.status === 201) {
        publicKey.value = "success";
        publicKeyData.value = {
          usuario: response?.data?.usuario,
          publicKeyUrl: response?.data?.publicKeyUrl,
          publicKeyFile: response?.data?.publicKeyFile
        };
        activateSnack("Usuario creado exitosamente", "success");
      } else {
        activateSnack(response?.data?.replyText ?? "", "accent");
      }
    })
    .catch((err) => {
      console.error("err", err);
      activateSnack("Ocurrió un error", "accent");
    });
};

const descargarPublicKey = () => {
  if (publicKeyData.value?.publicKeyUrl) {
    const url = baseURL + publicKeyData.value.publicKeyUrl;
    const link = document.createElement('a');
    link.href = url;
    link.download = publicKeyData.value.publicKeyFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    activateSnack("Descargando llave pública...", "info");
  }
};

const cerrarRegistro = () => {
  numeroCuentaUsuario.value = "";
  correoUsuario.value = "";
  contrasenaUsuario.value = "";
  publicKey.value = "";
  publicKeyData.value = null;
  tab.value = "login";
};

const activateSnack = (messageParam, color = "primary") => {
  messageAlert.value = messageParam;
  colorAlert.value = color;
  activatorAlert.value = true;
  setTimeout(() => {
    activatorAlert.value = false;
  }, 5000);
};
</script>
