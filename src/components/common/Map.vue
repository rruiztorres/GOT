<template>
    <div style="height:96%">
        <!-- MAPA -->
        <vl-map 
            :load-tiles-while-animating="true" 
            :load-tiles-while-interacting="true"
            :data-projection = "epsg"
            >

            <vl-view 
                :zoom.sync="zoom" 
                :min-zoom = "minZoom"
                :center.sync="center">
            </vl-view>

            <!--GEOMETRIAS MAPA -->

            <!--Geometrias de job--> 
            <vl-layer-vector :z-index="1">
                <vl-source-vector :features.sync="jobs" ident="jobs"></vl-source-vector>
                <vl-style-box>
                    <vl-style-stroke color="blue" :width="4"></vl-style-stroke>
                </vl-style-box>
            </vl-layer-vector>
            
            <!-- Seleccion de geometria job--> 
            <vl-interaction-select
                v-if="drawType == null && toolActive == 'selectJob'"
                :features.sync="selectedJobs">
                <vl-style-box>
                    <vl-style-stroke color="red" :width="4"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.7)" ></vl-style-fill>
                </vl-style-box>
            </vl-interaction-select>

            <!-- Creacion geometrias de job -->
            <vl-interaction-draw 
            type="Polygon" 
            source="jobs"
            :active="toolActive == 'drawJobs'">
                <vl-style-box>
                    <vl-style-stroke color="blue"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
                </vl-style-box>
            </vl-interaction-draw>

            <!--Edición geometrias de job -->
            <vl-interaction-modify
            type="Polygon"
            source="jobs"
            :active="toolActive == 'modifyJob'">
            </vl-interaction-modify>
            <!--fin jobs-->

            <!--Geometrias de Error -->
            <vl-layer-vector 
                :z-index="3">
                <vl-source-vector :features.sync="errores" ident="errores"></vl-source-vector>
                <vl-style-box>
                    <vl-style-circle :radius="7">
                        <vl-style-fill color="blue"></vl-style-fill>
                        <vl-style-stroke color="white" :width="3"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-layer-vector>

            <!--Seleccion geometrias errores -->
            <vl-interaction-select
                v-if="drawType == null && toolActive == 'selectError'"
                :features.sync="selectedErrores">
                <vl-style-box>
                    <vl-style-circle :radius="9">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-interaction-select>

            <!-- Creacion geometrias de errores -->
            <vl-interaction-draw 
            type="Point" 
            source="errores"
            :active="toolActive == 'drawErrors'">
                <vl-style-box>
                    <vl-style-circle :radius="7">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-interaction-draw>

            <!--Edicion geometrias de errores-->
            <vl-interaction-modify
            type="Point"
            source="errores"
            :active="toolActive == 'modifyError'">
            </vl-interaction-modify>
            <!-- fin errores -->

            <!-- CAPAS WMTS -->    
            <vl-layer-tile 
            id="wmts" 
            :z-index="0">
                <vl-source-wmts 
                :attributions="activeMap.attribution" 
                :url="activeMap.url" 
                :layer-name="activeMap.layerName" 
                :matrixSet="activeMap.matrixSet" 
                :format="activeMap.format" 
                :style-name="activeMap.styleName">
                </vl-source-wmts>
            </vl-layer-tile>

            <!-- INFORMACIÓN NUMEROS DE ERROR EN MAPA -->
            <!--Meter en el div el control de capa --> 
            <div v-if="activarMostrarIdError == true">
                <vl-feature
                    v-for="atribute in erroresAttrb"
                    :key="atribute.error"
                    ref="marker">
                    <template
                        v-if="atribute.error != null"
                    >
                        <vl-overlay
                        :position="atribute.geometria_json.coordinates"
                        :offset="[-48, -45]">
                            <p class="bg-white p-2 text-xs font-bold rounded-md shadow-md">
                                {{atribute.error}}
                            </p>
                        </vl-overlay>
                    </template>
                </vl-feature>
            </div>
        </vl-map>     

        <!--PANEL DE CONTROL -->
        <div class="font-sans" style="float: right; height: 0rem">
            <div
            class="p-2 rounded-sm"
            style="
            position:absolute;
            top:2.5rem;
            right:1.7rem;
            margin-right: 1rem;
            width: 16rem;
            box-shadow: 0px 0px 5px 3px white;
            background-color: rgba(0, 60, 136, 0.4);
            "
            >
                <v-card-actions
                class="rounded mb-2 flex"
                style="background-color: rgba(0, 60, 136)"
                >
                    <div 
                        v-for="generalTool in generalTools" 
                        :key="generalTool.title">
                        <v-btn dark icon>
                            <v-icon>{{generalTool.icon}}</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                    </div>

                    <v-btn dark text @click="showMapTools = !showMapTools">
                    TOOLS
                        <v-icon>{{
                        showMapTools ? "mdi-chevron-up" : "mdi-chevron-down"
                        }}</v-icon>
                    </v-btn>
                </v-card-actions>

                <v-expand-transition>
                    <div v-show="showMapTools">
                        <v-divider></v-divider>

                        <div class="text-center rounded bg-blue-800 p-2 md-1 text-white text-l">
                        ERRORES
                        </div>
                        <div class="mt-2 flex">
                            <v-btn-toggle v-model="toggleBtnError" color="blue accent-4">
                                <v-btn
                                v-for="item in errorPanel"
                                :key="item.title"
                                icon tile
                                :title="item.title"
                                @click="item.click()"
                                :disabled="applyMode(item.modo)"
                                >
                                    <v-icon color="#1E40AF">{{ item.icon }}</v-icon>
                                </v-btn>
                            </v-btn-toggle>
                        </div>

                        <v-spacer class="my-4"></v-spacer>

                        <div class="text-center rounded bg-blue-800 p-2 md-1 text-white text-l">
                        JOBS
                        </div>
                        <div class="mt-2 flex">
                            <v-btn-toggle v-model="toggleBtnJob" color="blue accent-4">
                                <v-btn
                                v-for="item in jobsPanel"
                                :key="item.title"
                                icon tile
                                :title="item.title"
                                @click="item.click()"
                                :disabled="applyMode(item.modo)"
                                >
                                <v-icon color="#1E40AF">{{ item.icon }}</v-icon>
                            </v-btn>
                            </v-btn-toggle>
                        </div>
                    
                        <v-spacer class="my-8"></v-spacer>

                        <div class="rounded bg-blue-800 p-2 mb-1 text-white text-l text-center">
                        CARTOGRAFÍA
                        </div>
                        <v-btn
                            v-for="service in wmtsServices"
                            :key="service.nombre"
                            text dark class="bg-green-500 mb-1 flex-grow shadow-lg w-full"
                            @click="activeMap = service"
                            >{{service.nombre}}
                        </v-btn>
                        <v-spacer class="my-1"></v-spacer>

                        <v-switch
                        class="bg-white pl-6 pt-4 rounded-md shadow-md"
                        dense
                        v-model="activarMostrarIdError"
                        :label="`Mostrar ID Error`"
                        ></v-switch>

                        <v-spacer class="my-8"></v-spacer>                
                    </div>
                </v-expand-transition>
            </div>
        </div>

        <!-- VENTANA INFORMACION MAPA (Centro, zoom, etc) -->
        <v-card style="
        top: -6.5rem;
        margin: 1rem;
        width:22rem;
        box-shadow: 0px 0px 10px white;
        background-color: rgba(0, 60, 136, 0.5);
        font-size:80%;
        color:white;
        ">
            <div class="p-2">
                Zoom: {{ zoom }}<br>
                Centro: {{ center }}<br>
                {{epsg}}
            </div>
        </v-card>

        <!--FORMULARIO ALTA JOB-->
        <template>
            <div class="text-center">
            <v-dialog v-model="editJob" width="500">
                <v-card>
                <v-card-title dark class="text-lg text-white bg-blue-500"
                    >Alta de Job
                    <v-spacer></v-spacer>
                </v-card-title>

                    <div class="p-1">
                        <!--TextEditor descripciones error-->
                        <v-col class="bg-gray-200" cols="12">
                        <v-textarea
                            v-model="descJob"
                            dense filled auto-grow
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
                                dense filled class="text-m"
                                :items="expediente"
                                v-model="expedienteJob"
                            ></v-select>
                            </v-col>
                        </v-row>

                        <v-row style="margin-bottom: -2.5rem">
                            <v-col cols="4" class="mt-3"> Detectado en: </v-col>
                            <v-col cols="8">
                            <v-select
                                dense filled class="text-m"
                                :items="deteccion"
                                v-model="deteccionJob"
                            ></v-select>
                            </v-col>
                        </v-row>
                        
                        <v-row style="margin-bottom: -2.5rem">
                            <v-col cols="4" class="mt-3"> Perfil job: </v-col>
                            <v-col cols="8">
                            <v-select
                                dense filled class="text-m"
                                :items="perfil"
                                v-model="perfilJob"
                            ></v-select>
                            </v-col>
                        </v-row>

                        <v-row style="margin-bottom: -2.5rem">
                            <v-col cols="4" class="mt-3"> Gravedad: </v-col>
                            <v-col cols="8">
                            <v-select
                                dense filled class="text-m"
                                :items="gravedad"
                                v-model="gravedadJob"
                            ></v-select>
                            </v-col>
                        </v-row>

                        <v-row style="margin-bottom: -2.5rem">
                            <v-col cols="4" class="mt-3"> Asignar a: </v-col>
                            <v-col cols="8">
                            <v-select
                                dense filled class="text-m"
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
                                dense filled class="text-m"
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
                                dense filled class="text-m"
                                :items="nombreOperador"
                                v-model="nombreOperadorJob"
                            ></v-select>
                            </v-col>
                        </v-row>
                        </v-col>

                        <v-spacer class="mt-5"></v-spacer>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error" dark @click="abortInsertion('jobs')"
                            >CANCELAR</v-btn>
                            <v-btn color="success" dark @click="storeAttrbJobs"
                            >ACEPTAR</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-dialog>
            </div>
        </template>

        <!--FORMULARIO ALTA ERROR-->
        <template>
            <v-dialog v-model="editError" width="500">
                <v-card>
                <div>
                    <v-card-title dark class="text-lg text-white bg-red-500"
                    >Alta de error
                    <v-spacer></v-spacer>
                    </v-card-title>

                    <div class="p-1">
                    <!--TextEditor descripciones error-->
                    <v-col class="bg-gray-200" cols="12">
                        <v-textarea
                        v-model="descError"
                        filled label="Descripción del error"
                        auto-grow
                        value=""
                        ></v-textarea>
                    </v-col>

                    <v-divider></v-divider>
                    <v-spacer class="mt-2"></v-spacer>

                    <v-col cols="12">
                        <v-row style="margin-bottom: -2.5rem">
                        <v-col cols="4" class="mt-3"> Tema: </v-col>
                        <v-col cols="8">
                            <v-select
                            filled dense class="text-m"
                            :items="temaError"
                            v-model="selectTema"
                            ></v-select>
                        </v-col>
                        </v-row>

                        <v-row style="margin-bottom: -2.5rem">
                        <v-col cols="4" class="mt-3"> Tipo: </v-col>
                        <v-col cols="8">
                            <v-select
                            filled dense class="text-m"
                            :items="tipoError"
                            v-model="selectTipoError"
                            ></v-select>
                        </v-col>
                        </v-row>
                    </v-col>

                    <v-spacer class="mt-5"></v-spacer>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" dark @click="abortInsertion('errores')"
                        >CANCELAR</v-btn>
                        <v-btn color="success" dark @click="storeAttrbErrors"
                        >ACEPTAR</v-btn>
                    </v-card-actions>
                    </div>
                </div>
                </v-card>
            </v-dialog>
        </template>

        <!--MENSAJES ALERTA FLOTANTES -->
        <template>
            <v-dialog v-model="mensajeFlotante.visibilidad" max-width="49rem">
                <v-alert
                :color="mensajeFlotante.color"
                :type="mensajeFlotante.type"
                prominent
                class="mb-0"
                >
                <v-row no-gutters>
                    <v-col cols="9" class="m-auto pl-2">
                        {{mensajeFlotante.mensaje}}
                    </v-col>
                    <v-col cols="3">
                        <v-btn v-if="mensajeFlotante.aceptar == true" @click="closeInfoMessage()">ENTENDIDO</v-btn>
                    </v-col>
                </v-row>
                </v-alert>
            </v-dialog>
        </template>

        <!--MENSAJES AYUDA HERRAMIENTAS --> 
        <template>
            <v-alert
            v-if="ayudaHerramientaVentana == true"
            transition="fade-transition"
            type="info"
            color="#9fbce3"
            style="top: -15rem; margin: auto; max-width: 30rem"
            >
                <v-col cols="12" class=" pt-0 pb-0 pl-4">
                    {{ayudaHerramienta.mensaje}}
                </v-col>
            </v-alert>
        </template>

        <!-- INFORMACION DEL JOB -->
        <v-dialog v-model="ventanaInfoJob" width="550">
            <v-card class="p-4 shadow shadow-l">
                <v-card-title>PROPIEDADES DEL JOB {{jobMostrarInfo.job}}</v-card-title>
                <table class="w-full">
                    <tr>
                        <td class="w-1/3 border border-gray p-2"><b>JOB:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.job}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="w-1/3 border border-gray p-2"><b>DESCRIPCIÓN:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.descripcion}}</td>
                    </tr>
                    <tr>
                        <td class="border border-gray p-2"><b>EXPEDIENTE:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.expediente}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="border border-gray p-2"><b>DETECTADO EN:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.deteccion_job}}</td>
                    </tr>
                    <tr>
                        <td class="border border-gray p-2"><b>PERFIL:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.arreglo_job}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="border border-gray p-2"><b>GRAVEDAD:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.gravedad_job}}</td>
                    </tr>
                    <tr>
                        <td class="border border-gray p-2"><b>ASIGNADO A:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.asignacion_job}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="border border-gray p-2"><b>ENVIAR A:</b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.tipo_bandeja}}</td>
                    </tr>
                    <tr>
                        <td class="border border-gray p-2"><b>OPERADOR: </b></td>
                        <td class="border border-gray p-2">{{jobMostrarInfo.nombre_operador}}</td>
                    </tr>
                </table>
                <v-spacer class="mb-4"></v-spacer>
                <v-card-actions class="justify-end" style="padding:0rem;">
                    <v-btn class="w-28" color="error" elevation="3" @click="closeWindowInfoJob()">CANCELAR</v-btn>
                    <v-btn class="w-28" :disabled="modoMapa == 'visualizar'" color="primary" elevation="3" @click="openFormEditJob()">EDITAR</v-btn>
                    <v-btn class="w-28" color="success" elevation="3" @click="updateEditedJob()">ACEPTAR</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- FORMULARIO EDICIÓN DEL JOB -->
        <v-dialog v-model="formularioEdicionJob" width="500">
            <FormularioDatosJob
            :job="jobMostrarInfo"
            @closeEditJob="formularioEdicionJob=false"
            >
            </FormularioDatosJob>
        </v-dialog>

        <!-- INFORMACION DEL ERROR -->
        <v-dialog v-model="ventanaInfoError" width="550">
            <v-card class="p-4 shadow shadow-l">
                <v-card-title><p>PROPIEDADES DEL ERROR <b>{{errorMostrarInfo.error}}</b></p></v-card-title>
                <table class="w-full">
                    <tr class="bg-gray-100">
                        <td class="w-1/3 border border-gray p-2"><b>DESCRIPCIÓN:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.descripcion}}</td>
                    </tr>
                    <tr>
                        <td class="w-1/3 border border-gray p-2"><b>TEMA:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.tema_error}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="w-1/3 border border-gray p-2"><b>TIPO:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.tipo_error}}</td>
                    </tr>
                    <tr>
                        <td class="w-1/3 border border-gray p-2"><b>VIA ENTRADA:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.via_ent}}</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="w-1/3 border border-gray p-2"><b>ESTADO:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.estado}}</td>
                    </tr>
                    <tr>
                        <td class="w-1/3 border border-gray p-2"><b>ASOC. A JOB:</b></td>
                        <td class="border border-gray p-2">{{errorMostrarInfo.job}}</td>
                    </tr>
                </table>
                <v-spacer class="mb-4"></v-spacer>
                <v-card-actions class="justify-end" style="padding:0rem;">
                    <v-btn class="w-28" color="error" elevation="3" @click="ventanaInfoError = false">CANCELAR</v-btn>
                    <v-btn class="w-28" :disabled="modoMapa == 'visualizar'" color="primary" elevation="3" @click="openFormEditError()">EDITAR</v-btn>
                    <v-btn class="w-28" color="success" elevation="3" @click="updateEditedError()">ACEPTAR</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- FORMULARIO EDICIÓN DEL ERROR -->
        <v-dialog v-model="formularioEdicionError" width="500">
            <FormularioDatosError
            :error="errorMostrarInfo"
            @closeEditError="formularioEdicionError=false"
            >
            </FormularioDatosError>
        </v-dialog>   
    </div>
</template>

<script>
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

import { makeArrayFromApi } from '@/assets/mixins/makeArrayFromApi';
import { asignarValoresDefault } from '@/assets/mixins/asignarValoresDefault';
import { getMapExtent } from '@/assets/mixins/getMapExtent';
import { stringifyJobGeometry } from '@/assets/mixins/stringifyJobGeometry';
import { stringifyErrorGeometry } from '@/assets/mixins/stringifyErrorGeometry';

import FormularioDatosJob from '@/components/common/FormularioDatosJob';
import FormularioDatosError from '@/components/common/FormularioDatosError';


    export default {
        props: ["modoMapa", "jobsRecibidos", "erroresRecibidos", "reset"],

        components:{
            FormularioDatosJob,
            FormularioDatosError
        },

        computed: {
            returnModoMapa(){
            return this.modoMapa;
            },
            returnJobsRecibidos(){
            return this.jobsRecibidos;
            },
            returnErroresRecibidos(){
            return this.erroresRecibidos;
            },
            returnReset(){
            return this.reset;
            },
        },

        mixins:[
            makeArrayFromApi, 
            asignarValoresDefault,
            getMapExtent,
            stringifyJobGeometry,
            stringifyErrorGeometry,
        ],

        created(){
            //Selecciona como mapa activo por defecto el primer objeto del array de servicios
            this.activeMap = this.wmtsServices[0];
            this.getJobParameters();
            this.getErrorParameters();
            this.retrieveJobFromBD();
            this.retrieveErrorsFromBD();         
        },

        beforeDestroy(){
            this.$emit("errores", this.erroresAttrb);
            this.$emit('jobs', this.jobsAttrb);
        },

        watch:{
            jobs(){
                if(this.jobs.length != 0 && this.toolActive == 'drawJobs'){
                    this.editJob = true
                }

                if(this.jobs.length != 0 && this.toolActive == 'modifyJob'){
                    this.$emit('jobs', this.jobsAttrb)
                }

                //Actualizacion de geometrias al vuelo
                if(this.jobsRecibidos != undefined){
                    if(this.jobsAttrb.length > 0){
                        for (this.index in this.jobs){
                            if (this.jobs[this.index].id == this.jobsAttrb[this.index].id){
                                this.jobsAttrb[this.index].geometria_json = this.jobs[this.index].geometry;
                            }
                        }
                    }
                }
            },
            
            errores(){
                if(this.errores.length != 0 && this.toolActive == 'drawErrors'){
                    this.editError = true
                }

                if(this.errores.length != 0 && this.toolActive == 'modifyError'){
                    this.$emit("errores", this.erroresAttrb)
                }
                
                //Actualización geometrías al vuelo
                if(this.errores.length == this.erroresAttrb.length){
                    for (this.index in this.errores){
                        for (this.indexAttrb in this.erroresAttrb){
                            if (this.errores[this.index].id == this.erroresAttrb[this.indexAttrb].id) {
                                this.erroresAttrb[this.index].geometria_json = this.errores[this.index].geometry;
                            }
                        }
                    }
                }
            },
        },

        methods:{
            dummy(){
                //
            },

            updateEditedJob(){
                this.$emit("job", this.jobMostrarInfo)
                this.ventanaInfoJob = false;
            },

            updateEditedError(){
                for (this.index in this.erroresAttrb){
                    if (this.erroresAttrb[this.index].id==this.errorMostrarInfo.id){
                        this.erroresAttrb[this.index] = this.errorMostrarInfo
                        this.erroresAttrb[this.index].geometria = this.stringifyErrorGeometry(this.errorMostrarInfo.geometria_json)
                    }
                }
                this.$emit("errores", this.erroresAttrb)
                this.ventanaInfoError = false;
            },

            closeWindowInfoJob(){
                this.ventanaInfoJob = false;
            },
            
            openFormEditJob(){
                this.formularioEdicionJob = true;
            },

            openFormEditError(){
                this.formularioEdicionError = true;
            },

            showInfoError(){
                if (this.selectedErrores.length == 0){
                    this.throwMessage("orange", "info", "Debe seleccionar un error", true)
                } else {
                    if (this.selectedErrores.length == 1) {
                        for (this.index in this.selectedErrores) {
                            for (this.indexattrb in this.erroresAttrb){
                                if (this.erroresAttrb[this.indexattrb].id == this.selectedErrores[this.index].id){
                                    this.errorSeleccionado = this.erroresAttrb[this.indexattrb];
                                    this.errorMostrarInfo = {
                                        id: this.errorSeleccionado.id,
                                        id_error: this.errorSeleccionado.id_error,
                                        error: this.errorSeleccionado.error,
                                        descripcion: this.errorSeleccionado.descripcion,
                                        tema_error: this.errorSeleccionado.tema_error,
                                        tipo_error: this.errorSeleccionado.tipo_error,
                                        via_ent: this.errorSeleccionado.via_ent,
                                        estado: this.errorSeleccionado.estado,
                                        job: this.errorSeleccionado.job,
                                        geometria: null,
                                        geometria_json: this.errorSeleccionado.geometria_json,
                                    }
                                }
                            }
                        }
                        this.selectedErrores = [];
                        this.ventanaInfoError = true;
                    } else {
                        this.throwMessage("orange", "info", "Solo es posible mostrar la información de un error cada vez", true)
                    }
                }
            },

            showInfoJob(){
                if (this.selectedJobs.length == 0){
                    this.throwMessage("orange", "info", "Debe seleccionar un job", true)
                } else {
                    if (this.selectedJobs.length == 1) {
                        for (this.index in this.selectedJobs) {
                            for (this.indexattrb in this.jobsAttrb){
                                if (this.jobsAttrb[this.indexattrb].id == this.selectedJobs[this.index].id){
                                    this.jobMostrarInfo = this.jobsAttrb[this.indexattrb];
                                    //Reiniciamos la geometría por si fuera necesario hacer ediciones
                                    this.jobMostrarInfo.geometria = this.stringifyJobGeometry(this.jobsAttrb[this.indexattrb].geometria_json)
                                }
                            }
                        }
                        this.selectedJobs = [];
                        this.ventanaInfoJob = true;
                    } else {
                        this.throwMessage("orange", "info", "Solo es posible mostrar la información de un job cada vez", true)
                    }
                }
            },
            
            retrieveJobFromBD(){
                if (this.modoMapa == 'visualizar' || this.modoMapa == 'editar') {
                    //Solo ejecutamos si recibimos errores desde el componente padre
                    if (this.jobsRecibidos) {
                        //Geometrias
                        this.newJob = {
                            id: uuidv4(),
                            geometry: this.jobsRecibidos.geometria_json,
                            type: "Feature"
                        }
                        this.jobs.push(this.newJob);

                        //Atributos
                        this.newAttrbJobBd = {
                            id: this.newJob.id,
                            expediente: this.jobsRecibidos.expediente,
                            job: this.jobsRecibidos.job,
                            descripcion: this.jobsRecibidos.descripcion,
                            gravedad_job: this.jobsRecibidos.gravedad_job,
                            deteccion_job: this.jobsRecibidos.deteccion_job,
                            arreglo_job: this.jobsRecibidos.arreglo_job,
                            estado: this.jobsRecibidos.estado,
                            tipo_bandeja: this.jobsRecibidos.tipo_bandeja,
                            asignacion_job: this.jobsRecibidos.asignacion_job,
                            nombre_operador: this.jobsRecibidos.nombre_operador,
                            geometria: this.jobsRecibidos.geometria,
                            geometria_json: this.jobsRecibidos.geometria_json,
                            job_grande: this.jobsRecibidos.job_grande,
                        };
                        this.jobsAttrb.push(this.newAttrbJobBd);

                        //getExtent
                        axios
                        .get(`${process.env.VUE_APP_API_ROUTE}/jobExtent/`+ this.jobsRecibidos.job)
                        .then((data)=> {
                            this.datosExtent = this.getMapExtent(data.data);
                            this.center = this.datosExtent.centro;
                            this.zoom = this.datosExtent.nuevoZoom;
                        })
                        
                        
                    }
                }
            },

            
            retrieveErrorsFromBD(){
            //Solo se ejecuta si modoMapa es visualizar o editar
                if (this.modoMapa == 'visualizar' || this.modoMapa == 'editar'){
                    //Solo ejecutamos si recibimos errores desde el componente padre
                    if (this.erroresRecibidos){
                        for (this.index in this.erroresRecibidos){
                            this.newError = {
                                id: uuidv4(),
                                geometry: this.erroresRecibidos[this.index].geometria_json,
                                type: "Feature"
                            }
                            this.errores.push(this.newError);

                            //Atributos
                            this.newAttrbErrorBd = {
                                id: this.newError.id,
                                id_error: this.erroresRecibidos[this.index].id_error,
                                error: this.erroresRecibidos[this.index].error,
                                descripcion: this.erroresRecibidos[this.index].descripcion,
                                job: this.erroresRecibidos[this.index].job,
                                tema_error: this.erroresRecibidos[this.index].tema_error,
                                tipo_error: this.erroresRecibidos[this.index].tipo_error,
                                via_ent: this.erroresRecibidos[this.index].via_ent,
                                estado: this.erroresRecibidos[this.index].estado,
                                geometria: null,
                                geometria_json: this.erroresRecibidos[this.index].geometria_json,
                            };
                            this.erroresAttrb.push(this.newAttrbErrorBd);
                        }
                    }
                }
            },

            
            applyMode(modo){
            //Aplica el modo de mapa (edicion - visualización)
                if (this.modoMapa == 'visualizar') {
                    if (modo == 'editar'){
                        return true
                    } 
                }
                else if (this.modoMapa == 'editar') {
                    return false
                }
            },
            
            deactivateSelectTool(tipo){
                if (tipo == 'Jobs'){
                    this.toggleBtnJob = null
                } else {
                    this.toggleBtnError = null
                }
            },

            activeDrawErrors(){
                this.deactivateSelectTool('Jobs');
                this.toolActive = this.errorPanel[0].active;
                this.drawType = 'Point';
                this.showToolHelp('Haga clic en el mapa para situar el error.')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeSelectErrors(){
                this.deactivateSelectTool('Jobs');
                this.toolActive = this.errorPanel[1].active;
                this.drawType = null;
                this.showToolHelp('Haga clic sobre un error para seleccionarlo. El color azul indica que el error ha sido seleccionado')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeInfoError(){
                this.deactivateSelectTool('Jobs');
                this.toolActive = this.errorPanel[2].active;
                this.drawType = null;
                this.showInfoError();
                this.showToolHelp('Muestra información de un error seleccionado')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeModifyErrors(){
                this.deactivateSelectTool('Jobs');
                this.toolActive =this.errorPanel[3].active;
                this.drawType = 'Point';
                this.showToolHelp('')
                setTimeout(this.closeToolHelp, 6000);
            },

            activeDeleteErrors(){
                this.deactivateSelectTool('Jobs');
                this.toolActive =this.errorPanel[4].active;
                this.drawType = null;
            },

            deleteErrors(){
                //Comprobamos primero que existe una seleccion, si no existe lanza mensaje
                if (this.selectedErrores.length == 0){
                    this.throwMessage("orange", "info", "Debe seleccionar al menos un error", true)
                }

                for (this.index in this.selectedErrores){
                    for (this.errorIndex in this.errores){
                        if (this.errores[this.errorIndex].id == this.selectedErrores[this.index].id){
                            //Borramos geometria y atributos cuando id es igual.
                            this.errores.splice(this.errorIndex, 1);
                            this.erroresAttrb.splice(this.errorIndex, 1);

                            this.throwMessage ("green", "success", "Error eliminado correctamente", false)
                            setTimeout(this.closeInfoMessage,1500);
                        }
                    }
                }
                //Deseleccionar jobs
                this.selectedErrores = [];
            },

            getErrorParameters(){
                axios.get(`${process.env.VUE_APP_API_ROUTE}/errorParameters`).then((data) => {
                    this.objeto = data.data;
                    this.makeArrayFromApi(this.objeto.tema,this.temaError, 'tema_error')
                    this.makeArrayFromApi(this.objeto.tipo, this.tipoError, 'tipo_error')

                    //Asignar valor por defecto
                    this.selectTema = this.temaError[this.asignarValoresDefault(this.objeto.tema, 'id_tema_error')];
                    this.selectTipoError = this.tipoError[this.asignarValoresDefault(this.objeto.tipo, 'id_tipo_error')];
                    })
            },

            storeAttrbErrors(){
                //Almacenamos los atributos de cada job en un array distinto
                //TODO: parece imposible unificar todo en un mismo array... 
                let newAttrbError = {
                    id: this.errores[this.errores.length-1].id,
                    id_error: null,
                    error: null,
                    descripcion: this.descError,
                    job: null,
                    tema_error: this.selectTema,
                    tipo_error: this.selectTipoError,    
                    via_ent: 'IDV',
                    estado: 'Marcado',
                    geometria: this.stringifyErrorGeometry(this.errores[this.errores.length-1].geometry),
                    geometria_json: this.errores[this.errores.length-1].geometry,            
                }
                this.erroresAttrb.push(newAttrbError);
                this.editError = false;
                this.$emit('errores', this.erroresAttrb)
            },

            getJobParameters(){
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

                    //Asignar valores por defecto
                    //asignarValoresDefault(objetoAPI, columnaID)
                    this.asignacionJob = this.asignacion[this.asignarValoresDefault(this.objeto.asignacion, 'id_asignacion')];
                    this.deteccionJob = this.deteccion[this.asignarValoresDefault(this.objeto.deteccion, 'id_deteccion')];
                    this.gravedadJob = this.gravedad[this.asignarValoresDefault(this.objeto.gravedad, 'id_gravedad')];
                    this.perfilJob = this.perfil[this.asignarValoresDefault(this.objeto.perfilJob, 'id_arreglo')];
                    this.tipoBandejaJob = this.tipoBandeja[this.asignarValoresDefault(this.objeto.tipoBandeja, 'id_tipo_bandeja')];
                    this.nombreOperadorJob = null;
                    })
            },

            throwMessage(color, tipo, mensaje, aceptar){
                this.mensajeFlotante.visibilidad = true;
                this.mensajeFlotante.color = color;                 //colores: red, green, orange, yellow, purple
                this.mensajeFlotante.type = tipo;                   //type: success, info, warning, error
                this.mensajeFlotante.mensaje = mensaje;
                this.mensajeFlotante.aceptar = aceptar;             //Muestra el boton de "entendido"
            },

            closeInfoMessage(){
                this.mensajeFlotante.visibilidad = false;
            },

            showToolHelp(mensaje){
                this.ayudaHerramientaVentana = true;
                this.ayudaHerramienta.mensaje = mensaje;
            },

            closeToolHelp(){
                this.ayudaHerramientaVentana = false;
            },

            deleteJobs(){
                //Comprobamos primero que existe una seleccion, si no existe lanza mensaje
                if (this.selectedJobs.length == 0){
                    this.throwMessage("orange", "info", "Debe seleccionar al menos un job", true)
                }

                for (this.index in this.selectedJobs){
                    for (this.jobIndex in this.jobs){
                        if (this.jobs[this.jobIndex].id == this.selectedJobs[this.index].id){
                            //Borramos geometria y atributos cuando id es igual.
                            this.jobs.splice(this.jobIndex, 1);
                            this.jobsAttrb.splice(this.jobIndex, 1);

                            this.throwMessage ("green", "success", "Job eliminado correctamente", false)
                            setTimeout(this.closeInfoMessage,1500);
                        }
                    }
                }
                //Deseleccionar jobs
                this.selectedJobs = [];
            },

            abortInsertion(tipoDato){
                //Si un usuario cancela la inserción de atributos, cancela también la geometría
                if (tipoDato == 'jobs') {
                    this.jobs.splice(this.jobs.length-1,1);
                    this.editJob = false;
                    //Evita que se active la ventana de atributos de jobs
                    this.activeSelectJobs(); this.toggleBtnJob = 1;
                }
                else if (tipoDato == 'errores'){
                    this.errores.splice(this.errores.length-1,1);
                    this.editError = false;
                    //Evita que se active la ventana de atributos de jobs
                    this.activeSelectErrors(); this.toggleBtnError = 1;
                }
                
            },

            storeAttrbJobs(){
                //Almacenamos datos de geometría y atributos en otro array
                //TODO: parece imposible unificar todo en un mismo array... 
                this.newAttrbJob = {
                    id: this.jobs[this.jobs.length-1].id,
                    expediente: this.expedienteJob,
                    job: null,
                    descripcion: this.descJob,
                    gravedad_job: this.gravedadJob,
                    deteccion_job: this.deteccionJob,
                    arreglo_job: this.perfilJob,
                    estado: 'En triaje',
                    tipo_bandeja: this.tipoBandejaJob,
                    asignacion_job: this.asignacionJob,
                    nombre_operador: this.nombreOperadorJob,
                    geometria: this.stringifyJobGeometry(this.jobs[this.jobs.length-1].geometry),
                    geometria_json: this.jobs[this.jobs.length-1].geometry,
                    job_grande: this.jobGrande,
                }
                this.jobsAttrb.push(this.newAttrbJob);
                this.editJob = false;
                this.$emit('jobs', this.jobsAttrb)
            },

            activeDrawJobs(){
                this.deactivateSelectTool('Errores');
                this.toolActive = this.jobsPanel[0].active;
                this.drawType = 'Polygon';
                this.showToolHelp('Haga clic en el mapa para dibujar los vértices del polígono. Doble clic para finalizar.')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeSelectJobs(){
                this.deactivateSelectTool('Errores');
                this.toolActive = this.jobsPanel[1].active;
                this.drawType = null;
                this.showToolHelp('Haga clic sobre un job para seleccionarlo. El color azul indica que el job ha sido seleccionado')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeInfoJob(){
                this.deactivateSelectTool('Errores');
                this.toolActive = this.jobsPanel[2].active;
                this.drawType = null;
                this.showInfoJob();
                this.showToolHelp('Muestra información del job seleccionado')
                setTimeout(this.closeToolHelp, 3000);
            },

            activeModifyJobs(){
                this.deactivateSelectTool('Errores');
                this.toolActive =this.jobsPanel[3].active;
                this.drawType = 'Polygon';
                this.showToolHelp('Acérquese al job y un punto azul indicará el vértice que se desplazara. Para crear un nuevo vértice arrastre la línea de polígono en el lugar deseado')
                setTimeout(this.closeToolHelp, 6000);
            },

            activeDeleteJobs(){
                this.deactivateSelectTool('Errores');
                this.toolActive =this.jobsPanel[4].active;
                this.drawType = null;
            },

        },

        data(){
            return{
            //PARAMETROS API
            apiUrl: "http://10.13.86.114:3000/",
            perfilMapa: undefined,        

            //MAP
            epsg:"EPSG:3857",
            activeMap: null,

            //VIEW
            zoom: 5.5,
            minZoom: 5.5,
            center: [ -386025.74417069746, 4683331.210786856 ],

            //SOURCE WMTS -> añadimos servicio añadiendo objeto al array
            wmtsServices: [
                {
                    attribution: 'IGN base wmts - Instituto Geográfico Nacional',
                    url: "https://www.ign.es/wmts/ign-base",
                    layerName: "IGNBaseTodo", 
                    nombre: "IGN Base", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignBase', 
                    format: 'image/jpeg'
                },
                {
                    attribution: 'IGN PNOA - Máxima actualidad - Instituto Geográfico Nacional',
                    url: "https://www.ign.es/wmts/pnoa-ma",
                    layerName: "OI.OrthoimageCoverage", 
                    nombre: "PNOA MA", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignPNOA', 
                    format: 'image/jpeg'
                },
                {
                    attribution: 'IGN Mapa Ráster - Instituto Geográfico Nacional',
                    url: "https://www.ign.es/wmts/mapa-raster",
                    layerName: "MTN", 
                    nombre: "Mapa Ráster", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignMapaRaster', 
                    format: 'image/jpeg'
                },
                {
                    attribution: 'IGN MTN50 Primera Edición - Instituto Geográfico Nacional',
                    url: "https://www.ign.es/wmts/primera-edicion-mtn",
                    layerName: "mtn50-edicion1", 
                    nombre: "MTN 50 1ª ED.", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignMTN50Old', 
                    format: 'image/jpeg'
                },
                {
                    attribution: 'IGN MTN25 Primera Edición - Instituto Geográfico Nacional',
                    url: "https://www.ign.es/wmts/primera-edicion-mtn",
                    layerName: "mtn25-edicion1", 
                    nombre: "MTN 25 1ª ED.", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignMTN25Old', 
                    format: 'image/jpeg'
                },
            ],

            //GEOMETRIAS MAPA
            jobs: [],
            selectedJobs:[],
            errores: [],
            selectedErrores:[],

            //ATRIBUTOS DE GEOMETRÍAS MAPA
            jobsAttrb:[],
            erroresAttrb:[],

            //HERRAMIENTAS
            showMapTools: true,
            toggleBtnError: 9,                //Muestra el boton seleccionado en panel control errores
            toggleBtnJob: 9,                  //Muestra el boton seleccionado en panel control jobs
            toolActive: null,
            drawType: null,
            generalTools: [
                {
                    title: "Buscar",
                    icon: "mdi-map-search"
                },
                {
                    title: "Mover",
                    icon: "mdi-cursor-pointer"
                },
                {
                    title: "Centrar Mapa",
                    icon: "mdi-arrow-expand-all"
                },
            ],
            jobsPanel: [              
                {   title: "Dibujar Job", 
                    active: "drawJobs", 
                    click: this.activeDrawJobs, 
                    icon: "mdi-vector-square",
                    modo: "editar" 
                },
                {   title: "Seleccionar Job", 
                    active: "selectJob", 
                    click: this.activeSelectJobs, 
                    icon: "mdi-cursor-default",
                    modo: "visualizar" 
                },
                {   title: "Ver / Editar Propiedades del Job", 
                    active: "getJobInfo", 
                    click: this.activeInfoJob, 
                    icon: "mdi-square-edit-outline",
                    modo: "visualizar" 
                },
                {   title: "Editar geometría de Job", 
                    active: "modifyJob", 
                    click: this.activeModifyJobs, 
                    icon: "mdi-vector-polygon",
                    modo: "editar"  
                },
                {   title: "Eliminar Job", 
                    active: "deleteJobs", 
                    click: this.deleteJobs, 
                    icon: "mdi-delete",
                    modo: "editar" 
                },
            ],
            errorPanel: [             //Array de objetos que definen las opciones disponibles en el panel de control
                {   title: "Dibujar Error",
                    active: "drawErrors",
                    click: this.activeDrawErrors,
                    icon: "mdi-map-marker-plus",
                    modo: "editar" 
                },
                {   title: "Seleccionar Error",
                    active: "selectError", 
                    click: this.activeSelectErrors, 
                    icon: "mdi-cursor-default",
                    modo: "visualizar" 
                },
                {   title: "Ver / Editar Propiedades del Error",
                    active: "getErrorInfo", 
                    click: this.activeInfoError, 
                    icon: "mdi-square-edit-outline",
                    modo: "visualizar"
                },
                {   title: "Editar posición del Error",
                    active: "modifyError", 
                    click: this.activeModifyErrors, 
                    icon: "mdi-arrow-all",
                    modo: "editar"
                },
                {   title: "Eliminar Error", 
                    active: "deleteErrors", 
                    click: this.deleteErrors, 
                    icon: "mdi-delete",
                    modo: "editar"

                },
            ],
            activarMostrarIdError: false,

            //FORMULARIO ALTA JOB   
            editJob: false,             //Visibilidad ventana editar atributos
            descJob: '',                //TextArea Descripcion Job
            jobGrande: false,           //Valor
            expediente:[],
            expedienteJob:[],
            deteccion: [],              //Array desde BD llenar en initialize
            deteccionJob:[],            //Toma por defecto primer valor
            perfil: [],                 //Array desde BD llenar en initialize    
            perfilJob: [],
            gravedad: [],               //Array desde BD llenar en initialize
            gravedadJob:[],
            asignacion: [],             //Array desde BD llenar en initialize
            asignacionJob: [],
            tipoBandeja: [],            //Array desde BD llenar en initialize
            tipoBandejaJob: [],
            nombreOperador: [],         //Array desde BD llenar en initialize
            nombreOperadorJob: [],

            //FORMULARIO ALTA ERROR
            editError: false,
            descError: '',
            temaError:[],
            selectTema: [],
            tipoError: [],
            selectTipoError: [],
            

            //MENSAJES FLOTANTES         
            mensajeFlotante:  {
                visibilidad: false,
                color: "green",             
                type: "success",            
                mensaje: "introduzca texto",
                aceptar: true,  
            },

            //MENSAJES AYUDA HERRAMIENTA
            ayudaHerramientaVentana: false,
            ayudaHerramienta: {
                mensaje: 'introduzca texto'
            },

            //VENTANA INFORMACION 
            ventanaInfoJob: false,
            ventanaInfoError: false,
            jobMostrarInfo: {},
            formularioEdicionJob: false,
            errorMostrarInfo: {},
            formularioEdicionError: false,
            
        }
    }
}
</script>
