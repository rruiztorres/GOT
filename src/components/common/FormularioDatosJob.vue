<template>  
      <v-card light width="500">
        <v-card-title class="text-lg text-white bg-blue-500"
          >Editar Atributos Job
          <v-spacer></v-spacer>
        </v-card-title>
        <div class="p-1">
          <!--TextEditor descripciones error-->
          <v-col class="bg-gray-200" cols="12">
            <v-textarea
              v-model="descJob"
              dense
              filled
              auto-grow
              label="Descripción del Job"
            ></v-textarea>
          </v-col>

          <v-spacer class="mt-2"></v-spacer>

          <v-col cols="12">
            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Job Grande: </v-col>
              <v-col cols="8" style="padding:0rem 0.7rem 1rem; 0rem;">
                <v-switch
                  style="padding-top:0.5rem;"
                  inset
                  v-model="jobGrande"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Expediente </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="expediente"
                  v-model="expedienteJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Detectado en: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="deteccion"
                  v-model="deteccionJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Perfil job: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="perfil"
                  v-model="perfilJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Gravedad: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="gravedad"
                  v-model="gravedadJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: -2.5rem">
              <v-col cols="4" class="mt-3"> Asignar a: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="asignacion"
                  v-model="asignacionJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row
              v-if="asignacionJob == 'Bandeja de Jobs'"
              style="margin-bottom: -2.5rem"
            >
              <v-col cols="4" class="mt-3"> Enviar a: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="tipoBandeja"
                  v-model="tipoBandejaJob"
                ></v-select>
              </v-col>
            </v-row>

            <v-row
              v-if="asignacionJob == 'Bandeja de Jobs'"
              style="margin-bottom: -2.5rem"
            >
              <v-col cols="4" class="mt-3"> Operador: </v-col>
              <v-col cols="8">
                <v-select
                  dense
                  filled
                  class="text-m"
                  :items="nombreOperador"
                  v-model="nombreOperadorJob"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-spacer class="mt-5"></v-spacer>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="closeEditJob()">CANCELAR</v-btn>
            <v-btn color="success" dark @click="guardarDatosJob()">ACEPTAR</v-btn>
          </v-card-actions>
        </div>
      </v-card>
</template>

<script>
import axios from 'axios';
import {makeArrayFromApi} from '@/assets/mixins/makeArrayFromApi.js';

export default {
  name: "FormularioDatosJob",

  mixins: [makeArrayFromApi],

  mounted(){
      this.obtenerParametrosJob();
  },

  props: ["job"],

        computed: {
            returnJob(){
            return this.job;
            },
        },

  methods: {
    dummy() {
      //
    },
    closeEditJob(){
      this.$emit("closeEditJob", false);
    },

    guardarDatosJob(){
      this.job.asignar = this.asignacionJob;
      this.job.descripcion = this.descJob;
      this.job.detectado = this.deteccionJob;
      this.job.expediente = this.expedienteJob;
      this.job.gravedad = this.gravedadJob;
      this.job.jobGran = this.jobGrande;
      this.job.operador = this.nombreOperadorJob;
      this.job.perfil = this.perfilJob;
      this.job.tipoBandeja = this.tipoBandejaJob;

      //Emitir cambios y cerrar
      this.$emit("editedJob", this.editedJob);
      this.closeEditJob();
    },

    obtenerParametrosJob(){
        axios.get(`${process.env.VUE_APP_API_ROUTE}/jobParameters`).then((data) => {
            this.objeto = data.data;
            //makeArrayFromApi (objetoAPI, arrayCrear, columnaBD)
            this.makeArrayFromApi(this.objeto.expediente,this.expediente, 'expediente')
            this.makeArrayFromApi(this.objeto.asignacion,this.asignacion, 'asignacion')
            this.makeArrayFromApi(this.objeto.deteccion,this.deteccion, 'deteccion')
            this.makeArrayFromApi(this.objeto.gravedad,this.gravedad, 'gravedad')
            this.makeArrayFromApi(this.objeto.operador,this.nombreOperador, 'nombre_operador')
            this.makeArrayFromApi(this.objeto.perfilJob,this.perfil, 'arreglo')                  
            this.makeArrayFromApi(this.objeto.tipoBandeja,this.tipoBandeja, 'tipo_bandeja')

            //Valores preasignados del job a editar
            this.descJob = this.job.descripcion;
            this.jobGrande = this.job.jobGran;
            this.expedienteJob = this.job.expediente;
            this.deteccionJob = this.job.detectado;
            this.perfilJob = this.job.perfil;
            this.gravedadJob = this.job.gravedad;
            this.asignacionJob = this.job.asignar;
            this.tipoBandejaJob = this.job.tipoBandeja;
            this.nombreOperadorJob = this.job.operador;
            })
    },
  },

  data() {
    return {
      //FORMULARIO ALTA JOB
      editJob: false,                   //Visibilidad ventana editar atributos
      descJob: "",                      //TextArea Descripcion Job
      jobGrande: false,                 //Valor
      expediente: [],
      expedienteJob: [],
      deteccion: [],                    //Array desde BD llenar en initialize
      deteccionJob: [],                 //Toma por defecto primer valor
      perfil: [],                       //Array desde BD llenar en initialize
      perfilJob: [],
      gravedad: [],                     //Array desde BD llenar en initialize
      gravedadJob: [],
      asignacion: [],                   //Array desde BD llenar en initialize
      asignacionJob: [],
      tipoBandeja: [],                  //Array desde BD llenar en initialize
      tipoBandejaJob: [],
      nombreOperador: [],               //Array desde BD llenar en initialize
      nombreOperadorJob: [],
    };
  },
};
</script>
