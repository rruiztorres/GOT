<template>
  <div>
    <!--TOOLBAR SUPERIOR -->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="closeDialog()"><v-icon>mdi-close</v-icon></v-btn>
      <v-toolbar-title class="editJobTitle"
        >ASIGNAR ERRORES A JOB</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn
        class="fontControl editJobBtn errorBtn"
        dark
        text
        elevation="2"
        @click="closeDialog()"
        >CANCELAR
      </v-btn>
      <v-btn class="fontControl editJobBtn saveBtn" dark text elevation="2" @click="saveData()"
        >GUARDAR DATOS
      </v-btn>
      <v-btn class="fontControl editJobBtn generateBtn" dark text elevation="2"
        >GENERAR
      </v-btn>
    </v-toolbar>

    <!--MAIN-->
    <v-card>
      <v-tabs fixed-tabs background-color="#0341a6" dark>
        <v-tab class="fontControl" :key="1">Localización en el Mapa </v-tab>
        <v-tab class="fontControl" :key="2">Resumen Jobs / Errores creados </v-tab>
        <v-tabs-slider color="#76aff5"></v-tabs-slider>

        <!--LOCALIZACIÓN EN EL MAPA-->
        <v-tab-item>
          <v-card flat class="asignTabContent">
            <Map modoMapa="editar" :erroresRecibidos="erroresAsign" @jobs="getJobsFromMap"></Map>
          </v-card>
        </v-tab-item>

        <!--Resumen Jobs / Errores creados-->
        <v-tab-item>
          <v-card class="asignTabContent" flat>
            <div class="dataTable">
              <h2>Jobs</h2>
              <v-data-table
                :headers="jobHeaders"
                :items="jobsAsign"
                item-key="job"
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
                :items="erroresAsign"
                item-key="error"
                hide-default-footer
              >
                <template v-slot:[`item.estado`]="{ item }">
                  <v-chip :color="getColor(item.estado)" dark>
                    {{ item.estado }}
                  </v-chip>
                </template>

                <template v-slot:no-data>
                  <h1>No existen errores asociados al job</h1>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn class="errorBtn" title="Eliminar Error" icon dark>
                    <v-icon @click="dummy(item)">
                      mdi-trash-can
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-tab-item>
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

    </v-card>
  </div>
</template>

<script>
import Map from "@/components/common/Map";
import {getColor} from "@/assets/mixins/getColor";
import axios from 'axios';

export default {
  name: "mapaAsignarErrores",
  components: { Map },
  props: ["errores"],
  mixins: [getColor],

  data() {
    return {
      jobsAsign: [],
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
        { text: "Id Error", value: "error" },
        { text: "Asignado a Job", value: "job" },
        { text: "Tipo Error", value: "tipo_error" },
        { text: "Tema Error", value: "tema_error" },
        { text: "Descripcion", value: "descripcion" },
      ],

      // MENSAJES DE INFORMACION
      showMessage: false,
      messageType: 'success',
      message: null,
    };
  },

  beforeDestroy() {
    this.erroresAsign = [];
  },

  created() {
    this.erroresAsign = this.errores;
  },

  methods: {
    dummy() {
      console.log("hello world");
    },

    getJobsFromMap(jobs){
      this.jobsAsign = jobs;
    },

    closeDialog() {
      this.$emit("closeDialog", true);
    },

    closeMsgInfo(){
      this.showMessage = false;
    },

    saveData() {
      this.log = {
        procesoJob: "GOT",
        usuario: localStorage.usuario,
        observaciones: "Desde Errores no asignados. Se asocian a Job",
        departamento: "",
        resultadoCC: "",
      };

      this.jobsErrores = {
        jobs: this.jobsAsign,
        errores: this.erroresAsign,
        log: this.log,
      };

      
      //ACTUALIZACION EN BD
      axios
        .post(`${process.env.VUE_APP_API_ROUTE}/postJobsErrores`, this.jobsErrores)
        .then((data) => {
          if(data.status == 201){
            //ACTUALIZACION TABLA ERRORES
            for (this.index in this.erroresAsign){
              for (this.indexErr in data.data.errores){
                if (
                    data.data.errores[this.indexErr].asignado == true &&
                    data.data.errores[this.indexErr].id_error == this.erroresAsign[this.index].id_error
                  ){
                  this.erroresAsign[this.index].error = data.data.errores[this.indexErr].codigoError;
                  this.erroresAsign[this.index].job = data.data.errores[this.indexErr].job
                }
              }
            }
            //ACTUALIZACION TABLA JOBS
            for (this.index in this.jobsAsign){
              this.jobsAsign[this.index].job = data.data.jobs[this.index]
            }

            //ACTUALIZAR LA TABLA DEL COMPONENTE PADRE
            this.$emit("deleteErrores", this.erroresAsign)
          }
        })
    },
  },
};
</script>

<style scoped>
.tab {
  font-weight: 400 !important;
}

.fontControl {
  font-weight: 400 !important;
}


.asignTabContent {
  height: 86vh;
}

.editJobBtn {
  margin: 0.5rem;
}

.saveBtn {
  background-color: #6b7280;
}

/* RESUMEN JOBS ERRORES */
.dataTable {
  margin: 1rem 1rem 2rem 1rem;
  padding: 1rem;
  background-color: #eceff1;
  border-radius: 3px;
}

h2 {
  font-weight: 400 !important;
}
</style>
