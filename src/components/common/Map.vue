<template>
    <div class="h-full">
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

            <!--jobs-->        
            <vl-layer-vector 
                :z-index="2">
                <vl-source-vector :features.sync="jobs" ident="jobs"></vl-source-vector>
                <vl-style-box>
                    <vl-style-stroke color="green"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
                </vl-style-box>
            </vl-layer-vector>

            <vl-interaction-select
                v-if="drawType == null && toolActive == 'selectJob'"
                :features.sync="selectedJobs">
            </vl-interaction-select>

            <vl-interaction-draw 
            type="Polygon" 
            source="jobs"
            :active="toolActive == 'drawJobs'">
                <vl-style-box>
                    <vl-style-stroke color="blue"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
                </vl-style-box>
            </vl-interaction-draw>

            <vl-interaction-modify
            type="Polygon"
            source="jobs"
            :active="toolActive == 'modifyJob'">
            </vl-interaction-modify>
            <!--fin jobs-->

            <!-- ERRORES -->
            <vl-layer-vector 
                :z-index="3">
                <vl-source-vector :features.sync="errores" ident="errores"></vl-source-vector>
                <vl-style-box>
                    <vl-style-circle :radius="7">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-layer-vector>

            <vl-interaction-select
                v-if="drawType == null && toolActive == 'selectError'"
                :features.sync="selectedErrores">
            </vl-interaction-select>

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

            <vl-interaction-modify
            type="Point"
            source="errores"
            :active="toolActive == 'modifyError'">
            </vl-interaction-modify>

    <!-- ================================ CAPAS WMTS ================================= -->    

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


    <!-- ========================== INFO JOBS ============================== -->

            <vl-overlay v-if ="ventanaInfoJob == true" id="overlay" :position="[center[0]-2000, center[1]+2000]">
                <template>
                    <div class="overlay-content bg-white p-4 shadow shadow-l">
                        <table class="bg-gray-100">
                            <tr class="border border-gray">
                                <td class="p-2"><b>JOB:</b></td>
                                <td class="p-2">{{jobMostrarInfo.job}}</td>
                            </tr>
                            <tr class="border border-gray">
                                <td class="p-2"><b>DESCRIPCIÓN:</b></td>
                                <td class="p-2">{{jobMostrarInfo.descripcion}}</td>
                            </tr>
                            <tr class="border border-gray">
                                <td class="p-2"><b>DETECTADO:</b></td>
                                <td class="p-2">{{jobMostrarInfo.detectado}}</td>
                            </tr>
                            <tr class="border border-gray">
                                <td class="p-2"><b>GRAVEDAD:</b></td>
                                <td class="p-2">{{jobMostrarInfo.gravedad}}</td>
                            </tr>
                            <tr class="border border-gray">
                                <td class="p-2"><b>PERFIL:</b></td>
                                <td class="p-2">{{jobMostrarInfo.perfil}}</td>
                            </tr>
                        </table>
                        <br/>
                        <v-btn color="error" elevation="3" @click="ventanaInfoJob = !ventanaInfoJob">CERRAR</v-btn>
                    </div>
                </template>
            </vl-overlay>

        </vl-map>

        <!--PANEL DE CONTROL -->
        <v-app class="font-sans" style="float: right; height: 0rem">
            <v-card
            class="p-2 border-2 border-blue-400"
            style="
            top: -45.5rem;
            margin-right: 1rem;
            width: 16rem;
            box-shadow: 5px 5px 5px gray;
            background-color: rgba(0, 60, 136, 0.5);
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
                            :disabled="aplicarModo(item.modo)"
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
                            :disabled="aplicarModo(item.modo)"
                            >
                            <v-icon color="#1E40AF">{{ item.icon }}</v-icon>
                        </v-btn>
                        </v-btn-toggle>
                    </div>
                    
                    <v-spacer class="my-8"></v-spacer>

                    <div class="rounded bg-blue-800 p-2 mb-1 text-white text-l text-center">
                    CAPAS WMTS
                    </div>
                        <v-btn
                            v-for="service in wmtsServices"
                            :key="service.nombre"
                            text dark class="bg-green-500 mb-1 flex-grow shadow-lg w-full"
                            @click="activeMap = service"
                            >{{service.nombre}}
                        </v-btn>
                        <v-spacer class="my-1"></v-spacer>
                    </div>

                </v-expand-transition>
            </v-card>
        </v-app>

        <!-- VENTANA INFORMACION -->
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
                            <v-btn color="error" dark @click="cancelarInsercion('jobs')"
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
                        <v-btn color="error" dark @click="cancelarInsercion('errores')"
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
                        <v-btn v-if="mensajeFlotante.aceptar == true" @click="cerrarMensajeInformacion()">ENTENDIDO</v-btn>
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


    </div>
</template>

<script>
import axios from "axios";
import {makeArrayFromApi} from '@/assets/mixins/makeArrayFromApi.js';
import {asignarValoresDefault} from '@/assets/mixins/asignarValoresDefault.js';
import {getMapExtent} from '@/assets/mixins/getMapExtent';
import md5 from 'md5';


    export default {
        props: ["modoMapa", "jobsRecibidos", "erroresRecibidos", "reset"],

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
        ],

        created(){
            //Selecciona como mapa activo por defecto el primer objeto del array de servicios
            this.activeMap = this.wmtsServices[0];
            this.obtenerParametrosJob();
            this.obtenerParametrosError();
            this.retrieveJobFromBD();
            this.retrieveErroresFromBD();
        },

        watch:{
            jobs(){
                if(this.jobs.length != 0 && this.toolActive == 'drawJobs'){
                    this.editJob = true
                }

                if(this.jobs.length != 0 && this.toolActive == 'modifyJob'){
                    this.$emit('jobs', this.jobsAttrb)
                }
            },
            
            errores(){
                if(this.errores.length != 0 && this.toolActive == 'drawErrors'){
                    this.editError = true
                }
            },

        },

        methods:{
            dummy(){
                //
            },

            mostrarInfoError(){
                console.log(this.selectedErrores)
            },

            mostrarInfoJob(){
                for (this.index in this.selectedJobs) {
                    for (this.indexattrb in this.jobsAttrb){
                        if (this.jobsAttrb[this.indexattrb].id == this.selectedJobs[this.index].id){
                            this.jobSeleccionado = this.jobsAttrb[this.indexattrb];

                            this.jobMostrarInfo = {
                                job: this.jobSeleccionado.job,
                                descripcion: this.jobSeleccionado.descripcion,
                                detectado: this.jobSeleccionado.detectado,
                                gravedad: this.jobSeleccionado.gravedad,
                                perfil: this.jobSeleccionado.perfil,
                            }
                        }
                    }
                }
                this.ventanaInfoJob = true;
            },
            
            retrieveJobFromBD(){
                if (this.modoMapa == 'visualizar' || this.modoMapa == 'editar') {
                    //Solo ejecutamos si recibimos errores desde el componente padre
                    if (this.jobsRecibidos) {
                        //Geometrias
                        this.newJob = {
                            id: md5(this.jobsRecibidos.job),
                            geometry: this.jobsRecibidos.geometria_json,
                            type: "Feature"
                        }
                        this.jobs.push(this.newJob);

                        //Atributos
                        this.newAttrbJobBd = {
                            id: md5(this.jobsRecibidos.job),
                            job: this.jobsRecibidos.job,
                            expediente: this.jobsRecibidos.expediente,
                            estado: this.jobsRecibidos.estado,
                            jobGran: this.jobsRecibidos.job_grande,
                            detectado: this.jobsRecibidos.deteccion_job,
                            descripcion: this.jobsRecibidos.descripcion,
                            perfil: this.jobsRecibidos.arreglo_job,
                            gravedad: this.jobsRecibidos.gravedad_job,
                            asignar: this.jobsRecibidos.asignacion_job,
                            tipoBandeja: this.jobsRecibidos.tipo_bandeja,
                            operador: this.jobsRecibidos.nombre_operador,
                            geometria: this.jobsRecibidos.geometria,
                            geometriaJSON: this.jobsRecibidos.geometria_json,
                        };
                        this.jobsAttrb.push(this.newAttrbJobBd);

                        //getExtent
                        this.datosExtent = this.getMapExtent(this.jobsRecibidos.geometria_json)
                        this.center = this.datosExtent.centro;
                        this.zoom = this.datosExtent.nuevoZoom;
                    }
                }
            },

            //Solo modo visualizar
            retrieveErroresFromBD(){
                if (this.modoMapa == 'visualizar' || this.modoMapa == 'editar'){
                    //Solo ejecutamos si recibimos errores desde el componente padre
                    if (this.erroresRecibidos){
                        for (this.index in this.erroresRecibidos){
                            this.newError = {
                                geometry: this.erroresRecibidos[this.index].geometria_json,
                                type: "Feature"
                            }
                            this.errores.push(this.newError);
                        }
                    }
                }
            },

            //Aplica el modo de mapa (edicion - visualización)
            aplicarModo(modo){
                if (this.modoMapa == 'visualizar') {
                    if (modo == 'editar'){
                        return true
                    } 
                }
                
                else if (this.modoMapa == 'editar') {
                    return false
                }

            },
            
            //Formatea la geometria de jobs para la insercion en BD
            stringifyErrorGeometry(geometry){
                this.coordinates = geometry.coordinates;
                this.string = 'POINT(';
                this.coordinate = this.coordinates.toString();
                this.coordinate = this.coordinate.replace(',',' ');
                this.string = this.string + this.coordinate;
                this.string = this.string + ')';
                return this.string;
            },

            //Formatea la geometria de jobs para la insercion en BD
            stringifyJobGeometry(geometry){
                this.coordinates = geometry.coordinates[0];
                this.string = "POLYGON((";
                for (this.index in this.coordinates) {
                    this.coordinate = this.coordinates[this.index].toString();
                    this.coordinate = this.coordinate.replace(',',' ');
                    this.string = this.string + this.coordinate + ','
                }
                this.string = this.string + '))';
                this.string = this.string.replace(",))", "))");
                return this.string;
            },

            desactivarSelectTool(tipo){
                if (tipo == 'Jobs'){
                    this.toggleBtnJob = null
                } else {
                    this.toggleBtnError = null
                }
            },

            activeDrawErrors(){
                this.desactivarSelectTool('Jobs');
                this.toolActive = this.errorPanel[0].active;
                this.drawType = 'Point';
                this.mostrarAyudaHerramienta('Haga clic en el mapa para situar el error.')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeSelectErrores(){
                this.desactivarSelectTool('Jobs');
                this.toolActive = this.errorPanel[1].active;
                this.drawType = null;
                this.mostrarAyudaHerramienta('Haga clic sobre un error para seleccionarlo. El color azul indica que el error ha sido seleccionado')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeInfoError(){
                this.desactivarSelectTool('Jobs');
                this.toolActive = this.errorPanel[2].active;
                this.drawType = null;
                this.mostrarInfoError();
                this.mostrarAyudaHerramienta('Muestra información de un error seleccionado')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeModifyErrores(){
                this.desactivarSelectTool('Jobs');
                this.toolActive =this.errorPanel[3].active;
                this.drawType = 'Point';
                this.mostrarAyudaHerramienta('')
                setTimeout(this.cerrarAyudaHerramienta, 6000);
            },

            activeDeleteErrores(){
                this.desactivarSelectTool('Jobs');
                this.toolActive =this.errorPanel[4].active;
                this.drawType = null;
            },

            deleteErrores(){
                //Comprobamos primero que existe una seleccion, si no existe lanza mensaje
                if (this.selectedErrores.length == 0){
                    this.lanzarMensaje("orange", "info", "Debe seleccionar al menos un error", true)
                }

                for (this.index in this.selectedErrores){
                    for (this.errorIndex in this.errores){
                        if (this.errores[this.errorIndex].id == this.selectedErrores[this.index].id){
                            //Borramos geometria y atributos cuando id es igual.
                            this.errores.splice(this.errorIndex, 1);
                            this.erroresAttrb.splice(this.errorIndex, 1);

                            this.lanzarMensaje ("green", "success", "Error eliminado correctamente", false)
                            setTimeout(this.cerrarMensajeInformacion,1500);
                        }
                    }
                }
                //Deseleccionar jobs
                this.selectedErrores = [];
            },

            obtenerParametrosError(){
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
                    estado: 'Marcado',
                    idError: null,
                    asocJob: null,
                    tipo: this.selectTipoError,
                    tema: this.selectTema,
                    descripcion: this.descError,
                    geometria: this.stringifyErrorGeometry(this.errores[this.errores.length-1].geometry),
                    geometriaJSON: this.errores[this.errores.length-1].geometry,
                    viaEnt: 'IDV',
                }
                this.erroresAttrb.push(newAttrbError);
                this.editError = false;
                this.$emit('errores', this.erroresAttrb)
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

                    //Asignar valores por defecto
                    //asignarValoresDefault(objetoAPI, columnaID)
                    this.asignacionJob = this.asignacion[this.asignarValoresDefault(this.objeto.asignacion, 'id_asignacion')];
                    this.deteccionJob = this.deteccion[this.asignarValoresDefault(this.objeto.deteccion, 'id_deteccion')];
                    this.gravedadJob = this.gravedad[this.asignarValoresDefault(this.objeto.gravedad, 'id_gravedad')];
                    this.perfilJob = this.perfil[this.asignarValoresDefault(this.objeto.perfilJob, 'id_arreglo')];
                    this.tipoBandejaJob = this.tipoBandeja[this.asignarValoresDefault(this.objeto.tipoBandeja, 'id_tipo_bandeja')];
                    })
            },

            lanzarMensaje(color, tipo, mensaje, aceptar){
                this.mensajeFlotante.visibilidad = true;
                this.mensajeFlotante.color = color;                 //colores: red, green, orange, yellow, purple
                this.mensajeFlotante.type = tipo;                   //type: success, info, warning, error
                this.mensajeFlotante.mensaje = mensaje;
                this.mensajeFlotante.aceptar = aceptar;             //Muestra el boton de "entendido"
            },

            cerrarMensajeInformacion(){
                this.mensajeFlotante.visibilidad = false;
            },

            mostrarAyudaHerramienta(mensaje){
                this.ayudaHerramientaVentana = true;
                this.ayudaHerramienta.mensaje = mensaje;
            },

            cerrarAyudaHerramienta(){
                this.ayudaHerramientaVentana = false;
            },

            deleteJobs(){
                //Comprobamos primero que existe una seleccion, si no existe lanza mensaje
                if (this.selectedJobs.length == 0){
                    this.lanzarMensaje("orange", "info", "Debe seleccionar al menos un job", true)
                }

                for (this.index in this.selectedJobs){
                    for (this.jobIndex in this.jobs){
                        if (this.jobs[this.jobIndex].id == this.selectedJobs[this.index].id){
                            //Borramos geometria y atributos cuando id es igual.
                            this.jobs.splice(this.jobIndex, 1);
                            this.jobsAttrb.splice(this.jobIndex, 1);

                            this.lanzarMensaje ("green", "success", "Job eliminado correctamente", false)
                            setTimeout(this.cerrarMensajeInformacion,1500);
                        }
                    }
                }
                //Deseleccionar jobs
                this.selectedJobs = [];
            },

            cancelarInsercion(tipoDato){
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
                    this.activeSelectErrores(); this.toggleBtnError = 1;
                }
                
            },

            storeAttrbJobs(){
                //Almacenamos datos de geometría y atributos en otro array
                //TODO: parece imposible unificar todo en un mismo array... 
                this.newAttrbJob = {
                    id: this.jobs[this.jobs.length-1].id,
                    idJob: null,
                    expediente: this.expedienteJob,
                    estado: 'En triaje',
                    jobGran: this.jobGrande,
                    detectado: this.deteccionJob,
                    descripcion: this.descJob,
                    perfil: this.perfilJob,
                    gravedad: this.gravedadJob,
                    asignar: this.asignacionJob,
                    tipoBandeja: this.tipoBandejaJob,
                    operador: this.nombreOperadorJob,
                    geometria: this.stringifyJobGeometry(this.jobs[this.jobs.length-1].geometry),
                    geometriaJSON: this.jobs[this.jobs.length-1].geometry,
                    epsg: 3857,
                }
                this.jobsAttrb.push(this.newAttrbJob);
                this.editJob = false;
                this.$emit('jobs', this.jobsAttrb)
            },

            activeDrawJobs(){
                this.desactivarSelectTool('Errores');
                this.toolActive = this.jobsPanel[0].active;
                this.drawType = 'Polygon';
                this.mostrarAyudaHerramienta('Haga clic en el mapa para dibujar los vértices del polígono. Doble clic para finalizar.')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeSelectJobs(){
                this.desactivarSelectTool('Errores');
                this.toolActive = this.jobsPanel[1].active;
                this.drawType = null;
                this.mostrarAyudaHerramienta('Haga clic sobre un job para seleccionarlo. El color azul indica que el job ha sido seleccionado')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeInfoJob(){
                this.desactivarSelectTool('Errores');
                this.toolActive = this.jobsPanel[2].active;
                this.drawType = null;
                this.mostrarInfoJob();
                this.mostrarAyudaHerramienta('Muestra información del job seleccionado')
                setTimeout(this.cerrarAyudaHerramienta, 3000);
            },

            activeModifyJobs(){
                this.desactivarSelectTool('Errores');
                this.toolActive =this.jobsPanel[3].active;
                this.drawType = 'Polygon';
                this.mostrarAyudaHerramienta('Acérquese al job y un punto azul indicará el vértice que se desplazara. Para crear un nuevo vértice arrastre la línea de polígono en el lugar deseado')
                setTimeout(this.cerrarAyudaHerramienta, 6000);
            },

            activeDeleteJobs(){
                this.desactivarSelectTool('Errores');
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
                    attribution: 'IGN PNOA - Máxima actualidad - Institutot Geográfico Nacional',
                    url: "https://www.ign.es/wmts/pnoa-ma",
                    layerName: "OI.OrthoimageCoverage", 
                    nombre: "PNOA MA", 
                    matrixSet: "EPSG:3857", 
                    styleName: "default",
                    activeMap: 'ignPNOA', 
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
            showMapTools: false,
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
                {   title: "Información del Job", 
                    active: "getJobInfo", 
                    click: this.activeInfoJob, 
                    icon: "mdi-information",
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
                    click: this.activeSelectErrores, 
                    icon: "mdi-cursor-default",
                    modo: "visualizar" 
                },
                {   title: "Información del Error",
                    active: "getErrorInfo", 
                    click: this.activeInfoError, 
                    icon: "mdi-information",
                    modo: "visualizar"
                },
                {   title: "Editar posición del Error",
                    active: "modifyError", 
                    click: this.activeModifyErrores, 
                    icon: "mdi-arrow-all",
                    modo: "editar"
                },
                {   title: "Eliminar Error", 
                    active: "deleteErrores", 
                    click: this.deleteErrores, 
                    icon: "mdi-delete",
                    modo: "editar"

                },
            ],

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

            //VENTANA INFORMACION JOB
            ventanaInfoJob: false,

            };
        }
    }

</script>
