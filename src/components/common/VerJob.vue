<template>
  <div>
    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
      <v-toolbar-title
      class="editJobTitle"
        >JOB - {{ job.job }}</v-toolbar-title
      >
    </v-toolbar>

    <!--MAIN-->
    <template>
      <v-card>
        <v-tabs
        fixed-tabs 
        background-color="#0341a6" 
        dark
        v-model="activeTab">
          <v-tab 
          class="tab"
          :key="1" 
          @click="activateMap(false)"
          >Datos del Job
          </v-tab>
          <v-tab 
          class="tab"
          :key="2"
          @click="activateMap(true)"
          >Localización en el Mapa
          </v-tab>
          <v-tab
          class="tab"
          :key="3" 
          @click="activateMap(false)"
          >Proceso
          </v-tab>
          <v-tabs-slider color="#76aff5"></v-tabs-slider>
          
          <!--DATOS DEL JOB-->
          <v-tab-item>  
            <v-card class="card" flat>
              <div class="dataTable">
                <h2>Jobs</h2>
                <v-data-table
                  :headers="jobHeaders"
                  :items="datosJob"
                  hide-default-footer
                >
                  <template v-slot:[`item.estado`]="{ item }">
                    <v-chip :color="getColor(item.estado)" dark>
                      {{ item.estado }}
                    </v-chip>
                  </template>
                </v-data-table>
              </div>

              <div class="dataTable">
                <h2>Errores Asociados</h2>
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
                      <h2>Este Job no tiene errores asociados</h2>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn 
                      title="Eliminar Error" 
                      icon 
                      dark>
                        <v-icon @click="confirmDelete(item)">
                          mdi-trash-can
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
              </div>
            </v-card>
          </v-tab-item>

          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat style="height:86vh">
              <Map
                v-if="mapIsActive == true"
                modoMapa="visualizar"
                :jobsRecibidos="editandoJob"
                :erroresRecibidos="errores"
              >
              </Map>
            </v-card>
          </v-tab-item>
          <!-- FIN LOCALIZACION EN EL MAPA -->

          <!--PROCESO-->
          <v-tab-item>
            <v-card class="card" flat>
              <Logger
                :jobsRecibidos="editandoJob"
                :erroresRecibidos="errores"
              ></Logger>
            </v-card>
          </v-tab-item>
          <!--PROCESO-->
        </v-tabs>

        <!-- ALERTA DATOS SIN GUARDAR (lo utilizamos también en mapa ¿sacar a componente? ) -->
        <v-overlay :value="showAlert">
            <v-card class="alertCard">
              <h1 class="alertCardTitle">ATENCIÓN</h1>
              <h4>
                Existen datos sin guardar ¿desea cerrar sin guardar los cambios?
              </h4>
              <v-card-actions>
                <div class="alertButtonGroup">
                  <v-btn
                    class="alertButton errorBtn"
                    dark
                    text
                    @click="showAlert = false"
                    >CANCELAR</v-btn
                  >
                  <v-btn
                    class="alertButton generateBtn"
                    dark
                    text
                    @click="closeWithoutSave()"
                    >OK</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-overlay>

        <!-- AVISO ELIMINAR ERRORES -->
        <v-overlay :value="showAlertError">
          <v-card class="alertCard">
            <h1 class="alertCardTitle">ATENCIÓN</h1>
            <h4>Esto borrara el error.</h4>
            <h4>El borrado es permanente y <b>no puede deshacerse</b>.</h4>
            <br/>
            <h3><b>¿Desea continuar?</b></h3>
            <v-card-actions>
              <div class="alertButtonGroup">
                <v-btn
                class="alertButton errorBtn"
                dark
                text
                @click="showAlertError = false"
                >
                CANCELAR
                </v-btn>
                <v-btn
                class="alertButton generateBtn"
                dark
                text
                @click="deleteError(errorBorrar)"
                >
                OK
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-overlay>

        <!--MENSAJES DE INFORMACION-->
        <v-overlay :value="showMessage">
          <v-alert
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
import { getColor } from "@/assets/mixins/getColor";
import { generarJobError } from "@/assets/mixins/generarJobError";
import { stringifyJobGeometry } from "@/assets/mixins/stringifyJobGeometry";
import { stringifyErrorGeometry } from "@/assets/mixins/stringifyErrorGeometry";

import axios from "axios";
import Map from "@/components/common/Map";
import Logger from "@/components/common/Logger";

export default {
  mixins: [
    getColor,
    generarJobError,
    stringifyJobGeometry,
    stringifyErrorGeometry,
  ],

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
    datosJobToDataTable() {
      //caso edicion devuelve arrays hay que convertir a objeto
      if (this.editandoJob.length > 0) {
        this.editandoJob = this.editandoJob[0];
        //añadimos atributos
        this.editandoJob.geometria = this.stringifyJobGeometry(
          this.editandoJob.geometria_json
        );
      }
      this.datosJob = [this.editandoJob];
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
            this.errores[this.elemento].job = this.job.id_job;
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

      //Borramos datos obtenidos, si no se duplican la siguiente vez que se abre
      this.errores = [];
      this.erroresBruto = [];
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

<style scoped>
.card {
  height: 87vh;
  padding: 0.5rem;
}

.editJobTitle, .tab, h2 {
  font-weight: 400 !important;
}

.generateBtn {
  background-color: #10b981;
}

.dataTable {
  margin: 1rem 1rem 2rem 1rem;
  padding: 1rem;
  background-color: #eceff1;
  border-radius: 3px;
}

/* ALERTA DATOS SIN GUARDAR */
.alertButtonGroup {
  margin: 0 auto;
}

.alertButton {
  width: 10rem;
  margin: 1rem;
}

</style>
