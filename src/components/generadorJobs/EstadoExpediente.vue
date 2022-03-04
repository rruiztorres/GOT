<template>
    <div>
        <v-card light class="newExpContainer">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Estado Expediente: <b>{{expediente.expediente}}</b></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-card-actions>

                </v-card-actions>
            </v-toolbar>
            <v-card-text class="wrapper">

                <v-overlay 
                    :value="noJobAlert"
                >
                <v-alert type="info">
                    El expediente aun no tiene jobs asociados
                    <v-btn class="closeAlert" @click="close">CERRAR</v-btn>
                    </v-alert>
                </v-overlay>

                <v-row>
                    <!-- MAPA -->
                    <v-col cols="12" md="9">
                        <MapaGestor
                        v-if="mountMap === true"
                        :jobsRecibidos="jobs">
                        </MapaGestor>
                    </v-col>

                    <!-- TARJETAS -->
                    <v-col cols="12" md="3">
                        <v-card elevation="2" dark class="resumeCard bgBlue">
                            TOTAL JOBS 
                            <h1>{{totalJobs}}</h1>
                        </v-card>
                        <v-card elevation="2" dark class="resumeCard bgGreen">
                            EJECUTADO
                            <h1>{{jobsTerminados}} %</h1>
                        </v-card>
                        <v-card elevation="2" dark class="resumeCard bgRed">
                            RESTANTES
                            <h1>{{jobsRestantes}}</h1>
                        </v-card>

                        <br/>
                        <div class="chartWrapper bgBlue">
                            <h3 class="textWhite">JOBS POR ESTADO</h3>
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
                <v-row>
                    <v-col cols="12">
                        <div class="tableWrapper">
                            <v-text-field
                            class="textField"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                            ></v-text-field>

                            <v-data-table
                            :search="search"
                            :items="jobs"
                            :headers="jobsHeaders"
                            >
                                <template v-slot:[`item.estado`]="{ item }">
                                    <v-chip :color="getColor(item.estado)" dark>
                                        {{ item.estado }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>      
        </v-card>
    </div>
</template>

<script> 
import axios from 'axios';
import ApexChart from "vue-apexcharts";
import MapaGestor from "@/components/gestor/MapaGestor";

import {createDataSeries} from "@/assets/mixins/createDataSeries";
import {getColor} from "@/assets/mixins/getColor";

    export default {
        name: 'EstadoExpediente',
        props: ['expediente'],
        components: {MapaGestor, ApexChart},
        mixins: [createDataSeries, getColor],

        data(){
            return {
                totalJobs: 0,
                jobsTerminados: 0,
                jobsRestantes: 0,
                jobs: [],
                jobsEstadoOptions: {},
                jobsEstadoSeries: [],

                mountMap: false,
                noJobAlert: false,

                estadosErrorSeries: [],
                estadosErrorOptions: {},

                jobsHeaders: [
                    { text: "Estado", align: "start", sortable: true, value: "estado" },
                    { text: "Bloq.", align: "start", sortable: true, value: "" },
                    { text: "Job", align: "start", sortable: true, value: "job" },
                    { text: "Gravedad", align: "start", sortable: true, value: "gravedad_job"},
                    { text: "Detectado en", align: "start", sortable: true, value: "deteccion_job"},
                    { text: "Perfil", align: "start", sortable: true, value: "arreglo_job" },
                    { text: "Descripción", align: "start", sortable: true, value: "descripcion" },
                    { text: "Operador", align: "start", sortable: true, value: "nombre_operador" }
                ],
                search: '',
            }
        },

        created(){
            this.initialize();
        },

        methods:{
            async initialize(){
                await axios
                .get(`${process.env.VUE_APP_API_ROUTE}/getJobsByExp/` + this.expediente.expediente)
                .then((data) => {
                    if (data.status === 201){ 
                        this.jobs = data.data.jobs
                        this.mountMap = true;
                        this.getStatistics();  
                    } else { 
                        this.noJobAlert = true
                        this.jobs = undefined;
                        this.mountMap = false;
                    }
                })
            },

            getColorSeries(array){
                this.colors = [];
                for(this.index in array){
                    this.color = this.getColor(array[this.index])
                    this.colors.push(this.color)
                }
                return this.colors;
            },
            
            getStatistics(){
                //JOBS POR ESTADO
                this.estadosJob = this.createDataSeries(this.jobs, 'estado');
                this.jobColors = this.getColorSeries(this.estadosJob.tipos)
                this.jobsEstadoSeries = this.estadosJob.series;

                this.jobsEstadoOptions = {labels: this.estadosJob.tipos, legend: {position: 'bottom'}, colors: this.jobColors }
                this.totalJobs = this.jobs.length;
                for(this.index in this.jobs){
                    if(
                        this.jobs[this.index].estado === 'Conciliado' ||
                        this.jobs[this.index].estado === 'Consolidado'||
                        this.jobs[this.index].estado === 'Desestimado'
                        ){
                            this.jobsTerminados = this.jobsTerminados + 1;
                        } else {
                            this.jobsRestantes = this.jobsRestantes + 1;
                        }
                }
                this.jobsTerminados = ((this.jobsTerminados * 100) / this.totalJobs).toFixed(1);
            },

            close(){
                this.$emit("close", false)
            },
        }
    }
</script>

<style scoped>
    .newExpContainer {
        margin: 0 auto;
    }

    .wrapper {
        height: 93vh;
        overflow-y: auto;
    }

    .newExpTitle {
        background-color: #4287f5;
        font-weight: 400 !important;
        color: white;
        margin-bottom: 1rem;
        width: 100%;
    }

    h3 {
        font-weight: 400 !important;
        margin: 0rem 0rem 0.25rem 0rem;
    }

    .resumeCard{
        margin-bottom: 1rem;
        padding: 1rem;
        height: 5.5rem;
    }

    .bgBlue {
     background-color: #4287f5;
    }

    .bgGreen {
    background-color: #009933;
    }

    .bgRed {
    background-color: #f54b42;
    }

    .loading{
        background-color: #f54b42;
    }

    .progress{
        display: block;
        margin: auto;
    }

    .chartWrapper {
        margin-top: -0.25rem;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0px 1px 2px 1px rgba(128, 128, 128, 0.671);
    }

    .chartBg {
        background-color: white;
        border-radius: 4px;
        padding: 1rem;
    }

    .textWhite {
        color:White;
    }

    .tableWrapper {
        padding: 1.25rem;
        background-color: lightgray;
        border-radius: 4px;
    }

    .closeAlert {
        margin-left: 1rem;
        font-weight: 400;
    }
</style>