<template>
<div>
    <div style="height:550px">
        <!--//4326 wgs84
            //3857 WEB mercator
            //3034 ETRS89 -->
        <vl-map 
            :load-tiles-while-animating="true" 
            :load-tiles-while-interacting="true" 
            data-projection="EPSG:3857"
            >
            
            <!-- CONTROLA LA VISTA DEL MAPA -->
            <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>



            <!-- MUESTRA LAS GEOMETRIAS ALMACENADAS EN JOBS Y ERRORES -->
            <vl-interaction-select
                v-if="drawType == null"
                :features.sync="selectedFeatures">
                
                <template>
                <!--Estilos de seleccion-->    
                <vl-style-box>
                    <vl-style-circle :radius="7">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>

                <vl-style-box>
                    <vl-style-stroke color="red" :width="4"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.2)"></vl-style-fill>
                </vl-style-box>
                <!-- fin estilos seleccion -->


                <!-- geometrias source -->
                <vl-layer-vector :z-index="zIndexJob">
                    <vl-source-vector :features.sync="jobs" ident="jobs"></vl-source-vector>
                    <vl-style-box>
                        <vl-style-stroke color="blue"></vl-style-stroke>
                        <vl-style-fill color="rgba(255,255,255,0.1)"></vl-style-fill>
                    </vl-style-box>
                </vl-layer-vector>

                <vl-layer-vector :z-index="zIndexError">
                    <vl-source-vector :features.sync="errores" ident="errores"></vl-source-vector>
                    <vl-style-box>
                        <vl-style-circle :radius="6">
                        <vl-style-fill color="blue"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                        </vl-style-circle>
                    </vl-style-box>
                </vl-layer-vector>
                <!-- fin geometrias source -->

                </template>


                <!--permite mostra información sobre feature seleccionada-->
            </vl-interaction-select>



            <!-- PERMITE DIBUJAR y MODIFICAR GEOMETRIAS EN EL MAPA Y LAS ALMACENA EN ARRAYS -->
            <vl-interaction-draw type="Polygon" source="jobs" :active="(optionActive == 'drawJob')">
            </vl-interaction-draw>  

            <vl-interaction-draw type="Point" source="errores" :active="(optionActive == 'drawError')">
            </vl-interaction-draw> 

            <vl-interaction-modify type="Polygon" source="jobs" :active="(optionActive == 'modifyJob')">
            </vl-interaction-modify>

            <vl-interaction-modify type="Point" source="errores" :active="(optionActive == 'modifyError')">
            </vl-interaction-modify>
               
            <!--CAPAS DE MAPAS -->
            <div v-if="mapActive=='osm'">
                <vl-layer-tile id="osm">
                    <vl-source-osm></vl-source-osm>
                </vl-layer-tile>
            </div>

            <div v-if="mapActive=='ignBase'">
                <vl-layer-tile>
                    <vl-source-wms
                    layers = 'IGNBaseTodo'
                    matrixSet = 'EPSG:3857'
                    style = 'default'
                    url = '	https://www.ign.es/wms-inspire/ign-base'
                    >
                    </vl-source-wms>
                </vl-layer-tile>
            </div>

            <div v-if="mapActive=='pnoa'">
                <vl-layer-tile>
                    <vl-source-wmts
                    matrixSet = 'EPSG:3857'
                    styleName = 'default'
                    layerName = 'OI.OrthoimageCoverage'
                    url='http://www.ign.es/wmts/pnoa-ma'
                    >
                    </vl-source-wmts>
                </vl-layer-tile>
            </div>

            <div v-if="mapActive=='MTN25'">
                <vl-layer-tile>
                    <vl-source-wms
                    matrixSet = 'EPSG:3857'
                    layers = 'mtn_rasterizado'
                    style = 'default'
                    url='https://www.ign.es/wms-inspire/mapa-raster'
                    >
                    </vl-source-wms>
                </vl-layer-tile>
            </div>
           <!-- FIN CAPAS MAPA BASE --> 
        </vl-map>


        
        <!--FORMULARIO INTRODUCIR DATOS JOB -->
        <template>
            <div class="text-center">
                <v-dialog
                v-model="editJob"
                width="500"
                >

                <v-card>
                        <v-card-title dark class="text-lg text-white bg-blue-500">Alta de Job
                        <v-spacer></v-spacer>
                        <v-card-title>
                        <b>{{"  " + incidencia + '-J0' + jobs.length}}</b></v-card-title>
                        </v-card-title>

                        <div class="p-1">
                            <!--TextEditor descripciones error-->
                            <v-col class="bg-gray-200" cols="12">
                                <v-textarea
                                    v-model="descJob"
                                    filled
                                    label="Descripción del Job"
                                    auto-grow
                                    value=""
                                ></v-textarea>
                            </v-col>

                            <v-divider></v-divider>
                            <v-spacer class="mt-2"></v-spacer>

                            <v-col cols="12">
                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Detectado en:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="deteccion"
                                            :label="deteccion[0]"
                                            v-model="deteccionJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Arreglar en:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="arreglo"
                                            :label="arreglo[0]"
                                            v-model="arregloJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Gravedad:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="gravedad"
                                            :label="gravedad[0]"
                                            v-model="gravedadJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Asignar a:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="asignacion"
                                            label="Seleccione Bandeja"
                                            v-model="asignacionJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                
                                <v-row v-if="asignacionJob == 'Bandeja de Jobs'" style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Enviar a:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="tipoBandeja"
                                            label="Seleccione Bandeja"
                                            v-model="tipoBandejaJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row v-if="asignacionJob == 'Bandeja de Jobs'" style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Operador:
                                    </v-col>
                                    <v-col dense cols="8">
                                        <v-select
                                        dense
                                            filled
                                            class="text-lg"
                                            :items="nombreOperador"
                                            label="Seleccionar Operador"
                                            v-model="nombreOperadorJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>                                        
                            </v-col>
                            
                            <v-spacer class="mt-5"></v-spacer>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" dark @click="editJob = false">CANCELAR</v-btn>
                                <v-btn color="success" dark @click="recJobData">ACEPTAR</v-btn>
                            </v-card-actions>
                        </div>
                </v-card>
                </v-dialog>
            </div>
        </template>


        <!--IFORMULARIO INTRODUCIR DATOS ERROR -->
        <template>
            <div class="text-center">
                <v-dialog
                v-model="editError"
                width="500"
                >

                <v-card>
                        <div v-if="deleting==false">
                            <v-card-title dark class="text-lg text-white bg-red-500">Alta de error
                            <v-spacer></v-spacer>
                            <v-card-title>
                            <b>{{"  " + incidencia + '-E' + errores.length}}</b></v-card-title>
                            </v-card-title>

                            <div class="p-1">
                                <!--TextEditor descripciones error-->
                                <v-col class="bg-gray-200" cols="12">
                                    <v-textarea
                                        v-model="descError"
                                        filled
                                        label="Descripción del error"
                                        auto-grow
                                        value=""
                                    ></v-textarea>
                                </v-col>

                                <v-divider></v-divider>
                                <v-spacer class="mt-2"></v-spacer>

                                <v-col cols="12">
                                    <v-row style="margin-bottom:-2.5rem;">
                                        <v-col cols="4" class="mt-5"            >                           
                                        Tema:
                                        </v-col>
                                        <v-col dense cols="8">
                                            <v-select
                                            dense
                                                filled
                                                class="text-lg"
                                                :items="tema"
                                                :label="tema[0]"
                                                v-model="temaError"
                                            ></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row style="margin-bottom:-2.5rem;">
                                        <v-col cols="4" class="mt-5"            >                           
                                        Tipo:
                                        </v-col>
                                        <v-col dense cols="8">
                                            <v-select
                                            dense
                                                filled
                                                class="text-lg"
                                                :items="tipoError"
                                                :label="tipoError[0]"
                                                v-model="errorDe"
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>

                                <v-spacer class="mt-5"></v-spacer>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" dark @click="editError = false">CANCELAR</v-btn>
                                    <v-btn color="success" dark @click="recErrorData">ACEPTAR</v-btn>
                                </v-card-actions>
                            </div>
                        </div>
                </v-card>
                </v-dialog>
            </div>


            <!--ALERTAS-->
            <template>
                <v-overlay :value="showErrorAlert">
                    <!--NO SE HA SELECCIONADO NINGÚN ERROR-->
                    <v-alert
                        prominent
                        type="error"
                        >
                        <v-row align="center">
                            <v-col class="grow">
                            {{showAlertMessage}}
                            </v-col>
                            <v-col class="shrink">
                            <v-btn @click="showErrorAlert=false">ENTENDIDO</v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-overlay>

                <v-dialog v-model="showDeleteAlert" max-width="500px">
                  <v-card>
                   <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                   <h3 class="text-center text-l">{{showDeleteMessage}}</h3>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="w-24 bg-red-500" dark text @click="showDeleteAlert=false">Cancel</v-btn>
                        <v-btn class="w-24 bg-green-500" dark text @click="showDeleteAlert=false">OK</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- PANEL CONTROL MAPA -->
                <!-- TODO: optimizar esta parte de codigo -->
                <v-app class="font-sans" style="float:right; height:0rem;">
                    <v-card
                        class="p-2 border-2 border-blue-400"
                        style="top:-34rem; margin-right:1rem; width:15rem; 
                        box-shadow: 5px 5px 5px gray;
                        background-color:rgba(0, 60, 136, 0.5)">
                        <v-card-actions class="rounded mb-2 flex" style="background-color: rgba(0, 60, 136);">
                                <v-btn dark icon @click="dummy">
                                   <v-icon>mdi-map-search</v-icon>
                                </v-btn>

                                <v-spacer></v-spacer>
                                
                                <v-btn dark text @click="show = !show">
                                    TOOLS
                                   <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                        </v-card-actions>

                        <v-expand-transition>
                            <div v-show="show">
                                <v-divider></v-divider>
                                
                                <div
                                class="rounded bg-blue-800 p-2 md-1 text-white text-l">
                                ERRORES 
                                </div>

                                <div class="mt-2 flex">
                                    <v-btn :disabled="buttonActive=='drawError'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeDrawError"><v-icon>mdi-map-marker-plus</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='activeSelectError'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeSelectError"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='getErrorInfo'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="getErrorInfo"><v-icon>mdi-information</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='activeModifyError'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeModifyError"><v-icon>mdi-map-marker-radius</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='deleteErrores'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="deleteErrores"><v-icon>mdi-delete</v-icon></v-btn>
                                </div>

                                <v-spacer class="my-4"></v-spacer>

                                <div
                                class="rounded bg-blue-800 p-2 md-1 text-white text-l">
                                JOBS 
                                </div>

                                <div class="mt-2 flex">
                                    <v-btn :disabled="buttonActive=='activeDrawJob'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeDrawJob"><v-icon>mdi-vector-square</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='activeSelectJob'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeSelectJob"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='getJobInfo'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="getJobInfo"><v-icon>mdi-information</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='activeModifyJob'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeModifyJob"><v-icon>mdi-vector-polygon</v-icon></v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn :disabled="buttonActive=='deleteJobs'" icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="deleteJobs"><v-icon>mdi-delete</v-icon></v-btn>
                                </div>
                            
                            <v-spacer class="my-4"></v-spacer>

                                <div
                               class="rounded bg-blue-800 p-2 md-1 text-white text-l">
                                CAPAS
                                </div>
    
                                <v-spacer class="my-2"></v-spacer>
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('osm')">Open Street Maps</v-btn><br>
                                <v-spacer class="my-1"></v-spacer>
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('ignBase')">IGN Base</v-btn><br>
                                <v-spacer class="my-1"></v-spacer>
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('pnoa')">PNOA</v-btn><br>
                                <v-spacer class="my-1"></v-spacer>
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('MTN25')">MTN25</v-btn><br>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-app>



                <!--Contenedor general para avisos... mas facil -->

                    <v-alert
                    v-if="infoMsgWindow == true"
                    transition="fade-transition"
                    dense
                    type="info"
                    color="#9fbce3"
                    style="top:-7rem; margin:auto; max-width:30rem;"
                    >
                        {{infoMsg}}
                    </v-alert>


            </template>
        </template>
    </div>

</div>
</template>












<script>
import axios from 'axios';

  export default {

    props:[
        'incidencia',
        'asignErrors',
    ],

    computed: {
        returnIncidencia(){
            return this.incidencia
        },
        returnAsignErrors(){
            return this.asignErrors
        }
    },

    mounted(){
        this.initialize();
    },
    
    methods:{
        dummy(){
        //TODO: eliminar cuando las funciones del panel de control estén definidas
        },
        // MODELADO DE PETICION API, se invoca desde initialize
        // TODO: ¿catch de errores?
        getArrayFromApi(array, url, route, column){
            axios
                .get(url + route)
                .then(data =>   {
                                this.object = (data.data.response)
                                    for (this.index in this.object){
                                        array.push(this.object[this.index][column]);
                                    }
                                })
                //.catch();
            return array;
        },
        initialize(){
            //TODO: no parece que el problema sea de cookies cuando hacemos peticiones WMS/WMTS

            //TODO: lo suyo seria traerselo desde un archivo .env
            this.url = 'http://10.13.86.114:3000/'; //url del servicio
            
            //Peticiones a API para llenar datos en formularios
            this.getArrayFromApi(this.tema, this.url, 'temasError', 'tema_error');
            this.getArrayFromApi(this.tipoError, this.url, 'tiposError', 'tipo_error');
            this.getArrayFromApi(this.deteccion, this.url, 'deteccionJob', 'detect_job');
            this.getArrayFromApi(this.arreglo, this.url, 'arregloJob', 'arreglo_job');
            this.getArrayFromApi(this.gravedad, this.url, 'gravedadJob', 'gravedad_job');
            this.getArrayFromApi(this.asignacion, this.url, 'asignacionJob', 'asignacion_job')
            this.getArrayFromApi(this.tipoBandeja, this.url, 'tipoBandejaJob', 'tipo_bandeja')
            this.getArrayFromApi(this.nombreOperador, this.url, 'operadores', 'nombre_operador')
        },

        activeMap(map){
            this.mapActive = map;
        },

        closeMsgWindow(){
            this.infoMsgWindow = false;
        },

        //TODO: optimizar esta parte de codigo
        //PANEL CONTROL ERRORES
        activeDrawError(){
            //TODO: el mensaje habría que programarlo para que solo se mostrara unos segundos
            this.infoMsg = 'Haga clic en el mapa para situar el punto de error';
            this.optionActive = 'drawError';
            this.buttonActive = 'drawError';
        },
        activeSelectError(){
            this.infoMsg = undefined;
            this.optionActive = undefined;
            this.buttonActive = 'activeSelectError';
        },
        getErrorInfo(){
            this.infoMsg = undefined;
            this.buttonActive = 'getErrorInfo';
            if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero un error'
                } else {
                        for (this.index in this.erroresCache){
                            if (this.selectedFeatures[0].id == this.erroresCache[this.index][0].id){
                                //console.log(this.erroresCache[this.index])
                            }
                        }
                }  

        },
        activeModifyError(){
            this.infoMsg = undefined;
            this.optionActive = 'modifyError';
            this.buttonActive = 'activeModifyError';
        },
        deleteErrores(){
        this.infoMsg = undefined;
        this.activeButton = 'deleteErrores';
        },

        //PANEL DE CONTROL JOBS

        activeDrawJob(){
            //TODO: el mensaje habría que programarlo para que solo se mostrara unos segundos
            this.infoMsg = 'Haga clic en el mapa para dibujar los vértices del polígono. Doble clic para finalizar.';
            this.optionActive = 'drawJob';
            this.buttonActive = 'activeDrawJob'
        },
        activeSelectJob(){
            this.infoMsg = undefined;
            this.optionActive = 'selectJob';
            this.buttonActive = 'activeSelectJob';
        },
        getJobInfo(){
            this.infoMsg = undefined;
            this.buttonActive = 'getJobInfo';
            if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero un Job'
            } else {
                for (this.index in this.jobsCache){
                    if (this.selectedFeatures[0].id == this.jobsCache[this.index][0].id){
                        //console.log(this.jobsCache[this.index])
                    }
                }
            }
        },
        activeModifyJob(){
            this.buttonActive = 'activeModifyJob';
            if (this.selectedFeatures.length > 0){
                this.infoMsg = undefined;
            } else {
                this.infoMsg = "clic en OK para guardar";
            }
            this.optionActive = 'modifyJob';
        },
        deleteJobs(){
            this.buttonActive = 'deleteJob'
            this.infoMsg = undefined;
            this.jobs.pop();
        },        
        //fin funciones panel de control




        recErrorData(){
            this.idError = this.incidencia + '-E0' + this.errores.length;
            this.index = this.errores.length-1;
            this.newError = {
                                id: this.errores[this.index].id,
                                geometry: this.errores[this.index].geometry,
                                idError: this.idError, 
                                temaError: this.temaError, 
                                errorDe: this.errorDe,
                                descripcion: this.descError,
                                job:'',
                            };
            this.erroresCache.push(this.newError);
            //Cerramos menu
            this.editError = false;
        },

        recJobData(){
            //TODO
            this.idJob = this.incidencia + '-J0' + this.jobs.length;
            this.index = this.jobs.length-1;
            this.newJob = {
                            id_inc: this.incidencia,
                            id: this.jobs[this.index].id,
                            geometry: this.jobs[this.index].geometry,
                            idJob: this.idJob,
                            descripcion: this.descJob,
                            deteccion: this.deteccionJob,
                            arreglo: this.arregloJob,
                            gravedad: this.gravedadJob,
                            asignacion: this.asignacionJob,
                            bandeja: this.bandejaJob,
                            nombreOperador: this.nombreOperadorJob,
                            estado: '',
            }
            this.jobsCache.push(this.newJob)
            //Cerramos menu
            this.editJob = false
        },

        asignErrorToJob(){
            //TODO: MEJOR EMITIR ERRORES Y JOBS POR SEPARADO?
            let pointInPolygon = require("point-in-polygon");

            for (this.indexError in this.erroresCache) {
                this.point = [this.erroresCache[this.indexError].geometry.coordinates[0], this.erroresCache[this.indexError].geometry.coordinates[1]];

                for (this.indexJob in this.jobsCache) {
                    this.polygon = [this.jobsCache[this.indexJob].geometry.coordinates[0]]
                    this.inside = pointInPolygon(this.point, this.polygon[0]);

                    if (this.inside == true) {
                        //Esta dentro del Job
                        this.erroresCache[this.indexError].job = this.jobsCache[this.indexJob].idJob
                    }
                }
            }
        },
    },

    watch: {
        jobs(){
            if (this.jobs.length == 0) {
                this.editJob = false;
            } else {
                //al almacenar un nuevo job creado
                this.editJob = true;
                //evita que el menu jobs aparezca cada vez que editamos un vértice del job
                if (this.optionActive == 'modifyJob'){
                    this.editJob = false
                } else {
                    this.editJob = true;
                }
            }
        //console.log(this.jobs)
        },
        errores(){
            if (this.errores.length == 0) {
                this.editError = false;
            } else {
                this.editError = true;                
            }
        },
        erroresCache(){
            this.$emit('errores', this.erroresCache);
        },
        jobsCache(){
            this.asignErrorToJob();
            this.$emit('jobs', this.jobsCache);
            //console.log('cambios guardados')
        },
        infoMsg(){
            if (this.infoMsg !== undefined) {
                this.infoMsgWindow = true;
                setTimeout(this.closeMsgWindow, 4000);
            } else {
                this.closeMsgWindow();
            }
        },
        

    },
    data () {
      return {
        //Config Map Vuelayers
        zoom: 11,
        center: [335752.64617923653, 4809241.805683324],
        selectedFeatures: [],
        drawType: undefined,
        
        //Mapa Activo por defecto
        mapActive:'osm',
        
        //Errores
        temaError:'',           //Recoge el valor del formulario de alta error "Tema Error"
        errorDe:'',             //Recoge el valor del formulario de alta error  "Error De"
        tema: [],               //Inicializa la variable que luego llenamos desde initialize
        tipoError: [],          //Inicializa la variable que luego llenamos desde initialize
        errores: [],            //Almacenamiento por defecto de vuelayers
        erroresCache:[],        //Donde almacenamos nosotros los errores antes de grabar en BD
        editError: false,       //Activa el formulario de alta Error
        selectErrors: false,    //Activa la seleccion de errores
        traceError: false,      //Activa el dibujo de errores
        descError:'',           //Desde input formulario
        

        //Jobs
        deteccion: [],          //Inicializa la variable que luego llenamos desde initialize
        arreglo: [],            //Inicializa la variable que luego llenamos desde initialize
        gravedad: [],           //Inicializa la variable que luego llenamos desde initialize
        asignacion: [],         //Inicializa la variable que luego llenamos desde initialize
        tipoBandeja: [],        //Inicializa la variable que luego llenamos desde initialize
        nombreOperador: [],     //Inicializa la variable que luego llenamos desde initialize
        //TODO: determinar los arrays de Jobs desde BD
        
        descJob:'',             //Valor que recogemos en formulario
        deteccionJob:'',        //Valor que recogemos en formulario
        arregloJob:'',          //Valor que recogemos en formulario
        gravedadJob:'',         //Valor que recogemos en formulario
        asignacionJob:'',       //Valor que recogemos en formulario
        bandejaJob:'',          //Valor que recogemos en formulario
        nombreOperadorJob:'',   //Valor que recogemos en formulario

        jobs: [],               //Almacenamiento por defecto de vuelayers
        jobsCache: [],           //Donde almacenamos nosotros los jobs antes de grabar en BD 

        editJob: false,         //Activa el formulario de alta job
        selectJobs: false,      //Activa la seleccion de jobs
        traceJob: false,        //Activa el dibujo de jobs

        //Misc
        infoMsgWindow: false,   //Activa ventana información
        infoMsg: undefined,     //Muestra los mensajes de ayuda cuando dibujamos errores o jobs
        showErrorAlert: false,  //Muestra la ventana de error cuando no se ha seleccionado ningún error
        zIndexJob: 1,
        zIndexError: 2,
        showAlertMessage:'',    //Muestra mensajes de error
        deleting: false,        //Evita que se abra el panel de editar error cuando estamos borrando uno
        showDeleteMessage:'',   //Envia un mensaje de error a la ventana showDeleteAlert
        showDeleteAlert: false, //Muestra la ventana showDeleteAlert
        optionActive: undefined,
        show: false,            //Apertura panel herramientas mapa
        buttonActive: '',


        popup: false,

      }
    },
  }
</script>