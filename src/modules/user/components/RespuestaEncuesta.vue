<template>
    <v-card class="mx-auto mt-4 mb-4" max-width="800">
      <v-card-title class="text-center grey--text" style="white-space: normal; line-height: 1.3; font-size: 1.1rem;">
        Encuestas asignadas
      </v-card-title>
      <v-card-text>
        <v-table class="elevation-1" style="min-width: 400px; max-width: 100%;">
          <thead>
            <tr>
              <th class="text-center font-weight-bold">Nombre</th>
              <th class="text-center font-weight-bold">Acciones</th>
            </tr>
          </thead>
          <tbody v-if="encuestas && encuestas.length">
            <tr
              v-for="(item, idx) in encuestas"
              :key="idx"
            >
              <td
                v-for="(header) in headers"
                :key="header.value"
                :class="'text-center'"
              >
                {{ getNestedValue(item, header.value) }}
              </td>
              <td class="text-center">
                <v-btn 
                  v-if="!item.contestada"
                  color="primary" 
                  size="small" 
                  @click="openModal(item)"
                >
                  Responder Encuesta
                </v-btn>
                <span v-else class="text-success font-weight-medium">
                  Encuesta Contestada
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="headers.length" class="text-center">
                No hay encuestas asignadas
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <SnackBar :text="message" :value="activator" :color="colorSnack" />
    </v-card>
    <template v-if="dialog">
      <GeneralModal v-model="dialog">
        <template v-slot:content>
          <v-card>
            <v-card-title class="text-center grey--text" style="white-space: normal;"> 
              Responder Encuesta: {{ encuestaSeleccionada?.Encuestum?.nombre }}
            </v-card-title>
            <v-card-text class="mt-4">
              <v-file-input
                v-model="publicKeyFile"
                label="Selecciona tu archivo de llave pública (.pem)"
                accept=".pem"
                variant="outlined"
                prepend-icon="mdi-key"
                class="mb-4"
                required
                @change="cargarPublicKey"
                :rules="[v => !!v || 'Debes seleccionar tu archivo de llave pública']"
              >
                <template v-slot:selection="{ fileNames }">
                  <v-chip
                    color="primary"
                    label
                    size="small"
                  >
                    {{ fileNames[0] }}
                  </v-chip>
                </template>
              </v-file-input>
              
              <v-alert v-if="publicKey" type="info" variant="tonal" class="mb-4">
                <div class="text-caption">Llave cargada exitosamente</div>
              </v-alert>
              
              <div v-for="(pregunta, idx) in encuestaSeleccionada?.Encuestum?.Pregunta" :key="pregunta.idPregunta" class="mb-6">
                <h3 class="mb-3">{{ idx + 1 }}. {{ pregunta.texto }}</h3>
                <v-radio-group v-model="respuestas[pregunta.idPregunta]">
                  <v-radio
                    v-for="opcion in pregunta.OpcionRespuesta"
                    :key="opcion.idOpcionRespuesta"
                    :label="opcion.opcion"
                    :value="opcion.idOpcionRespuesta"
                    color="primary"
                  ></v-radio>
                </v-radio-group>
              </div>
              
              <div class="text-center mt-6">
                <v-btn 
                  color="primary" 
                  class="mx-2" 
                  @click="guardarRespuestas()"
                  :disabled="!publicKey || publicKey.trim() === ''"
                >
                  Guardar Respuestas
                </v-btn>
                <v-btn color="error" class="mx-2" @click="cerrarModal()">
                  Cancelar
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
  obtenerEncuestaAsignadaService,
  responderEncuestaService,
  generarFirmaService
} from "@/services/userServices.mjs";
import { onMounted, ref} from "vue";

const dialog = ref(false);
const encuestaSeleccionada = ref(null);
const respuestas = ref({});
const publicKey = ref("");
const publicKeyFile = ref(null);

const encuestas = ref([]);
const headers = ref([
  { text: "Nombre", value: "Encuestum.nombre" },
]);

// SnackBar
const activator = ref(false);
const message = ref("");
const colorSnack = ref("");

onMounted(() => {
  obtenerEncuestas();
});

const obtenerEncuestas = async () => {
  await obtenerEncuestaAsignadaService()
    .then((response) => {
      if (response?.request?.status === 200) {
        const user =  response?.data?.encuestasAsignadas;
        encuestas.value = user
        return;
      }
      activateSnack(response?.data?.replyText ?? "", "accent");
    })
    .catch((err) => {
      console.error("err", err);
      activateSnack("Ocurrió un error", "accent");
    });
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((value, key) => value?.[key], obj);
};

const openModal = (encuesta) => {
  encuestaSeleccionada.value = encuesta;
  respuestas.value = {};
  publicKey.value = "";
  publicKeyFile.value = null;
  dialog.value = true;
};

const cerrarModal = () => {
  dialog.value = false;
  encuestaSeleccionada.value = null;
  respuestas.value = {};
  publicKey.value = "";
  publicKeyFile.value = null;
};

const cargarPublicKey = async (event) => {
  const file = event.target.files?.[0] || publicKeyFile.value?.[0];
  
  if (!file) {
    publicKey.value = "";
    return;
  }
  
  // Validar que sea un archivo .pem
  if (!file.name.endsWith('.pem')) {
    activateSnack("Por favor selecciona un archivo .pem válido", "accent");
    publicKey.value = "";
    publicKeyFile.value = null;
    return;
  }
  
  try {
    // Leer el contenido del archivo
    const fileContent = await file.text();
    publicKey.value = fileContent;
    activateSnack("Llave cargada exitosamente", "success");
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    activateSnack("Error al leer el archivo de llave", "accent");
    publicKey.value = "";
    publicKeyFile.value = null;
  }
};

const guardarRespuestas = async () => {
  // Validar que todas las preguntas tengan respuesta
  const preguntas = encuestaSeleccionada.value?.Encuestum?.Pregunta || [];
  
  for (let pregunta of preguntas) {
    if (!respuestas.value[pregunta.idPregunta]) {
      activateSnack(`Por favor, responde la pregunta: "${pregunta.texto}"`, "accent");
      return;
    }
  }
  
  // Validar que se haya ingresado la publicKey
  if (!publicKey.value || publicKey.value.trim() === '') {
    activateSnack("Por favor, ingresa tu llave de acceso", "accent");
    return;
  }
  
  // Crear arreglo de respuestas
  const respuestasArray = preguntas.map(pregunta => ({
    idPregunta: pregunta.idPregunta,
    idOpcionRespuesta: respuestas.value[pregunta.idPregunta]
  }));
  
  try {
    // Paso 1: Solicitar firma al servidor
    activateSnack("Generando firma...", "info");
    
    const firmaResponse = await generarFirmaService({
      publicKey: publicKey.value,
      data: respuestasArray
    });
    
    if (firmaResponse?.status !== 200 || !firmaResponse?.data?.firma) {
      activateSnack(firmaResponse?.data?.error || "Error al generar la firma", "accent");
      return;
    }
    
    const firma = firmaResponse.data.firma;
    
    // Paso 2: Enviar respuestas con la firma generada
    activateSnack("Enviando respuestas...", "info");
    
    const response = await responderEncuestaService({
      publicKey: publicKey.value,
      firma: firma,
      data: respuestasArray
    });
    
    if (response?.status === 200) {
      activateSnack("Respuestas guardadas exitosamente", "success");
      await recargaData();
      cerrarModal();
    } else {
      activateSnack(response?.data?.error || "Error al guardar las respuestas", "accent");
    }
  } catch (err) {
    console.error("Error en guardarRespuestas:", err);
    activateSnack("Ocurrió un error al procesar las respuestas", "accent");
  }
};

const recargaData = async () => {
  await obtenerEncuestas();
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