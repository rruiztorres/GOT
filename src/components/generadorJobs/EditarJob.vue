<template>
  <div>
    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="checkData"><v-icon>mdi-close</v-icon></v-btn>
      <v-toolbar-title
      class="editJobTitle"
        >EDITANDO JOB - {{ job.job }}</v-toolbar-title
      >
      <v-spacer></v-spacer>
        <v-btn 
          class="editJobBtn errorBtn"
          :disabled="mapIsActive === true || loggerIsActive === true"
          dark 
          text 
          @click="closeDialog"
          elevation="2"
          >CANCELAR
        </v-btn>
        <v-btn 
        class="editJobBtn saveBtn"
        :disabled="mapIsActive === true || loggerIsActive === true"
        dark 
        text 
        @click="updateDataBD"
        elevation="2"
        >GUARDAR DATOS
        </v-btn>
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
          @click="activateMap(false), activateLogger(false)"
          >Datos del Job
          </v-tab>
          <v-tab 
          class="tab"
          :key="2"
          @click="activateMap(true), activateLogger(false)"
          >Localización en el Mapa
          </v-tab>
          <v-tab
          class="tab"
          :key="3" 
          @click="activateMap(false), activateLogger(true)"
          >Proceso
          </v-tab>
          <v-tabs-slider color="#76aff5"></v-tabs-slider>
          
          <!--DATOS DEL JOB-->
          <v-tab-item>  
            <DatosJobErrores
              :job="[editandoJob]"
              :errores="errores"
            >
            </DatosJobErrores>
          </v-tab-item>

          <!--LOCALIZACIÓN EN EL MAPA-->
          <v-tab-item>
            <v-card flat style="height:86vh">
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

          <!--PROCESO-->
          <v-tab-item>
            <v-card class="card" flat>
              <Logger
                v-if="loggerIsActive == true"
                :jobsRecibidos="editandoJob"
                :erroresRecibidos="errores"
                @updateJobErrores="updateDataFromLogger"
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


import pointInPolygon from "point-in-polygon";

import axios from "axios";
import DatosJobErrores from "@/components/common/DatosJobErrores";
import Map from "@/components/common/Map";
import Logger from "@/components/common/Logger";

export default {
  mixins: [
    getColor,
    generarJobError,
  ],

  props: ["job"],

  computed: {
    returnJob() {
      return this.job;
    },
  },

  name: "EditarJob",

  components: {
    DatosJobErrores,
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
    initialize() {
      //Enviamos señal sin cambio a map
      this.activeTab = 0;
      //Evita crear claves duplicadas en el array de errores
      this.errores = [];
      if (this.errores.length == 0) {
        this.getErroresFromJobBD();
      }
    },

    updateDataFromLogger(data){
      data.job.estado = data.job.nuevoEstado;
      this.storeJobs([data.job])
    },

    closeWithoutSave() {
      this.showAlert = false;
      //Borramos ediciones sin guardar
      this.editandoJob = this.job;
      this.closeDialog();
    },

    editItem(item) {
      this.showEditJob = true;
      this.jobEditar = item;
    },

    closeEditJob(data) {
      this.showEditJob = data;
    },

    checkData() {
      if (this.edicionSinGuardar == true) {
        this.showAlert = true;
      } else {
        this.closeDialog();
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

    storeJobs(job) {
      this.editandoJob = job[0];
      //TODO: IMPLEMENTAR DETECCION DE CAMBIOS
      /*
      if (this.editandoJob.editado != undefined && this.editandoJob === true){
        this.edicionSinGuardar = true;
      }
      */
    },

    storeErrors(errores) {
      this.errores = errores;
      //TODO: IMPLEMENTAR DETECCION DE CAMBIOS
      /*
      for (this.index in errores) {
        if (this.errores[this.index].editado != undefined && this.errores[this.index].editado === true){
          this.edicionSinGuardar = true;
        }
      }
      */
    },

    activateMap(active) {
      this.mapIsActive = active;
    },

    activateLogger(active) {
      this.loggerIsActive = active;
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
      this.activateLogger(false);
      this.dialog = false;
      this.$emit("dialog", this.dialog);

      //Borramos datos obtenidos, si no se duplican la siguiente vez que se abre la consulta
      this.errores = [];
      this.erroresBruto = [];
    },

    errorInJob(polygon, point) {
      this.polygon = [polygon];
      this.point = [point.coordinates[0], point.coordinates[1]];
      this.inside = pointInPolygon(this.point, this.polygon[0]);
      return this.inside;
    },

    updateDataBD() {
      this.continue = true;
      this.errorDetectFuera = false;
      this.arrayPut = [];
      this.arrayPost = [];
      this.ejecucionPostError = true;
      this.ejecucionPutError = true;
      this.ejecucionPutJob = true;

      this.log = {
        idEventoLogger: 6, //JOB MODIFICADO
        procesoJob: "GOT",
        usuario: localStorage.usuario,
        observaciones: "",
        departamento: "",
        resultadoCC: "",
      };

      //ACTUALIZAMOS DATOS DEL JOB
      axios
      .put(`${process.env.VUE_APP_API_ROUTE}/updateJob`, [
        this.editandoJob,
        this.log,
      ])
      .then((data) => {
        if (data.status !== 201) {
          this.ejecucionPutJob = false;
        }
      })
      .catch((data) => {
        console.log(data);
      });

      //EXISTEN ERRORES FUERA DEL JOB?
      for (this.index in this.errores) {
        this.errorDentro = this.errorInJob(
          this.editandoJob.geometria.coordinates[0],
          this.errores[this.index].geometria
        );
        if (this.errorDentro == false) {
          this.continue = false;
          this.errorDetectFuera = true;
        }
      }

      //UPDATE O INSERT DE ERRORES?
      if (this.continue == true) {
        for (this.index in this.errores) {
          if (this.errores[this.index].error == null) {
            this.errores[this.index].job = this.job.id_job;
            this.arrayPost.push(this.errores[this.index]);
          } else {
            this.arrayPut.push(this.errores[this.index]);
          }
        }
      }

      //INSERT ERRORES
      if (this.continue == true) {
        axios
          .post(`${process.env.VUE_APP_API_ROUTE}/postError`, this.arrayPost)
          .then((data) => {
            if (data.status == 201) {
              //Actualizar numeros serie errores guardados
              for (this.index in this.errores) {
                for (this.indexCreados in data.data.errores) {
                  if (
                    data.data.errores[this.indexCreados].id ==
                    this.errores[this.index].id
                  ) {
                    this.errores[this.index].error =
                      data.data.errores[this.indexCreados].error;
                  }
                }
              }
            } else {
              this.ejecucionPostError = false;
            }
          });

        //UPDATE ERRORES
        axios
          .put(`${process.env.VUE_APP_API_ROUTE}/updateError`, this.arrayPut)
          .then((data) => {
            if (data.status !== 201) {
              this.ejecucionPutError = false;
            }
          });
      }

      //RESULTADO DE EJECUCIONES
      if (
        this.ejecucionPostError == true &&
        this.ejecucionPutError == true &&
        this.ejecucionPutJob == true
      ) {
        if (this.errorDetectFuera == false) {
          this.$emit("datosActualizados", true);
          this.edicionSinGuardar = false;
          this.showInfo("Datos actualizados correctamente", "green");
          setTimeout(this.closeInfo, 1500);
          setTimeout(this.closeDialog, 2000);
        } else {
          this.showInfo(
            "No pueden existir errores fuera del job, por favor revise los datos",
            "red"
          );
          setTimeout(this.closeInfo, 1500);
        }
      } else {
        this.showInfo(
          "Ocurrió un error inesperado, por favor revise los datos",
          "red"
        );
        setTimeout(this.closeInfo, 1500);
      }
    },
  },

  data() {
    return {
      errores: [],
      erroresBruto: [],
      

      mapReset: false,
      mapIsActive: false,
      activeTab: 0,

      showMessage: false,
      messageType: "",      //green para success, red para error, blue para info.
      message: "",

      showEditJob: false,
      jobEditar: null,
      edicionSinGuardar: false,

      //CAPACIDAD EDICION JOBS
      editandoJob: this.job,

      //ALERTA DATOS SIN GUARDAD
      showAlert: false,

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
    overflow-y: auto;
    overflow-x: hidden;
}

.editJobTitle, .editJobBtn, .tab, h2 {
  font-weight: 400 !important;
}

.editJobBtn{
  margin: 0.5rem;
}

.errorBtn {
  background-color: #ef4444;
}

.saveBtn {
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

.errorNoData {
  font-weight: 400 !important;
}

</style>
