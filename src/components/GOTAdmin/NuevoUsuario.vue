<template>
    <div>
        <v-card light class="newUserContainer">
            <v-card-title class="newUserTitle">
                NUEVO USUARIO
                <v-spacer></v-spacer>
                <v-card-actions>
                <v-btn color="error" class="fontControl" @click="close">
                    CERRAR
                </v-btn>
                <v-btn color="success" class="fontControl" @click="storeUser">
                    ACEPTAR
                </v-btn>
                </v-card-actions>
            </v-card-title>
            
            <v-card-text v-if="loading === false">
                <v-text-field filled label="Nombre" v-model="newUser.nombre"></v-text-field>
                <v-text-field filled label="Apellidos" v-model="newUser.apellidos"></v-text-field>

                <v-text-field filled label="Nombre usuario" v-model="newUser.userName"></v-text-field>
                <v-text-field filled label="Password" v-model="newUser.password"></v-text-field>

                <v-select filled label="Roles"
                multiple
                :items="roles"
                v-model="newUser.selectedRoles"
                ></v-select>

                <v-select
                :disabled="newUser.selectedRoles === []"
                filled label="Rol por defecto"
                v-model="newUser.defaultRole"
                :items="newUser.selectedRoles"
                >
                </v-select>
            </v-card-text>
            
            <v-card-text v-else>
                <div class="loader">
                    <h2 class="fontControl">CARGANDO DATOS</h2>
                    <h3 class="fontControl">Por favor, espere</h3>
                    <br/>
                    <v-progress-circular
                    :size="70"
                    :width="7"
                    color="purple"
                    indeterminate
                    ></v-progress-circular>
                </div>
            </v-card-text>
        </v-card>

        <!--MENSAJES DE INFORMACION-->
        <v-overlay :value="showMessage">
            <v-alert
            :color="messageType"
            dark
            border="top"
            icon="mdi-alert-circle-outline"
            transition="scale-transition"
            >
            {{ message }}
            </v-alert>
        </v-overlay>        
    </div>
</template>

<script>
import axios from 'axios';
import md5 from 'md5';

    export default {
        name: 'Nuevo_Usuario',

        data(){
            return {
                roles: undefined,
                loading: false,

                showMessage: false,
                messageType: 'info',
                message: undefined,

                newUser: {
                    nombre: undefined,
                    apellidos: undefined,
                    userName: undefined,
                    password: undefined,
                    selectedRoles: [],
                    defaultRole: undefined,
                }
            }
        },

        created(){
            this.initialize();
        },

        methods:{
            async initialize(){
                await axios
                .get(`${process.env.VUE_APP_API_ROUTE}/getRoles`)
                .then((data) => {
                    this.roles = data.data.roles
                })
            },

            async storeUser(){
                this.loading = true;
                this.newUser.password = md5(this.newUser.password)

                await axios
                .post(`${process.env.VUE_APP_API_ROUTE}/newUser`, this.newUser)
                .then((data) => {
                    if (data.status !== 203){
                        this.showMessage = true,
                        this.messageType = 'success',
                        this.message = data.data.mensaje,
                        this.loading = false;
                        setTimeout(this.close, 2000);
                    } else {
                        this.showMessage = true,
                        this.messageType = 'error',
                        this.message = data.data.mensaje,
                        this.loading = false;
                        setTimeout(this.close, 2000);
                    }
                })
            },

            close(){
                this.$emit("close", false)
            },
        }
    }
</script>

<style scoped>
    .fontControl {
        font-weight: 400 !important;
    }

    .newUserContainer {
        width: 60vw;
        max-width: 700px;
        max-height: 95vh;
        overflow-y: auto;
    }

    .newUserTitle {
        background-color: #4287f5;
        font-weight: 400 !important;
        color: white;
        margin-bottom: 1rem;
        width: 100%;
    }

    .loader {
        text-align: center;
    }
</style>
