<template>
  <div style="width:98%;" class="m-auto rounded-md bg-white p-4 shadow-md">
      <h1 class="text-xl font-bold py-4 mt-2">
        Mis Jobs
      </h1>

      <div class="overflow-y-auto">
        <v-card elevation="0" class="mb-4">
          <div>
            <div class="p-3 flex bg-blue-500 w-full items-center">
              <v-btn disabled dark color="success" class="mr-3">ASIGNAR JOB/S</v-btn>
              <v-btn disabled dark color="error" class="mr-3">ACCION 2</v-btn>
              <v-spacer></v-spacer>

              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                class="bg-white p-2"
              ></v-text-field>
            </div>
          </div>
        </v-card>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="jobs"
          :key="jobs.job"
          :search="search"
          class="font-sans"
          item-key="job"
          show-select
        >
          <template v-slot:top>


            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                <h3 class="text-center text-l">
                  Esta acción borrará la incidencia ¿Desea continuar?
                </h3>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="w-24 bg-red-500" dark text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    class="w-24 bg-green-500"
                    dark
                    text
                    @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn title="ver datos del job" icon dark class="bg-blue-500 mr-1">
              <v-icon small @click="editItem(item)"> mdi-eye </v-icon>
            </v-btn>
            <v-btn title="asignarme el job" icon dark class="bg-green-500 mr-1">
              <v-icon small @click="editItem(item)"> mdi-account-hard-hat </v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>

          <template v-slot:[`item.bloqueado`]="{ item }">
            <v-icon v-if="checkBlocking(item.bloqueado) == false" color="red">
              mdi-block-helper
            </v-icon>
          </template>

        </v-data-table>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { checkBlocking } from '@/assets/mixins/checkBlocking.js';



export default {
  name: "BandejaOpEsp",
  mixins: [getColor, checkBlocking],

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
      { text: "BL.",align: "start", sortable: true, value: "bloqueado"},
      { text: "Estado", align: "start", sortable: true, value: "estado"},
      { text: "Job", align: "start", sortable: true, value: "job"},
      { text: "Gravedad", align: "start", sortable: true, value: "gravedad_job"},
      { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
      { text: "Perfil", align: "start", sortable: true, value: "arreglo_job"},
      { text: "Descripción", align: "start", sortable: true, value: "resumen"}, //hay que hacer desde API un "resumen" ademas de la desc completa
      { text: "Acciones", value: "actions", sortable: false },
    ],
    jobs: [],
    editedIndex: -1,
    editedItem: {
      id_inc: "",
      job_estado: "",
      job_prioridad: "",
      job_detectado: "",
      job_arreglar: "",
    },
    defaultItem: {
      id_inc: "",
      job_estado: "",
      job_prioridad: "",
      job_detectado: "",
      job_arreglar: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    dummy() {
      console.log()
    },

    editItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.editedItem = Object.assign({}, item); 
      console.log(this.editedItem)    
    },

    initialize() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
        .then((data) => {
          this.jobsBruto = data.data.response;
          for (this.elemento in this.jobsBruto) {
            //filtramos jobs, en bandeja, operadores especializados sin operador asignado
            if (  this.jobsBruto[this.elemento].estado == "En bandeja_op" 
                  && this.jobsBruto[this.elemento].nombre_operador == localStorage.usuario) {
              this.jobs.push(this.jobsBruto[this.elemento]);
            } 
          }
        });
    },

    deleteItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.jobs.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    dialogClose() {
      this.dialog = false;
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.jobs[this.editedIndex], this.editedItem);
      } else {
        this.jobs.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style>
.v-application--wrap {
  min-height: 1vh !important;
}
</style>
