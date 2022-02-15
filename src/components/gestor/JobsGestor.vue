<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Jobs</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <div>
      <v-card elevation="0">
        <v-row class="panelFuncionesCard">
          <v-col cols="12" md="8">
    
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="textField"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-data-table
        class="dataTable"
        v-model="selected"
        :headers="jobHeaders"
        :items="jobs"
        :search="search"
        item-key="job"
        show-select
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            {{ item.estado }}
          </v-chip>
        </template>

        <template v-slot:[`item.bloqueado`]="{ item }">
          <v-icon v-if="item.bloqueado === false" color="red">
              mdi-cancel
          </v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {getColor} from "@/assets/mixins/getColor";

export default {
  name: "JobsGestor",
  mixins: [getColor],
  data() {
    return {
      selected: [],
      jobs: [],
      search: "",
      jobHeaders: [
        { text: "Estado", align: "start", sortable: true, value: "estado"},
        { text: "Bloq.", align: "start", sortable: true, value: "bloqueado" },
        { text: "Expediente", align: "start", sortable: true, value: "expediente"},
        { text: "Job", align: "start", sortable: true, value: "job" },
        { text: "Descripción", align: "start", sortable: true, value: "resumen"},
        { text: "Expediente", align: "start", sortable: true, value: "expediente"},
        { text: "Perfil", align: "start", sortable: true, value: "arreglo_job"},
        { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
        { text: "Asignado a:", align: "start", sortable: true, value: "asignacion_job"},
        { text: "Tipo Bandeja", align: "start", sortable: true, value: "tipo_bandeja"},
        { text: "Operador", align: "start", sortable: true, value: "operador"},
      ],
    };
  },

  created() {
    this.getJobsFromBd();
  },

  methods: {
    getJobsFromBd() {
      axios.get(`${process.env.VUE_APP_API_ROUTE}/jobs`).then((data) => {
        for (this.index in data.data.response) {
          this.jobs.push(data.data.response[this.index]);
        }
      });
    },
  },
};
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  font-weight: 400;
}

.panelContainer {
  height: 90vh;
  overflow-y: auto;
}

.dataTable {
  margin-top: 1rem;
}
</style>
