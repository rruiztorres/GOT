<template>
<div class="flex">
    <div style="height:550px" class="flex-grow">
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
        <vl-interaction-select>
            <!--estilos??-->
            <vl-layer-vector :z-index="zIndexJob">
                <vl-source-vector :features.sync="jobs" ident="jobs"></vl-source-vector>

                <vl-style-box>
                    <vl-style-stroke color="red"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.8)"></vl-style-fill>
                </vl-style-box>
            </vl-layer-vector>

            <vl-layer-vector :z-index="zIndexError">
                <vl-source-vector :features.sync="errores" ident="errores"></vl-source-vector>
                <vl-style-box>
                    <vl-style-circle :radius="5">
                    <vl-style-fill color="red"></vl-style-fill>
                    <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-layer-vector>
        </vl-interaction-select>


            <!-- PERMITE DIBUJAR GEOMETRIAS EN EL MAPA Y LAS ALMACENA EN ARRAYS -->
            <vl-interaction-draw type="Polygon" source="jobs" :active="traceJob">
                <vl-style-box>
                    <vl-style-stroke color="blue"></vl-style-stroke>
                    <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
                </vl-style-box>
            </vl-interaction-draw>  

            <vl-interaction-draw type="Point" source="errores" :active="traceError">
                
            </vl-interaction-draw> 
               
            

            <!-- CAPAS DE MAPAS BASE -->
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
        </vl-map>

        <!--Introducir datos Jobs -->
        <template>
            <div class="text-center">
                <v-dialog
                v-model="editJob"
                width="500"
                >

                <v-card>
                    <v-card-title class="text-h5 bg-blue-200">
                    Alta de Job
                    </v-card-title>

                    <v-card-text class="mt-1">
                        Aqui van los dialogos para introducir caracteristicas del Job.
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="error"
                            dark
                            @click="editJob = false"
                            >
                            CANCELAR
                        </v-btn>

                        <v-btn
                            color="success"
                            @click="editJob = false"
                            >
                            ACEPTAR
                        </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </div>
        </template>


        <!--Editar datos Error -->
        <template>
            <div class="text-center">
                <v-dialog
                v-model="editError"
                width="500"
                >

                <v-card>
                        <v-card-title dark class="text-lg text-white bg-red-500">Alta de error
                        <v-spacer></v-spacer>
                        <b>{{"  " + incidencia + '-E' + errores.length}}</b></v-card-title>
                   
                        <div class="p-1">
                            
                            <v-col class="p-6 bg-gray-200" cols="12">
                                <p class="text-lg text-gray-600">Descripción</p>
                                <TextEditor></TextEditor>
                            </v-col>

                            <v-divider></v-divider>
                            <v-spacer class="mt-2"></v-spacer>

                            <v-col class="" cols="12">
                                <v-select
                                    class="text-lg"
                                    :items="tema"
                                    filled
                                    label="Tema"
                                ></v-select>
                            
                                <v-select
                                    class="text-lg"
                                    :items="errorDe"
                                    filled
                                    label="Error de"
                                ></v-select>
                            </v-col>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" dark @click="editError = false">CANCELAR</v-btn>
                                <v-btn color="success" dark @click="editError = false">ACEPTAR</v-btn>
                            </v-card-actions>
                        </div>
                </v-card>
                </v-dialog>
            </div>
        </template>
    </div>







    <!-- PANEL CONTROL MAPA -->
    <div class="min-w-max border-2 border-gray p-6" style="background-color:rgb(2 62 138 / 50%);">
        <h1 class="text-white">Jobs</h1>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="activeDrawJob"><v-icon>mdi-vector-polygon</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="activeSelectJob"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="dummy"><v-icon>mdi-information</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="dummy"><v-icon>mdi-cog</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="deleteJobs"><v-icon>mdi-delete</v-icon></v-btn>

        <v-spacer class="my-4"></v-spacer>

        <h1 class="text-white">Errores</h1>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="activeDrawError"><v-icon>mdi-map-marker-remove-variant</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="activeSelectError"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="dummy"><v-icon>mdi-information</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="dummy"><v-icon>mdi-cog</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1 shadow-lg" @click="deleteErrores"><v-icon>mdi-delete</v-icon></v-btn>

        <v-spacer class="my-4"></v-spacer>

        <h1 class="text-white">Capas</h1>
        <v-btn color="success" dark class="w-full m-1 shadow-lg" @click="activeMap('osm')">Open Street Maps</v-btn><br>
        <v-btn color="success" dark class="w-full m-1 shadow-lg" @click="activeMap('ignBase')">IGN Base</v-btn><br>
        <v-btn color="success" dark class="w-full m-1 shadow-lg" @click="activeMap('')">PNOA</v-btn><br>
        <v-btn color="success" dark class="w-full m-1 shadow-lg" @click="activeMap('urlEsriImagery')">ESRI Imagery</v-btn><br>
        <v-btn color="success" dark class="w-full m-1 shadow-lg" @click="activeMap('')">BDIG</v-btn><br>


    </div>
</div>
</template>

<script>
import TextEditor from '@/components/TextEditor';

  export default {
    props:[
        'incidencia'
    ],
    components: {
        TextEditor,
    },
    mounted(){
        this.initialize();
    },
    methods:{
        initialize(){
            document.cookie = 'SameSite=Secure';
        },
        activeMap(map){
            this.mapActive = map;
        },
        activeDrawJob(){
            this.selectJobs = false;
            this.selectError = false;
            this.traceJob = true;
            this.traceError = false;
        },
        activeSelectJob(){
            this.selectJobs = true;
            this.selectError = false;
            this.traceJob = false;
            this.traceError = false;
        },
        activeDrawError(){
            this.selectJobs = false;
            this.selectError = false;
            this.traceJob = false;
            this.traceError = true;
        },
        activeSelectError(){
            this.selectJobs = false;
            this.selectError = true;
            this.traceJob = false;
            this.traceError = false;
        },
        dummy(){
            console.log("no hago nada aun")
        },
        deleteJobs(){
            this.jobs.pop();
        },
        deleteErrores(){
            this.errores.pop();
        },
    },

    watch: {
        jobs(){
            if (this.errores.length == 0) {
                this.editJob = false;
            } else {
                this.editJob = true;
            }
        },
        errores(){
            if (this.errores.length == 0) {
                this.editError = false;
            } else {
                this.editError = true;
            }
        },
    },
    data () {
      return {
        zoom: 10,
        center: [335752.64617923653, 4809241.805683324],
        urlIgnBase: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
        urlEsriImagery: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        mapActive:'osm',
        jobs: [],
        zIndexJob: 1,
        zIndexError: 2,
        errores: [],
        traceJob: false,
        traceError: false,
        editJob: false,
        editError: false,
        selectJobs: false,
        selectErrors: false,
        tema: ['Tema1','Tema2','Tema3'],
        errorDe: ['Tipo1','Tipo2','Tipo3'],
      }
    },
  }
</script>