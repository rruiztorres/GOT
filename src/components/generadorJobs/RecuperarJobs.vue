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
                  <v-col cols="12" md="4">
                    <v-btn
                      class="button"
                      :disabled="groupActions()" 
                      dark color="warning" 
                      @click="recuperarTriaje()">
                      RECUPERAR A TRIAJE
                    </v-btn>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-btn
                      class="button"
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
          <template v-slot:no-data>
            <NoData :mensaje="noDataMensaje" :opcion="noDataOpcion"></NoData>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              class="editButton"
              elevation="2"
              @click="editItem(item)"
              icon
              dark
            >
              <v-icon> mdi-map </v-icon>
            </v-btn>
          </template>

        </v-data-table>

        
        <!-- VER EN MAPA -->
        <v-dialog
            v-if="showMap == true"
            style="heigth:100vh;"
            v-model="showMap"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="showMap = false"><v-icon>mdi-close</v-icon></v-btn>
            <v-toolbar-title class="editJobTitle"
              >VER JOB</v-toolbar-title
            >            
          </v-toolbar>
          <v-card class="mapCard">
            <Map
              :modoMapa="'visualizar'"
              :jobsRecibidos="jobEditar"
            ></Map>
          </v-card>
        </v-dialog>
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
import NoData from "@/components/common/NoData";
import Map from "@/components/common/Map";


export default {
  name: "RecuperarJobs",
  mixins: [getColor],
  components: {
    NoData,
    Map,
  },

  data: () => ({
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
      { text: "Ver en mapa", align: "center", sortable: false, value: "actions"},
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

    //VER EN MAPA
    showMap: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
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

    dialogClose() {
      this.dialog = false;
    },

    editItem(item) {
      this.showMap = true;
      this.jobEditar = item;
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

.button {
    width: 100%;
    font-weight: 400;
}

.textField {
  background-color: white;
  padding: 0.5rem;
}

.mapCard {
  height: 100vh;
}

</style>
