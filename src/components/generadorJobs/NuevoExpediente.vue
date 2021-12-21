<template>
    <div>
        <v-card light class="bg-white rounded-md m-2" style="max-height:90vh; overflow-y:scroll; overflow-x:hidden; max-width:46rem">
            <v-card-title class="bg-blue-200">NUEVO EXPEDIENTE
                <v-spacer></v-spacer>
                <v-card-actions>
                    <v-btn color="error" dark @click="closeExpediente">CANCELAR</v-btn>
                    <v-btn color="success" dark @click="saveExpediente">ACEPTAR</v-btn>
                </v-card-actions>
            </v-card-title>
            <v-card-text class="p-5 mt-0">
                <v-row>    
                    <v-col cols="12">
                        <!--NUMERO EXPEDIENTE -->
                        <v-row class="mb-0 mt-2">
                            <v-col class="pb-0">
                                <h2 title="obligatorio" class="text-sm text-gray-500 mb-1">Número de Expediente <b>*</b></h2>
                                <v-text-field
                                v-model="nExp"
                                filled 
                                :rules="[rules.required, rules.formNumExp]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <!-- OBSERVACIONES -->
                        <v-row class="mt-0">
                            <v-col cols="12">
                                <h2 title="obligatorio" class="text-sm text-gray-500 mb-1">Observaciones <b>*</b></h2>
                                <div class="p-3 border border-gray-200 shadow bg-gray-100" style="max-width:50rem">
                                    <TextEditor @editor="storeObservationsExp"></TextEditor>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="mt-6">
                            <v-col cols="12" md="6">
                                <v-row class="mb-1">
                                    <v-col cols="4">
                                        <h2 title="obligatorio" class="text-sm text-gray-500 mb-1">Fecha Incio <b>*</b></h2>
                                    </v-col>
                                    <v-col cols="8">
                                        <span class="bg-green-100 rounded p-1 mb-0">
                                            <b class="px-6">{{fechaInicio}}</b>
                                        </span>
                                    </v-col>
                                </v-row>
                                <v-date-picker
                                    no-title
                                    locale="es-ES"
                                    :show-current="false"
                                    width="325"
                                    color="green"
                                    v-model="fechaInicio"
                                    class="shadow-md"
                                ></v-date-picker>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-row class="mb-1">
                                    <v-col cols="4">
                                        <h2 class="text-sm text-gray-500 mb-1">Fecha Fin </h2>
                                    </v-col>
                                    <v-col cols="8">
                                        <span v-if="fechaFin != ''" class="bg-red-100 rounded p-1 mb-0">
                                            <v-icon title="Borrar fecha fin" color="#f87171" @click="fechaFin = ''">mdi-close</v-icon>
                                            <b class="px-4">{{fechaFin}}</b>
                                        </span>
                                    </v-col>
                                </v-row>
                                <v-date-picker
                                    no-title
                                    locale="es-ES"
                                    :show-current="false"
                                    width="325"
                                    color="red"
                                    v-model="fechaFin"
                                    class="shadow-md"
                                ></v-date-picker>
                            </v-col>
                        </v-row>
                    </v-col>
                    <p class="ml-3 text-xs">Los campos marcados con <b>(*)</b> son obligatorios</p>
                </v-row>
            </v-card-text>
        </v-card>

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
                        <v-btn v-if="mensajeFlotante.aceptar == true" @click="closeInfoMessage()">ENTENDIDO</v-btn>
                    </v-col>
                </v-row>
                </v-alert>
                
            </v-dialog>
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import TextEditor from "@/components/common/TextEditor";

export default {
    name: 'NuevoExpediente',
    components: {TextEditor},

    mounted(){
    this.initializeParameters();
    this.retrieveExpFromBD();
    },

    methods:{
        initializeParameters(){
        this.nExp = '';
        this.storeObservationsExp('');
        },

        closeExpediente(){
        this.$emit('closed', true);
        },

        storeObservationsExp(data){
        this.observaciones = data;
        },

        retrieveExpFromBD(){
        axios
        .get(`${process.env.VUE_APP_API_ROUTE}/expedientes`)
        .then((data) => {
            this.expedientesBD = data.data.respuesta;
        })
        },

        checkData(datos){
        if (datos.fechaInicio == '' || datos.numExp == '' || datos.observaciones == ''){
            this.throwMessage('red','error','Los campos Número Expediente, Observaciones y Fecha Inicio son obligatorios', true)
        } else {
            // comprobamos que expediente no existe ya en BD
            this.compruebaExp = 'ok';
            for (this.index in this.expedientesBD){
            if (this.expedientesBD[this.index].expediente == datos.numExp){
                this.throwMessage('red','error','El número de expediente ya existe', true)
                this.compruebaExp = 'error'
            }
            }
        }
        return this.compruebaExp;
        },

        saveExpediente(){
        let newExp = {
            numExp: this.nExp,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            observaciones: this.observaciones,
            finalizado: false
        }
        const datosCorrectos = this.checkData(newExp);
        if (datosCorrectos == 'ok'){      
            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/expediente`, newExp)
            .then((data) => {
                if (data.status == 201){
                    this.throwMessage('green', 'success', `Expediente ${this.nExp} creado correctamente`, true)
                    this.initializeParameters();
                    this.$emit('updateExp', true);
                }
            })
            }
        },
        
        throwMessage(color, tipo, mensaje, aceptar){
            this.mensajeFlotante.visibilidad = true;
            this.mensajeFlotante.color = color;                 //colores: red, green, orange, yellow, purple
            this.mensajeFlotante.type = tipo;                   //type: success, info, warning, error
            this.mensajeFlotante.mensaje = mensaje;
            this.mensajeFlotante.aceptar = aceptar;             //Muestra el boton de "entendido"
        },

        closeInfoMessage(){
            this.mensajeFlotante.visibilidad = false;
            this.closeExpediente();
        },
    },

    data() {
        return {
        fechaInicio: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

        fechaFin: '',
        
        observaciones: '',
        nExp:'',
        expedientesBD:[],

        visibilidadMensajeInfo: true,
        mensajeFlotante:  {
            visibilidad: false,
            color: "green",             
            type: "success",            
            mensaje: "introduzca texto",
            aceptar: true,  
        },

        modal: false,

        rules: {
            required: value => !!value || 'Obligatorio.',
            formNumExp: value => value.length == 13 || 'El formato debe ser AAAA_00000000',
            },
        };
    },
}

</script>