<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Mis Jobs</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <div>
      <!-- PANEL ACCIONES SUPERIOR -->
      <v-card elevation="0">
        <v-row class="panelFuncionesCard">
          <v-col cols="12" md="8">
            <v-row class="buttonGroup">
              <v-col cols="12" md="3">
                <!-- -->
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
        :sort-by.sync="sortBy"
      >
        <template v-slot:top>
          <v-dialog
            style="heigth:100vh;"
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <VerJob 
            :job="editedItem"
            @dialog="dialogClose"
            ></VerJob>
          </v-dialog>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            title="Ver Job"
            class="editButton"
            elevation="2"
            @click="editItem(item)"
            icon
            dark           
          >
            <v-icon > mdi-briefcase-eye </v-icon>
          </v-btn>
          <v-btn
            v-if="  item.estado != 'Ejecución' && 
                    item.estado != 'Pausa' && 
                    item.estado != 'Versión generada'"
            title="Devolver A Bandeja"
            class="returnButton"
            elevation="2"
            @click="justifyReturnJob(item)"
            icon dark           
          >
            <v-icon > mdi-thumb-down </v-icon>
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

        <template v-slot:[`item.bloqueado`]="{ item }">
          <v-icon v-if="checkBlocking(item.bloqueado) == false" color="red">
            mdi-block-helper
          </v-icon>
        </template>
      </v-data-table>

        <!-- VENTANA JUSTIFICACIÓN DEVOLVER JOB -->
        <v-overlay 
          v-if="jobReturned != null"
          :value="showWindowJustify">       
          <JustificarAccion 
            title="Devolver Job a bandeja"
            text="Indique el motivo por el cual desea devolver el Job:"
            @close="getJustifyReturnJob"          
          ></JustificarAccion>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { checkBlocking } from "@/assets/mixins/checkBlocking.js";
import { returnJob } from "@/assets/mixins/proceso/returnJob";
import VerJob from "@/components/common/VerJob";
import NoData from "@/components/common/NoData";
import JustificarAccion from "@/components/common/JustificarAccion";

export default {
  name: "BandejaOpEsp",
  mixins: [getColor, checkBlocking, returnJob,],
  components: { NoData, VerJob, JustificarAccion },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    sortBy: 'estado',
    headers: [
      { text: "BL.", align: "start", value: "bloqueado" },
      { text: "Estado", align: "start", value: "estado" },
      { text: "Job", align: "start", value: "job" },
      {
        text: "Gravedad",
        align: "start",
        value: "gravedad_job",
      },
      {
        text: "Detectado en",
        align: "start",
        value: "deteccion_job",
      },
      { text: "Perfil", align: "start", value: "arreglo_job" },
      { text: "Descripción", align: "start", value: "resumen" }, //hay que hacer desde API un "resumen" ademas de la desc completa
      { text: "Acciones", value: "actions"},
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
    noDataMensaje:'Parece que no tienes ningún Job asignado aun...' ,
    noDataOpcion: 'Echa un vistazo por si hubiera algún job en bandeja que puedas ejecutar',

    //DEVOLVER JOB
    showWindowJustify: false,
    showWindowReturnJob: false,
    justificacionJobDevuelto: '',
    jobReturned: null,
    rules: {
      required: value => !!value || 'Este campo es obligatorio.',
      counter: value => value.length <= 120 || 'Máximo 120 caracteres'
    },

    //MENSAJES INFORMACIÓN
    showMessage: false,
    messageType: '',
    message: '',
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

    justifyReturnJob(job){
      this.showWindowJustify = true;
      this.jobReturned = job;
    },

    getJustifyReturnJob(data){
      this.showWindowJustify = false;
      if (data !== ''){
        this.justificacionJobDevuelto = data;
        this.proceso = this.returnJob(this.jobReturned);

        if (this.proceso === 0) {      
          this.showWindowReturnJob = false;
          for (this.index in this.jobs){
            if (this.jobs[this.index].job == this.jobReturned.job){
              this.jobs.splice(this.index, 1)
              this.message = `El Job ${this.jobReturned.job} se ha devuelto a la bandeja ${this.jobReturned.tipo_bandeja}`
              this.messageType = 'success';
              this.showMessage = true;
              setTimeout(this.closeInfoMsg, 2000);
            }
          }
        } else {
            this.message = 'Error inesperado, por favor revise los datos';
            this.messageType = 'error';
            this.showMessage = true;
            setTimeout(this.closeInfoMsg, 2000);
        }
      }
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
      //REINICIO DE JOBS SI EXISTEN
      this.jobs = [];
      axios.get(`${process.env.VUE_APP_API_ROUTE}/jobs`).then((data) => {
        this.jobsBruto = data.data.response;
        for (this.elemento in this.jobsBruto) {
          //filtramos jobs, en bandeja, operadores especializados sin operador asignado
          if (
            this.jobsBruto[this.elemento].estado == "En bandeja_op" ||
            this.jobsBruto[this.elemento].estado == "Versión generada" ||
            this.jobsBruto[this.elemento].estado == "Pausa" ||
            this.jobsBruto[this.elemento].estado == "Ejecución" ||
            this.jobsBruto[this.elemento].estado === "Error_fin para usuario"          
            ) {
              if (this.jobsBruto[this.elemento].nombre_operador == localStorage.usuario){
                this.jobs.push(this.jobsBruto[this.elemento]);
              }
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

.buttonGroup {
  padding: 0.5rem;
}

.textField {
  background-color: white;
  padding: 0.5rem;
}

.editButton {
  background-color:#4287f5;
  margin-right: 0.25rem;
}

.returnButton {
  background-color: #ef4444;
  margin-right: 0.25rem;
}

.button {
  font-weight: 400 !important;
}

</style>
