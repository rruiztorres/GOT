<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Jobs en Triaje</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <div>
      <!--PANEL ACCIONES SUPERIOR -->
      <v-card elevation="0">
        <v-row class="panelFuncionesCard">
          <v-col cols="12" md="8">
            <v-row class="buttonGroup">
              <v-col cols="12" md="3">
                <v-btn
                  class="btn"
                  :disabled="groupActions()"
                  dark
                  color="success"
                  @click="groupGenerate()"
                >
                  GENERAR JOBS
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  class="btn"
                  :disabled="groupActions()"
                  dark
                  color="#71717A"
                  @click="groupAsignExp()"
                >
                  ASIGNAR EXP.
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  class="btn"
                  :disabled="groupActions()"
                  dark
                  color="warning"
                  @click="groupDesestimar()"
                >
                  DESESTIMAR
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  class="btn"
                  :disabled="groupActions()"
                  dark
                  color="error"
                  @click="deleteJobs()"
                >
                  ELIMINAR
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              class="textField"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-data-table
        class="dataTable"
        v-model="selected"
        :headers="headers"
        :items="jobs"
        :search="search"
        group-by="expediente"
        item-key="job"
        show-select
      >
        <template v-slot:top>
          <!-- VENTANA EDICION JOB -->
          <v-dialog
            style="heigth:100vh;"
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <EditarJob
              @datosActualizados="updateData"
              @dialog="dialogClose"
              :job="editedItem"
            ></EditarJob>
          </v-dialog>

          <!-- ALERTA BORRADO JOBS -->
          <v-overlay :value="dialogDelete">
            <v-card class="alertCard">
              <h1 class="alertCardTitle">ATENCIÓN</h1>
              <h4>Esta acción borrará el Job y todos los errores asociados.</h4>
              <h4>El borrado es permanente y <b>no puede deshacerse</b></h4>
              <br />
              <h3><b>¿Desea continuar?</b></h3>
              <v-card-actions>
                <div class="alertButtonGroup">
                  <v-btn
                    class="alertButton errorBtn"
                    dark
                    text
                    @click="dialogDelete = !dialogDelete"
                    >CANCELAR</v-btn
                  >
                  <v-btn
                    class="alertButton generateBtn"
                    dark
                    text
                    @click="confirmDeleteJobs()"
                    >OK</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-overlay>

          <!-- ALERTA DESESTIMAR JOBS -->
          <v-overlay :value="dialogDesestimar">
            <v-card class="alertCard">
              <h1 class="alertCardTitle">ATENCIÓN</h1>
              <h4>Esta acción desestimará el job y los errores asociados</h4>
              <h4>
                La desestimación es permanente y <b>no puede deshacerse</b>
              </h4>
              <br />
              <h3><b>¿Desea continuar?</b></h3>
              <v-card-actions>
                <div class="alertButtonGroup">
                  <v-btn
                    class="alertButton errorBtn"
                    dark
                    text
                    @click="dialogDesestimar = !dialogDesestimar"
                    >CANCELAR</v-btn
                  >
                  <v-btn
                    class="alertButton generateBtn"
                    dark
                    text
                    @click="showWindowJustify = true"
                    >OK</v-btn
                  >
                </div>
              </v-card-actions>
            </v-card>
          </v-overlay>

          <!-- VENTANA JUSTIFICACIÓN DEVOLVER JOB-->
          <v-overlay :value="showWindowJustify">
            <JustificarAccion
              title="Desestimar Job/s"
              text="Indique el motivo por el cual desea desestimar"
              @close="getJustification"
            ></JustificarAccion>
          </v-overlay>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="editButton"
            elevation="2"
            @click="editItem(item)"
            icon
            dark
          >
            <v-icon> mdi-lead-pencil </v-icon>
          </v-btn>
        </template>

        <template v-slot:no-data>
          <NoData :mensaje="noDataMensaje" :opcion="noDataOpcion"></NoData>
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
        <v-card light class="asignExpContainer">
          <v-card-title class="asignExpTitle"
            >Asignación de Expediente
            <v-spacer></v-spacer>
            <v-card-actions>
              <div>
                <v-btn
                  text
                  dark
                  class="errorBtn expBtn"
                  elevation="2"
                  @click="showExpSelect = !showExpSelect"
                  >CANCELAR</v-btn
                >
                <v-btn
                  text
                  dark
                  class="generateBtn expBtn"
                  elevation="2"
                  :disabled="expediente == null"
                  @click="asignExpToSelect()"
                  >ASIGNAR A SELECCIÓN</v-btn
                >
              </div>
            </v-card-actions>
          </v-card-title>
          <v-row class="asignExpInfoContainer">
            <v-col>
              <div>
                <div>
                  <v-card-text>Seleccione un expediente </v-card-text>
                  <v-select
                    :items="expedientes"
                    v-model="expediente"
                    label="Expediente"
                    solo
                    light
                  ></v-select>
                </div>

                <v-card-title>Información</v-card-title>
                <div
                  class="asignExpTable"
                  v-if="
                    expedienteInfo[0].observaciones != null &&
                      expedienteInfo[0].fecha
                  "
                >
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td class="text-left">Observaciones</td>
                          <td>
                            <span
                              class="asignExpObser"
                              v-html="expedienteInfo[0].observaciones"
                            ></span>
                          </td>
                        </tr>
                        <tr>
                          <td class="text-left">Fecha Alta</td>
                          <td v-html="expedienteInfo[0].fecha"></td>
                        </tr>
                        <tr>
                          <td class="text-left">Estado</td>
                          <td v-html="expedienteInfo[0].finalizado"></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>

                <div class="asignExpTable" v-else>
                  <div>Seleccione un expediente para ver información</div>
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
import { generarJobError } from "@/assets/mixins/generarJobError";
import { stringifyJobGeometry } from "@/assets/mixins/stringifyJobGeometry";
import { desestimarJobs } from "@/assets/mixins/proceso/desestimarJobs";

import NoData from "@/components/common/NoData";
import EditarJob from "@/components/generadorJobs/EditarJob";
import JustificarAccion from "@/components/common/JustificarAccion";

export default {
  name: "JobsTriajeGJ",
  mixins: [getColor, generarJobError, stringifyJobGeometry, desestimarJobs],
  components: {
    EditarJob,
    NoData,
    JustificarAccion,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogDesestimar: false,
    justificacionJobDesestimado: "",
    selected: [],
    search: "",
    headers: [
      { text: "Estado", align: "start", sortable: true, value: "estado" },
      { text: "Job", align: "start", sortable: true, value: "job" },
      {
        text: "Expediente",
        align: "start",
        sortable: true,
        value: "expediente",
      },
      {
        text: "Gravedad",
        align: "start",
        sortable: true,
        value: "gravedad_job",
      },
      {
        text: "Detectado en",
        align: "start",
        sortable: true,
        value: "deteccion_job",
      },
      { text: "Perfil", align: "start", sortable: true, value: "arreglo_job" },
      { text: "Descripción", align: "start", sortable: true, value: "resumen" }, //hay que hacer desde API un "resumen" ademas de la desc completa
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
      resumen: "",
    },
    defaultItem: {
      estado: "",
      job: "",
      expediente: "",
      gravedad_job: "",
      deteccion_job: "",
      arreglo_job: "",
      resumen: "",
    },

    showMessage: false,
    message: "",
    messageType: "",

    showWindowJustify: false,
    rules: {
      required: (value) => !!value || "Este campo es obligatorio.",
      counter: (value) => value.length <= 120 || "Máximo 120 caracteres",
    },

    //MANEJO EXPEDIENTES
    showExpSelect: false,
    expedientes: [],
    expediente: null,
    expedienteInfo: [
      {
        fecha: null,
        observaciones: null,
        finalizado: null,
      },
    ],

    //NO DATA SLOT
    noDataMensaje: "En estos momentos no existen Jobs que requieran triaje.",
    noDataOpcion:
      "Echa un vistazo a los errores sin asignar por si puedes generar nuevos Jobs.",
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    dialogDelete(val) {
      val || this.closeDelete();
    },

    expediente() {
      if (this.expediente != null) {
        axios
          .get(`${process.env.VUE_APP_API_ROUTE}/expediente/` + this.expediente)
          .then((data) => {
            this.expedienteInfo[0].fecha = data.data.respuesta[0].fecha.slice(
              0,
              10
            );
            this.expedienteInfo[0].observaciones =
              data.data.respuesta[0].observaciones;
            if (data.data.respuesta[0].finalizado == true) {
              this.expedienteInfo[0].finalizado = "Finalizado";
            } else {
              this.expedienteInfo[0].finalizado = "Abierto";
            }
          });
      }
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    groupDesestimar() {
      this.dialogDesestimar = true;
    },

    getJustification(data) {
      if (data != "") {
        this.observaciones = data;
        this.desestimateJobs(this.observaciones);
      } else {
        this.dialogDesestimar = false;
        this.showWindowJustify = false;
        this.selected = [];
      }
    },

    desestimateJobs(observaciones) {
      this.dialogDesestimar = false;
      this.showWindowJustify = false;
      this.ejecucion = this.desestimarJobs(this.selected, observaciones);
      if (this.ejecucion == 0) {
        for (this.index in this.jobs) {
          for (this.indexSelection in this.selected) {
            if (
              this.selected[this.indexSelection].id_job ==
              this.jobs[this.index].id_job
            ) {
              this.jobs.splice(this.index, 1);
            }
          }
        }
        this.showInfo(
          "Los jobs seleccionados se han desestimado correctamente",
          "green"
        );
        setTimeout(this.closeInfo, 1500);
      }
    },

    asignExpToSelect() {
      //Asigna el expediente a la seleccion de jobs actual
      for (this.index in this.selected) {
        this.selected[this.index].geometria = this.stringifyJobGeometry(
          this.selected[this.index].geometria_json
        );
        this.selected[this.index].expediente = this.expediente;

        axios
          .put(`${process.env.VUE_APP_API_ROUTE}/updateJob`, [
            this.selected[this.index],
          ])
          .then((data) => {
            this.showExpSelect = false;
            this.selected = [];
            if (data.status == 201) {
              this.showInfo(
                "El expediente ha sido asignado a los jobs seleccionados",
                "green"
              );
              setTimeout(this.closeInfo, 1500);
            } else {
              this.showInfo(data.data.mensaje, "red");
              setTimeout(this.closeInfo, 1500);
            }
          });
      }
    },

    groupAsignExp() {
      this.showExpSelect = true;
      this.getExpedientes();
    },

    getExpedientes() {
      axios.get(`${process.env.VUE_APP_API_ROUTE}/expedientes`).then((data) => {
        for (this.index in data.data.respuesta) {
          this.expedientes.push(data.data.respuesta[this.index].expediente);
        }
      });
    },

    deleteJobs() {
      this.dialogDelete = true;
    },

    confirmDeleteJobs() {
      const deleteJobs = this.selected;
      axios
        .delete(`${process.env.VUE_APP_API_ROUTE}/deleteJobs`, {data: deleteJobs,})
        .then((data) => {
          if (data.status == 201) {
            this.showInfo(data.data.mensaje, "green");
            setTimeout(this.closeInfo, 1500);

            //Actualizar array jobs
            for (this.index in this.jobs) {
              for (this.indexSelection in this.selected) {
                if (this.selected[this.indexSelection].id_job === this.jobs[this.index].id_job) {
                  this.jobs.splice(this.index, 1);
                }
              }
            }
            //Deseleccionar jobs eliminados
            this.selected = [];
          } else {
            this.showInfo(data.data.mensaje, "red");
            setTimeout(this.closeInfo, 1500);
          }
          this.dialogDelete = false;
        });
    },

    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },

    groupGenerate() {
      //Recuperar errores por cada job
      for (this.index in this.selected) {
        const jobAGenerar = [this.selected[this.index]];
        axios
          .get(`${process.env.VUE_APP_API_ROUTE}/error/` + jobAGenerar[0].job)
          .then((data) => {
            if (data.data.errores != undefined) {
              //El job tiene errores asociados
              this.erroresGenerar = data.data.errores;
            } else {
              //El job no tiene errores asociados.
              this.erroresGenerar = [];
            }
            this.generarJobError(jobAGenerar, this.erroresGenerar);
          });
      }

      //actualizar array jobs
      for (this.index in this.jobs) {
        for (this.selIndex in this.selected) {
          if (this.jobs[this.index].job == this.selected[this.selIndex].job) {
            this.jobs.splice(this.index, 1);
          }
        }
      }

      //info
      this.showInfo("jobs generados correctamente", "green");
      setTimeout(this.closeInfo, 1500);

      //Deseleccionar
      this.selected = [];
      this.search = "";
    },

    groupActions() {
      if (this.selected == 0) {
        return true;
      } else {
        return false;
      }
    },

    updateData(data) {
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
            if (
              this.jobsBruto[this.elemento].estado == "En triaje" ||
              this.jobsBruto[this.elemento].estado == "En consulta"
            ) {
              this.jobs.push(this.jobsBruto[this.elemento]);
            }
          }
        })
        .catch((data) => {
          console.log(data);
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

.panelContainer {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
}

.panelHeader {
  display: flex;
}

.panelHeader-title {
  font-weight: 500;
  margin-bottom: 2rem;
}

.panelFuncionesCard {
  background-color: #4287f5;
}

.dataTable {
  margin-top: 1rem;
}

.buttonGroup {
  padding: 0.5rem;
}

.btn {
  width: 100%;
  font-weight: 400;
}

.textField {
  background-color: white;
  padding: 0.5rem;
}

.editButton {
  background-color: #4287f5;
}

/* ALERTA BORRADO */
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

.errorBtn {
  background-color: #ef4444;
}

.generateBtn {
  background-color: #10b981;
}

/* SELECCION DE EXPEDIENTES */
.asignExpContainer {
  width: 40vw;
  min-width: 430px;
}

.asignExpTitle {
  font-weight: 400 !important;
  background-color: #4287f5;
  color: white;
}

.asignExpInfoContainer {
  padding: 1rem;
}

.expBtn {
  margin: 0.25rem 0.25rem;
  font-weight: 400 !important;
}

.asignExpTable {
  padding: 0.5rem;
  background-color: #cfd8dc;
  border-radius: 4px;
}
.asignExpObser > p {
  margin-bottom: 0rem;
}
</style>
