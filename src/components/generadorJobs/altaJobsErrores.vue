<template>
<v-app class="font-sans">
<v-dialog 
    v-model="dialog" 
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    class="h-full">
    <div class="bg-blue-50 h-full">
        <v-toolbar
            dark
            color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="compruebaDatos"
                >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Alta de nuevos Jobs / Errores</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn class="w-24 bg-red-500 mr-5" dark text @click="compruebaDatos">CANCELAR</v-btn>
                <v-btn class="w-38 bg-gray-500 mr-5" dark text @click="guardarDatos">GUARDAR DATOS</v-btn>
                <v-btn class="w-24 bg-green-500 mr-5" dark text >GENERAR</v-btn>
        </v-toolbar>

            <template>
            <v-card>
                <v-tabs
                    fixed-tabs
                    background-color="#0341a6"
                    dark
                >
                    <v-tab>Localización en el Mapa</v-tab>
                    <v-tab>Resumen Jobs / Errores creados</v-tab>
                    <v-tab>Datos Adjuntos</v-tab>

                    <v-tabs-slider color="#76aff5"></v-tabs-slider>
                
                    <!--LOCALIZACIÓN EN EL MAPA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        style="height:50rem;"
                        >
                            <Map @jobs="storeJobs" @errores="storeErrors" perfil="editar"></Map>
                         </v-card>
                    </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                    <!--RESUMEN DE JOBS Y ERRORES-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <v-spacer class="m-4"></v-spacer>
                            
                            <h1 class="text-2xl font-black mb-2">Jobs</h1>
                                <v-data-table
                                    :loading="jobLoading"
                                    loading-text="Esperando jobs. Si registró jobs en mapa haga clic en Guardar datos para ver los cambios."
                                    :headers="jobHeaders"
                                    :items="jobs"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.estado`]="{ item }">
                                        <v-chip :color="getColor(item.estado)" dark>
                                            {{ item.estado }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                        
                            <v-spacer class="m-4"></v-spacer>
             
                            <h1 class="text-2xl font-black mb-2">Errores</h1>
                                <v-data-table
                                    :loading="errorLoading"
                                    loading-text="Esperando errores. Si registró errores haga clic en Guardar datos para ver los cambios."
                                    :headers="errorHeaders"
                                    :items="errores"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.estado`]="{ item }">
                                        <v-chip :color="getColor(item.estado)" dark>
                                            {{ item.estado }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                        </v-card>
                    </v-tab-item> <!--FIN RESUMEN JOBS ERRORES-->

                    <!--DATOS ADJUNTOS-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                           EMPTY
                         </v-card>
                    </v-tab-item> <!-- FIN DATOS ADJUNTOS -->
                </v-tabs>

                <!--MENSAJES DE INFORMACION-->
                <v-overlay :value="showMessage">
                    <v-alert
                    class="mx-7"
                    :color="messageType"
                    dark
                    border="top"
                    icon="mdi-alert-circle-outline"
                    transition="scale-transition"
                    >
                    {{message}}
                    </v-alert>
                </v-overlay>

                <v-overlay :value="showAlert">
                  <v-card class="p-3 w-80">
                   <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                   <h3 class="text-center text-l">Existen datos sin guardar ¿desea cerrar sin guardar los cambios?</h3>
                      <v-card-actions>
                        <div class="mt-6 flex">
                            <v-btn class="w-24 bg-red-500" dark text @click="closeAlert">CANCELAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn class="w-24 bg-green-500" dark text @click="closeDialog">OK</v-btn>
                        </div>
                      </v-card-actions>
                  </v-card>
                </v-overlay>

            </v-card>
        </template>
    </div>
</v-dialog>
</v-app>
</template>

<script>
    import Map from '@/components/common/Map';
    import axios from 'axios';
    import {getColor} from '@/assets/mixins/getColor.js';
    import pointInPolygon from 'point-in-polygon';

    export default {
        name: "altaJobsErrores",

        components: {
            Map,
        },

        mixins: [
            getColor
        ],

        watch:{
            selectViaEntrada(){
                this.viaEntrada = this.selectViaEntrada
            },
            selectProcedencia(){
                this.procedencia = this.selectProcedencia
            },
            selectPrioridad(){
                this.prioridad = this.selectPrioridad
            },
            jobs(){
                if (this.jobs.length != 0){
                    this.jobLoading=false;
                }
            },
            errores(){
                if (this.errores.length != 0){
                    this.errorLoading=false;
                }
            }
        },

        methods: {
            compruebaDatos(){
                if (this.jobs.length != 0 || this.errores.length != 0){
                    this.openAlert();
                } else {
                    this.closeDialog();
                }
            },

            openAlert(){
                this.showAlert = true;
            },

            closeAlert(){
                this.showAlert = false;
            },

            closeDialog() {
                this.dialog = false;
                //Al cerrar el dialogo devuelve el valor por defecto para GJ a loader
                //TODO: habría que definir el valor por defecto en una función global
                this.$emit('closed', 'JobsTriajeGJ');
            },


            showInfo(message, type){
                this.showMessage = true;
                this.message = message;
                this.messageType = type;
            },
            closeInfo(){
                this.showMessage = false;
            },

            recDataError(){
                //Comprueba si hay errores registrados en mapa
                if (this.errores.length > 0){
                    //Si hay Jobs registrados asigna errores a jobs espacialmente
                    this.asignErrorToJob();
                    for (this.index in this.errores) {
                        axios
                        .post( this.url + 'postErrores', this.errores[this.index])
                        .then( data => {
                            if (data.data.status == 200){
                                this.showInfo("Datos guardados correctamente", "green");
                                setTimeout(this.closeInfo,2000);
                            } else {
                                this.showInfo("Error al guardar!", "red");
                                setTimeout(this.closeInfo,2000);
                            }
                        })
                        .catch(error => {console.warn("algo fue mal al grabar el error ", error)})
                    }
                }
            },

            recDataJob(){
                if(this.jobs.length > 0){
                    for (this.index in this.jobs) {
                        axios
                        .post( this.url + 'postJobs', this.jobs[this.index])
                        .then( data => {
                            if (data.data.status == 200) {
                            //TODO: debería confirmar que jobs y errores se guardan bien
                            }
                        })
                        .catch(error => {console.warn("Algo fue mal al grabar el job ",error)})                                              
                    }
                }
            },

            updateDataError(){
                axios
                .put(this.url + 'updateErrores' + this.errores)
                .then(data => { console.log ("Errores actualizados correctamente ", data)})
            },

            updateDataJobs(){
                axios
                .put(this.url + 'updateJobs' + this.jobs)
                .then(data => { console.log ("Jobs actualizados correctamente ", data)})
            },


            compruebaErrorBD(){
                for (this.index in this.errores){
                    axios
                    .get(this.url + 'errores/' + this.errores[this.index].idError)
                    .then(data => {
                        if (data.data.mensaje.length > 0){
                            this.existe = true;
                        } else {
                            this.existe = false;
                        }
                    })
                }
                return this.existe;
            },

            compruebaJobBD(){
                for (this.index in this.jobs){
                    axios
                    .get(this.url + 'jobs/' + this.jobs[this.index].id_job)
                    .then(data => {
                        if (data.data.mensaje.length > 0){
                            this.existe = true;
                        } else {
                            this.existe = false;
                        }
                    })
                }
                return this.existe;
            },

            guardarDatos(){
                       
            },

            storeJobs(jobs){
                this.jobs = jobs;
            },

            storeErrors(errores){
                console.log("hello", errores)
                this.errores = errores;
            },

            asignErrorToJob() {
                for (this.indexError in this.errores) {
                    //reinicia el valor, necesario para detectar ediciones
                    this.errores[this.indexError].job = '';
                    this.point = [
                        this.errores[this.indexError].geometry.coordinates[0],
                        this.errores[this.indexError].geometry.coordinates[1],
                    ];

                    for (this.indexJob in this.jobs) {
                        this.polygon = [this.jobs[this.indexJob].geometry.coordinates[0]];
                        this.inside = pointInPolygon(this.point, this.polygon[0]);
                        if (this.inside == true) {
                            //Esta dentro del Job
                            this.errores[this.indexError].job = this.jobs[this.indexJob].idJob;
                        }
                    }
                }
            },
        },

        data () {
            return {
                url: 'http://10.13.86.114:3000/',    //url:puerto del servicio API
                dialog: true,
                emailRules: [
                    v => /.+@.+/.test(v) || 'Debe introducir un email válido, por ejemplo: "usuario@incigeo.com"',
                ],
                errores:[],                         //Almacen de errores
                jobs:[],                            //Almacen de jobs

                jobLoading: true,                   //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado jobs        
                errorLoading: true,                 //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado errores  

                showMessage: false,                 //Muestra mensajes de información en la parte inferior de la pantalla
                showAlert: false,                   //Muestra ventana de alerta
                message: '',                        //Determina el texto mostrado en el mensaje de información
                messageType: '',                    //green para success, red para error, blue para info.

                jobHeaders : [
                    { text: 'Estado', value:'estado'},                
                    { text: 'Id', value:'idJob'},
                    { text: 'Expediente', value: 'expediente'},
                    { text: 'Descripción', value: 'descripcion'},
                    { text: 'Perfil', value:'perfil' },
                    { text: 'Detectado en', value: 'detectado' },
                    { text: 'Gravedad', value: 'gravedad' },
                    { text: 'Asignado a', value: 'tipoBandeja' },
                    { text: 'Operador', value: 'operador' },
                ],

                errorHeaders : [
                    { text: 'Estado', value: 'estado' },                
                    { text: 'Id Error', value:'idError'},
                    { text: 'Asignado a Job', value: 'asocJob' },
                    { text: 'Error de', value: 'tipoError' },
                    { text: 'Tema Error', value: 'tema' },
                    { text: 'Descripcion', value: 'descripcion' },
                ],
            }
        },
    }
</script>