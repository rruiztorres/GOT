<template>
  <div>
    <v-app class="font-sans shadow-md rounded px-8 mr-8">
      <h1 class="text-xl font-bold py-4 mt-2">
        Editar Expedientes
      </h1>

      <div class="overflow-y-auto">
        <v-card elevation="0" class="mb-4">
          <div>
            <div class="p-3 flex bg-blue-500 w-full items-center">
              <v-btn disabled dark color="success" class="mr-3">ASOCIAR A JOBS</v-btn>
              <v-btn disabled dark color="error" class="mr-3">FINALIZAR</v-btn>
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
          :items="expedientes"
          :search="search"
          class="font-sans"
          show-select
        >
          <template v-slot:top>
            <!-- VENTANA EDICION INCIDENCIA -->
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
              class="h-full"
            >
              <VerIncidencia
                @dialog="dialogClose"
                :incidencia="editedItem"
                :error="editedItem.geometria_error"
                :center="editedItem.geometria_error"
              ></VerIncidencia>
            </v-dialog>
            <!-- FIN VENTANA EDICION INCIDENCIA -->

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
            <v-btn title="editar" icon dark class="bg-blue-500 mr-1"
              ><v-icon small @click="dummy(item)"> mdi-pencil </v-icon></v-btn
            >
            <v-btn title="consultar" icon dark class="bg-green-500"
              ><v-icon small @click="dummy(item)"> mdi-eye </v-icon></v-btn
            >
          </template>

          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>

          <template v-slot:[`item.finalizado`]="{ item }">
            <v-chip :color="getColor(item.finalizado)" dark>
              {{ item.finalizado }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import VerIncidencia from "@/components/common/VerIncidencia";


export default {
  name: "EditarExpediente",
  mixins: [getColor],
  components: {
    VerIncidencia,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
      { text: "Finalizado", align: "start", sortable: true, value: "finalizado"},
      { text: "Expediente", align: "start", sortable: true, value: "expediente"},
      { text: "Fecha", align: "start", sortable: true, value: "fecha"},
      { text: "Observaciones", align: "start", sortable: true, value: "observaciones"},
      { text: "Acciones", value: "actions", sortable: false },
    ],
    expedientes: [],
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
      //
    },

    initialize() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/expedientes`)
        //se realiza el filtro para los jobs en triaje y la asignación del job_id
        .then((data) => {
            this.expedientes = data.data.respuesta
        });
    },

    editItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
