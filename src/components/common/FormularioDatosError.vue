<template>
    <v-card class="containerForm">
        <div>
            <v-card-title 
            dark 
            class="titleErrorForm"
            >Editar Atributos de Error
            <v-spacer></v-spacer>
            </v-card-title>

            <div>
            <!--TextEditor descripciones error-->
            <v-col>
                <v-textarea
                class="textAreaError"
                v-model="descripcion"
                filled label="Descripción del error"
                counter
                :rules="[errorRules.required, errorRules.counter]"
                auto-grow
                value=""
                ></v-textarea>
            </v-col>

            <v-divider></v-divider>
            <v-spacer class="mt-2"></v-spacer>

            <v-col cols="12">
                <v-row class="formRow">
                <v-col 
                class="formRowTitle"
                cols="4"> Tema: </v-col>
                <v-col cols="8">
                    <v-select
                    filled dense class="text-m"
                    :items="arrayTemaError"
                    v-model="seleccionTemaError"
                    ></v-select>
                </v-col>
                </v-row>

                <v-row class="formRow">
                <v-col 
                class="formRowTitle"
                cols="4"> Tipo: </v-col>
                <v-col cols="8">
                    <v-select
                    filled dense
                    :items="arrayTipoError"
                    v-model="seleccionTipoError"
                    ></v-select>
                </v-col>
                </v-row>
            </v-col>

            <v-spacer></v-spacer>

            <v-card-actions
                class="actionForm"
            >
                <v-spacer></v-spacer>
                <v-btn
                class="button"
                color="error" 
                dark 
                @click="closeEditError()"
                >CANCELAR</v-btn>
                <v-btn
                :disabled="disableAceptarError || descripcion.length == 0"
                color="success" 
                :dark="!disableAceptarError"
                class="button" 
                @click="storeErrorData()"
                >ACEPTAR</v-btn>
            </v-card-actions>
            </div>
        </div>
    </v-card>
</template>

<script>
import axios from 'axios';
import { makeArrayFromApi } from '@/assets/mixins/makeArrayFromApi.js';

    export default {
        name: "FormularioDatosError",

        mixins: [makeArrayFromApi],

        mounted(){
            this.getErrorParameters();
        },

        props: ["error"],

        computed: {
            returnError(){
            return this.error;
            },
        },

        watch:{
            descripcion(){
                if(this.descripcion.length >= 255 || this.descripcion.length == 0){
                    this.disableAceptarError = true;
                } else {
                    this.disableAceptarError = false;
                }
            },
        },

        methods: {
            dummy(){
                console.log("dummy")
            },

            storeErrorData(){
                this.error.descripcion = this.descripcion;
                this.error.tema_error = this.seleccionTemaError;
                this.error.tipo_error = this.seleccionTipoError;

                //Emitir cambios y cerrar
                this.$emit("editedError", this.error);
                this.closeEditError();
            },

            closeEditError(){
                this.$emit("closeEditError", false);
            },

            getErrorParameters(){
                axios.get(`${process.env.VUE_APP_API_ROUTE}/errorParameters`).then((data) => {
                this.objeto = data.data;
                this.makeArrayFromApi(this.objeto.tema,this.arrayTemaError, 'tema_error')
                this.makeArrayFromApi(this.objeto.tipo, this.arrayTipoError, 'tipo_error')

                //Valores preasignados del error a editar
                this.descripcion = this.error.descripcion;
                this.seleccionTemaError = this.error.tema_error;
                this.seleccionTipoError = this.error.tipo_error;
                })
            },
        },

        data(){
            return{
                descripcion: '',            //Descripcion del error -> recibimos en prop
                arrayTemaError:[],          //Array temas error -> obtenidos en getErrorParameters
                seleccionTemaError: [],     //Seleccion tema error -> valor por defecto y seleccion de tema en el array
                arrayTipoError: [],         //Array tipos error -> obtenidos en getErrorParameters
                seleccionTipoError: [],     //Seleccion tipo error -> valor por defecto y seleccion de tipo en el array

                errorRules: {
                required: value => !!value || 'Este campo es obligatorio.',
                counter: value => value.length <= 255 || 'Máximo 255 caracteres'
                },
                disableAceptarError: false,
            }
        }
    }

</script>

<style scoped>
    .titleErrorForm {
        background-color: #E53935;
        color: white;
        font-weight: 400 !important;
    }

    .containerForm {
        font-weight: 400 !important;
    }

    .textAreaError {
        margin-top: 0.5rem;
    }

    .formRow {
        margin-top: 0.5rem;
        margin-bottom: -2.5rem
    } 

    .actionForm {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #ECEFF1;
    }

    .formRowTitle {
        margin-top: 0.46rem;
    }

    .button {
        font-weight: 400 !important;
    }
</style>