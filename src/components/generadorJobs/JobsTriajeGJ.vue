<template>
  <div>
    <v-app class="font-sans shadow-md rounded px-8 mr-8">
        <div class="flex">
        <h1 class="text-xl font-bold py-4 mt-2 flex-grow">Jobs en Triaje</h1>
        <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1" class="m-auto">
          <v-icon x-large>mdi-help-box</v-icon>
        </v-btn>
      </div>

      <div class="overflow-y-auto">
        <v-card elevation="0" class="mb-4">
          <div>
            <div class="p-3 flex bg-blue-500 w-full items-center">
              <v-btn :disabled="groupActions()" dark color="success" @click="groupGenerate()" class="mr-3">GENERAR JOBS</v-btn>
              <v-btn :disabled="groupActions()" dark color="#71717A" class="mr-3">ASIGNAR EXPEDIENTE</v-btn>
              <v-btn :disabled="groupActions()" dark color="error" class="mr-3">ELIMINAR</v-btn>
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
          group-by="expediente"
          class="font-sans"
          item-key="job"
          show-select>
          <template v-slot:top>
            <!-- VENTANA EDICION INCIDENCIA -->
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
              class="h-full"
            >
              <EditarJob
                @datosActualizados="updateData"
                @dialog="dialogClose"
                :job="editedItem"
              ></EditarJob>
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
            <v-btn title="Editar Job" icon dark class="bg-blue-500 mr-1">
              <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <div class="my-4">
                <h3>Recuperando Jobs</h3>
            </div>
            <div class="my-4"> 
                <v-progress-circular
                :size="80"
                :width="10"
                color="primary"
                indeterminate
                ></v-progress-circular>
            </div>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>
        </v-data-table>

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
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJobError } from '@/assets/mixins/generarJobError';
import EditarJob from '@/components/generadorJobs/EditarJob.vue';


export default {
  name: "JobsTriajeGJ",
  mixins: [getColor, generarJobError],
  components: {
    EditarJob,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
      { text: "Estado", align: "start", sortable: true, value: "estado"},
      { text: "Job", align: "start", sortable: true, value: "job"},
      { text: "Expediente", align: "start", sortable: true, value: "expediente"},
      { text: "Gravedad", align: "start", sortable: true, value: "gravedad_job"},
      { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
      { text: "Perfil", align: "start", sortable: true, value: "arreglo_job"},
      { text: "Descripción", align: "start", sortable: true, value: "resumen"}, //hay que hacer desde API un "resumen" ademas de la desc completa
      { text: "Operador", align: "start", sortable: true, value: "nombre_operador"},
      { text: "Acciones", value: "actions", sortable: false },
    ],
    jobs: [],
    editedIndex: -1,
    editedItem: {
      estado: "",
      job: "",
      expediente: "",
      gravedad_job: "",
      deteccion_job: "",
      arreglo_job: "",
      resumen:"",
    },
    defaultItem: {
      estado: "",
      job: "",
      expediente: "",
      gravedad_job: "",
      deteccion_job: "",
      arreglo_job: "",
      resumen:"",
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


    groupGenerate(){
      this.erroresEnJob = [];
      //Recuperar errores por cada job
      
      for (this.index in this.selected){
        axios
        .get(`${process.env.VUE_APP_API_ROUTE}/error/` + this.selected[this.index].job)
        .then ((data) => {
          if (data.data.errores != undefined){
            //El job tiene errores asociados
            this.jobGenerar = [this.selected[this.index]];
            this.erroresGenerar = data.data.errores;
            this.resultado = this.generarJobError(this.jobGenerar, this.erroresGenerar);
            
            //Evaluar respuesta
            if (this.resultado.procesadoOK == true){
              this.showInfo(this.resultado.mensaje, "green");
              setTimeout(this.closeInfo, 2000);        
            } else {
              console.log("Con Errores asociados -> procesado con estado distinto a 0")
              console.log(this.resultado)
            }
          }        
          
          else {
            //El job no tiene errores asociados.
            this.jobGenerar = [this.selected[this.index]];
            this.resultado = this.generarJobError(this.jobGenerar, []);
     
            //Evaluar respuesta
            if (this.resultado.procesadoOK == true){
              this.showInfo(this.resultado.mensaje, "green");
              setTimeout(this.closeInfo, 2000);  
            } else {
              console.log("Sin errores asociados -> procesado con estado distinto a 0")
              console.log(this.resultado)
            }
          }     
        })
        //Actualizar array de jobs
        for (this.indexJob in this.jobs){
          if (this.jobs[this.indexJob].job == this.selected[this.index].job){
            this.jobs.splice(this.indexJob, 1)
          }
        }
      }     
    },

    groupActions(){
      if (this.selected == 0){
        return true
      } else {
        return false
      }
    },

    updateData(data){
      if (data == true) {
        this.initialize();
      }
    },

    initialize() {
      //Reinicia los datos de los jobs
      this.jobs = [];
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
        //se realiza el filtro para los jobs en triaje y la asignación del job_id
        .then((data) => {
          this.jobsBruto = data.data.response;
          for (this.elemento in this.jobsBruto) {
            //filtramos jobs segun estado
            if (this.jobsBruto[this.elemento].estado == "En triaje") {
              this.jobs.push(this.jobsBruto[this.elemento]);
            }
          }
        })
        .catch((data) => {
          console.log(data)
        })
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
      this.initialize();
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
