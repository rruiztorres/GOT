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
          item-key="expediente"
          :search="search"
          class="font-sans"
          show-select
        >
          <template v-slot:top>
            <!-- VENTANA EDICION EXPEDIENTE 
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
            FIN VENTANA EDICION INCIDENCIA -->

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                <h3 class="text-center text-l">
                  Esta acción borrará la incidencia ¿Desea continuar?
                </h3>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="w-24 bg-red-500" dark text @click="dummy"
                    >Cancel</v-btn
                  >
                  <v-btn
                    class="w-24 bg-green-500"
                    dark
                    text
                    @click="dummy"
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


export default {
  name: "EditarExpediente",
  mixins: [getColor],

  data: () => ({
    dialog: false,
    dialogDelete: false,
    singleSelect: false,
    selected: [],
    search: "",
    headers: [
      { text: "Finalizado", align: "start", sortable: true, value: "finalizado"},
      { text: "Expediente", align: "start", sortable: true, value: "expediente"},
      { text: "Fecha", align: "start", sortable: true, value: "fecha"},
      { text: "Observaciones", align: "start", sortable: true, value: "textoPlano"},
      { text: "Acciones", value: "actions", sortable: false },
    ],
    expedientes: [],
    editedIndex: -1,
    editedItem: {
      finalizado: "",
      expediente: "",
      fecha: "",
      textoPlano: "",
    },
  }),

  created() {
    this.initialize();
  },

  watch: {
    selected(){
      console.log(this.selected)
    }
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
            for (this.index in this.expedientes) {
              //Devuelve texto plano desde html para la tabla
              this.texto = this.expedientes[this.index].observaciones;
              this.texto = this.texto.replace(/<[^>]*>/g, '');
              this.expedientes[this.index].textoPlano = this.texto;

              //Devuelve fecha en formato YYYY-MM-DD
              this.fecha = this.expedientes[this.index].fecha;
              this.fechaCortada = this.fecha.slice(0,10)
              this.expedientes[this.index].fecha = this.fechaCortada;
            }
        });
    },
  },
};
</script>

<style>
.v-application--wrap {
  min-height: 1vh !important;
}
</style>
