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
          <v-btn class="w-24 bg-green-500" dark text>GUARDAR</v-btn>
        </v-toolbar>



        <template>
        <v-card>
            <v-tabs
                fixed-tabs
                background-color="#0341a6"
                dark
            >
                <v-tab>Datos de la Incidencia</v-tab>
                <v-tab>Localización en el Mapa</v-tab>
                <v-tab>Log de la Incidencia</v-tab>
                <v-tab>Datos adjuntos</v-tab>

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
                                <tr class="bg-white"><td class="p-3"><b>Seguimiento:</b></td><td class="p-3"></td></tr>
                                <tr class="bg-gray-100"><td class="p-3"><b>Descripción:</b></td><td class="p-3">{{incidencia.inc_descripcion}}</td></tr>
                                </tbody>
                            </table>

                            <br/>
                            <!--Sacar a componente-->
                            <div>
                                <h1 class="text-xl mb-1">JOBS ASOCIADOS A LA INCIDENCIA {{incidencia.id_inc}}</h1>
                                
                                <div v-if="(jobs.length!==0)">
                                    <table class="p-6 text-justify shadow-md w-full">
                                        <thead>
                                        <tr class="bg-gray-300">
                                            <th class="p-3"><b>JOB nº</b></th>
                                            <th class="p-3">Estado</th>
                                            <th class="p-3">Prioridad</th>
                                            <th class="p-3">Detectado</th>
                                            <th class="p-3">Arreglar en</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="job in jobs" :key="job.job_id">
                                            <td class="p-3">{{job.id_inc+'-J'+job.job_id}}</td>
                                            <td class="p-3">{{job.job_estado}}</td>
                                            <td class="p-3">{{job.job_prioridad}}</td>
                                            <td class="p-3">{{job.job_detectado}}</td>
                                            <td class="p-3">{{job.job_arreglar}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div v-if="(jobs.length==0)">
                                    <table class="p-6 text-justify shadow-md w-full">
                                        <thead>
                                        <tr class="bg-gray-300">
                                            <th class="p-3"><b>JOB nº</b></th>
                                            <th class="p-3">Estado</th>
                                            <th class="p-3">Prioridad</th>
                                            <th class="p-3">Detectado</th>
                                            <th class="p-3">Arreglar en</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="bg-white">
                                            <td colspan="5" class="p-3">No Existen Jobs asociados a la incidencia</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <br/>
                            <div>
                                <h1 class="text-xl mb-1">ERRORES ASOCIADOS A LA INCIDENCIA {{incidencia.id_inc}}</h1>
                                
                                <div v-if="(jobs.length!==0)">
                                    <table class="p-6 text-justify shadow-md w-full">
                                        <thead>
                                        <tr class="bg-gray-300">
                                            <th class="p-3"><b>JOB nº</b></th>
                                            <th class="p-3">Estado</th>
                                            <th class="p-3">Prioridad</th>
                                            <th class="p-3">Detectado</th>
                                            <th class="p-3">Arreglar en</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="job in jobs" :key="job.job_id">
                                            <td class="p-3">{{job.id_inc+'-J'+job.job_id}}</td>
                                            <td class="p-3">{{job.job_estado}}</td>
                                            <td class="p-3">{{job.job_prioridad}}</td>
                                            <td class="p-3">{{job.job_detectado}}</td>
                                            <td class="p-3">{{job.job_arreglar}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div v-if="(jobs.length==0)">
                                    <table class="p-6 text-justify shadow-md w-full">
                                        <thead>
                                        <tr class="bg-gray-300">
                                            <th class="p-3"><b>JOB nº</b></th>
                                            <th class="p-3">Estado</th>
                                            <th class="p-3">Prioridad</th>
                                            <th class="p-3">Detectado</th>
                                            <th class="p-3">Arreglar en</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="bg-white">
                                            <td colspan="5" class="p-3">No Existen Jobs asociados a la incidencia</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <!--FIN tabla JOBS-->    
                            </div>

                    <v-card-text>
                        <p>
                        Hello moto!
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item> <!--FIN DATOS INCIDENCIA -->

                <!--LOCALIZACIÓN EN EL MAPA-->
                <v-tab-item>
                    <v-card 
                    flat
                    class="p-8"
                    >
                        <!--MAP--> 
                        <vl-map 
                            :load-tiles-while-animating="false" 
                            :load-tiles-while-interacting="true"
                            data-projection="EPSG:4326"
                            class="mt-4 ml-4 shadow-lg border border-white" 
                            style="height: 800px">

                            <vl-view 
                                :zoom.sync="zoom" 
                                :center.sync="center_inc">
                            </vl-view>

                        <!-- MI MAPA CANVAS -->
                            <vl-layer-tile id="osm">
                                <vl-source-osm></vl-source-osm>
                            </vl-layer-tile>

                        <!--GEOMETRIAS MAPA-->
                            <vl-layer-vector>
                                <vl-feature>
                                    <vl-geom-point
                                        :coordinates="error_inc">
                                    </vl-geom-point>

                                    <vl-style-box>
                                        <vl-style-circle :radius="10">
                                            <vl-style-fill color="red"></vl-style-fill>
                                            <vl-style-stroke color="white"></vl-style-stroke>
                                        </vl-style-circle>
                                    </vl-style-box>
                                </vl-feature>
                            </vl-layer-vector>
                        </vl-map>
                        <v-card-text>
                            <p>
                            hello world!
                            </p>
                        </v-card-text>
                    </v-card>
                </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                <!--LOG DE LA INCIDENCIA-->
                <v-tab-item>
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

  export default {
    props: [
        'incidencia', 
        'error' ,
        'center'
    ],

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
            
        }
    },

    methods:{
        //inicializa la tabla de jobs asociados a la incidencia
        initialize () {
        const url = 'http://10.13.86.114:3000/'; //url del servicio
        const id_inc = this.incidencia.id_inc;
        axios
          .get(url+'jobs/'+ id_inc)
          //se realiza el filtro para las incidencias en bandeja
          .then(data => {this.jobs = data.data;
          //debug
          //console.log(this.jobs); 
          })
        },
        closeDialog(){
            this.dialog = false;
            this.$emit('dialog', this.dialog);
        }
    },

    data () {
        return {
                zoom: 15,
                jobs:[],
                //recogemos las props en otras variables de lo contrario se genera un bug al cerrar el panel
                error_inc: this.error,
                center_inc: this.error,
                
            }
    },
  }
</script>