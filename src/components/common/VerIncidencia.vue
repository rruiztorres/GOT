<template>
<div class="bg-gray-200 h-full pb-6">
    <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Incidencia {{incidencia.id_inc}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog">CANCELAR</v-btn>
          <v-btn class="w-24 bg-green-500" dark text @click="storePolygonGeom">GUARDAR</v-btn>
        </v-toolbar>

        <template>
        <v-card>
            <v-tabs
                v-model="activeTab"
                fixed-tabs
                background-color="#0341a6"
                dark
            >
                <v-tab :key="1" @click="activateMap(false)">Datos de la Incidencia</v-tab>
                <v-tab :key="2" @click="activateMap(true)">Localización en el Mapa</v-tab>
                <v-tab :key="3" @click="activateMap(false)">Log de la Incidencia</v-tab>
                <v-tab :key="4" @click="activateMap(false)">Datos adjuntos</v-tab>

                <v-tabs-slider color="#76aff5"></v-tabs-slider>
            
                <!--DATOS DE LA INCIDENCIA-->
                <v-tab-item>
                    <v-card 
                    flat
                    class="p-8"
                    >
                        <div>
                            <h1 class="text-xl mb-1">DATOS DE LA INCIDENCIA</h1>
                            <table class="mr-6 text-justify shadow-md w-full">
                                <tbody>
                                <tr class="bg-gray-100"><td class="p-3"><b>Estado:</b></td><td class="p-3">{{incidencia.inc_estado}}</td></tr>
                                <tr class="bg-white"><td class="p-3"><b>Prioridad:</b></td><td class="p-3">{{incidencia.inc_prioridad}}</td></tr>
                                <tr class="bg-gray-100"><td class="p-3"><b>Procedencia:</b></td><td class="p-3">{{incidencia.inc_procedencia}}</td></tr>
                                <tr class="bg-white"><td class="p-3"><b>Seguimiento:</b></td><td class="p-3">{{incidencia.inc_seguimiento}}</td></tr>
                                <tr class="bg-gray-100"><td class="p-3"><b>Descripción:</b></td><td class="p-3" v-html="incidencia.inc_descripcion"></td></tr>
                                </tbody>
                            </table>

                            <br/>
                            <!--Sacar a componente-->
                            <div>
                                <h1 
                                    class="text-xl pb-3"
                                    >
                                    JOBS ASOCIADOS A LA INCIDENCIA {{incidencia.id_inc}}
                                </h1>                                                               
                                <div v-if="(jobs.length!==0)">
                                    <template>
                                        <v-data-table
                                            :loading="jobLoading"
                                            loading-text="Aun no existen jobs asociados a esta incidencia"
                                            :headers="jobHeaders"
                                            :items="jobs"
                                            item-key="job_id"
                                        >
                                            <template v-slot:[`item.job_estado`]="{ item }">
                                                <v-chip :color="getColor(item.job_estado)" dark>
                                                    {{ item.job_estado }}
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </div>

                                <h1 
                                class="text-xl pb-3"
                                >
                                    ERRORES ASOCIADOS A LA INCIDENCIA {{incidencia.id_inc}}
                                </h1>                                                               
                                <div v-if="(jobs.length!==0)">
                                    <template>
                                        <v-data-table
                                            :loading="jobLoading"
                                            loading-text="Aun no existen jobs asociados a esta incidencia"
                                            :headers="errorHeaders"
                                            :items="errores"
                                            item-key="error_id"
                                            group-by="error_job"
                                        >
                                            <template v-slot:[`item.error_estado`]="{ item }">
                                                <v-chip :color="getColor(item.error_estado)" dark>
                                                    {{ item.error_estado }}
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </template>
                                </div>

                            </div>
                            <br/>
                            
                            <!--FIN tabla JOBS-->    
                            </div>

                    <v-card-text>
                        <p>
                        <!--comodin-->
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item> <!--FIN DATOS INCIDENCIA -->

                <!--LOCALIZACIÓN EN EL MAPA-->
                <v-tab-item>
                    <v-card 
                    flat
                    class="p-8"
                    style="height:50rem;"
                    >

                        <Map 
                            v-if="mapIsActive == true"
                            perfil="visualizar"  
                            :incidencia="incSerial" 
                            :jobsRecibidos="jobs" 
                            :erroresRecibidos="errores" 
                            :reset="mapReset">
                        </Map>
                    
                    </v-card>
                </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                <!--LOG DE LA INCIDENCIA-->
                <v-tab-item @click="activateMap(false)">
                    <v-card 
                    flat
                    class="p-8"
                    >
                    <!-- desde aqui -->

                        <template>
                            <v-container style="max-width: 600px;">
                                <v-timeline
                                dense
                                clipped
                                >
                                
                                    <v-timeline-item
                                        class="mb-6"
                                        hide-dot
                                    >
                                        <h2 class="text-xl">{{incidencia.id_inc}}</h2>
                                    </v-timeline-item>

                                    
                                    <v-timeline-item
                                        class="mb-4"
                                        fill-dot
                                        color="green"
                                        small
                                    >
                                        <v-row justify="space-between">
                                        <v-col cols="7">
                                            <v-chip
                                            class="white--text ml-0 w-full"
                                            color="green"
                                            label
                                            small
                                            >
                                            Inserciones automáticas
                                            </v-chip>
                                            Incidencia insertada por proceso automático
                                        </v-col>
                                        <v-col class="text-right" cols="5">
                                            09:25 PM (10/02/2021)
                                        </v-col>
                                        </v-row>
                                    </v-timeline-item>

                                    
                                    <v-timeline-item
                                        class="mb-4"
                                        fill-dot
                                        color="#dadde0"
                                        small
                                    >
                                        <v-row justify="space-between">
                                        <v-col cols="7">
                                            El Generador de Jobs Raúl Ruiz Torres atiende la incidencia
                                        </v-col>
                                        <v-col class="text-right" cols="5">
                                            10:45 PM (11/02/2021)
                                        </v-col>
                                        </v-row>
                                    </v-timeline-item>

                                    <v-timeline-item
                                        class="mb-4"
                                        fill-dot
                                        color="orange"
                                        small
                                    >
                                        <v-row justify="space-between">
                                        <v-col cols="7">
                                            <v-chip
                                            class="white--text ml-0 w-full"
                                            color="orange"
                                            label
                                            small
                                            >
                                            Incidencia pausada
                                            </v-chip>
                                            Se necesita información adicional para dar de alta la incidencia
                                        </v-col>
                                        <v-col class="text-right" cols="5">
                                            11:15 PM (11/02/2021)
                                        </v-col>
                                        </v-row>
                                    </v-timeline-item>

                                    <v-timeline-item
                                        class="mb-4"
                                        fill-dot
                                        color="green"
                                        small
                                    >
                                        <v-row justify="space-between">
                                        <v-col cols="7">
                                            <v-chip
                                            class="white--text ml-0 w-full"
                                            color="green"
                                            label
                                            small
                                            >
                                            Incidencia reanudada
                                            </v-chip>
                                            El Generador de Jobs Raúl Ruiz Torres continua con la incidencia
                                        </v-col>
                                        <v-col class="text-right" cols="5">
                                            11:15 PM (11/02/2021)
                                        </v-col>
                                        </v-row>
                                    </v-timeline-item>
                                

                                </v-timeline>
                            </v-container>
                            </template>

                    <!-- hasta aqui -->  


                    <v-card-text>
                        <p>
                        <!-- COMODIN -->
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item> <!--FIN LOG DE LA INCIDENCIA-->

                <!--DATOS ADJUNTOS-->
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        <!-- COMODIN --> 
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item> <!--FIN DATOS ADJUNTOS-->
            </v-tabs>
        </v-card>
        </template>



    
</div>
</template>

<script>
import {getColor} from '@/assets/mixins/getColor.js';
import axios from 'axios';

import Map from '@/components/common/Map';

  export default {
    props: [
        'incidencia', 
        'error' ,
        'center'
    ],

    name: 'VerIncidencia',

    components: {
        Map,
    },

    mixins: [
        getColor
    ],

    created(){
        this.initialize();
    },
    
    watch: {
        incidencia(){
            //lanza de nuevo initialize cuando detecta que hemos cambiado de incidencia en el menu
            //de lo contrario se genera un bug al cambiar de incidencia
            if(this.incidencia.id_inc) {
                this.initialize()
                //reiniciamos tambien las variables de error y centro
                this.error_inc = this.error;
                this.center_inc = this.error;
            }
         },     
    },

    methods:{
        activateMap(active) {
            this.mapIsActive = active;
        },

        //inicializa la tabla de jobs asociados a la incidencia
        initialize () {
            //Enviamos señal sin cambio a map
            this.mapReset = false;
            this.activeTab= 0,
            this.id_inc = this.incidencia.id_inc;
            document.cookie = 'SameSite = Strict';
            axios
                .get(this.url+'jobs/'+ this.id_inc)
                .then(data => {this.jobsBruto = data.data.mensaje;
                    for (this.index in this.jobsBruto){
                        this.jobs.push(this.jobsBruto[this.index])
                    }
                })

            axios
                .get(this.url+'errores/'+ this.id_inc)
                .then(data => {this.erroresBruto = data.data.mensaje;
                    for (this.index in this.erroresBruto){
                        this.errores.push(this.erroresBruto[this.index])
                    }
                })
            
        },
        closeDialog(){
            this.activateMap(false);
            this.dialog = false;
            this.$emit('dialog', this.dialog);

            //Borramos datos obtenidos, si no se duplican la siguiente vez que se abre la consulta
            this.jobs = [];
            this.jobsBruto = [];
            this.errores = [];
            this.erroresBruto = [];

            //Reseteamos mapa
            this.mapReset = true;
        },
        storePolygonGeom(){
            //de momento solo puede almacenar 1 poligono
            this.geometries = this.features[0].geometry.coordinates;
            this.jobGeometry = [];
            //formateo de geometrias desde openlayers a postgis
            for (this.geometry in this.geometries) {
                for(this.index in this.geometries[this.geometry]){
                    this.coordinate = this.geometries[this.geometry][this.index];
                    this.coordinate = JSON.stringify(this.coordinate);
                    //borrar caracteres no deseados
                    this.coordinate = this.coordinate.replace("[", "");
                    this.coordinate = this.coordinate.replace("]", "");
                    this.coordinate = this.coordinate.replace(",", " ");
                    this.jobGeometry.push(this.coordinate);
                }
            }
            this.jobGeometry = '"POLYGON((' + this.jobGeometry + '))"';
        },

    },

    data () {
        return {

                url: 'http://10.13.86.114:3000/',    //url:puerto del servicio API

                jobs:[],                             //recogemos las props en otras variables de lo contrario se genera un bug al cerrar el panel
                jobsBruto:[],                        //lo que recogemos desde la api JSON
                jobLoading: false,                   //Muestra barra progreso en la tabla jobs hasta que se recuperan los jobs desde API
                jobHeaders: [  
                    { text: 'Estado', value: 'job_estado' },              
                    { text: 'Job', align: 'start', sortable: false, value: 'job_id',},
                    { text: 'Gravedad', value: 'job_gravedad' },
                    { text: 'Detectado', value: 'job_detectado' },
                    { text: 'Arreglar en', value: 'job_arreglar' },
                    { text: 'Descripción', value: 'job_desc' },        
                ],
                errores:[],
                erroresBruto:[],
                errorHeaders: [
                    { text: 'Estado', value: 'error_estado'},
                    { text: 'Error', value: 'error_id'},
                    { text: 'Asociado a Job', value: 'error_job'},
                    { text: 'Tema', value: 'error_tema'},
                    { text: 'Tipo', value: 'error_tipo'},
                    { text: 'Descripcion', value: 'error_descripcion'},
                ],
                incSerial: '',

                mapReset: false,
                mapIsActive: false,
                activeTab: 0,
                
            }
    },
  }
</script>