<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Situación actual</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <!-- JOBS -->
    <!-- CARDS -->
    <div class="cardsRow bgLightBlue shadow">
      <h3>RESUMEN JOBS</h3>
      <v-row>
        <v-col cols="12" lg="3">
          <v-card class="card bgBlue">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-briefcase</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{totalJobs}}</h1>
                  <h3><b>TOTAL</b></h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgOrange">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-map-search</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsTriaje}}</h1>
                  <h3>EN TRIAJE</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgYellow">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-account-hard-hat</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsEjecucion}}</h1>
                  <h3>EN EJECUCIÓN</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgGreen">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-check-all</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsConciliados}}</h1>
                  <h3>CONSOLIDADOS</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    

      <!-- GRÁFICOS -->
      <v-row>
        <!-- JOBS POR PRODUCTO -->
        <v-col cols="12" md="4">
          <div class="chartWrapper bgBlue">
            <h3 class="textWhite">Jobs por producto</h3>
            <div class="chartBg">
              <ApexChart
                type="bar"
                :stacked="true"
                height="300"
                :options="jobTipoOptions"
                :series="series"
              ></ApexChart>
            </div>
          </div>
        </v-col>

        <!-- JOBS EJECUTADOS -->
        <v-col cols="12" md="4">
          <div class="chartWrapper bgBlue">
            <h3 class="textWhite">Jobs Ejecutados</h3>
            <div class="chartBg">
              <ApexChart
                type="area"
                height="300"
                :options="jobsEjecutadosOptions"
                :series="ejecutadosSeries"
              ></ApexChart>
            </div>
          </div>
        </v-col>

        <!-- JOBS SEGÚN ESTADO -->
        <v-col cols="12" md="4">
          <div class="chartWrapper bgBlue">
            <h3 class="textWhite">Jobs según estado</h3>
            <div class="chartBg">
              <ApexChart 
                type="pie"
                width="418"
                :options="jobsEstadoOptions" 
                :series="jobsEstadoSeries">
              </ApexChart>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <br/>   
    <!-- ERRORES -->
    <!-- CARDS -->
    <div class="cardsRow bgLightRed shadow">
      <h3>RESUMEN ERRORES</h3>
      <v-row>
        <v-col cols="12" lg="3">
          <v-card class="card bgRed">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-map-marker</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{totalJobs}}</h1>
                  <h3>TOTAL</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgGrey">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-map-search</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsTriaje}}</h1>
                  <h3>SIN ASIGNAR</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgYellow">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-account-hard-hat</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsEjecucion}}</h1>
                  <h3>PENDIENTES</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card class="card bgGreen">
            <v-container>
              <v-row>
                <v-col cols="4" class="cardIconContainer">
                  <v-icon class="cardIcon">mdi-check-all</v-icon>
                </v-col>
                <v-col cols="8">
                  <h1>{{jobsConciliados}}</h1>
                  <h3>SOLUCIONADOS</h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <!-- GRÁFICOS -->
    <v-row>
      <!-- ERRORES SEGÚN TIPO -->
      <v-col cols="12" md="4">
        <div class="chartWrapper bgRed">
          <h3 class="textWhite">Errores según tipo</h3>
          <div class="chartBg">
            <ApexChart
              type="bar"
              :stacked="true"
              height="300"
              :options="errorTipoOptions"
              :series="errorTipoSeries"
            ></ApexChart>
          </div>
        </div>
      </v-col>

      <!-- ERRORES 2 -->
      <v-col cols="12" md="4">
        <div class="chartWrapper bgRed">
          <h3 class="textWhite">Errores según tema</h3>
          <div class="chartBg">
            <ApexChart
              type="bar"
              height="300"
              :options="errorTemaOptions"
              :series="errorTemaSeries"
            ></ApexChart>
          </div>
        </div>
      </v-col>

      <!-- ERRORES 3 -->
      <v-col cols="12" md="4">
        <div class="chartWrapper bgRed">
          <h3 class="textWhite">Errores según estado</h3>
          <div class="chartBg">
            <ApexChart 
              type="pie"
              width="418"
              :options="estadosErrorOptions" 
              :series="estadosErrorSeries">
            </ApexChart>
          </div>
        </div>
      </v-col>
    </v-row>
    </div>
  </div>

</template>

<script>
import ApexChart from "vue-apexcharts";
import axios from "axios";

import {createDataSeries} from "@/assets/mixins/createDataSeries";

export default {
  name: "EstadisticasGestor",
  components: { ApexChart },
  mixins: [createDataSeries],

  data() {
    return {
      series: [], //Solo se usa para inicializar
      totalJobs: undefined,
      jobsTriaje: undefined,
      jobsEjecucion: undefined,
      jobsConciliados: undefined,
      errorTipoSeries: [],
      errorTemaSeries: [],
      errorProcedencia: [],
      

      //JOBS TIPO
      jobTipoOptions: {
        chart: { id: "jobsPorTipo" },
        xaxis: { categories: [] },
        plotOptions: { bar: { borderRadius: 2, horizontal: true } },
        dataLabels: { enabled: false },
        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5,},},
      },

      //JOBS EJECUTADOS
      ejecutadosSeries: [{
        name: 'ejecutados',
        data: [10, 25, 16, 42, 20 ,15, 25, 30]
      },
      {
        name: 'objetivo',
        data: [20, 20, 20, 20, 20 , 20, 20, 20]
      },],

      jobsEjecutadosOptions: {
        chart: { type: "line", zoom: {enabled: false},},
        dataLabels: {enabled: false},
        stroke: {curve: "smooth"},
        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5},},
        xaxis: { categories: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"]},
      },

      //JOBS SEGUN ESTADO
      jobsEstadoSeries: [],
      jobsEstadoOptions: {},

      //ERROR TIPO
      errorTipoOptions: {
        chart: { id: "errorTipo" },
        xaxis: { categories: [] },
        plotOptions: {bar: { borderRadius: 2, horizontal: true }},
        colors: ['#f54b42'],
        dataLabels: { enabled: false },
        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5,},},
      },

      //ERROR TEMA
      errorTemaOptions: {
        chart: { id: "errorTema" },
        xaxis: { categories: [] },
        plotOptions: {bar: { borderRadius: 2, horizontal: true }},
        colors: ['#f54b42'],
        dataLabels: { enabled: false },
        grid: {row: {colors: ["#f3f3f3", "transparent"], opacity: 0.5,},},
      },

      //ERROR ESTADO
      estadosErrorSeries: [],
      estadosErrorOptions: {},
    };
  },

  mounted() {
    this.getJobs();
    this.getErrores();
  },

  methods: {

    getJobs() {
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/jobs`)
      .then((data) => {

        //JOBS POR TIPO
        this.tiposJob = this.createDataSeries(data.data.response, 'deteccion_job');
        this.series = [{ name: "Total", data: this.tiposJob.series }];
        this.jobTipoOptions = {xaxis: { categories: this.tiposJob.tipos },}

        //JOBS POR ESTADO
        this.estadosJob = this.createDataSeries(data.data.response, 'estado');
        this.jobsEstadoSeries = this.estadosJob.series;
        this.jobsEstadoOptions = {labels: this.estadosJob.tipos, legend: {position: 'bottom'}}
      
        //CARDS
        this.totalJobs = data.data.response.length;
        this.jobsTriaje = this.jobsEstadoSeries[this.estadosJob.tipos.indexOf('En triaje')]
        this.jobsEjecucion = this.jobsEstadoSeries[this.estadosJob.tipos.indexOf('Ejecución')]
        this.jobsConciliados = this.jobsEstadoSeries[this.estadosJob.tipos.indexOf('Conciliado')]
      })
    },

    getErrores(){
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/errores`)
      .then( (data) => {
        //ERRORES POR TIPO
        this.tiposErrores = this.createDataSeries(data.data.errores, 'tema_error');
        this.errorTipoSeries = [{ name: "Total", data: this.tiposErrores.series }];
        this.errorTipoOptions = {xaxis: { categories: this.tiposErrores.tipos },}

        //ERRORES POR TEMA
        this.temasErrores = this.createDataSeries(data.data.errores, 'tipo_error');
        this.errorTemaSeries = [{ name: "Total", data: this.temasErrores.series }];
        this.errorTemaOptions = {xaxis: { categories: this.temasErrores.tipos },}

        //ERRORES POR ESTADO
        this.estadosErrores = this.createDataSeries(data.data.errores, 'estado');
        this.estadosErrorSeries = this.estadosErrores.series;
        this.estadosErrorOptions = {labels: this.estadosErrores.tipos, legend: {position: 'bottom'}}
      })
    },
  },
};
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  font-weight: 400 !important;
}

.cardTitle {
  margin-bottom: 0.25rem;
}

.v-application--wrap {
  min-height: 1vh !important;
}

.panelContainer {
  background-color: white;
  height: 90vh;
  padding: 2rem;
  border-radius: 10px;
  overflow-y: auto;
}

.shadow{
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
}

.panelHeader {
  display: flex;
}

.panelHeader-title {
  margin-bottom: 2rem;
}

.textWhite {
  color: white;
}

.chartWrapper {
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 1px 5px 5px 1px lightgray;
}

.chartBg {
  background-color: white;
  border-radius: 4px;
  padding: 1rem;
}


.cardsRow{
  background-color: rgba(216, 213, 213, 0.322);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}


.card {
  text-align: center;
  color: white;
}

.card > h1{
  font-weight: 500 !important;
  font-size: 3rem;
  margin-bottom: -0.5rem;
}

.cardIconContainer {
  background-color: rgba(128, 128, 128, 0.486);
  padding: auto;
}

.cardIcon {
  display: block;
  margin: auto;
  font-size: 4rem;
  color: white;
}

.bgBlue {
  background-color: #4287f5;
}
.bgOrange {
  background-color: #ff6600;
}
.bgYellow {
  background-color: #ffcc00;
}
.bgGreen {
  background-color: #009933;
}
.bgRed {
  background-color: #f54b42;
}
.bgGrey {
  background-color: grey;
}

</style>
