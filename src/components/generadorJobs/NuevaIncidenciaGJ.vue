<template>
<v-app class="font-sans">
<v-dialog 
    v-model="dialog" 
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    class="h-full">
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
            <v-toolbar-title>Alta de Incidencia {{incSerial}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog">CANCELAR</v-btn>
                <v-btn class="w-38 bg-gray-500 mr-5" dark text>GUARDAR DATOS</v-btn>
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
                    <v-tab>Datos Adjuntos</v-tab>
                    <v-tab>Resumen de la Incidencia</v-tab>

                    <v-tabs-slider color="#76aff5"></v-tabs-slider>
                
                    <!--DATOS DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <v-card
                            class="p-4 mb-12 mt-4 h-full"
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
                                    style="height:20rem;"
                                    >
                                        <TextEditor @editor = storeDescIncidencia></TextEditor>
                                    </div>
                                </v-col>

                                <v-col cols="4">
                                    <v-subheader>Vía de Entrada</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        :label="inViaEntrada[0]"
                                        :items="inViaEntrada"
                                        v-model="viaEntrada"
                                        ></v-select>
                                    </v-row>

                                    <v-subheader>Procedencia</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        :label="inProcedencia[0]"
                                        :items="inProcedencia"
                                        v-model="procedencia"
                                        ></v-select>
                                        </v-row>
                                    

                                    <v-subheader>E-mail seguimiento</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-text-field
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
                        >
                            <Map @jobs="storeJobs" @errores="storeErrors" :incidencia="incSerial"></Map>
                         </v-card>
                    </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                    <!--DATOS ADJUNTOS-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                           EMPTY
                         </v-card>
                    </v-tab-item> <!-- FIN DATOS ADJUNTOS -->

                    <!--RESUMEN DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <template>
                                    <v-data-table
                                        :headers="jobHeaders"
                                        :items="jobitos"
                                        class="elevation-1"
                                        hide-default-footer
                                    ></v-data-table>
                            </template>
                        </v-card>
                    </v-tab-item> <!--FIN RESUMEN DE LA INCIDENCIA-->
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

    watch:{
        returnedTextIncidencia(){
            this.recDataIncidencia() 
        },
        viaEntrada(){
            this.recDataIncidencia() 
        },
        procedencia(){
            this.recDataIncidencia() 
        },
        email(){
            this.recDataIncidencia() 
        }, 
        jobs(){
            this.storeJobs()
        },
        errors(){
            this.storeErrors()
        },
    },

    methods: {
        closeDialog() {
            this.dialog = false;
        },
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
        },
        storeJobs(jobs){
            this.jobs = jobs;
            console.log('Jobs ', this.jobs)
        },
        storeErrors(errores){
            this.errores = errores;
            console.log('Errores ', this.errores)
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
            inProcedencia: [],

            incidencia:[],      //Almacen de datos para incidencia
            viaEntrada:'',      //Select desde formulario
            procedencia:'',     //Select desde formulario
            email:'',           //Select desde formulario

            errores:[],         //Almacen de errores
            jobs:[],            //Almacen de jobs


            jobHeaders : [                
                { text: 'Id Job', value:'idJob'},
                { text: 'Arreglar en', value:'arreglo' },
                { text: 'Asignación', value: 'deteccion' },
                { text: 'Descripcion', value: 'descripcion' },
                { text: 'Asignación', value: 'asignacion' },
                { text: 'Tipo operador', value: 'operador' },
            ],

            errorHeaders : [                
                { text: 'Id Error', value:'idError'},
                { text: 'Error de', value: 'errorDe' },
                { text: 'Tema Error', value: 'temaError' },
                { text: 'Descripcion', value: 'descripcion' },
            ],
            expanded: [],

            jobitos: [
                {
                    idJob: 'IGN_C_202100001-J01',
                    deteccion: 'BTN25',
                    arreglo: 'BDIG',
                    detectado: 'deteccion',
                    descripcion: 'Datos estaticos solo de prueba esta parte no está hecha',
                    asignacion: 'Bandeja de Jobs',
                    operador: 'Operadores',
                },
            ]
        }
    },
  }
</script>