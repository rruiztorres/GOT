<template>
    <div style="width:98%;" class="m-auto rounded-md bg-white p-4 shadow-md">
      <h1 class="text-xl font-bold py-4 mt-2">
        Recuperar Jobs
      </h1>

      <div class="overflow-y-auto">
        <v-card elevation="0" class="mb-4">
          <div>
            <div class="p-3 flex bg-blue-500 w-full items-center">
              <v-btn :disabled="groupActions()" dark color="success" class="mr-3" @click="recuperarTriaje()">RECUPERAR A TRIAJE</v-btn>
              <v-btn :disabled="groupActions()" dark color="error" class="mr-3">RECHAZAR JOBS</v-btn>
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
          :search="search"
          class="font-sans"
          item-key="job"
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

          <template v-slot:no-data>
            <div class="p-3">
              <h1 class="text-2xl font-bold">VAYA...</h1>
              <h1 class="text-xl">Parece que no existen jobs que puedan recuperarse</h1>
              <img 
                title=""
                class="m-auto" 
                width="400px" src="@/assets/no_data.jpg">
            </div>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>
        </v-data-table>
      </div>

      <!--MENSAJES DE INFORMACION-->
      <v-overlay :value="showMessage">
        <v-alert
          class="mx-7"
          :color="messageType"
          dark
          border="top"
          icon="mdi-alert-circle-outline"
          transition="scale-transition"
        >
          {{ message }}
        </v-alert>
      </v-overlay>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import VerIncidencia from "@/components/common/VerIncidencia";


export default {
  name: "RecuperarJobs",
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
      { text: "Estado", align: "start", sortable: true, value: "estado"},
      { text: "Job", align: "start", sortable: true, value: "job"},
      { text: "Expediente", align: "start", sortable: true, value: ""},
      { text: "Gravedad", align: "start", sortable: true, value: "gravedad_job"},
      { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
      { text: "Perfil", align: "start", sortable: true, value: "arreglo_job"},
      { text: "Descripción", align: "start", sortable: true, value: "resumen"}, //hay que hacer desde API un "resumen" ademas de la desc completa
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
    showMessage: false,
    message: '',
    messageType: '',
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

    editItem(){
      console.log("edit", this.editedItem)
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    dummy() {
      //
    },
    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },

    recuperarTriaje(){
      for (this.index in this.selected){
        this.actualizarJob = {
            nuevoEstado: 'En triaje',
            nombre_operador: this.selected[this.index].nombre_operador,
            job: this.selected[this.index].job
        };
        axios
          .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, this.actualizarJob)
          .then ((data)=> {
            if (data != undefined){
              this.showInfo(`Los jobs se han devuelto a triaje con éxito`, "green");
              setTimeout(this.closeInfo, 2000);
              //actualizar array jobs
              for (this.index in this.jobs){
                for (this.selectIndex in this.selected){
                  if (this.jobs[this.index].job == this.selected[this.selectIndex].job){
                    this.jobs.splice(this.index,1);
                  } 
                }
              }
              this.selected = [];
            }
          })
      }
    },

    groupActions(){
      if (this.selected == 0){
        return true
      } else {
        return false
      }
    },

    initialize() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
        //se realiza el filtro para los jobs devueltos y la asignación del job_id
        .then((data) => {
          this.jobsBruto = data.data.response;
          for (this.elemento in this.jobsBruto) {
            //filtramos jobs segun estado
            if (this.jobsBruto[this.elemento].estado !== "En triaje") {
              this.jobs.push(this.jobsBruto[this.elemento]);
            }
          }
          
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
