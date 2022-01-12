<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <div>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="checkData">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Alta de nuevos Jobs / Errores</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="toolbarBtn errorBtn"
          elevation="2"
          dark
          text
          @click="checkData"
          >CANCELAR</v-btn
        >
        <v-btn
          class="toolbarBtn saveBtn"
          elevation="2"
          dark
          text
          @click="saveData"
          >GUARDAR DATOS</v-btn
        >
        <v-btn
          class="toolbarBtn generateBtn"
          elevation="2"
          dark
          text
          @click="generateJobsErrors()"
          >GENERAR</v-btn
        >
      </v-toolbar>

      <template>
        <v-card>
          <v-tabs
            class="dialogContainer"
            fixed-tabs
            background-color="#0341a6"
            dark
          >
            <v-tab class="tab">Localización en el Mapa</v-tab>
            <v-tab class="tab">Resumen Jobs / Errores creados</v-tab>
            <v-tab class="tab">Datos Adjuntos</v-tab>

            <v-tabs-slider color="#76aff5"></v-tabs-slider>

            <!--LOCALIZACIÓN EN EL MAPA-->
            <v-tab-item>
              <v-card flat class="cardMap">
                <Map
                  @jobs="storeJobs"
                  @errores="storeErrors"
                  modoMapa="editar"
                ></Map>
              </v-card>
            </v-tab-item>
            <!-- FIN LOCALIZACION EN EL MAPA -->

            <!--RESUMEN DE JOBS Y ERRORES-->
            <v-tab-item>
              <v-card flat class="cardJob">
                <div class="dataTable">
                  <h2>Jobs</h2>
                  <v-data-table
                    :loading="jobLoading"
                    loading-text="Esperando jobs..."
                    :headers="jobHeaders"
                    :items="jobs"
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
                  <h2>Errores</h2>
                  <v-data-table
                    :loading="errorLoading"
                    loading-text="Esperando errores..."
                    :headers="errorHeaders"
                    :items="errores"
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
            </v-tab-item>

            <!--DATOS ADJUNTOS-->
            <v-tab-item>
              <v-card flat>
                EMPTY
              </v-card>
            </v-tab-item>
            <!-- FIN DATOS ADJUNTOS -->
          </v-tabs>

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

          <!--ALERTA DATOS SIN GUARDAR-->
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
                    @click="closeAlert"
                    >CANCELAR</v-btn
                  >
                  <v-btn
                    class="alertButton generateBtn"
                    dark
                    text
                    @click="closeDialog"
                    >OK</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-overlay>

          <!--LOADING-->
          <v-overlay :value="showLoading">
            <div>
              <div>
                <h3>Espere mientras se cargan los datos</h3>
              </div>
              <div>
                <v-progress-circular
                  :size="80"
                  :width="10"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
            </div>
          </v-overlay>
        </v-card>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import Map from "@/components/common/Map";
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJobError } from "@/assets/mixins/generarJobError.js";

export default {
  name: "altaJobsErrores",

  components: {
    Map,
  },

  mixins: [getColor, generarJobError],

  watch: {
    selectViaEntrada() {
      this.viaEntrada = this.selectViaEntrada;
    },

    selectProcedencia() {
      this.procedencia = this.selectProcedencia;
    },

    selectPrioridad() {
      this.prioridad = this.selectPrioridad;
    },

    jobs() {
      if (this.jobs.length != 0) {
        this.jobLoading = false;
      }
    },

    errores() {
      if (this.errores.length != 0) {
        this.errorLoading = false;
      }
    },
  },

  methods: {
    generateJobsErrors() {
      this.resultado = this.generarJobError(this.jobs, this.errores);
      if (this.resultado.procesadoOK == false) {
        this.showInfo(this.resultado.mensaje, "red");
        setTimeout(this.closeInfo, 2000);
      } else if (this.resultado.procesadoOK == true) {
        this.showInfo(this.resultado.mensaje, "green");
        setTimeout(this.closeInfo, 2000);
        //Cierre automático tras generar jobs y errores
        setTimeout(this.closeDialog, 2200);
      }
    },

    checkData() {
      if (
        (this.jobs.length != 0 && this.datosGuardados == false) ||
        (this.errores.length != 0 && this.datosGuardados == false)
      ) {
        this.openAlert();
      } else {
        this.closeDialog();
      }
    },

    openAlert() {
      this.showAlert = true;
    },

    closeAlert() {
      this.showAlert = false;
    },

    closeDialog() {
      this.dialog = false;
      //Al cerrar el dialogo devuelve el valor por defecto para GJ a loader
      //TODO: habría que definir el valor por defecto en una función global
      this.$emit("closed", "JobsTriajeGJ");
    },

    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },
    closeInfo() {
      this.showMessage = false;
    },

    storeJobs(jobs) {
      this.jobs = jobs;
    },

    storeErrors(errores) {
      this.errores = errores;
    },

    updateDataError() {
      axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateErrores` + this.errores)
        .then((data) => {
          console.log("Errores actualizados correctamente ", data);
        });
    },

    updateDataJobs() {
      axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateJobs` + this.jobs)
        .then((data) => {
          console.log("Jobs actualizados correctamente ", data);
        });
    },

    // GUARDAR DATOS MAESTRO
    saveData() {
      this.showLoading = true;
      this.log = {
        procesoJob: "GOT",
        usuario: localStorage.usuario,
        observaciones: "",
        departamento: "",
        resultadoCC: "",
      };
      this.jobsErrores = {
        jobs: this.jobs,
        errores: this.errores,
        log: this.log,
      };

      axios
        .post(
          `${process.env.VUE_APP_API_ROUTE}/postJobsErrores`,
          this.jobsErrores
        )
        .then((data) => {
          if (data.status == 201) {
            //Asignamos los id dados por la base de datos en la petición
            for (this.index in this.jobs) {
              this.jobs[this.index].job = data.data.jobs[this.index];
            }
            //Asignar idJob a los errores dentro de job
            for (this.index in this.errores) {
              for (this.asignIndex in data.data.errores) {
                if (
                  data.data.errores[this.asignIndex].asignado == true &&
                  data.data.errores[this.asignIndex].idInterno ==
                    this.errores[this.index].id
                ) {
                  this.errores[this.index].asocJob =
                    data.data.errores[this.asignIndex].job;
                  this.errores[this.index].idError =
                    data.data.errores[this.asignIndex].idError;
                }
              }
            }

            this.datosGuardados = true;
            this.showLoading = false;
            this.showInfo("Datos guardados correctamente", "green");
            setTimeout(this.closeInfo, 2000);
          } else {
            console.log(data.data.mensaje);
          }
        });
    },
  },

  data() {
    return {
      dialog: true,
      errores: [], //Almacen de errores
      jobs: [], //Almacen de jobs
      jobLoading: true, //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado jobs
      errorLoading: true, //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado errores
      showMessage: false, //Muestra mensajes de información en la parte inferior de la pantalla
      message: "", //Determina el texto mostrado en el mensaje de información
      messageType: "", //green para success, red para error, blue para info.

      jobHeaders: [
        { text: "Estado", value: "estado" },
        { text: "ID Job", value: "job" },
        { text: "Expediente", value: "expediente" },
        { text: "Perfil", value: "arreglo_job" },
        { text: "Detectado en", value: "deteccion_job" },
        { text: "Gravedad", value: "gravedad_job" },
        { text: "Asignado a", value: "tipo_bandeja" },
        { text: "Operador", value: "nombre_operador" },
        { text: "Descripción", value: "descripcion" },
      ],

      errorHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Id Error", value: "idError" },
        { text: "Asignado a Job", value: "asocJob" },
        { text: "Tipo Error", value: "tipo_error" },
        { text: "Tema Error", value: "tema_error" },
        { text: "Descripcion", value: "descripcion" },
      ],

      showAlert: false, //Muestra ventana de alerta
      datosGuardados: false, //Indica si los datos han sido guardados en base de datos.

      showLoading: false, //Muestra la pantalla de carga mientras los datos son almacenados
    };
  },
};
</script>

<style scoped>
.dialogContainer {
  height: 93vh;
}

.toolbarBtn {
  margin: auto 0.5rem;
  font-weight: 400 !important;
}

.tab {
  font-weight: 400 !important;
}

.cardMap {
  height: 88vh;
}

.cardJob {
  height: 86vh;
}

.cardJob > * > h2 {
  font-weight: 400 !important;
}

.errorBtn {
  background-color: #ef4444;
}

.saveBtn {
  background-color: #6b7280;
}

.generateBtn {
  background-color: #10b981;
}

/* RESUMEN JOBS ERRORES */
.dataTable {
  margin: 1rem 1rem 2rem 1rem;
  padding: 1rem;
  background-color: #eceff1;
  border-radius: 3px;
}

/*ALERTA DATOS NO GUARDADOS */
.alertCard {
  text-align: center;
  padding: 1rem;
}

.alertCardTitle {
  margin-bottom: 0.5rem;
}

.alertCard > * {
  font-weight: 400 !important;
}

.alertButtonGroup {
  margin: 0 auto;
}

.alertButton {
  width: 10rem;
  margin: 1rem;
}
</style>
