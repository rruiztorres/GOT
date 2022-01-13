<template>
  <v-card>
    <v-card-title class="titleJobForm" dark
      >Edición de Job
      <v-spacer></v-spacer>
    </v-card-title>

    <div>
      <!--TextEditor descripciones error-->
      <v-col cols="12">
        <v-textarea
          counter
          class="textAreaJob"
          v-model="descJob"
          dense
          filled
          auto-grow
          :rules="[jobRules.required, jobRules.counter]"
          label="Descripción del Job"
        ></v-textarea>
      </v-col>

      <v-divider></v-divider>

      <v-col cols="12">
        <v-row class="formRow">
          <v-col cols="4"> Job Grande: </v-col>
          <v-col cols="8" class="vColJobGran">
            <v-switch
              class="switchBigJob"
              inset
              v-model="jobGrande"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row class="formRow">
          <v-col class="formRowTitle" cols="4"> Expediente </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="expediente"
              v-model="expedienteJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="formRow">
          <v-col class="formRowTitle" cols="4"> Detectado en: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="deteccion"
              v-model="deteccionJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="formRow">
          <v-col class="formRowTitle" cols="4"> Perfil job: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="perfil"
              v-model="perfilJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="formRow">
          <v-col class="formRowTitle" cols="4"> Gravedad: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="gravedad"
              v-model="gravedadJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="formRow">
          <v-col class="formRowTitle" cols="4"> Asignar a: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="asignacion"
              v-model="asignacionJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row v-if="asignacionJob == 'Bandeja de Jobs'" class="formRow">
          <v-col class="formRowTitle" cols="4"> Enviar a: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="tipoBandeja"
              v-model="tipoBandejaJob"
            ></v-select>
          </v-col>
        </v-row>

        <v-row v-if="asignacionJob == 'Bandeja de Jobs'" class="formRow">
          <v-col class="formRowTitle" cols="4"> Operador: </v-col>
          <v-col cols="8">
            <v-select
              dense
              filled
              :items="nombreOperador"
              v-model="nombreOperadorJob"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>

      <v-card-actions class="actionForm">
        <v-spacer></v-spacer>
        <v-btn 
          class="button"
          color="error" 
          dark 
          @click="closeEditJob()"
        > 
        CANCELAR
        </v-btn>
        <v-btn
          class="button"
          color="success"
          :dark="!disableAceptarJob"
          @click="storeJobData()"
          :disabled="disableAceptarJob || descJob.length == 0"
          >ACEPTAR
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import { makeArrayFromApi } from "@/assets/mixins/makeArrayFromApi.js";

export default {
  name: "FormularioDatosJob",
  mixins: [makeArrayFromApi],

  mounted() {
    this.getJobParameters();
  },

  props: ["job"],

  computed: {
    returnJob() {
      return this.job;
    },
  },

  watch: {
    descJob() {
      if (this.descJob.length >= 255 || this.descJob.length == 0) {
        this.disableAceptarJob = true;
      } else {
        this.disableAceptarJob = false;
      }
    },
  },

  methods: {
    dummy() {
      //
    },

    closeEditJob() {
      this.$emit("closeEditJob", false);
    },

    storeJobData() {
      this.job.asignacion_job = this.asignacionJob;
      this.job.descripcion = this.descJob;
      this.job.deteccion_job = this.deteccionJob;
      this.job.expediente = this.expedienteJob;
      this.job.gravedad_job = this.gravedadJob;
      this.job.job_grande = this.jobGrande;
      this.job.nombre_operador = this.nombreOperadorJob;
      this.job.arreglo_job = this.perfilJob;
      this.job.tipo_bandeja = this.tipoBandejaJob;

      //Emitir cambios y cerrar
      this.$emit("editedJob", this.editedJob);
      this.closeEditJob();
    },

    getJobParameters() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/jobParameters`)
        .then((data) => {
          this.objeto = data.data;
          //makeArrayFromApi (objetoAPI, arrayCrear, columnaBD)
          this.makeArrayFromApi(
            this.objeto.expediente,
            this.expediente,
            "expediente"
          );
          this.makeArrayFromApi(
            this.objeto.asignacion,
            this.asignacion,
            "asignacion"
          );
          this.makeArrayFromApi(
            this.objeto.deteccion,
            this.deteccion,
            "deteccion"
          );
          this.makeArrayFromApi(
            this.objeto.gravedad,
            this.gravedad,
            "gravedad"
          );
          this.makeArrayFromApi(
            this.objeto.operador,
            this.nombreOperador,
            "nombre_operador"
          );
          this.makeArrayFromApi(this.objeto.perfilJob, this.perfil, "arreglo");
          this.makeArrayFromApi(
            this.objeto.tipoBandeja,
            this.tipoBandeja,
            "tipo_bandeja"
          );

          //Valores preasignados del job a editar
          this.descJob = this.job.descripcion;
          this.jobGrande = this.job.job_grande;
          this.expedienteJob = this.job.expediente;
          this.deteccionJob = this.job.deteccion_job;
          this.perfilJob = this.job.arreglo_job;
          this.gravedadJob = this.job.gravedad_job;
          this.asignacionJob = this.job.asignacion_job;
          this.tipoBandejaJob = this.job.tipo_bandeja;
          this.nombreOperadorJob = this.job.nombre_operador;
        });
    },
  },

  data() {
    return {
      //FORMULARIO ALTA JOB
      editJob: false, //Visibilidad ventana editar atributos
      descJob: "", //TextArea Descripcion Job
      jobGrande: false, //Valor
      expediente: [],
      expedienteJob: [],
      deteccion: [], //Array desde BD llenar en initialize
      deteccionJob: [], //Toma por defecto primer valor
      perfil: [], //Array desde BD llenar en initialize
      perfilJob: [],
      gravedad: [], //Array desde BD llenar en initialize
      gravedadJob: [],
      asignacion: [], //Array desde BD llenar en initialize
      asignacionJob: [],
      tipoBandeja: [], //Array desde BD llenar en initialize
      tipoBandejaJob: [],
      nombreOperador: [], //Array desde BD llenar en initialize
      nombreOperadorJob: [],
      jobRules: {
        required: (value) => !!value || "Este campo es obligatorio.",
        counter: (value) => value.length <= 255 || "Máximo 255 caracteres",
      },
      disableAceptarJob: true,
    };
  },
};
</script>

<style scoped>
/*FORMULARIOS ALTA ERROR JOB */
.titleErrorForm {
  background-color: #e53935;
  color: white;
  font-weight: 400 !important;
}

.containerForm {
  font-weight: 400 !important;
}

.titleJobForm {
  background-color: #039be5;
  color: white;
  font-weight: 400 !important;
}

.formRow {
  margin-top: 0.5rem;
  margin-bottom: -2.5rem;
}

.switchBigJob {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  padding-top: 0.5rem;
}

.actionForm {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #eceff1;
}

.textAreaJob {
  margin: 0.5rem 0rem -1rem 0rem;
}

.formRowTitle {
  margin-top: 0.46rem;
}

.button{
  font-weight: 400 !important;
}

.vColJobGran {
  padding: 0rem 0.7rem 1rem 0.8rem;
}
</style>
