<template>
    <div class="font-sans">
        <h1 class="ml-2 text-2xl font-bold my-6">
        Crear nueva Incidencia
        </h1>
        <v-app class="font-sans">
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                        >
                        Datos de la Incidencia
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                        >
                        Registrar Errores / Jobs
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step 
                        step="3">
                        Finalizar
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>

                <!-- ================================== STEP 1 ============================== --> 

                    <v-stepper-content 
                        step="1">
                            <v-card
                            class="p-4 mb-12 h-full"
                            >
                            <v-row align="center">
                                <v-col cols="2">
                                    <v-subheader>Código Incidencia</v-subheader>
                                </v-col>
                                <v-col cols="10">
                                    <h1 class="text-l text-black"><b>{{incSerial}}</b></h1>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-subheader>Descripción Incidencia</v-subheader>
                                    <div class="ml-4 p-3 border border-gray-200 shadow bg-gray-100">
                                        <TextEditor @editor = storeDescIncidencia></TextEditor>
                                    </div>
                                </v-col>
                            </v-row>

                            <div class="mt-5">
                                <v-row align="center">
                                    <v-col cols="2">
                                        <v-subheader>Vía de Entrada</v-subheader>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select
                                        dense
                                        :items="inViaEntrada"
                                        v-model="viaEntrada"
                                        ></v-select>
                                    </v-col>

                                    <v-col cols="2">
                                        <v-subheader>Procedencia</v-subheader>
                                    </v-col>
                                    <v-col cols="4">
                                        <v-select
                                        dense
                                        :items="inProcedencia"
                                        v-model="procedencia"
                                        ></v-select>
                                    </v-col>
                                </v-row>

                                <v-row align="center">
                                     <v-col cols="3">
                                        <v-subheader>E-mail seguimiento</v-subheader>
                                    </v-col>
                                     <v-col cols="9">
                                        <v-text-field
                                        v-model="email"
                                        :rules="emailRules"
                                    ></v-text-field>
                                    </v-col>
                                </v-row>   
                            </div>                                   

                            </v-card>

                            <v-btn
                            color="primary"
                            @click="recDataIncidencia"
                            class="mr-2"
                            >
                            Siguiente
                            </v-btn>
                    </v-stepper-content>


                <!-- ================================== STEP 2 ============================== -->

                    <v-stepper-content step="2">
                        <v-card
                        class="mb-12"
                        color="grey lighten-1"
                        height="550px"
                        >
                        <Map @errores="storeErrores" :incidencia="incSerial"></Map>
                        
                        </v-card>

                        <v-btn
                        color="secondary"
                        @click="e1 = e1-1"
                        class="mr-2"
                        >
                        Volver a paso 1 
                        </v-btn>

                        <v-btn
                        color="primary"
                        @click="getErrores"
                        class="mr-2"
                        >
                        Siguiente
                        </v-btn>

                    </v-stepper-content>







                    <v-stepper-content step="3">
                        <v-card
                        class="mb-12"
                        color="grey lighten-1"
                        height="200px"
                        ></v-card>

                        <v-btn
                        color="secondary"
                        @click="e1 = e1-1"
                        class="mr-2"
                        >
                        Volver a paso 2 
                        </v-btn>

                        <v-btn
                        color="success"
                        @click="e1 = 1"
                        class="mr-2"
                        >
                        Finalizar
                        </v-btn>

                        <v-btn
                        
                        color="error"
                        class="mr-2">
                        Cancelar
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-app>
    </div>
</template>

<script>
import TextEditor from '@/components/TextEditor';
import Map from '@/components/Map';
import axios from 'axios';

  export default {
    components: {
        TextEditor,
        Map,
    },

    created () {
      this.initializeIncSerial();
      this.initializeViaEnt();
      this.initializeProced();
    },

    methods: {
        initializeIncSerial () {
            const type = 'IGN_C_'; //Al estar en Generador de JOBS el tipo es "C"
            let date = new Date();
            let year = (date.getFullYear()).toString();
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
        storeDescIncidencia(returnedText){
            this.returnedTextIncidencia = returnedText
        },
        recDataIncidencia(){
            this.incidencia.push({
                id_inc:this.incSerial,
                descripcion:this.returnedTextIncidencia,
                via_entrada: this.viaEntrada,
                procedencia: this.procedencia,
                eMailSeguim: this.email,
            })
            console.log("Incidencia Grabada -> ", this.incidencia[0])
            this.e1 = 2 //Avanzamos al paso 2
        },
        storeErrores(errors){
            this.errores = errors
        },
        getErrores(){
            console.log('Errores almacenados: ', this.errores)
            this.e1 = 3
        }
    },
 
    data () {
        return {
            e1: 1,
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
        }
    },
  }
</script>