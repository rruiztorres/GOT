<template>
<v-app class="font-sans">
<v-dialog 
    v-model="dialog" 
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    class="h-full">
    <div class="bg-blue-50 h-full pb-6">
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
            <v-toolbar-title>Alta de Incidencia {{incSerial}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog">CANCELAR</v-btn>
                <v-btn class="w-38 bg-gray-500 mr-5" dark text @click="recDataIncidencia">GUARDAR DATOS</v-btn>
                <v-btn class="w-24 bg-green-500 mr-5" dark text>GENERAR</v-btn>
        </v-toolbar>



            <template>
            <v-card>
                <v-tabs
                    fixed-tabs
                    background-color="#0341a6"
                    dark
                >
                    <v-tab>Descripción de Incidencia</v-tab>
                    <v-tab>Localización en el Mapa</v-tab>
                    <v-tab>Resumen de la Incidencia</v-tab>
                    <v-tab>Datos Adjuntos</v-tab>

                    <v-tabs-slider color="#76aff5"></v-tabs-slider>
                
                    <!--DATOS DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <v-card
                            class="p-4 mb-12 mt-4" style="height:42rem;"
                            >
                            <v-row align="center">
                                <v-subheader class="ml-3">Código Incidencia</v-subheader>
                                <h1 class="text-xl text-black"><b>{{incSerial}}</b></h1>
                            </v-row>

                            <v-row>
                                <v-col cols="8">
                                    <v-subheader>Descripción Incidencia</v-subheader>
                                    <div 
                                    class="ml-4 p-3 border border-gray-200 shadow bg-gray-100"
                                    style="height:33rem;"
                                    >
                                        <TextEditor @editor = storeDescIncidencia></TextEditor>
                                    </div>
                                </v-col>

                                <v-col cols="4">
                                    <v-subheader>Vía de Entrada</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        return-object
                                        :items="inViaEntrada"
                                        v-model='selectViaEntrada'
                                        ></v-select>
                                    </v-row>

                                    <v-subheader>Procedencia</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        :items="inProcedencia"
                                        v-model='selectProcedencia'
                                        ></v-select>
                                    </v-row>

                                    <v-subheader>Realizar seguimiento</v-subheader>
                                    <v-row align="center" class="ml-1">
                                        <v-container fluid>
                                            <v-switch
                                            v-model="switch1"
                                            :label="switch1"
                                            ></v-switch>
                                        </v-container>
                                    </v-row>

                                    <v-subheader>E-mail seguimiento</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-text-field
                                        :disabled = !switch1
                                        filled
                                        v-model="email"
                                        :rules="emailRules"
                                        ></v-text-field>
                                    </v-row>   
                                </v-col>
                            </v-row>                                   
                            </v-card>

                        </v-card>
                    </v-tab-item> <!--FIN DATOS INCIDENCIA -->

                    <!--LOCALIZACIÓN EN EL MAPA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        style="height:50rem;"
                        >
                            <Map @jobs="storeJobs" @errores="storeErrors" :incidencia="incSerial"></Map>
                         </v-card>
                    </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                    <!--RESUMEN DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <h1 class="text-2xl font-black mb-2">Incidencia</h1>
                            <p>Resumen de la incidencia tal</p>

                            <v-spacer class="m-4"></v-spacer>
                            
                            <h1 class="text-2xl font-black mb-2">Jobs</h1>
                                <v-data-table
                                    :loading="jobLoading"
                                    loading-text="Esperando jobs"
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
                                    loading-text="Esperando errores"
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
                    </v-tab-item> <!--FIN RESUMEN DE LA INCIDENCIA-->

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
            </v-card>
            </template>
    </div>
</v-dialog>
</v-app>
</template>

<script>
import TextEditor from '@/components/TextEditor';
import Map from '@/components/Map';
import axios from 'axios';
import {getColor} from '@/assets/mixins/getColor.js';
import pointInPolygon from 'point-in-polygon';

  export default {
    components: {
        TextEditor,
        Map,
    },

      mixins: [
        getColor
    ],

    created () {
        this.initializeIncSerial();
        this.initializeViaEnt();
        this.initializeProced();
    },

    mounted(){
        //Si no se cambia el select del formulario guardará los valores por defecto
        this.viaEntrada = this.selectViaEntrada
        this.procedencia = this.selectProcedencia
    },

    watch:{
        selectViaEntrada(){
            this.viaEntrada = this.selectViaEntrada
        },
        selectProcedencia(){
            this.procedencia = this.selectProcedencia
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
        closeDialog() {
            this.dialog = false;
            //Al cerrar el dialogo devuelve el valor por defecto para GJ a loader
            this.$emit('closed', 'IncTriajeGJ');
        },
        //TODO: Mejorar la gestion de los numeros de serie
        initializeIncSerial () {
            const type = 'IGN_C_'; //Al estar en Generador de JOBS el tipo es "C"
            const date = new Date();
            const year = (date.getFullYear()).toString();
            const url = 'http://10.13.86.114:3000/'; //url del servicio
            axios
            .get(url + 'serials/' + type +'/'+ year)
            //recuperamos el ultimo serial registrado en BD
            .then(data => {this.serial = (data.data[0]);
            this.incSerial = (this.serial.serial_type)+(this.serial.serial_year)+(this.serial.serial_id)
            })
        },
        initializeViaEnt() {
            const url = 'http://10.13.86.114:3000/'; //url del servicio
            axios
                .get(url + 'viaentrada')
                .then(data =>   {
                                this.objViaEnt = (data.data.response)
                                    for (this.index in this.objViaEnt) {
                                        this.inViaEntrada.push(this.objViaEnt[this.index].via_ent)
                                    }
                                },
                    )
        },
        initializeProced() {
            const url = 'http://10.13.86.114:3000/'; //url del servicio
            axios
                .get(url + 'procedencia')
                .then(data =>   {
                                this.objProced = (data.data.response)
                                    for (this.index in this.objProced) {
                                        this.inProcedencia.push(this.objProced[this.index].proc)
                                    }
                                },
                    )
        },
        //Lo que recogemos del text editor
        storeDescIncidencia(returnedText){
            this.returnedTextIncidencia = returnedText
        },
        recDataIncidencia(){
            this.incidencia = {
                id_inc:this.incSerial,
                descripcion:this.returnedTextIncidencia,
                via_entrada: this.viaEntrada,
                procedencia: this.procedencia,
                eMailSeguim: this.email,
            }
            this.asignErrorToJob();
            console.log('Incidencia: ', this.incidencia, 'Errores: ', this.errores, 'Jobs: ', this.jobs)
        },
        storeJobs(jobs){
            this.jobs = jobs;
        },
        storeErrors(errores){
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
            dialog: true,

            incSerial:'',
            emailRules: [
                v => /.+@.+/.test(v) || 'Debe introducir un email válido, por ejemplo: "usuario@incigeo.com"',
            ],
            inViaEntrada: [],
            selectViaEntrada: 'Directo',        //Determina valor por defecto para el formulario
            inProcedencia: [],
            selectProcedencia: 'IGN / CNIG',    //Determina valor por defecto para el formulario

            incidencia:[],                      //Almacen de datos para incidencia
            viaEntrada:'',                      //Select desde formulario si no se cambia recoge valor por defecto
            procedencia:''  ,                   //Select desde formulario si no se cambia recoge valor por defecto
            switch1:'',
            email:'',                           //Select desde formulario

            errores:[],                         //Almacen de errores
            jobs:[],                            //Almacen de jobs


            jobLoading: true,
            errorLoading: true,

            jobHeaders : [
                { text: 'Estado', value:'estado'},                
                { text: 'Id Job', value:'idJob'},
                { text: 'Arreglar en', value:'arreglo' },
                { text: 'Asignación', value: 'deteccion' },
                { text: 'Descripcion', value: 'descripcion' },
                { text: 'Asignación', value: 'asignacion' },
                { text: 'Tipo operador', value: 'bandeja' },
            ],

            errorHeaders : [
                { text: 'Estado', value: 'estado' },                
                { text: 'Id Error', value:'idError'},
                { text: 'Asignado a Job', value: 'job' },
                { text: 'Error de', value: 'selectTipoError' },
                { text: 'Tema Error', value: 'selectTema' },
                { text: 'Descripcion', value: 'descripcion' },
            ],
        }
    },
  }
</script>