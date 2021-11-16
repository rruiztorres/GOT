<!--
Ventana de seleccion de atributos de error en modo edición
-->

<template>
    <v-card light width="500">
        <div>
            <v-card-title dark class="text-lg text-white bg-red-500"
            >Editar Atributos de Error
            <v-spacer></v-spacer>
            </v-card-title>

            <div class="p-1">
            <!--TextEditor descripciones error-->
            <v-col class="bg-gray-200" cols="12">
                <v-textarea
                v-model="descripcion"
                filled label="Descripción del error"
                auto-grow
                value=""
                ></v-textarea>
            </v-col>

            <v-divider></v-divider>
            <v-spacer class="mt-2"></v-spacer>

            <v-col cols="12">
                <v-row style="margin-bottom: -2.5rem">
                <v-col cols="4" class="mt-3"> Tema: </v-col>
                <v-col cols="8">
                    <v-select
                    filled dense class="text-m"
                    :items="arrayTemaError"
                    v-model="seleccionTemaError"
                    ></v-select>
                </v-col>
                </v-row>

                <v-row style="margin-bottom: -2.5rem">
                <v-col cols="4" class="mt-3"> Tipo: </v-col>
                <v-col cols="8">
                    <v-select
                    filled dense class="text-m"
                    :items="arrayTipoError"
                    v-model="seleccionTipoError"
                    ></v-select>
                </v-col>
                </v-row>
            </v-col>

            <v-spacer class="mt-5"></v-spacer>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" dark @click="closeEditError()"
                >CANCELAR</v-btn>
                <v-btn color="success" dark @click="storeErrorData()"
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
                descripcion: '',              //Descripcion del error -> recibimos en prop
                arrayTemaError:[],          //Array temas error -> obtenidos en getErrorParameters
                seleccionTemaError: [],     //Seleccion tema error -> valor por defecto y seleccion de tema en el array
                arrayTipoError: [],         //Array tipos error -> obtenidos en getErrorParameters
                seleccionTipoError: [],     //Seleccion tipo error -> valor por defecto y seleccion de tipo en el array
            }
        }
    }

</script>