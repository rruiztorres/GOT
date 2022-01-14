<template>
  <div class="panelContainer">
    <!-- HEADER -->
    <div class="panelHeader">
      <h2 class="panelHeader-title">
        Bandeja de Jobs (Operadores)
      </h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <!-- CONTAINER -->
    <div>
      <!-- PANEL ACCIONES SUPERIOR -->
      <v-card elevation="0">
        <v-row class="panelFuncionesCard">
          <v-col cols="12" md="8">
            <v-row class="buttonGroup">
              <v-col cols="12" md="3">
                <v-btn class="btn" dark color="success">
                  ASIGNARME JOBS
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn class="btn" dark color="error">
                  DEVOLVER JOBS
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
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

      <!-- DATA TABLE -->
      <v-data-table
        class="dataTable"
        v-model="selected"
        :headers="headers"
        :items="jobs"
        :key="jobs.job"
        :search="search"
        item-key="job"
        show-select
      >

        <!-- VENTANA DATOS JOB, LOCALIZACION EN MAPA, PROCESO -->
        <template v-slot:top>
          <v-dialog
            style="heigth:100vh;"
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <VerJob :job="editedItem" @dialog="dialogClose"></VerJob>
          </v-dialog>
        </template>

        <!-- ACCIONES -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn title="Ver Job" 
            icon dark class="editButton" @click="editItem(item)">
            <v-icon> mdi-briefcase-eye </v-icon>
          </v-btn>
          <v-btn title="asignarme el job" 
            icon dark class="generateBtn" @click="asignJob(item)">
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
        </template>

        <!-- NO DATA -->
        <template v-slot:no-data>
          <NoData :mensaje="noDataMensaje" :opcion="noDataOpcion"></NoData>
        </template>

        <!-- COLORES ESTADO  -->
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            {{ item.estado }}
          </v-chip>
        </template>

        <!-- ICONOS BLOQUEO  -->
        <template v-slot:[`item.bloqueado`]="{ item }">
          <v-icon v-if="checkBlocking(item.bloqueado) == false" color="red">
            mdi-block-helper
          </v-icon>
        </template>
      </v-data-table>

      <!-- MENSAJES DE INFORMACIÓN -->
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { checkBlocking } from "@/assets/mixins/checkBlocking.js";
import NoData from "@/components/common/NoData";
import VerJob from "@/components/common/VerJob";

export default {
  name: "BandejaOpEsp",
  mixins: [getColor, checkBlocking],
  components: { NoData, VerJob },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
      { text: "BL.", align: "start", sortable: true, value: "bloqueado" },
      { text: "Estado", align: "start", sortable: true, value: "estado" },
      { text: "Job", align: "start", sortable: true, value: "job" },
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
      id_inc: "",
      job_estado: "",
      job_prioridad: "",
      job_detectado: "",
      job_arreglar: "",
    },
    defaultItem: {
      id_inc: "",
      job_estado: "",
      job_prioridad: "",
      job_detectado: "",
      job_arreglar: "",
    },

    //NO DATA SLOT
    noDataMensaje: "Vaya... parece que no existen jobs para mostrar aquí.",
    noDataOpcion: "Si necesitas jobs para trabajar puedes generar alguna IDV",

    //MENSAJES INFORMACIÓN
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
      console.log();
    },

    asignJob(job){
      job.nuevoEstado = 'En bandeja_op';
      job.nombre_operador = localStorage.usuario;
      
      //OBJECTO LOG
      this.log = {
          idEventoLogger: 11, //JOB SELECCIONADO PARA TRABAJAR
          procesoJob: 'GOT',
          usuario: localStorage.usuario,
          observaciones: '',
          departamento: '',
          resultadoCC: '',
      }

      axios
      .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
      .then((data) => {
        for (this.index in this.jobs){
          if (this.jobs[this.index].job == data.data.jobActualizado){
            this.jobs.splice(this.index, 1)
            this.message = `Te has asignado correctamente el job ${data.data.jobActualizado}`
            this.messageType = 'success';
            this.showMessage = true;
            setTimeout(this.closeInfoMsg, 2000);
          }
        }
      })
    },

    closeInfoMsg(){
      this.showMessage = false;
    },

    editItem(item) {
      this.editedIndex = this.jobs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    initialize() {
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
      .then((data) => {
        this.jobsBruto = data.data.response;
        for (this.elemento in this.jobsBruto) {
          //filtramos jobs, en bandeja, operadores sin operador asignado
          if (
            this.jobsBruto[this.elemento].estado == "En bandeja" &&
            this.jobsBruto[this.elemento].tipo_bandeja ==
              "Operadores" &&
            this.jobsBruto[this.elemento].nombre_operador == null
          ) {
            this.jobs.push(this.jobsBruto[this.elemento]);
          }
        }
      });
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

h2,
h4 {
  font-family: 300 !important;
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

.buttonGroup {
  padding: 0.5rem;
}

.textField {
  background-color: white;
  padding: 0.5rem;
}

.noData {
  padding: 1rem;
}

.saveButton {
  background-color: #4287f5;
  margin-right: 0.25rem;
}
</style>
