<template>
    <v-card class="mx-auto mt-4 mb-4" max-width="800">
      <v-card-title class="text-center grey--text" style="white-space: normal; line-height: 1.3; font-size: 1.1rem;">
        Encuestas del sistema
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
                {{ item[header.value] }}
              </td>
              <td class="text-center">
                <v-btn color="primary" size="small" @click="asignarEncuesta(item)">
                  Asignar
                </v-btn>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="2" class="text-center">
                No hay encuestas registrados
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <SnackBar :text="message" :value="activator" :color="colorSnack" />
      <div class="text-center">
        <v-btn color="primary" class="my-4" @click="openModal()">Agrega una nueva encuesta</v-btn>
      </div>
    </v-card>
    <template v-if="dialog">
      <GeneralModal v-model="dialog">
        <template v-slot:content>
          <v-card>
            <v-card-title class="text-center grey--text" style="white-space: normal;"> Registra una encuesta</v-card-title>
            <v-card-text class="mt-4">
                <v-text-field v-model="nombreEncuesta" label="Nombre de la encuesta" class="mb-4"></v-text-field>
                
                <div v-for="(pregunta, preguntaIdx) in preguntas" :key="preguntaIdx" class="mb-6 pa-4" style="border: 1px solid #e0e0e0; border-radius: 4px;">
                  <v-text-field v-model="pregunta.texto" :label="'Pregunta ' + (preguntaIdx + 1)" class="mb-3"></v-text-field>
                  
                  <div v-for="(respuesta, respuestaIdx) in pregunta.respuestas" :key="respuestaIdx" class="mb-2">
                    <v-text-field v-model="pregunta.respuestas[respuestaIdx]" :label="'Respuesta ' + (respuestaIdx + 1)" dense></v-text-field>
                  </div>
                  
                  <v-btn color="secondary" size="small" class="mt-2" @click="agregarRespuesta(preguntaIdx)">
                    Agregar Respuesta
                  </v-btn>
                </div>
                
                <v-btn color="info" class="mb-4" @click="agregarPregunta()">
                  Agregar Pregunta
                </v-btn>
                
                <div class="text-center mt-6">
                  <v-btn color="primary" class="mx-2" @click="agregarEncuesta()">
                    Crear Encuesta
                  </v-btn>
                  <v-btn color="error" class="mx-2" @click="dialog = false">
                    Cancelar
                  </v-btn>
                </div>
              </v-card-text>
          </v-card>
        </template>
      </GeneralModal>
    </template>
    <template v-if="dialogAsignar">
      <GeneralModal v-model="dialogAsignar">
        <template v-slot:content>
          <v-card>
            <v-card-title class="text-center grey--text" style="white-space: normal;"> Asignar Encuesta: {{ encuestaSeleccionada?.nombre }}</v-card-title>
            <v-card-text class="mt-4">
                <v-autocomplete
                  v-model="usuarioSeleccionado"
                  :items="usuariosDisponibles"
                  item-title="numeroCuenta"
                  item-value="id"
                  label="Seleccionar Usuario"
                  class="mb-4"
                  return-object
                ></v-autocomplete>
                
                <v-btn color="info" class="mb-4" @click="agregarUsuarioAsignado()" :disabled="!usuarioSeleccionado">
                  Asignar usuario
                </v-btn>
                
                <div v-if="usuariosAsignados.length > 0" class="mt-4">
                  <h3 class="mb-3">Usuarios Asignados:</h3>
                  <v-chip
                    v-for="(usuario, idx) in usuariosAsignados"
                    :key="idx"
                    closable
                    @click:close="removerUsuarioAsignado(idx)"
                    class="ma-1"
                    color="primary"
                  >
                    {{ usuario.numeroCuenta }}
                  </v-chip>
                </div>
                
                <div class="text-center mt-6">
                  <v-btn color="primary" class="mx-2" @click="guardarCambios()">
                    Guardar Cambios
                  </v-btn>
                  <v-btn color="error" class="mx-2" @click="cerrarModalAsignar()">
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
  obtenerEncuestasService,
  obtenerUsuariosService,
  crearEncuestaService,
  asignarEncuestaService
} from "@/services/adminServices.mjs";
import { onMounted, ref, computed } from "vue";

const dialog = ref(false);
const dialogAsignar = ref(false);
const nombreEncuesta = ref("");
const preguntas = ref([
  {
    texto: "",
    respuestas: ["", ""]
  }
]);

const usuarios = ref([]);
const usuariosAsignados = ref([]);
const usuarioSeleccionado = ref(null);
const encuestaSeleccionada = ref(null);
const encuestas = ref([]);
const headers = ref([
  { text: "Nombre", value: "nombre" },
]);

// Computed para usuarios disponibles (excluyendo los ya asignados y los que ya tienen la encuesta)
const usuariosDisponibles = computed(() => {
  // IDs de usuarios que están en el arreglo temporal de asignación
  const idsAsignados = usuariosAsignados.value.map(u => u.idUsuario);
  
  // IDs de usuarios que ya tienen asignada esta encuesta (de EncuestaAsignadas)
  const idsYaAsignados = encuestaSeleccionada.value?.EncuestaAsignadas 
    ? encuestaSeleccionada.value.EncuestaAsignadas.map(ea => ea.idUsuario)
    : [];
  
  // Combinar ambos arreglos de IDs a excluir
  const todosLosIdsExcluidos = [...idsAsignados, ...idsYaAsignados];
  
  // Filtrar usuarios que no estén en ninguno de los dos arreglos
  return usuarios.value.filter(u => !todosLosIdsExcluidos.includes(u.idUsuario));
});

// SnackBar
const activator = ref(false);
const message = ref("");
const colorSnack = ref("");

onMounted(() => {
  obtenerEncuestas();
  obtenerUsuarios();
});

const obtenerEncuestas = async () => {
  await obtenerEncuestasService({
  })
    .then((response) => {
      if (response?.request?.status === 200) {
        const user =  response?.data?.encuestas;
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
  nombreEncuesta.value = "";
  preguntas.value = [
    {
      texto: "",
      respuestas: ["", ""]
    }
  ];
  dialog.value = true;
};

const agregarPregunta = () => {
  preguntas.value.push({
    texto: "",
    respuestas: ["", ""]
  });
};

const agregarRespuesta = (preguntaIdx) => {
  preguntas.value[preguntaIdx].respuestas.push("");
};

const agregarEncuesta = () => {
  // Validar que el nombre no esté vacío
  if (nombreEncuesta.value.trim() === "") {
    activateSnack("Por favor, ingresa el nombre de la encuesta.", "accent");
    return;
  }
  
  // Validar que haya al menos una pregunta
  if (preguntas.value.length === 0) {
    activateSnack("Debes agregar al menos una pregunta.", "accent");
    return;
  }
  
  // Validar que todas las preguntas tengan texto y respuestas
  for (let i = 0; i < preguntas.value.length; i++) {
    if (preguntas.value[i].texto.trim() === "") {
      activateSnack(`La pregunta ${i + 1} no puede estar vacía.`, "accent");
      return;
    }
    
    // Validar que tenga al menos 2 respuestas no vacías
    const respuestasValidas = preguntas.value[i].respuestas.filter(r => r.trim() !== "");
    if (respuestasValidas.length < 2) {
      activateSnack(`La pregunta ${i + 1} debe tener al menos 2 respuestas.`, "accent");
      return;
    }
  }
  
  // Preparar datos de la encuesta
  const nuevaEncuesta = {
    nombre: nombreEncuesta.value,
    preguntas: preguntas.value.map(p => ({
      texto: p.texto,
      respuestas: p.respuestas.filter(r => r.trim() !== "")
    }))
  };
  
  crearEncuestaService({ encuesta: nuevaEncuesta })
  .then((response) => {
    if (response?.request?.status === 201) {
        activateSnack("Encuesta creada exitosamente", "success");
        obtenerEncuestas();
        dialog.value = false;
      } else {
        activateSnack(response?.data?.replyText ?? "", "accent");
      }
    })
    .catch((err) => {
      console.error("err", err);
      activateSnack("Ocurrió un error", "accent");
    });
  
  // Por ahora solo mostrar mensaje de éxito
  activateSnack("Encuesta creada exitosamente", "success");
  dialog.value = false;
};

const asignarEncuesta = (encuesta) => {
  encuestaSeleccionada.value = encuesta;
  usuariosAsignados.value = [];
  usuarioSeleccionado.value = null;
  dialogAsignar.value = true;
};

const agregarUsuarioAsignado = () => {
  if (!usuarioSeleccionado.value) {
    activateSnack("Por favor, selecciona un usuario.", "accent");
    return;
  }
  
  // Agregar el usuario a la lista de asignados
  usuariosAsignados.value.push({...usuarioSeleccionado.value});
  
  // Limpiar la selección
  usuarioSeleccionado.value = null;
};

const removerUsuarioAsignado = (idx) => {
  usuariosAsignados.value.splice(idx, 1);
};

const cerrarModalAsignar = () => {
  dialogAsignar.value = false;
  encuestaSeleccionada.value = null;
  usuariosAsignados.value = [];
  usuarioSeleccionado.value = null;
};

const guardarCambios = async () => {
  if (usuariosAsignados.value.length === 0) {
    activateSnack("Debes asignar al menos un usuario.", "accent");
    return;
  }

  const idEncuesta = encuestaSeleccionada.value.idEncuesta;
  
  try {
    // Enviar una petición por cada usuario asignado
    const promesas = usuariosAsignados.value.map((usuario) => {
      return asignarEncuestaService({
        idEncuesta: idEncuesta,
        idUsuario: usuario.idUsuario
      });
    });

    // Esperar a que todas las peticiones se completen
    const resultados = await Promise.all(promesas);
    
    // Verificar que todas las peticiones fueron exitosas
    const todasExitosas = resultados.every(response => response?.request?.status === 201 || response?.request?.status === 200);
    
    if (todasExitosas) {
      activateSnack("Asignaciones guardadas exitosamente", "success");
      // Recargar encuestas para actualizar EncuestaAsignadas
      await obtenerEncuestas();
      cerrarModalAsignar();
    } else {
      activateSnack("Algunas asignaciones fallaron", "accent");
    }
  } catch (err) {
    console.error("Error al asignar encuestas:", err);
    activateSnack("Ocurrió un error al asignar las encuestas", "accent");
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