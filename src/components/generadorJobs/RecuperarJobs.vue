<template>
    <div class="panelContainer" >
      <div class="panelHeader">
        <h2 class="panelHeader-title">Recuperar Jobs</h2>
        <v-spacer></v-spacer>
        <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
          <v-icon x-large>mdi-help-box</v-icon>
        </v-btn>
      </div>

      <div>
        
        <!--PANEL ACCIONES SUPERIOR -->
        <v-card elevation="0">
          <v-row class="panelFuncionesCard">
              <v-col cols="12" md="6">
                <v-row class="buttonGroup">
                  <v-col cols="12" md="5">
                    <v-btn 
                      :disabled="groupActions()" 
                      dark color="success" 
                      @click="recuperarTriaje()">
                      RECUPERAR A TRIAJE
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-btn 
                      :disabled="groupActions()" 
                      dark color="error" >
                      RECHAZAR JOBS
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
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
          item-key="job"
          show-select
        >
          <template v-slot:top>
            <!-- VENTANA EDICION INCIDENCIA -->
            <v-dialog
              v-model="dialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <VerIncidencia
                @dialog="dialogClose"
                :incidencia="editedItem"
                :error="editedItem.geometria_error"
                :center="editedItem.geometria_error"
              ></VerIncidencia>
            </v-dialog>
            <!-- FIN VENTANA EDICION INCIDENCIA -->

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <h1>ATENCIÓN</h1>
                <h3>
                  Esta acción borrará la incidencia ¿Desea continuar?
                </h3>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn 
                  dark text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    dark
                    text
                    @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      </div>

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
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import VerIncidencia from "@/components/common/VerIncidencia";
import NoData from "@/components/common/NoData";


export default {
  name: "RecuperarJobs",
  mixins: [getColor],
  components: {
    VerIncidencia,
    NoData,
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
      { text: "Estado", align: "start", sortable: true, value: "estado"},
      { text: "Job", align: "start", sortable: true, value: "job"},
      { text: "Expediente", align: "start", sortable: true, value: ""},
      { text: "Gravedad", align: "start", sortable: true, value: "gravedad_job"},
      { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
      { text: "Perfil", align: "start", sortable: true, value: "arreglo_job"},
      { text: "Descripción", align: "start", sortable: true, value: "resumen"}, //hay que hacer desde API un "resumen" ademas de la desc completa
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
    showMessage: false,
    message: '',
    messageType: '',

    //NO DATA SLOT
    noDataMensaje: 'Vaya... parece que no hay Jobs que puedan recuperarse',
    noDataOpcion: 'Si existe algún problemá técnico puedes contactar con un administrador',
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

    editItem(){
      console.log("edit", this.editedItem)
    }
  },
  created() {
    this.initialize();
  },

  methods: {
    dummy() {
      //
    },
    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },

    recuperarTriaje(){
      for (this.index in this.selected){
        this.actualizarJob = {
            nuevoEstado: 'En triaje',
            nombre_operador: this.selected[this.index].nombre_operador,
            job: this.selected[this.index].job,
            id_job: this.selected[this.index].id_job
        };

        //Objeto Log
        this.log = {
            idEventoLogger: 10, //JOB RECUPERADO A TRIAJE
            procesoJob: 'GOT',
            usuario: localStorage.usuario,
            observaciones: '',
            departamento: '',
            resultadoCC: '',
        }
        axios
          .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [this.actualizarJob, this.log])
          .then ((data)=> {
            if (data != undefined){
              this.showInfo(`Los jobs se han devuelto a triaje con éxito`, "green");
              setTimeout(this.closeInfo, 2000);
              //actualizar array jobs
              for (this.index in this.jobs){
                for (this.selectIndex in this.selected){
                  if (this.jobs[this.index].job == this.selected[this.selectIndex].job){
                    this.jobs.splice(this.index,1);
                  } 
                }
              }
              this.selected = [];
            }
          })
      }
    },

    groupActions(){
      if (this.selected == 0){
        return true
      } else {
        return false
      }
    },

    initialize() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
        //se realiza el filtro para los jobs devueltos y la asignación del job_id
        .then((data) => {
          this.jobsBruto = data.data.response;
          for (this.elemento in this.jobsBruto) {
            //filtramos jobs segun estado
            if (this.jobsBruto[this.elemento].estado !== "En triaje") {
              this.jobs.push(this.jobsBruto[this.elemento]);
            }
          }
          
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
  background-color:white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
}

.panelHeader {
  display: flex;
}

.panelHeader-title{
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

</style>
