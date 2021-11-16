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
          <v-tab :key="3" @click="activateMap(false)">Datos adjuntos</v-tab>

          <v-tabs-slider color="#76aff5"></v-tabs-slider>

          <!--DATOS DEL JOB-->
          <v-tab-item>
            <!--Container tab -->
            <v-card flat class="p-8">
              <div class="min-w-1/4">
                <v-row class="h-full mb-6">
                  <v-col cols="8">
                    <v-card class="mb-6">
                      <v-card-title class="bg-blue-200"
                        >DATOS DEL JOB</v-card-title
                      >

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
                        </v-data-table>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- LOG DEL JOB -->
                  <v-col cols="4">
                    <v-card>
                      <v-card-title class="bg-blue-200">LOG</v-card-title>
                      <template>
                        <v-container style="max-width: 600px;">
                          <v-timeline dense>
                            <v-timeline-item
                              class="mb-4"
                              fill-dot
                              color="green"
                              small
                            >
                              <v-card class="p-4">
                                <v-row justify="space-between">
                                  <v-col cols="12">
                                    <v-chip
                                      class="white--text ml-0 w-full"
                                      color="green"
                                      label
                                    >
                                      Inserciones automáticas - 09:25 PM
                                      (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">
                                      Incidencia insertada por proceso
                                      automático
                                    </p>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-timeline-item>

                            <v-timeline-item
                              class="mb-4"
                              fill-dot
                              color="#9CA3AF"
                              small
                            >
                              <v-card class="p-4">
                                <v-row justify="space-between">
                                  <v-col cols="12">
                                    <v-chip
                                      class="white--text ml-0 w-full"
                                      color="#9CA3AF"
                                      label
                                    >
                                      Job en Triaje - 10:25 PM (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">
                                      El Generador de Jobs Raúl Ruiz Torres está
                                      realizando el triaje del job
                                    </p>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-timeline-item>

                            <v-timeline-item
                              class="mb-4"
                              fill-dot
                              color="green"
                              small
                            >
                              <v-card class="p-4">
                                <v-row justify="space-between">
                                  <v-col cols="12">
                                    <v-chip
                                      class="white--text ml-0 w-full"
                                      color="green"
                                      label
                                    >
                                      Job Generado - 11:45 PM (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">
                                      Job generado por el generador de jobs Raúl
                                      Ruiz Torres y asignado a bandeja
                                      operadores
                                    </p>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-timeline-item>

                            <v-timeline-item
                              class="mb-4"
                              fill-dot
                              color="red"
                              small
                            >
                              <v-card class="p-4">
                                <v-row justify="space-between">
                                  <v-col cols="12">
                                    <v-chip
                                      class="white--text ml-0 w-full"
                                      color="red"
                                      label
                                    >
                                      Error de versionado - 11:55 PM
                                      (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">
                                      No se ha podido crear la versión del Job
                                    </p>
                                    <v-btn color="primary" small
                                      >Solucionar</v-btn
                                    >
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-timeline-item>
                          </v-timeline>
                        </v-container>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
                <br />
              </div>
            </v-card>
          </v-tab-item>


          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat class="p-8" style="height:50rem;">
              <Map
                v-if="mapIsActive == true"
                modoMapa="editar"
                :jobsRecibidos="editandoJob"
                :erroresRecibidos="errores"
                :reset="mapReset"
                @job="storeJobs"
                @errores="storeErrors"
              >
              </Map>
            </v-card>
          </v-tab-item>
          <!-- FIN LOCALIZACION EN EL MAPA -->

          <!--DATOS ADJUNTOS-->
          <v-tab-item>
            <v-card flat class="p-8">
              <v-spacer class="m-4"></v-spacer>
            </v-card>
          </v-tab-item>
          <!--FIN DATOS ADJUNTOS-->
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

import axios from "axios";
import Map from "@/components/common/Map";

export default {
  mixins: [getColor, generarJobError, stringifyJobGeometry],

  props: ["job", "error", "center"],

  computed: {
    returnJob() {
      return this.job;
    },
  },

  name: "EditarJob",

  components: {
    Map,
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
    dummy(item) {
      console.log(item);
    },

    closeWithoutSave(){
      this.showAlert = false;
      //Borramos ediciones sin guardar
      this.editandoJob = this.job;
      this.edicionSinGuardar = false;
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
      this.editandoJob.expediente = job.expediente;
      this.editandoJob.arreglo_job = job.arreglo_job;
      this.editandoJob.deteccion_job = job.deteccion_job;
      this.editandoJob.gravedad_job = job.gravedad_job;
      this.editandoJob.asignacion_job = job.asignacion_job;
      this.editandoJob.nombre_operador = job.nombre_operador;
      this.editandoJob.descripcion = job.descripcion;
      this.editandoJob.geometria_json = job.geometria_json;
      this.editandoJob.geometria = this.stringifyJobGeometry(job.geometria_json);
      this.editandoJob.resumen = job.descripcion.substr(0,30) + "...";

      this.edicionSinGuardar = true;
    },

    generateJobsErrors() {
      this.resultado = this.generarJobError([this.editandoJob],[]);
      if (this.resultado.procesadoOK == false) {
        this.showInfo(this.resultado.mensaje, "red");
        setTimeout(this.closeInfo, 2000);
      } else if (this.resultado.procesadoOK == true) {
        this.showInfo(this.resultado.mensaje, "green");
        setTimeout(this.closeInfo, 2000);
        setTimeout(this.closeDialog, 2200);
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
      this.datosJob = [this.editandoJob];
    },

    storeJobs(job) {
      this.editandoJob = job;
      this.updateEditedJob(this.editandoJob);
      this.datosJobToDataTable();
    },

    storeErrors(errores) {
      this.errores = errores;
    },

    activateMap(active) {
      this.mapIsActive = active;
    },

    //inicializa la tabla de jobs
    initialize() {
      //Enviamos señal sin cambio a map
      this.mapReset = false;
      this.activeTab = 0;

      this.getErroresFromJobBD();
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

      //Reseteamos mapa
      this.mapReset = true;
    },

    updateErrorsBD(data, index){
      this.errores[index].descripcion = data.descripcion;
      this.errores[index].error = data.error;
      this.errores[index].estado = data.estado;
      this.errores[index].geometria = data.geometria;
      this.errores[index].geometria_json = data.geometria_json;
      this.errores[index].id_error = data.id_error;
      this.errores[index].job = data.job;
      this.errores[index].tema_error = data.tema_error;
      this.errores[index].tipo_error = data.tipo_error;
      this.errores[index].via_ent = data.via_ent;
    },


    updateDataBD() {
      //1 .- Actualizar datos de job en BD   
      if (this.edicionSinGuardar == true) {
        axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateJob`, this.editandoJob)
          .then((data) => {
              this.edicionSinGuardar = false;
              this.$emit("datosActualizados", true);
              this.showInfo(data.data.mensaje, "green");
              setTimeout(this.closeInfo, 2000);
          })
          .catch((data) => {
            console.log(data);
          });
        
      }
      //2 .- Si se registra un error nuevo realizar insercion (si está dentro de job)
      //asignar id job
      for (this.index in this.errores){
        this.errores[this.index].asocJob = this.job.id_job;
      }

      for (this.index in this.errores) {
        if (this.errores[this.index].error == null){
           axios
            .post(`${process.env.VUE_APP_API_ROUTE}/postError`, this.errores[this.index])
            .then( data => {
              if (data.status == 201){
                this.updateErrorsBD(data.data.error[0], this.index);
              }
              else if (data.status == 203){
                //Eliminamos error fuera del job
                this.errores.pop()
              }
            });
        } else {
          //3 .- Los errores ya existian en BD . Actualizar datos
          axios
          .put(`${process.env.VUE_APP_API_ROUTE}/updateError`, this.errores[this.index])
          .then( data => {
            if (data.status == 201){
              this.updateErrorsBD(data.data.error[0], this.index);
            } 
          })
        } 
      }   
    },
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
      ],

      jobHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Expediente", value: "expediente" },
        { text: "Perfil", value: "arreglo_job" },
        { text: "Detectado en", value: "deteccion_job" },
        { text: "Gravedad", value: "gravedad_job" },
        { text: "Asignado a", value: "asignacion_job" },
        { text: "Operador", value: "nombre_operador" },
        { text: "Descripción", value: "resumen" },
      ],

      mapReset: false,
      mapIsActive: false,
      activeTab: 0,

      showMessage: false,
      messageType: "", //green para success, red para error, blue para info.
      message: "",

      showEditJob: false,
      jobEditar: null,

      //CAPACIDAD EDICION JOBS
      editandoJob: this.job,

      //ALERTA DATOS SIN GUARDAD
      showAlert: false,
    };
  },
};
</script>
