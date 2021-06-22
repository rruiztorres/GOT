<template>
<div class="flex">
    <div style="height:550px" class="w-3/4">
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
            <vl-layer-tile id="osm">
                <vl-source-osm></vl-source-osm>
            </vl-layer-tile>
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
                    <v-card-title class="text-h5 bg-blue-200">
                    Alta de Error
                    </v-card-title>

                    <v-card-text class="mt-1">
                        Aqui van los dialogos para introducir caracteristicas del Error.
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="error"
                            dark
                            @click="editError = false"
                            >
                            CANCELAR
                        </v-btn>

                        <v-btn
                            color="success"
                            @click="editError = false"
                            >
                            ACEPTAR
                        </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </div>
        </template>
    </div>

    <!-- PANEL CONTROL MAPA -->
    <div class="bg-blue-100 border-4 border-white w-1/4 p-6">
        <h1>Jobs</h1>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="activeDrawJob"><v-icon>mdi-vector-polygon</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="dummy"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="dummy"><v-icon>mdi-information</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="deleteJobs"><v-icon>mdi-delete</v-icon></v-btn>

        <v-spacer></v-spacer>

        <h1>Errores</h1>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="activeDrawError"><v-icon>mdi-map-marker-remove-variant</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="dummy"><v-icon>mdi-cursor-default-click</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="dummy"><v-icon>mdi-information</v-icon></v-btn>
        <v-btn icon tile dark class="bg-blue-500 m-1" @click="deleteErrores"><v-icon>mdi-delete</v-icon></v-btn>

        <div style="padding: 20px">
            <!--hago cosas -->
        </div>
    </div>
</div>
</template>

<script>
  export default {
    methods:{
        activeDrawJob(){
            this.traceJob = true;
            this.traceError = false;
        },
        activeDrawError(){
            this.traceJob = false;
            this.traceError = true;
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
        jobs: [],
        zIndexJob: 1,
        zIndexError: 2,
        errores: [],
        traceJob: false,
        traceError: false,
        editJob: false,
        editError: false,
      }
    },
  }
</script>