<template>
<div>
    <div style="height:46rem">
        
        <vl-map 
            :load-tiles-while-animating="true" 
            :load-tiles-while-interacting="true" 
            data-projection="EPSG:3857"
            >
            <!--            Otras opciones con las que trabaja bien
                            //4326 wgs84
                            //3857 WEB mercator
                            //3034 ETRS89    -->
            
            <!-- CONTROLA LA VISTA DEL MAPA -->
            <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>


            <!--PERMITE SELECCIONAR FEATURES-->
            <vl-interaction-select
                v-if="drawType == null"
                :features.sync="selectedFeatures">
                
                <template>
                    <!--DEFINE UN ESTILO NUEVO PARA LOS ELEMENTOS SELECCIONADOS-->    
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

                    <!-- MUESTRA LAS GEOMETRIAS ALMACENADAS EN JOBS Y ERRORES -->
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
                    <!-- fin geometrías -->
                </template>
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

            <!--servicios WMS-->

            <div v-if="mapActive=='ignBase'">
                <vl-layer-tile>
                    <vl-source-wms
                    layers = 'IGNBaseTodo'
                    matrixSet = 'EPSG:3857'
                    style = 'default'
                    url = 'https://www.ign.es/wms-inspire/ign-base'
                    >
                    </vl-source-wms>
                </vl-layer-tile>
            </div>

            
            <div v-if="mapActive=='pnoa'">
                <vl-layer-tile>
                    <vl-source-wms
                    layers = 'OI.OrthoimageCoverage'
                    matrixSet = 'EPSG:3857'
                    style = 'default'
                    url='https://www.ign.es/wms-inspire/pnoa-ma'
                    >
                    </vl-source-wms>
                </vl-layer-tile>
            </div>

            
            <div v-if="mapActive=='MTN25'">
                <vl-layer-tile>
                    <vl-source-wms
                    layers = 'mtn_rasterizado'
                    matrixSet = 'EPSG:3857'
                    style = 'default'
                    url='https://www.ign.es/wms-inspire/mapa-raster'
                    >
                    </vl-source-wms>
                </vl-layer-tile>
            </div>

            
            <div v-if="mapActive=='rt'">
                <vl-layer-tile>
                    <vl-source-wms
                    layers = 'TN.RoadTransportNetwork.RoadLink'
                    matrixSet = 'EPSG:3857'
                    style = 'carreteras'
                    url='https://servicios.idee.es/wms-inspire/transportes'
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
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="deteccion"
                                            
                                            v-model="deteccionJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Arreglar en:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="arreglo"
                                            v-model="arregloJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Gravedad:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="gravedad"
                                            v-model="gravedadJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Asignar a:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="asignacion"
                                            v-model="asignacionJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                
                                <v-row v-if="asignacionJob == 'Bandeja de Jobs'" style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Enviar a:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="tipoBandeja"
                                            v-model="tipoBandejaJob"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row v-if="asignacionJob == 'Bandeja de Jobs'" style="margin-bottom:-2.5rem;">
                                    <v-col cols="4" class="mt-5"            >                           
                                    Operador:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select
                                            filled
                                            class="text-lg"
                                            :items="nombreOperador"
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


        <!--FORMULARIO INTRODUCIR DATOS ERROR -->
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
                            <b>{{"  " + incidencia + '-E' + serialError}}</b></v-card-title>
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
                                        <v-col cols="8">
                                            <v-select
                                                filled
                                                class="text-lg"
                                                :items="tema"
                                                v-model="temaError"
                                            ></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row style="margin-bottom:-2.5rem;">
                                        <v-col cols="4" class="mt-5"            >                           
                                        Tipo:
                                        </v-col>
                                        <v-col cols="8">
                                            <v-select
                                                filled
                                                class="text-lg"
                                                :items="tipoError"
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

                <v-dialog v-model="showErrorInfo" v-if="selectedFeatures.length > 0" max-width="500px">
                  <v-card>
                   <h1 class="p-3 text-center font-bold text-xl">INFORMACIÓN DEL ERROR {{this.infoIdError}}</h1>
                   <div class="p-3">
                       <table class="bg-blue-100 w-full">
                            <tr><td class="p-1">ID Error</td><td class="p-1" style="border: 1px solid white;">{{this.infoIdError}}</td></tr>
                            <tr><td class="p-1">Descripción</td><td class="p-1" style="border: 1px solid white;"> {{this.infoDescripcion}}</td></tr>
                            <tr><td class="p-1">Tema Error</td><td class="p-1" style="border: 1px solid white;">{{this.infoTemaError}}</td></tr>
                            <tr><td class="p-1">Error de</td><td class="p-1" style="border: 1px solid white;"> {{this.infoErrorDe}}</td></tr>
                            <tr><td class="p-1">Coordenadas</td><td class="p-1" style="border: 1px solid white;"> X: {{this.infoCoordenadasX}} <br/> Y: {{this.infoCoordenadasY}}</td></tr>
                            <tr><td class="p-1">Asociado a Job</td><td class="p-1" style="border: 1px solid white;"> {{this.infoAsociadoJob}}</td></tr>
                       </table>
                   </div>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="w-24 bg-red-500" dark text @click="showErrorInfo=false">CERRAR</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                  </v-card>
                </v-dialog>

                <!-- PANEL CONTROL MAPA -->
                <v-app class="font-sans" style="float:right; height:0rem;">
                    <v-card
                        class="p-2 border-2 border-blue-400"
                        style="top:-45.5rem; margin-right:1rem; width:15rem; box-shadow: 5px 5px 5px gray; background-color:rgba(0, 60, 136, 0.5)">
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
                                    <v-btn 
                                    v-for="item in errorPanel"
                                    :key="item.title"
                                    icon tile dark class="bg-blue-600 flex-grow shadow-lg mr-1"
                                    :title=item.title
                                    :disabled="buttonActive==item.disabled"
                                    @click=item.click()
                                    >
                                        <v-icon>{{item.icon}}</v-icon>
                                    </v-btn>
                                </div>

                                <v-spacer class="my-4"></v-spacer>

                                <div
                                class="rounded bg-blue-800 p-2 md-1 text-white text-l">
                                JOBS 
                                </div>
                                <div class="mt-2 flex">
                                    <v-btn 
                                    v-for="item in jobsPanel"
                                    :key="item.title"
                                    icon tile dark class="bg-blue-600 flex-grow shadow-lg mr-1"
                                    :title=item.title
                                    :disabled="buttonActive==item.disabled"
                                    @click=item.click()
                                    >
                                        <v-icon>{{item.icon}}</v-icon>
                                    </v-btn>
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
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('MTN25')">Mapa Ráster</v-btn><br>
                                <v-spacer class="my-1"></v-spacer>
                                <v-btn text dark class="w-full bg-green-500 flex-grow shadow-lg" @click="activeMap('rt')">IGR-RT</v-btn><br>
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
        //TODO: eliminar cuando todas las funciones del panel de control estén definidas
        },
    
        avanceSerialError(){
            this.serialError++
            //debug
            console.log("avanzado serial error") 
        },

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
            //TODO: lo suyo seria traerselo desde un archivo .env
            this.url = 'http://10.13.86.114:3000/'; //url del servicio
            
            //Peticiones a API para llenar datos en formularios
            //TODO: Igual podríamos llenar todos los formularios con una peticion ??
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
    //TODO: optimizar esta parte de codigo. Demasiadas variables -> parametrizar.
        //PANEL CONTROL ERRORES
        activeDrawError(){
            //TODO: el mensaje habría que programarlo para que solo se mostrara unos segundos
            this.infoMsg = 'Haga clic en el mapa para situar el punto de error';
            this.optionActive = 'drawError';
            this.buttonActive = 'activeDrawError';
        },
        activeSelectError(){
            this.infoMsg = undefined;
            this.optionActive = undefined;
            this.buttonActive = 'activeSelectError';
        },
        getErrorInfo(){
            this.infoMsg = undefined;
            this.showErrorInfo = true;
            this.buttonActive = 'getErrorInfo';
            if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero un error'
                } else {
                        for (this.index in this.erroresCache){
                            if (this.selectedFeatures[0].id == this.erroresCache[this.index].id){
                                //console.log("Mostrando info de ", this.erroresCache[this.index].idError, this.erroresCache[this.index])
                                this.errorMostrar = this.erroresCache[this.index];
                                this.infoDescripcion = this.errorMostrar.descripcion;
                                this.infoIdError = this.errorMostrar.idError;
                                this.infoTemaError = this.errorMostrar.temaError;
                                this.infoErrorDe = this.errorMostrar.errorDe;
                                this.infoCoordenadasX = this.errorMostrar.geometry.coordinates[0];
                                this.infoCoordenadasY = this.errorMostrar.geometry.coordinates[1];
                                this.infoAsociadoJob = null;
                            }
                        }
                }
            //Vuelve al botón de selección tras mostrar info (¿?)    
            this.buttonActive = 'activeSelectError';  

        },
        activeModifyError(){
            this.infoMsg = undefined;
            this.optionActive = 'modifyError';
            this.buttonActive = 'activeModifyError';
        },
        deleteErrores(){
        this.infoMsg = undefined;
        this.optionActive = 'deleteErrores';
        this.activeButton = 'deleteErrores';
        if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero un error'
                } else {
                        for (this.index in this.erroresCache){
                            if (this.selectedFeatures[0].id == this.erroresCache[this.index].id){
                                this.borrandoError = this.erroresCache[this.index].idError;
                                this.showErrorAlert = true;
                                this.showAlertMessage = 'Se ha eliminado el error ' + this.borrandoError;
                                this.erroresCache.splice(this.index, 1);
                                //Elimina también el error en el almacen de openlayers
                                for (this.index in this.errores){
                                    if (this.selectedFeatures[0].id == this.errores[this.index].id){
                                        this.errores.splice(this.index,1);
                                    }
                                }
                                //Deselecciona el error en pantalla
                                this.selectedFeatures = [];
                            }
                        }
                }  
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
                        console.log(this.jobsCache[this.index])
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
            //TODO: Mejorar el tema de los numeros de serie
            this.idError = this.incidencia + '-E0' + this.serialError;
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
            //Evita que sea visible el cambio de numero de serie de error en el panel alta error
            setTimeout(this.avanceSerialError,1000);
        },

        recJobData(){
            //TODO: Mejorar el tema de los numeros de serie
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
                            bandeja: this.tipoBandejaJob,
                            nombreOperador: this.nombreOperadorJob,
                            estado: 'En Triaje',                        //TODO: solo para pruebas, determinar estado correcto.
            }
            this.jobsCache.push(this.newJob)
            //Cerramos menu
            this.editJob = false
        },

        asignErrorToJob(){
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
        },
        errores(){
            if (this.errores.length == 0) {
                this.editError = false;
            } else {
                this.editError = true;
                //evita que el menu errores aparezca cada vez que editamos un error 
                if (this.optionActive == 'modifyError' || this.optionActive == 'deleteErrores'){
                    this.editError = false
                } else {
                    this.editError = true;
                }                
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
            zoom: 11,                                           //Determina el nivel de zoom por defecto
            center: [335752.64617923653, 4809241.805683324],    //Determina el centro de mapa por defecto
            selectedFeatures: [],                               //Array para indicar que un elemento está seleccionado TODO: seleccion multiple?
            drawType: undefined,                                //Determina si la función dibujar está activada
            mapActive:'osm',                                    //Mapa Activo por defecto
            //TODO: Pendiente de parametrizar servicios WMS
            wmsServices:                                        //Para añadir servicio solo hay añadir un nuevo objeto al array
            [
                {name: 'IGN Base', layers: 'IGNBaseTodo', matrixSet: 'EPSG:3857', style: 'default', url:'https://www.ign.es/wms-inspire/ign-base'},
                {name: 'PNOA', layers: 'OI.OrthoimageCoverage', matrixSet: 'EPSG:3857', style: 'default', url:'https://www.ign.es/wms-inspire/pnoa-ma'},
                {name: 'Mapa Ráster', layers: 'mtn_rasterizado', matrixSet: 'EPSG:3857', style: 'default', url:'https://www.ign.es/wms-inspire/mapa-raster'},
                {name: 'Nomenclator', layers: 'GN.GeographicalNames', matrixSet: 'EPSG:3857', style: 'nombresgeograficos', url:'https://www.ign.es/wms-inspire/rt'},   
                {name: 'rt', layers:'TN.RoadTransportNetwork.RoadLink', matrixSet: 'EPSG:3857', style: 'carreteras', url:'https://servicios.idee.es/wms-inspire/transportes'}
            ],

        //Errores

            serialError: 1,         //Inicializamos serial errores
            temaError:'',           //Recoge el valor del formulario de alta error "Tema Error"
            errorDe:[],             //Recoge el valor del formulario de alta error  "Error De"
            tema: [],               //Inicializa la variable que luego llenamos desde initialize
            tipoError: [],          //Inicializa la variable que luego llenamos desde initialize
            errores: [],            //Almacenamiento por defecto de vuelayers
            erroresCache:[],        //Donde almacenamos nosotros los errores antes de grabar en BD
            editError: false,       //Activa el formulario de alta Error
            selectErrors: false,    //Activa la seleccion de errores
            traceError: false,      //Activa el dibujo de errores
            descError:'',           //Desde input formulario

        // Ventana dialogo Info Error
            infoIdError:'',
            infoDescripcion:'',
            infoTemaError:'',
            infoErrorDe:'',
            infoCoordenadas:'',
            infoAsociadoJob:'',
        
        //Jobs TODO: falta definir funcionamiento de herramientas
            deteccion: [],          //Inicializa la variable que luego llenamos desde initialize
            arreglo: [],            //Inicializa la variable que luego llenamos desde initialize
            gravedad: [],           //Inicializa la variable que luego llenamos desde initialize
            asignacion: [],         //Inicializa la variable que luego llenamos desde initialize
            tipoBandeja: [],        //Inicializa la variable que luego llenamos desde initialize
            nombreOperador: [],     //Inicializa la variable que luego llenamos desde initialize
            jobs: [],               //Almacenamiento por defecto de vuelayers
            jobsCache: [],          //Donde almacenamos nosotros los jobs antes de grabar en BD 
            editJob: false,         //Activa el formulario de alta job
            selectJobs: false,      //Activa la seleccion de jobs
            traceJob: false,        //Activa el dibujo de jobs

            //Atributos del Job
            descJob:'',             //Valor que recogemos en formulario de alta de Job
            deteccionJob:'',        //Valor que recogemos en formulario de alta de Job
            arregloJob:'',          //Valor que recogemos en formulario de alta de Job
            gravedadJob:'',         //Valor que recogemos en formulario de alta de Job
            asignacionJob:'',       //Valor que recogemos en formulario de alta de Job
            nombreOperadorJob:'',   //Valor que recogemos en formulario de alta de Job
            tipoBandejaJob:'',      //Valor que recogemos en formulario de alta de Job


        //Misc
        infoMsgWindow: false,   //Activa ventana información
        infoMsg: undefined,     //Muestra los mensajes de ayuda cuando dibujamos errores o jobs
        showErrorAlert: false,  //Muestra la ventana de error cuando no se ha seleccionado ningún error
        showErrorInfo: false,   //Muestra la información de un error seleccionado
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


        //HERRAMIENTAS PANELES DE CONTROL
        errorPanel: [   {title:'Dibujar Error', disabled:'activeDrawError', click: this.activeDrawError, icon:'mdi-map-marker-plus'},
                        {title:'Seleccionar Error', disabled:'activeSelectError', click: this.activeSelectError, icon:'mdi-cursor-default'},
                        {title:'Información del Error', disabled:'getErrorInfo', click: this.getErrorInfo, icon:'mdi-information'},
                        {title:'Editar posición del Error', disabled:'activeModifyError', click: this.activeModifyError, icon:'mdi-arrow-all'},
                        {title:'Eliminar Error', disabled:'deleteErrores', click: this.deleteErrores, icon:'mdi-delete'},
                    ],

        jobsPanel:  [
                        {title:'Dibujar Job', disabled:'activeDrawJob', click: this.activeDrawJob, icon:'mdi-vector-square'},
                        {title:'Seleccionar Job', disabled:'activeSelectJob', click: this.activeSelectJob, icon:'mdi-cursor-default'},
                        {title:'Información del Job', disabled:'getJobInfo', click: this.getJobInfo, icon:'mdi-information'},
                        {title:'Editar geometría de Job', disabled:'activeModifyJob', click: this.activeModifyJob, icon:'mdi-vector-polygon'},
                        {title:'Eliminar Job', disabled:'deleteJobs', click: this.deleteJobs, icon:'mdi-delete'},
                    ],

      }
    },
  }
</script>