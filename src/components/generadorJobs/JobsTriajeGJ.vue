<template>
  <div style="width:98%;" class="m-auto rounded-md bg-white p-4 shadow-md">
      <div class="flex">
        <h1 class="text-xl font-bold py-4 mt-2 flex-grow">Jobs en Triaje</h1>
        <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1" class="m-auto">
          <v-icon x-large>mdi-help-box</v-icon>
        </v-btn>
      </div>

      <div class="overflow-y-auto">
        
        <!--PANEL ACCIONES SUPERIOR -->
        <v-card elevation="0 mb-4">
            <v-row class="m-0 bg-blue-500 items-center">
              <v-col cols="12" md="8">
                <v-row>
                  <v-col cols="12" md="3">
                    <v-btn 
                      class="w-full"
                      :disabled="groupActions()" 
                      dark color="success" 
                      @click="groupGenerate()">
                      GENERAR JOBS
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-btn
                      class="w-full"
                      :disabled="groupActions()" 
                      dark color="#71717A" 
                      @click="groupAsignExp()">
                      ASIGNAR EXP.
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-btn
                      class="w-full"
                      :disabled="groupActions()" 
                      dark color="warning">
                      DESESTIMAR
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3">       
                    <v-btn
                      class="w-full"
                      :disabled="groupActions()" 
                      dark color="error" 
                      @click="deleteJobs()">
                    ELIMINAR
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  class="bg-white p-2"
                ></v-text-field>
              </v-col>
            </v-row>
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
              <v-icon @click="editItem(item)"> mdi-lead-pencil </v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <div class="p-3">
                <v-progress-circular
                  :size="70"
                  :width="7"
                  color="blue"
                  indeterminate
                  class="mb-6"
                ></v-progress-circular>
                <br/>
                <h2 class="text-gray-500 text-lg">Recuperando Jobs desde la base de datos ... por favor espere.</h2>
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

        <!--SELECCION DE EXPEDIENTES (asignacion masiva) TODO: sacar a componente-->
        <v-overlay :value="showExpSelect">
          <v-card light class="bg-white rounded-md" style="width:40vw; min-width:430px;">
            <v-card-title class="bg-blue-200">Asignación de Expediente
              <v-spacer></v-spacer>
              <v-card-actions>
                <div class="w-full">
                  <v-btn dark color="success" :disabled="expediente == null" @click="asignExpToSelect()" class="mr-3">ASIGNAR A SELECCIÓN</v-btn>
                  <v-btn dark color="error" @click="showExpSelect = !showExpSelect" class="mr-3">CANCELAR</v-btn>
                </div>
              </v-card-actions>
            </v-card-title>
            <v-row>
              <v-col>
                <div>
                  <div class="p-3">
                    <v-card-text>Seleccione un expediente </v-card-text>
                    <v-select
                    class="mx-3"
                    :items="expedientes"
                    v-model="expediente"
                    label="Expediente"
                    solo
                    light
                    ></v-select>
                  </div>
                    
                    <v-card-title class="bg-blue-200">Información</v-card-title>

                    <div class="p-5" v-if="expedienteInfo[0].observaciones != null && expedienteInfo[0].fecha">
                      <div class="text-sm text-gray-400 ml-1">Observaciones: </div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2"><p v-html="expedienteInfo[0].observaciones"></p></div>
                      <div class="text-sm text-gray-400 ml-1">Fecha alta: </div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2"><p v-html="expedienteInfo[0].fecha"></p></div>
                      <div class="text-sm text-gray-400 ml-1">Estado: </div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2"><p v-html="expedienteInfo[0].finalizado"></p></div>
                    </div>
                    <div class="p-5" v-else>
                      <div class="text-sm text-gray-400 ml-1">Observaciones:</div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2 text-gray-400">Seleccione un expediente para ver información</div>
                      <div class="text-sm text-gray-400 ml-1">Fecha alta: </div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2"></div>
                      <div class="text-sm text-gray-400 ml-1">Estado: </div>
                      <div class="bg-gray-100 rounded-md p-2 mb-2"></div>
                    </div>
                </div>
              </v-col>
            </v-row>          
          </v-card>
        </v-overlay>

      </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJobError } from '@/assets/mixins/generarJobError';
import EditarJob from '@/components/generadorJobs/EditarJob.vue';
import { stringifyJobGeometry } from '@/assets/mixins/stringifyJobGeometry';


export default {
  name: "JobsTriajeGJ",
  mixins: [getColor, generarJobError, stringifyJobGeometry],
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

    //MANEJO EXPEDIENTES
    showExpSelect: false,
    expedientes: [],
    expediente: null,
    expedienteInfo: [{
      fecha: null,
      observaciones: null,
      finalizado: null,
    }],
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    dialogDelete(val) {
      val || this.closeDelete();
    },

    expediente(){
      if(this.expediente != null){
        axios
        .get(`${process.env.VUE_APP_API_ROUTE}/expediente/`+ this.expediente)
        .then((data) => {
          this.expedienteInfo[0].fecha = (data.data.respuesta[0].fecha).slice(0,10);
          this.expedienteInfo[0].observaciones = data.data.respuesta[0].observaciones;
          if (data.data.respuesta[0].finalizado == true){
            this.expedienteInfo[0].finalizado = "Finalizado"
          } else {
            this.expedienteInfo[0].finalizado = "Abierto"
          }
        })
      }
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    asignExpToSelect(){
      //Asigna el expediente a la seleccion de jobs actual   
      for (this.index in this.selected){
        this.selected[this.index].geometria = this.stringifyJobGeometry(this.selected[this.index].geometria_json);
        this.selected[this.index].expediente = this.expediente;
        
        axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateJob`, [this.selected[this.index]])
        .then((data)=>{
          this.showExpSelect = false;
          this.selected = [];
          if (data.status == 201){
            this.showInfo("El expediente ha sido asignado a los jobs seleccionados", "green");
            setTimeout(this.closeInfo, 1500);
          } else {
            this.showInfo(data.data.mensaje, "red");
            setTimeout(this.closeInfo, 1500);
          }
        })
        
      }
      
    },

    groupAsignExp(){
      this.showExpSelect = true;
      this.getExpedientes();
    },

    getExpedientes(){
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/expedientes`)
      .then((data)=>{
        for (this.index in data.data.respuesta){
          this.expedientes.push(data.data.respuesta[this.index].expediente)
        }
      })
    },
    
    deleteJobs(){
      const deleteJobs = this.selected
      axios
      .delete(`${process.env.VUE_APP_API_ROUTE}/deleteJobs`, {data: deleteJobs}) 
      .then((data) => {
        if (data.status == 201){
          this.showInfo(data.data.mensaje, "green");
          setTimeout(this.closeInfo, 1500);

          //Actualizar array jobs
          for (this.index in this.jobs){
            for (this.indexSelection in this.selected){
              if (this.selected[this.indexSelection].id_job == this.jobs[this.index].id_job){
                this.jobs.splice(this.index, 1)
              }
            }
          }
          //Deseleccionar jobs eliminados
          this.selected = []

        } else {
          this.showInfo(data.data.mensaje, "red");
          setTimeout(this.closeInfo, 1500);  
        }
      })
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
      //Recuperar errores por cada job
      for (this.index in this.selected){
        const jobAGenerar = [this.selected[this.index]];
        axios
        .get(`${process.env.VUE_APP_API_ROUTE}/error/` + jobAGenerar[0].job)
        .then ((data) => { 
          if (data.data.errores != undefined){
            //El job tiene errores asociados
            this.erroresGenerar = data.data.errores;
          }             
          else {
            //El job no tiene errores asociados.
            this.erroresGenerar = [];
          }
          this.generarJobError(jobAGenerar, this.erroresGenerar);
        })
      }

      //actualizar array jobs 
      for (this.index in this.jobs){
        for(this.selIndex in this.selected){
          if (this.jobs[this.index].job == this.selected[this.selIndex].job){
            this.jobs.splice(this.index, 1)
          }
        }
      }

      //info 
      this.showInfo("jobs generados correctamente", "green");
      setTimeout(this.closeInfo, 1500);  
      
      //Deseleccionar
      this.selected = [];
      this.search = '';
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
