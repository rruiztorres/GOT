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
                <v-btn
                :disabled="true" 
                class="btn" 
                dark 
                color="success">
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

        <!-- VENTANA JUSTIFICACIÓN DEVOLVER JOB-->
        <v-overlay 
          v-if="jobReturned != null"
          :value="showWindowReturnJob">
          <v-card 
          light class="returnJobWindow">
            <v-card-title
                class="returnJobWindowTitle"
                dark
                    >Devolver Job {{jobReturned.job}}
                    <v-spacer></v-spacer>
                </v-card-title>
            <div class="returnJobWindowWrapper">  
              <v-card-text>Por favor, <b>indique el motivo</b> por el cual desea devolver el Job.</v-card-text>
              <v-textarea
                class="textAreaJob"
                filled
                auto-grow
                :rules="[rules.required, rules.counter]"
                counter 
                v-model="justificacionJobDevuelto"
              ></v-textarea>
            </div>
              <v-card-actions class="returnJobWindowActions">
                <v-spacer></v-spacer>
                  <v-btn
                    class="button" 
                    color="error" 
                    @click="showWindowReturnJob = !showWindowReturnJob"
                  >
                  CANCELAR
                  </v-btn>
                  <v-btn
                    class="button" 
                    :disabled="justificacionJobDevuelto=='' || justificacionJobDevuelto.length >= 120"
                    color="success" 
                    @click="returnJob(jobReturned)"
                  >
                  ACEPTAR
                  </v-btn>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { checkBlocking } from "@/assets/mixins/checkBlocking.js";
import VerJob from "@/components/common/VerJob";
import NoData from "@/components/common/NoData";

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
    noDataMensaje:'Parece que no tienes ningún Job asignado aun...' ,
    noDataOpcion: 'Echa un vistazo por si hubiera algún job en bandeja que puedas ejecutar',

    //DEVOLVER JOB
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
      this.showWindowReturnJob = true;
      this.jobReturned = job;
    },

    returnJob(job){
      job.nuevoEstado = 'En bandeja';
      job.nombre_operador = null;
      
      //OBJECTO LOG
      this.log = {
        idEventoLogger: 12, //JOB DEVUELTO A BANDEJA GENÉRICA
        procesoJob: 'GOT',
        usuario: localStorage.usuario,
        observaciones: this.justificacionJobDevuelto,
        departamento: '',
        resultadoCC: '',
      }
      
      axios
      .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
      .then((data) => {
        if(data.status == 201){
          this.showWindowReturnJob = false;
          for (this.index in this.jobs){
            if (this.jobs[this.index].job == data.data.jobActualizado){
              this.jobs.splice(this.index, 1)
              this.message = `El Job ${data.data.jobActualizado} se ha devuelto a la bandeja ${job.tipo_bandeja}`
              this.messageType = 'success';
              this.showMessage = true;
              setTimeout(this.closeInfoMsg, 2000);
            }
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
      axios.get(`${process.env.VUE_APP_API_ROUTE}/jobs`).then((data) => {
        this.jobsBruto = data.data.response;
        for (this.elemento in this.jobsBruto) {
          //filtramos jobs, en bandeja, operadores especializados sin operador asignado
          if (
            this.jobsBruto[this.elemento].estado == "En bandeja_op" &&
            this.jobsBruto[this.elemento].nombre_operador ==
              localStorage.usuario
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

.returnJobWindow {
 margin: auto 1rem;
}

.returnJobWindowTitle{
  background-color: #039BE5;
  color: white;
  font-weight: 400 !important;
}

.returnJobWindowWrapper{
  padding: 0.5rem;
}

.returnJobWindowActions {
  background-color: #CFD8DC;
}

.button {
  font-weight: 400 !important;
}

</style>
