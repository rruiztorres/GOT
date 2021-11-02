<template>
  <div class="bg-gray-200 h-full pb-6">
    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
      <v-toolbar-title
        >EDITANDO JOB - <b>{{ job.job }}</b></v-toolbar-title
      >

      <v-spacer></v-spacer>
      <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog"
        >CANCELAR</v-btn
      >
      <v-btn class="w-38 bg-gray-500 mr-5" dark text @click="actualizaDatosBD"
        >GUARDAR DATOS</v-btn
      >
      <v-btn class="w-24 bg-green-500 mr-5" dark text @click="generarJobErrores()"
        >GENERAR</v-btn
      >
    </v-toolbar>

    <!--MAIN-->
    <template>
      <v-card>
        <v-tabs v-model="activeTab" fixed-tabs background-color="#0341a6" dark>
          <v-tab :key="1" @click="activateMap(false)">Datos del Job</v-tab>
          <v-tab :key="2" @click="activateMap(true)"
            >Localización en el Mapa</v-tab
          >
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
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-btn
                            title="Editar Job"
                            icon
                            dark
                            class="bg-blue-500 mr-1"
                          >
                            <v-icon small @click="editItem(item)">
                              mdi-pencil
                            </v-icon>
                          </v-btn>
                        </template>

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
                {{message}}
                </v-alert>
            </v-overlay>

          </v-tab-item>
          <!--FIN DATOS DEL JOB -->

          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat class="p-8" style="height:50rem;">
              <Map
                v-if="mapIsActive == true"
                modoMapa="editar"
                :jobsRecibidos="job"
                :erroresRecibidos="errores"
                :reset="mapReset"
                @jobs="storeJobs"
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
      </v-card>
    </template>
  </div>
</template>

<script>
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJob } from "@/assets/mixins/generarJob.js";
import axios from "axios";
import Map from "@/components/common/Map";

export default {
  mixins: [getColor, generarJob],

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
      /*lanza de nuevo initialize cuando detecta que hemos cambiado de incidencia en el menu
      de lo contrario se genera un bug al cambiar de job*/
      if (this.job.job) {
        this.initialize();
      }
    },
  },

  methods: {
    dummy(item) {
      console.log(item);
    },

    generarJobErrores(){
      this.resultado = this.generarJob([this.job]);
        if (this.resultado.procesadoOK == false) {
            this.showInfo(this.resultado.mensaje, "red");
            setTimeout(this.closeInfo,2000);
        }
        else if (this.resultado.procesadoOK == true){
            this.showInfo(this.resultado.mensaje, "green");
            setTimeout(this.closeInfo,2000);
        }
    },

    showInfo(message, type){
        this.showMessage = true;
        this.message = message;
        this.messageType = type;
    },
    closeInfo(){
        this.showMessage = false;
    },

    datosJobToDataTable() {
      this.datosJob = [this.job];
    },

    storeJobs(jobs) {
      this.job = jobs;
      console.log("recibido cambio job");
    },

    storeErrors(errores) {
      this.errores = errores;
    },

    activateMap(active) {
      this.mapIsActive = active;
    },

    //inicializa la tabla de jobs asociados a la incidencia
    initialize() {
      //Enviamos señal sin cambio a map
      this.mapReset = false;
      this.activeTab = 0;
      this.getErroresFromJob();
      this.datosJobToDataTable();
    },

    getErroresFromJob() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/error/` + this.job.job)
        .then((data) => {
          this.erroresBruto = data.data.errores;
          for (this.elemento in this.erroresBruto) {
            this.errores.push(this.erroresBruto[this.elemento]);
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

    actualizaDatosBD() {
      //1 .- Actualizar datos de job en BD
      //2 .- Comprobar que no se ha insertado ningún error nuevo
      //3 .- Actualizar datos de errores en BD
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
        { text: "Acciones", value: "actions" },
      ],

      mapReset: false,
      mapIsActive: false,
      activeTab: 0,

      showMessage: false,
      messageType: '',                    //green para success, red para error, blue para info.
      message: '',
    };
  },
};
</script>
