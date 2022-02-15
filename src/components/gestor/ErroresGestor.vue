<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Errores</h2>
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
        :headers="errorHeaders"
        :items="errores"
        :search="search"
        item-key="error"
        show-select
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            {{ item.estado }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {getColor} from "@/assets/mixins/getColor";

export default {
  name: "ErroresGestor",
  mixins: [getColor],
  data() {
    return {
      selected: [],
      errores: [],
      search: "",
      errorHeaders: [
        { text: "Estado", align: "start", sortable: true, value: "estado"},
        { text: "Error", align: "start", sortable: true, value: "error"},
        { text: "Descripción", align: "start", sortable: true, value: "descripcion"},
        { text: "Asoc.Job", align: "start", sortable: true, value: "job"},
        { text: "Tema", align: "start", sortable: true, value: "tema_error"},
        { text: "Tipo", align: "start", sortable: true, value: "tipo_error"},
        { text: "Vía Ent.", align: "start", sortable: true, value: "via_ent"},
      ],
    };
  },

  created() {
    this.getErrorsFromBd();
  },

  methods: {
    getErrorsFromBd() {
      axios.get(`${process.env.VUE_APP_API_ROUTE}/errores`).then((data) => {
        for (this.index in data.data.errores) {
          this.errores.push(data.data.errores[this.index]);
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
