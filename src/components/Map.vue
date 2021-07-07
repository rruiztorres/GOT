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
               
            

            <!-- CAPAS DE MAPAS BASE 
            TODO: Cambiar los source a WMTS WMS, etc-->
            <div v-if="mapActive=='osm'">
                <vl-layer-tile id="osm">
                    <vl-source-osm></vl-source-osm>
                </vl-layer-tile>
            </div>

            <div v-if="mapActive=='ignBase'">
                <vl-layer-tile>
                    <vl-source-xyz :url="urlIgnBase"></vl-source-xyz>
                </vl-layer-tile>
            </div>

            <div v-if="mapActive=='urlEsriImagery'">
                <vl-layer-tile>
                    <vl-source-xyz :url="urlEsriImagery"></vl-source-xyz>
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
                            <v-col class="p-6 bg-gray-200" cols="12">
                                <p class="text-lg text-gray-600">Descripción</p>
                                <TextEditor @editor = storeDescJob>
                                </TextEditor>
                            </v-col>

                            <v-divider></v-divider>
                            <v-spacer class="mt-2"></v-spacer>

                            <v-col class="" cols="12">
                                <v-select
                                    class="text-lg"
                                    :items="deteccion"
                                    filled
                                    label="Detección"
                                    v-model="deteccionJob"
                                ></v-select>
                            
                                <v-select
                                    class="text-lg"
                                    :items="arreglo"
                                    filled
                                    label="Arreglo"
                                    v-model="arregloJob"
                                ></v-select>

                                <v-select
                                    class="text-lg"
                                    :items="gravedad"
                                    filled
                                    label="Gravedad"
                                    v-model="gravedadJob"
                                ></v-select>

                                <v-select
                                    class="text-lg"
                                    :items="asignacion"
                                    filled
                                    label="Asignacion"
                                    v-model="asignacionJob"
                                ></v-select>

                                <div v-if="asignacionJob == 'Bandeja de Jobs'">
                                    <v-select
                                    class="text-lg"
                                    :items="tipoBandeja"
                                    filled
                                    label="Enviar a"
                                    v-model="bandejaJob"
                                    ></v-select>

                                    <v-select
                                        class="text-lg"
                                        :items="nombreOperador"
                                        filled
                                        label="Asignar a"
                                        v-model="nombreOperadorJob"
                                    ></v-select>
                                </div>
                            </v-col>

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
                                <v-col class="p-6 bg-gray-200" cols="12">
                                    <p class="text-lg text-gray-600">Descripción</p>
                                    <TextEditor @editor = storeDescError>
                                    </TextEditor>
                                </v-col>

                                <v-divider></v-divider>
                                <v-spacer class="mt-2"></v-spacer>

                                <v-col class="" cols="12">
                                    <v-select
                                        class="text-lg"
                                        :items="tema"
                                        filled
                                        label="Tema"
                                        v-model="temaError"
                                    ></v-select>
                                
                                    <v-select
                                        class="text-lg"
                                        :items="tipoError"
                                        filled
                                        label="Error de"
                                        v-model="errorDe"
                                    ></v-select>
                                </v-col>

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
                <!-- TODO: menú flotante encima de mapa ??-->
                <!-- TODO: optimizar esta parte de codigo -->
                <v-app class="font-sans" style="float:right; height:2rem;">
                    <v-card
                    elevation="2"
                    tile
                    class="rounded border-none"
                    style="padding:1rem; top:-34rem; margin-right:1rem; width:16rem; background-color:rgba(34, 35, 36, 0.502);">
                        <div
                            class="rounded bg-blue-600 p-2 md-1 text-white text-l font-bold">
                            ERRORES 
                        </div>

                        <div class="mt-2 flex">
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeDrawError"><v-icon>mdi-map-marker-plus</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeSelectError"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="getErrorInfo"><v-icon>mdi-information</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeModifyError"><v-icon>mdi-map-marker-radius</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="deleteErrores"><v-icon>mdi-delete</v-icon></v-btn>
                        </div>

                        <v-spacer class="my-4"></v-spacer>

                        <div
                            class="rounded bg-blue-600 p-2 md-1 text-white text-l font-bold">
                            JOBS 
                        </div>
                        <div class="mt-2 flex">
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeDrawJob"><v-icon>mdi-vector-square</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeSelectJob"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="getJobInfo"><v-icon>mdi-information</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="activeModifyJob"><v-icon>mdi-vector-polygon</v-icon></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon tile dark class="bg-blue-600 flex-grow shadow-lg" @click="deleteJobs"><v-icon>mdi-delete</v-icon></v-btn>
                        </div>
                        
                        <v-spacer class="my-4"></v-spacer>

                        <div
                            class="rounded bg-blue-600 p-2 md-1 text-white text-l font-bold">
                            CAPAS
                        </div>
                        <v-spacer class="my-2"></v-spacer>
                        <v-btn color="success" dark class="w-full shadow-lg" @click="activeMap('osm')">Open Street Maps</v-btn><br>
                        <v-spacer class="my-1"></v-spacer>
                        <v-btn color="success" dark class="w-full shadow-lg" @click="activeMap('ignBase')">IGN Base</v-btn><br>
                        <v-spacer class="my-1"></v-spacer>
                        <v-btn color="success" dark class="w-full shadow-lg" @click="activeMap('')">PNOA</v-btn><br>
                        <v-spacer class="my-1"></v-spacer>
                        <v-btn color="success" dark class="w-full shadow-lg" @click="activeMap('urlEsriImagery')">ESRI Imagery</v-btn><br>
                        <v-spacer class="my-1"></v-spacer>
                        <v-btn color="success" dark class="w-full shadow-lg" @click="activeMap('')">BDIG</v-btn><br>
                    </v-card>
                </v-app>



                <!--Contenedor general para avisos... mas facil -->
                <div v-if="infoMsg">
                    <v-alert
                    dense
                    type="info"
                    color="#9fbce3"
                    style="top:-5rem; margin:1rem;"
                    >
                        {{infoMsg}}
                        <v-btn class="w-24 bg-green-500" dark text @click="(editJob = true)">OK</v-btn>
                    </v-alert>
                </div>

            </template>
        </template>
    </div>

</div>
</template>












<script>

import TextEditor from '@/components/TextEditor';
import axios from 'axios';

  export default {
    components: {
        TextEditor,
    },

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
            document.cookie = 'SameSite=Secure';

            //TODO: lo suyo seria traerselo desde un archivo .env
            this.url = 'http://10.13.86.114:3000/'; //url del servicio
            
            //Peticiones a API para llenar datos en formularios
            this.getArrayFromApi(this.tema, this.url, 'temasError', 'tema_error');
            this.getArrayFromApi(this.tipoError, this.url, 'tiposError', 'tipo_error')
            
            
        },

        activeMap(map){
            this.mapActive = map;
        },

        //TODO: optimizar esta parte de codigo
            activeDrawJob(){
                //TODO: el mensaje habría que programarlo para que solo se mostrara unos segundos
                this.infoMsg = 'Haga clic en el mapa para dibujar los vértices del polígono. Doble clic para finalizar.';
                this.optionActive = 'drawJob';
            },
            activeSelectJob(){
                this.infoMsg = undefined;
                this.optionActive = 'selectJob';
            },
            activeDrawError(){
                //TODO: el mensaje habría que programarlo para que solo se mostrara unos segundos
                this.infoMsg = 'Haga clic en el mapa para situar el punto de error';
                this.optionActive = 'drawError';
            },
            activeSelectError(){
                this.infoMsg = undefined;
                this.optionActive = undefined;
            },
            activeModifyJob(){
                if (this.selectedFeatures.length > 0){
                    this.infoMsg = undefined;
                } else {
                    this.infoMsg = "clic en OK para guardar";
                }
                this.optionActive = 'modifyJob';
            },
            activeModifyError(){
                this.infoMsg = undefined;
                this.optionActive = 'modifyError';
            },
        
        getErrorInfo(){
            if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero un error'
            } else {
                for (this.index in this.erroresCache){
                    if (this.selectedFeatures[0].id == this.erroresCache[this.index][0].id){
                        console.log(this.erroresCache[this.index])
                    }
                } 
            }
        },

        getJobInfo(){
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

        deleteJobs(){
            this.jobs.pop();
        },

        deleteErrores(){
            //Debug
            //console.log("estoy borrando esto: ", this.selectedFeatures[0])
            if(this.selectedFeatures.length == 0){
                this.showErrorAlert = true;
                this.showAlertMessage = 'Debe seleccionar primero algún error'
            } else {
                this.showDeleteMessage = this.erroresCache[0][0].idError + " será borrado. ¿Desea Continuar?"
                this.showDeleteAlert = true
                this.errores.pop();
            }
        },

        storeDescError(returnedText){
            this.returnedTextError = returnedText
        },

        storeDescJob(returnedText){
            this.returnedTextJob = returnedText
        },

        recErrorData(){
            this.idError = this.incidencia + '-E0' + this.errores.length;
            this.index = this.errores.length-1;
            this.newError = [{
                                id: this.errores[this.index].id,
                                geometry: this.errores[this.index].geometry,
                                idError: this.idError, 
                                temaError: this.temaError, 
                                errorDe: this.errorDe,
                                descripcion: this.returnedTextError,
                            }];
            this.erroresCache.push(this.newError);
            //Cerramos menu
            this.editError = false;
        },

        recJobData(){
            //TODO
            this.idJob = this.incidencia + '-J0' + this.jobs.length;
            this.index = this.jobs.length-1;
            this.newJob = [{
                            id: this.jobs[this.index].id,
                            geometry: this.jobs[this.index].geometry,
                            idJob: this.idJob,
                            deteccion: this.deteccionJob,
                            arreglo: this.arregloJob,
                            gravedad: this.gravedadJob,
                            asignacion: this.asignacionJob,
                            bandeja: this.bandejaJob,
                            nombreOperador: this.nombreOperadorJob,
                            errores: [],
            }]
            this.jobsCache.push(this.newJob)
            //Cerramos menu
            this.editJob = false
        },

        asignErrorToJob(){
            let pointInPolygon = require('point-in-polygon');

            for (this.indexError in this.erroresCache) {
                this.point = [this.erroresCache[this.indexError][0].geometry.coordinates[0], this.erroresCache[this.indexError][0].geometry.coordinates[1]];

                for (this.indexJob in this.jobsCache) {
                    this.polygon = [this.jobsCache[this.indexJob][0].geometry.coordinates[0]]
                    this.inside = pointInPolygon(this.point, this.polygon[0]);

                    if (this.inside == true) {
                        //console.log (this.erroresCache[this.indexError][0].idError, 'Esta dentro del Job ', this.jobsCache[this.indexJob][0].idJob)
                        this.jobsCache[this.indexJob][0].errores = this.erroresCache[this.indexError][0]
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
            }
        },
        jobsCache(){
            this.asignErrorToJob();
            this.$emit('jobs', this.jobsCache);
        },
        

    },
    data () {
      return {
        //Config Map Vuelayers
        zoom: 11,
        center: [335752.64617923653, 4809241.805683324],
        selectedFeatures: [],
        drawType: undefined,
            //TODO: Mapas base hay que hacerlos funcionar con servicios WMTS/WMS
            urlIgnBase: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
            urlEsriImagery: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
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
        

        //Jobs
        deteccion: ['MTN25','MTN50','BTN25','MP200','BTN100','BCN200','M.AUTONOMICO','ME500','BCN500','M1','CARTOCIUDAD','RT','HI','POB','Mundo Real o Fuente de Referencia','IGN Base', 'Otros'],          //Inicializa la variable que luego llenamos desde initialize
        arreglo: ['BDIG','BTN25','RT'],            //Inicializa la variable que luego llenamos desde initialize
        gravedad: ['Normal','Grave'],           //Inicializa la variable que luego llenamos desde initialize
        asignacion: ['Bandeja de Jobs', 'Departamento Externo'],         //Inicializa la variable que luego llenamos desde initialize
        tipoBandeja: ['Operadores', 'Operadores Especializados'],        //Inicializa la variable que luego llenamos desde initialize
        nombreOperador: ['Raul Ruiz Torres', 'John Doe'],     //Inicializa la variable que luego llenamos desde initialize
        //TODO: determinar los arrays de Jobs desde BD
        
        deteccionJob:'',        //Valor que recogemos en formulario
        arregloJob:'',          //Valor que recogemos en formulario
        gravedadJob:'',         //Valor que recogemos en formulario
        asignacionJob:'',       //Valor que recogemos en formulario
        bandejaJob:'',          //Valor que recogemos en formulario
        nombreOperadorJob:'',   //Valor que recogemos en formulario

        jobs: [],               //Almacenamiento por defecto de vuelayers
        jobsCache:[],           //DDonde almacenamos nosotros los jobs antes de grabar en BD 
        editJob: false,         //Activa el formulario de alta job
        selectJobs: false,      //Activa la seleccion de jobs
        traceJob: false,        //Activa el dibujo de jobs

        //Misc
        infoMsg: undefined,     //Muestra los mensajes de ayuda cuando dibujamos errores o jobs
        showErrorAlert: false,  //Muestra la ventana de error cuando no se ha seleccionado ningún error
        zIndexJob: 1,
        zIndexError: 2,
        showAlertMessage:'',    //Muestra mensajes de error
        deleting: false,        //Evita que se abra el panel de editar error cuando estamos borrando uno
        showDeleteMessage:'',   //Envia un mensaje de error a la ventana showDeleteAlert
        showDeleteAlert: false, //Muestra la ventana showDeleteAlert
        optionActive: undefined,

      }
    },
  }
</script>