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
                <v-text-field v-model="numeroCuentaUsuario" label="Numero de cuenta del usuario"></v-text-field>
                <v-text-field v-model="correoUsuario" label="Correo del usuario"></v-text-field>
                <v-text-field v-model="contrasenaUsuario" label="Contraseña del usuario"></v-text-field>
                <v-btn color="primary" class="mx-8" @click="agregarUsuario()">
                  Agregar
                </v-btn>
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
import { onMounted, ref } from "vue";

const dialog = ref(false);
const numeroCuentaUsuario = ref("");
const correoUsuario = ref("");
const contrasenaUsuario = ref("");

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
  dialog.value = true;
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
        activateSnack("Usuario creado exitosamente", "success");
        usuarios.value.splice(usuarios.value.length, 0, nuevoUsuario);
        numeroCuentaUsuario.value = "";
        correoUsuario.value = "";
        contrasenaUsuario.value = "";
        dialog.value = false;
      } else {
        activateSnack(response?.data?.replyText ?? "", "accent");
      }
    })
    .catch((err) => {
      console.error("err", err);
      activateSnack("Ocurrió un error", "accent");
    });
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