<template>
    <v-card class="mx-auto mt-4 mb-4" max-width="800">
      <v-card-title class="text-center grey--text" style="white-space: normal; line-height: 1.3; font-size: 1.1rem;">
        Usuarios del sistema
      </v-card-title>
      <v-card-text>
        <v-table class="elevation-1" style="min-width: 400px; max-width: 100%;">
          <thead>
            <tr>
              <th class="text-center font-weight-bold">Numero de cuenta</th>
              <th class="text-center font-weight-bold">Correo</th>
            </tr>
          </thead>
          <tbody v-if="usuarios && usuarios.length">
            <tr
              v-for="(item, idx) in usuarios"
              :key="idx"
            >
              <td
                v-for="(header) in headers"
                :key="header.value"
                :class="'text-center'"
              >
                {{ item[header.value] }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="headers.length" class="text-center">
                No hay usuarios registrados
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <h4 class="text-center grey--text my-4" style="white-space: normal; line-height: 1.3;">
        Total de usuarios registrados en el sistema = {{ usuarios.length }}   
      </h4>
      <SnackBar :text="message" :value="activator" :color="colorSnack" />
      <div class="text-center">
        <v-btn color="primary" class="my-4" @click="openModal()">Agrega un nuevo usuario</v-btn>
      </div>
    </v-card>
    <template v-if="dialog">
      <GeneralModal v-model="dialog">
        <template v-slot:content>
          <v-card>
            <v-card-title class="text-center grey--text" style="white-space: normal;"> Registra un usuario</v-card-title>
            <v-card-text class="mt-10 text-center">
                <div v-if="!publicKey">
                  <v-text-field v-model="numeroCuentaUsuario" label="Numero de cuenta del usuario"></v-text-field>
                  <v-text-field v-model="correoUsuario" label="Correo del usuario"></v-text-field>
                  <v-text-field v-model="contrasenaUsuario" label="Contraseña del usuario" type="password"></v-text-field>
                  <v-btn color="primary" class="mx-8" @click="agregarUsuario()">
                    Agregar
                  </v-btn>
                </div>
                
                <div v-else class="pa-4">
                  <v-alert type="success" variant="tonal" class="mb-4">
                    <v-alert-title class="text-h6 mb-2">Usuario creado exitosamente</v-alert-title>
                    La llave pública ha sido generada. Descarga el archivo y guárdalo en un lugar seguro.
                  </v-alert>
                  
                  <v-card variant="outlined" class="pa-4 mb-4">
                    <div class="text-subtitle-2 mb-2 font-weight-bold">Información del Usuario:</div>
                    <div class="mb-2">
                      <strong>Número de Cuenta:</strong> {{ publicKeyData.usuario?.numeroCuenta }}
                    </div>
                    <div class="mb-3">
                      <strong>Correo:</strong> {{ publicKeyData.usuario?.correo }}
                    </div>
                    <div class="text-subtitle-2 mb-2 font-weight-bold">Archivo de Llave Pública:</div>
                    <div class="text-body-2 mb-3" style="font-family: monospace;">
                      {{ publicKeyData.publicKeyFile }}
                    </div>
                    <v-btn 
                      color="primary" 
                      prepend-icon="mdi-download"
                      @click="descargarPublicKey()"
                      block
                    >
                      Descargar Llave Pública
                    </v-btn>
                  </v-card>
                  
                  <v-btn color="success" @click="cerrarModal()">
                    Cerrar
                  </v-btn>
                </div>
              </v-card-text>
          </v-card>
        </template>
      </GeneralModal>
    </template>
</template>

<script setup>
import GeneralModal from "@/components/GeneralModal.vue";

import SnackBar from "@/components/SnackBar.vue";
import {
  obtenerUsuariosService,
  crearUsuarioService,
} from "@/services/adminServices.mjs";
import { baseURL } from "@/general";
import { onMounted, ref } from "vue";

const dialog = ref(false);
const numeroCuentaUsuario = ref("");
const correoUsuario = ref("");
const contrasenaUsuario = ref("");
const publicKey = ref("");
const publicKeyData = ref(null);

const usuarios = ref([]);
const headers = ref([
  { text: "Numero de cuenta", value: "numeroCuenta" },
  { text: "Correo", value: "correo" },
]);
// SnackBar
const activator = ref(false);
const message = ref("");
const colorSnack = ref("");

onMounted(() => {
  obtenerUsuarios();
});

const obtenerUsuarios = async () => {
  await obtenerUsuariosService({
  })
    .then((response) => {
      if (response?.request?.status === 200) {
        const user =  response?.data?.usuarios;
        usuarios.value = user
        return;
      }
      activateSnack(response?.data?.replyText ?? "", "accent");
    })
    .catch((err) => {
      console.error("err", err);
      activateSnack("Ocurrió un error", "accent");
    });
};

const openModal = () => {
  numeroCuentaUsuario.value = "";
  correoUsuario.value = "";
  contrasenaUsuario.value = "";
  publicKey.value = "";
  publicKeyData.value = null;
  dialog.value = true;
};

const cerrarModal = () => {
  numeroCuentaUsuario.value = "";
  correoUsuario.value = "";
  contrasenaUsuario.value = "";
  publicKey.value = "";
  publicKeyData.value = null;
  dialog.value = false;
};

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
        console.log("response", response?.data);
        activateSnack("Usuario creado exitosamente", "success");
        obtenerUsuarios();
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

const activateSnack = (messageParam, color = "primary") => {
  message.value = messageParam;
  colorSnack.value = color;
  activator.value = true;
  setTimeout(() => {
    activator.value = false;
  }, 5000);
};

</script>