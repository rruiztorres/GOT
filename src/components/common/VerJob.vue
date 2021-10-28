<template>
  <div class="bg-gray-200 h-full pb-6">

    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>DATOS DEL JOB - <b>{{ job.job }}</b></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog">
          CANCELAR
        </v-btn>
        <v-btn class="w-24 bg-green-500" dark text @click="storePolygonGeom">
            GUARDAR
        </v-btn>
    </v-toolbar>

    <!--MAIN-->
    <template>
        <v-card>
            <v-tabs v-model="activeTab" fixed-tabs background-color="#0341a6" dark>
                <v-tab :key="1" @click="activateMap(false)">Datos del Job</v-tab>
                <v-tab :key="2" @click="activateMap(true)">Localización en el Mapa</v-tab>
                <v-tab :key="3" @click="activateMap(false)">Log del Job</v-tab>
                <v-tab :key="4" @click="activateMap(false)">Datos adjuntos</v-tab>

                <v-tabs-slider color="#76aff5"></v-tabs-slider>

                <!--DATOS DEL JOB-->
                <v-tab-item>
                    <v-card flat class="p-8">
                        <div class="min-w-1/4">
                            <table class="mr-6 text-justify shadow-md w-full table-fixed">
                                <tbody>
                                    <tr class="bg-gray-100 w-1/6">
                                        <td class="p-3"><b>Estado:</b></td>
                                        <td class="w-5/6">
                                            <v-chip :color="getColor(job.estado)" dark>
                                                {{job.estado}}</v-chip>
                                        </td>
                                    </tr>
                                    <tr class="p-3 bg-white">
                                        <td class="p-3"><b>Expediente:</b></td>
                                        <td>{{ job.expediente }}</td>
                                    </tr>
                                    <tr class="p-3 bg-gray-100">
                                        <td class="p-3"><b>Gravedad:</b></td>
                                        <td>{{ job.gravedad_job }}</td>
                                    </tr>
                                    <tr class="p-3 bg-white">
                                        <td class="p-3"><b>Detectado en:</b></td>
                                        <td>{{ job.deteccion_job }}</td>
                                    </tr>
                                    <tr class="p-3 bg-gray-100">
                                        <td class="p-3"><b>Perfil job:</b></td>
                                        <td>{{ job.arreglo_job }}</td>
                                    </tr>
                                    <tr class="p-3 bg-white">
                                        <td class="p-3"><b>Descripción:</b></td>
                                        <td>{{ job.descripcion }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            
                            <div>
                                <h1 class="text-xl pb-3">
                                    ERRORES ASOCIADOS AL JOB - <b>{{ job.job }}</b>
                                </h1>
                                <div>
                                    <template>
                                        <v-data-table
                                        loading-text="Aun no existen jobs asociados a esta incidencia"
                                        :headers="errorHeaders"
                                        :items="errores"
                                        item-key="error"
                                        >
                                            <template v-slot:[`item.estado`]="{ item }">
                                                <v-chip :color="getColor(item.estado)" dark>
                                                    {{ item.estado }}
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </div>
                            </div>
                            <br />
                        </div>
                    </v-card>
                </v-tab-item>
                <!--FIN DATOS DEL JOB -->

          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat class="p-8" style="height:50rem;">
              <Map
                v-if="mapIsActive == true"
                modoMapa="visualizar"
                :jobsRecibidos="job"
                :erroresRecibidos="errores"
                :reset="mapReset"
              >
              </Map>
            </v-card>
          </v-tab-item>
          <!-- FIN LOCALIZACION EN EL MAPA -->

          <!--LOG DE LA INCIDENCIA-->
          <v-tab-item @click="activateMap(false)">
            <v-card flat class="p-8">
              <!-- desde aqui -->

              <template>
                <v-container style="max-width: 600px;">
                  <v-timeline dense>

                    <v-timeline-item class="mb-4" fill-dot color="green" small>
                        <v-card class="p-4">
                            <v-row justify="space-between">
                                <v-col cols="12">
                                    <v-chip
                                        class="white--text ml-0 w-full"
                                        color="green"
                                        label 
                                        >
                                            Inserciones automáticas - 09:25 PM (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">Incidencia insertada por proceso automático</p>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-timeline-item>

                    <v-timeline-item class="mb-4" fill-dot color="#9CA3AF" small>
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
                                    <p class="my-3">El Generador de Jobs Raúl Ruiz Torres está realizando el triaje del job</p>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-timeline-item>

                    <v-timeline-item class="mb-4" fill-dot color="green" small>
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
                                    <p class="my-3">Job generado por el generador de jobs Raúl Ruiz Torres y asignado a bandeja operadores</p>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-timeline-item>

                    <v-timeline-item class="mb-4" fill-dot color="red" small>
                        <v-card class="p-4">
                            <v-row justify="space-between">
                                <v-col cols="12">
                                    <v-chip
                                        class="white--text ml-0 w-full"
                                        color="red"
                                        label 
                                        >
                                            Error de versionado - 11:55 PM (10/02/2021)
                                    </v-chip>
                                    <p class="my-3">No se ha podido crear la versión del Job</p>
                                    <v-btn color="primary" small>Solucionar</v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-timeline-item>         

                  </v-timeline>
                </v-container>
              </template>

              <!-- hasta aqui -->

              <v-card-text>
                <p>
                  <!-- COMODIN -->
                </p>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <!--FIN LOG DE LA INCIDENCIA-->

          <!--DATOS ADJUNTOS-->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <p>
                  <!-- COMODIN -->
                </p>
              </v-card-text>
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
import axios from 'axios';

import Map from "@/components/common/Map";

export default {
  props: ["job", "error", "center"],

  name: "VerJob",

  components: {
    Map,
  },

  mixins: [getColor],

  created() {
    this.initialize();
  },

  watch: {
    job() {
      //lanza de nuevo initialize cuando detecta que hemos cambiado de incidencia en el menu
      //de lo contrario se genera un bug al cambiar de incidencia
            if(this.job.job) {
                this.initialize()
            }
    },
  },

  methods: {
    activateMap(active) {
      this.mapIsActive = active;
    },

    //inicializa la tabla de jobs asociados a la incidencia
    initialize() {
      //Enviamos señal sin cambio a map
      this.mapReset = false;
      (this.activeTab = 0);
      this.getErroresFromJob();

    },

    getErroresFromJob() {
        axios
        .get(`${process.env.VUE_APP_API_ROUTE}/error/`+ this.job.job)
        .then((data) => {
          this.erroresBruto = data.data.errores;
          for (this.elemento in this.erroresBruto) {
              this.errores.push(this.erroresBruto[this.elemento]);
            }
        })
        .catch((data) => {
          console.log(data)
        })
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

    storePolygonGeom() {
      //de momento solo puede almacenar 1 poligono
      this.geometries = this.features[0].geometry.coordinates;
      this.jobGeometry = [];
      //formateo de geometrias desde openlayers a postgis
      for (this.geometry in this.geometries) {
        for (this.index in this.geometries[this.geometry]) {
          this.coordinate = this.geometries[this.geometry][this.index];
          this.coordinate = JSON.stringify(this.coordinate);
          //borrar caracteres no deseados
          this.coordinate = this.coordinate.replace("[", "");
          this.coordinate = this.coordinate.replace("]", "");
          this.coordinate = this.coordinate.replace(",", " ");
          this.jobGeometry.push(this.coordinate);
        }
      }
      this.jobGeometry = '"POLYGON((' + this.jobGeometry + '))"';
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
        { text: "Descripcion", value: "descripcion" },
      ],

      mapReset: false,
      mapIsActive: false,
      activeTab: 0,
    };
  },
};
</script>
