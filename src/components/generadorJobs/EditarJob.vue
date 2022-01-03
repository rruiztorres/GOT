<template>
  <div class="bg-gray-200 h-full pb-6">
    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="checkData"><v-icon>mdi-close</v-icon></v-btn>
      <v-toolbar-title
        >EDITANDO JOB - <b>{{ job.job }}</b></v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog"
        >CANCELAR</v-btn
      >
      <v-btn class="w-38 bg-gray-500 mr-5" dark text @click="updateDataBD"
        >GUARDAR DATOS</v-btn
      >
      <v-btn
        class="w-24 bg-green-500 mr-5"
        dark
        text
        @click="generateJobsErrors()"
        >GENERAR</v-btn
      >
    </v-toolbar>

    <!--MAIN-->
    <template>
      <v-card>
        <v-tabs v-model="activeTab" fixed-tabs background-color="#0341a6" dark>
          <v-tab :key="1" @click="activateMap(false)">Datos del Job</v-tab>
          <v-tab :key="2" @click="activateMap(true)">Localización en el Mapa</v-tab>
          <v-tab :key="3" @click="activateMap(false)">Proceso</v-tab>

          <v-tabs-slider color="#76aff5"></v-tabs-slider>

          <!--DATOS DEL JOB-->
          <v-tab-item>
            <!--Container tab -->
            <v-card flat class="p-8">
              <div class="min-w-1/4">
                <v-row class="h-full mb-6">
                  <v-col cols="12">
                    <v-card class="mb-6">
                      <v-card-title class="bg-blue-200">
                      DATOS DEL JOB
                      </v-card-title>
                      

                      <v-data-table
                        :headers="jobHeaders"
                        :items="datosJob"
                        class="font-sans"
                        hide-default-footer
                      >
                        <template v-slot:[`item.estado`]="{ item }">
                          <v-chip :color="getColor(item.estado)" dark>
                            {{ item.estado }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card>

                    <v-card>
                      <v-card-title class="bg-blue-200"
                        >ERRORES ASOCIADOS</v-card-title
                      >
                      <div>
                        <v-data-table
                          calculate-widths
                          :headers="errorHeaders"
                          :items="errores"
                          item-key="error"
                          hide-default-footer
                        >
                          <template v-slot:[`item.estado`]="{ item }">
                            <v-chip :color="getColor(item.estado)" dark>
                              {{ item.estado }}
                            </v-chip>
                          </template>

                          <template v-slot:no-data>
                            <h1>No existen errores asociados al job</h1>
                          </template>

                          <template v-slot:[`item.actions`]="{ item }">
                            <v-btn title="Eliminar Error" icon dark class="bg-red-500 mr-1">
                              <v-icon @click="confirmDelete(item)"> mdi-trash-can </v-icon>
                            </v-btn>
                          </template>
                        </v-data-table>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
                <br />
              </div>
            </v-card>
          </v-tab-item>


          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat class="p-8" style="height:86vh">
              <Map
                v-if="mapIsActive == true"
                modoMapa="editar"
                :jobsRecibidos="editandoJob"
                :erroresRecibidos="errores"
                @jobs="storeJobs"
                @errores="storeErrors"
              >
              </Map>
            </v-card>
          </v-tab-item>
          <!-- FIN LOCALIZACION EN EL MAPA -->

          <!--PROCESO-->
          <v-tab-item>
                <Logger 
                  :jobsRecibidos="editandoJob"
                  :erroresRecibidos="errores"
                ></Logger>
          </v-tab-item>
          <!--PROCESO-->
        </v-tabs>

        <!-- AVISO DATOS SIN GUARDAR (lo utilizamos también en mapa ¿sacar a componente? ) -->
        <v-overlay :value="showAlert">
          <v-card class="p-3 w-80">
            <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
            <h3 class="text-center text-l">Existen datos sin guardar ¿desea cerrar sin guardar los cambios?</h3>
              <v-card-actions>
                <div class="mt-6 flex">
                    <v-btn class="w-24 bg-red-500" dark text @click="showAlert = false">CANCELAR</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="w-24 bg-green-500" dark text @click="closeWithoutSave()">OK</v-btn>
                </div>
              </v-card-actions>
          </v-card>
        </v-overlay>

        <!-- AVISO ELIMINAR ERRORES -->
        <v-overlay :value="showAlertError">
          <v-card class="p-3 w-80">
            <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
            <h3 class="text-center text-l">Esta acción no se puede deshacer ¿continuar con el borrado?</h3>
              <v-card-actions>
                <div class="mt-6 flex">
                    <v-btn class="w-24 bg-red-500" dark text @click="showAlertError = false">CANCELAR</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="w-24 bg-green-500" dark text @click="deleteError(errorBorrar)">OK</v-btn>
                </div>
              </v-card-actions>
          </v-card>
        </v-overlay>

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
      </v-card>
    </template>
  </div>
</template>

<script>
import { getColor } from '@/assets/mixins/getColor';
import { generarJobError } from '@/assets/mixins/generarJobError';
import { stringifyJobGeometry } from '@/assets/mixins/stringifyJobGeometry';
import { stringifyErrorGeometry } from '@/assets/mixins/stringifyErrorGeometry'

import pointInPolygon from "point-in-polygon";

import axios from "axios";
import Map from "@/components/common/Map";
import Logger from "@/components/common/Logger";

export default {
  mixins: [getColor, generarJobError, stringifyJobGeometry, stringifyErrorGeometry],

  props: ["job", "error", "center"],

  computed: {
    returnJob() {
      return this.job;
    },
  },

  name: "EditarJob",

  components: {
    Map,
    Logger,
  },

  created() {
    this.initialize();
  },

  watch: {
    job() {
      //vuelve a lanzar el initialize cuando detecta un cambio de job
      if (this.job.job) {
        this.initialize();
        //es necesario para poder mutar la propiedad recibida "job"
        this.editandoJob = this.job;
      }
    },

  },

  methods: {
    confirmDelete(errorBorrar){
      this.showAlertError = true;
      this.errorBorrar = errorBorrar;
    },

    deleteError(error){
      if (error.error != null){
        axios
        .delete(`${process.env.VUE_APP_API_ROUTE}/deleteError`,  {data: {error}})
        .then( (data) => {
          if (data.status == 201){
            this.showInfo(data.data.mensaje, "green");
            setTimeout(this.closeInfo, 1000);

            //Actualizar array errores
            for (this.index in this.errores){
              if (this.errores[this.index].error == error.error){
                this.errores.splice(this.index,1)
              }
            }
          } else {
            this.showInfo(data.data.mensaje, "red");
            setTimeout(this.closeInfo, 2000);
          }
        })
      } else {
        this.showInfo("Error eliminado correctamente", "green");
        setTimeout(this.closeInfo, 2000);
        //Actualizar array errores
        for (this.index in this.errores){
          if (this.errores[this.index].error == error.error){
            this.errores.splice(this.index,1)
          }
        }
      }
      this.showAlertError = false;
    },

    closeWithoutSave(){
      this.showAlert = false;
      //Borramos ediciones sin guardar
      this.editandoJob = this.job;
      this.closeDialog();
    },

    editItem(item) {
      this.showEditJob = true;
      this.jobEditar = item;
    },

    closeEditJob(data){
      this.showEditJob = data;
    },

    checkData(){
      if (this.edicionSinGuardar == true){
        this.showAlert = true;
      } else {
        this.closeDialog();
      }
    },

    updateEditedJob(job){
        this.updateJob = job[0]
        this.editandoJob.expediente = this.updateJob.expediente;
        this.editandoJob.arreglo_job = this.updateJob.arreglo_job;
        this.editandoJob.deteccion_job = this.updateJob.deteccion_job;
        this.editandoJob.gravedad_job = this.updateJob.gravedad_job;
        this.editandoJob.asignacion_job = this.updateJob.asignacion_job;
        this.editandoJob.nombre_operador = this.updateJob.nombre_operador;
        this.editandoJob.descripcion = this.updateJob.descripcion;
        this.editandoJob.geometria_json = this.updateJob.geometria_json;
    },

    generateJobsErrors() {
      //TODO: Comprobar que las ediciones se han guardado.
      if (this.edicionSinGuardar == false){
        this.resultado = this.generarJobError([this.editandoJob],[]);
        if (this.resultado.procesadoOK == false) {
          this.showInfo(this.resultado.mensaje, "red");
          setTimeout(this.closeInfo, 2000);
        } else if (this.resultado.procesadoOK == true) {
          this.showInfo(this.resultado.mensaje, "green");
          setTimeout(this.closeInfo, 2000);
          setTimeout(this.closeDialog, 2200);
        } 
      } else {
          this.showInfo("Guarde los datos antes de generar el job", "red");
          setTimeout(this.closeInfo, 2000);
      }
    },

    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },

    datosJobToDataTable() {
      //caso edicion devuelve arrays hay que convertir a objeto
      if (this.editandoJob.length > 0){
        this.editandoJob = this.editandoJob[0];
        //añadimos atributos
        this.editandoJob.geometria = this.stringifyJobGeometry(this.editandoJob.geometria_json);
      }
      this.datosJob = [this.editandoJob];
    },

    storeJobs(job) {
      this.editandoJob = job;
      this.updateEditedJob(this.editandoJob);
      this.datosJobToDataTable();
      this.edicionSinGuardar = true;
    },

    storeErrors(errores) {
      this.errores = errores;
      this.edicionSinGuardar = true;

      for (this.index in errores){
        this.errores[this.index].geometria = this.stringifyErrorGeometry(errores[this.index].geometria_json)
      }
    },

    activateMap(active) {
      this.mapIsActive = active;
    },

    initialize() {
      //Enviamos señal sin cambio a map
      this.activeTab = 0;

      //Evita crear claves duplicadas en el array de errores
      this.errores = [];
      if (this.errores.length == 0) {
        this.getErroresFromJobBD();
      }

      //Formateo datos job a tabla
      this.datosJobToDataTable();
    },

    getErroresFromJobBD() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/error/` + this.job.job)
        .then((data) => {
          this.erroresBruto = data.data.errores;
          for (this.elemento in this.erroresBruto) {
            this.errores.push(this.erroresBruto[this.elemento]);
            this.errores[this.elemento].job = this.job.id_job
          }
        })
        .catch((data) => {
          console.log(data);
      });
    },

    closeDialog() {
      this.activateMap(false);
      this.dialog = false;
      this.$emit("dialog", this.dialog);

      //Borramos datos obtenidos, si no se duplican la siguiente vez que se abre la consulta
      this.errores = [];
      this.erroresBruto = [];
    },

    errorInJob(polygon, point){
      //Evalua si un punto de error está dentro de un job
      this.polygon = [polygon];
      this.point = [
        point.coordinates[0],
        point.coordinates[1],
      ];
      this.inside = pointInPolygon(this.point, this.polygon[0]);
      return this.inside;
    },

    updateDataBD(){
      this.continue = true;
      this.errorDetectFuera = false;
      this.arrayPut = [];
      this.arrayPost = [];
      this.ejecucionPostError = true;
      this.ejecucionPutError = true;
      this.ejecucionPutJob = true;

      this.log = {
          idEventoLogger: 6, //JOB MODIFICADO
          procesoJob: 'GOT',
          usuario: localStorage.usuario,
          observaciones: '',
          departamento: '',
          resultadoCC: '',
      }

      //Actualizamos datos de job
      if (this.edicionSinGuardar == true) {
        axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateJob`, [this.datosJob, this.log])
          .then((data) => {
              if (data.status !== 201) {
                this.ejecucionPutJob = false;
              }
          })
          .catch((data) => {
            console.log(data);
          });
      }

      //Comprobar si existe algún error fuera del job
      for (this.index in this.errores){   
        this.errorDentro = this.errorInJob(this.editandoJob.geometria_json.coordinates[0], this.errores[this.index].geometria_json)
        if (this.errorDentro == false){
          this.continue = false;
          this.errorDetectFuera = true;
        }
      }

      //Identificamos si son errores para actualizar o insertar
      if (this.continue == true){
        for (this.index in this.errores){
          if (this.errores[this.index].error == null){
            this.errores[this.index].job = this.job.id_job
            this.arrayPost.push(this.errores[this.index])
          } else {
            this.arrayPut.push(this.errores[this.index])
          }
        }
      }

      //Hacemos insercion de errores
      if (this.continue == true){
        axios
        .post(`${process.env.VUE_APP_API_ROUTE}/postError`, this.arrayPost)
        .then((data) => {
          if (data.status == 201){
            //Actualizar numeros serie errores guardados
            for (this.index in this.errores){
              for (this.indexCreados in data.data.errores){
                if (data.data.errores[this.indexCreados].id == this.errores[this.index].id){
                  this.errores[this.index].error = data.data.errores[this.indexCreados].error
                }
              }
            }
          } else {
            this.ejecucionPostError = false; 
          }
        })

        //Hacemos update de errores
        axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateError`, this.arrayPut)
        .then((data) => {
          if (data.status !== 201){
            this.ejecucionPutError = false; 
          }
        })
      }

      //Respuesta a usuario
      if (this.ejecucionPostError == true && this.ejecucionPutError == true && this.ejecucionPutJob == true){
        if (this.errorDetectFuera == false){
          this.$emit("datosActualizados", true);
          this.edicionSinGuardar = false;
          this.showInfo("Datos actualizados correctamente", "green");
          setTimeout(this.closeInfo, 1500);
        } else {
          this.showInfo("No pueden existir errores fuera del job, por favor revise los datos", "red");
          setTimeout(this.closeInfo, 1500);
        }
      } else {
        this.showInfo("Ocurrió un error inesperado, por favor revise los datos", "red");
        setTimeout(this.closeInfo, 1500);
      }
    }

    
  },

 

  data() {
    return {
      errores: [],
      erroresBruto: [],
      errorHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Error", value: "error" },
        { text: "Tema", value: "tema_error" },
        { text: "Tipo", value: "tipo_error" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Procedencia", value: "via_ent" },
        { text: "Acciones", value: "actions" },
      ],

      jobHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Expediente", value: "expediente" },
        { text: "Perfil", value: "arreglo_job" },
        { text: "Detectado en", value: "deteccion_job" },
        { text: "Gravedad", value: "gravedad_job" },
        { text: "Asignado a", value: "asignacion_job" },
        { text: "Operador", value: "nombre_operador" },
        { text: "Descripción", value: "descripcion" },
      ],

      mapReset: false,
      mapIsActive: false,
      activeTab: 0,

      showMessage: false,
      messageType: "", //green para success, red para error, blue para info.
      message: "",

      showEditJob: false,
      jobEditar: null,
      edicionSinGuardar: false,

      //CAPACIDAD EDICION JOBS
      editandoJob: this.job,

      //ALERTA DATOS SIN GUARDAD
      showAlert: false,

      //ALERTA BORRADO ERRORES
      showAlertError: false,

      //LOGGER
      loggerIsActive: false,
    };
  },
};
</script>
