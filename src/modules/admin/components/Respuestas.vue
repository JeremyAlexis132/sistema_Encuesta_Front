<template>
    <v-card class="mx-auto mt-4 mb-4" max-width="800">
      <v-card-title class="text-center grey--text" style="white-space: normal; line-height: 1.3; font-size: 1.1rem;">
        Respuestas de usuarios
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
                <v-btn 
                  color="primary" 
                  size="small" 
                  @click="openModal(item)"
                >
                  Ver respuestas
                </v-btn>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="2" class="text-center">
                No hay encuestas creadas
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
              Estadísticas: {{ encuestaSeleccionada?.nombre }}
            </v-card-title>
            <v-card-text class="mt-4">
              <div v-for="(pregunta, idx) in encuestaSeleccionada?.preguntas" :key="idx" class="mb-8">
                <h3 class="mb-4 text-center">{{ idx + 1 }}. {{ pregunta.texto }}</h3>
                
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="chart-container" style="position: relative; height: 300px;">
                      <Pie :data="getPieChartData(pregunta)" :options="chartOptions" />
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <div v-for="(opcion, opcionIdx) in pregunta.opciones" :key="opcionIdx" class="mb-3">
                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <div 
                            :style="{ backgroundColor: getColor(opcionIdx), width: '20px', height: '20px', borderRadius: '4px' }" 
                            class="mr-2"
                          ></div>
                          <span class="font-weight-medium mr-2">{{ opcion.opcion }}:</span>
                          <v-chip color="primary" size="small">
                            {{ opcion.numero }} respuesta{{ opcion.numero !== 1 ? 's' : '' }}
                          </v-chip>
                        </div>
                        <v-chip color="success" size="small" variant="outlined">
                          {{ calcularPorcentaje(pregunta, opcion.numero) }}%
                        </v-chip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
                
                <v-divider v-if="idx < encuestaSeleccionada.preguntas.length - 1" class="mt-4"></v-divider>
              </div>
              
              <div class="text-center mt-6">
                <v-btn color="primary" @click="cerrarModal()">
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
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  obtenerRespuestasService,
} from "@/services/adminServices.mjs";
import { onMounted, ref} from "vue";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const dialog = ref(false);
const encuestaSeleccionada = ref(null);

const encuestas = ref([]);
const headers = ref([
  { text: "Nombre", value: "nombre" },
]);

// SnackBar
const activator = ref(false);
const message = ref("");
const colorSnack = ref("");

// Colores para las gráficas
const colors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
  '#4BC0C0',
  '#FF6384'
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const dataset = context.dataset;
          const total = dataset.data.reduce((a, b) => a + b, 0);
          
          // Si el total es 0, mostrar el porcentaje equitativo
          if (total === 0 || total === dataset.data.length) {
            const equalPercentage = (100 / dataset.data.length).toFixed(1);
            return `${label}: 0 (${equalPercentage}%)`;
          }
          
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

onMounted(() => {
  obtenerRespuestas();
});

const obtenerRespuestas = async () => {
  await obtenerRespuestasService()
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

const openModal = (encuesta) => {
  encuestaSeleccionada.value = encuesta;
  dialog.value = true;
};

const cerrarModal = () => {
  dialog.value = false;
  encuestaSeleccionada.value = null;
};

const getPieChartData = (pregunta) => {
  const totalVotos = pregunta.opciones.reduce((sum, o) => sum + o.numero, 0);
  
  // Si no hay votos, simular 1 voto para cada opción para dividir equitativamente
  const data = totalVotos === 0 
    ? pregunta.opciones.map(() => 1)
    : pregunta.opciones.map(o => o.numero);
  
  return {
    labels: pregunta.opciones.map(o => o.opcion),
    datasets: [{
      data: data,
      backgroundColor: pregunta.opciones.map((_, idx) => colors[idx % colors.length]),
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };
};

const calcularPorcentaje = (pregunta, numeroRespuestas) => {
  const totalVotos = pregunta.opciones.reduce((sum, o) => sum + o.numero, 0);
  
  // Si no hay votos, dividir equitativamente
  if (totalVotos === 0) {
    return (100 / pregunta.opciones.length).toFixed(1);
  }
  
  return ((numeroRespuestas / totalVotos) * 100).toFixed(1);
};

const getColor = (index) => {
  return colors[index % colors.length];
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