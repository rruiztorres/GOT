<template>
<v-app class="font-sans h-full">
  <v-navigation-drawer 
    v-model="drawer" :mini-variant.sync="mini" floating permanent color="#EFF6FF">

<!-- PANEL USUARIO -->
    <template>
      <div class="text-center" >
        <v-menu
        v-model="menu"
        :close-on-click="closeOnClick"
        :nudge-width="80"
        offset-x
        class="transition duration-1500 ease-in-out"
        >
          <template v-slot:activator="{ on, attrs }">
          <div class="bg-blue-800 pt-7 h-52">
            <v-img
            v-bind="attrs"
            v-on="on"
            > 

            <div v-if="mini==false">
              <img
              :src="avatar"
              class="w-20 border-2 border-gray-400 rounded-full m-auto hover:opacity-70 transition duration-300 ease-in-out"
              >
            </div>
            <div v-if="mini==true">
              <img
              :src="avatar"
              class="w-10 border-2 border-gray-400 rounded-full m-auto hover:opacity-70 transition duration-300 ease-in-out"
              >
            </div>

            </v-img>

            <v-list-item-content>
              <div v-if="mini==false">
                <v-list-item-title v-model="userName" class="text-white">
                  {{userName}}
                </v-list-item-title>
              
                <v-list-item-subtitle v-model="userRole" class="text-white"> 
                  {{userRole}}
                </v-list-item-subtitle>
              </div>
            </v-list-item-content>

            <div v-if="mini==false" class="bg-blue-700 flex" style="height:2.85rem;">
              <v-icon class="hover:bg-blue-600 w-1/2 border-r border-blue-800" dark>mdi-cog</v-icon>
              <v-icon class="hover:bg-blue-600 w-1/2" dark>mdi-bell-outline</v-icon>
            </div>

          </div>
          </template>

          <!-- MENU DESPLEGABLE USUARIO -->
          <v-card>
            <v-list>
              <v-list-item class="w-80">
                <v-list-item-avatar>
                  <img
                  :src="avatar"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title 
                  v-model="userName"
                  >
                    {{userName}}
                  </v-list-item-title>
                  <v-list-item-subtitle 
                  v-model="userRole"
                  > 
                    {{userRole}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>
              
               <v-list>
                <v-list-item-title class="p-2">Cambio de Rol</v-list-item-title>

                <v-list-item
                  v-for="rol in roles"
                  :key="rol.name"
                  class="hover:bg-gray-200 w-80"
                  @click="cambiarRol(rol)" 
                >
                  <v-list-item-title
                  class="text-xs ml-3">
                  {{ rol.name }}
                  </v-list-item-title>

                  <v-icon
                  v-if="userRole==rol.name" 
                  class="rounded-full p-1 bg-green-500" dark
                  >
                    mdi-check
                  </v-icon>
                </v-list-item>
              </v-list>

            <v-divider></v-divider>

            <v-card-actions class="w-80">
              <v-spacer></v-spacer>
                <h6 class="text-xs">InciGEOv2 - dev</h6>
            </v-card-actions>
          </v-card> 
          <!-- FIN MENU DESPLEGABLE USUARIO -->
        </v-menu>
      </div>
    </template>      
      
<!-- FIN PANEL USUARIO -->

  <v-divider></v-divider>



<!-- MENU OPCIONES SEGUN ROL -->
  <div class="ml-1">
    <div v-if="userRole=='Generador de Jobs'"><NavGJ @cambiomenu="cambiarMenu" :hacerMini="mini"></NavGJ></div>
    <div v-if="userRole=='Operador Especializado'"><NavOpEsp @cambiomenu="cambiarMenu" :hacerMini="mini"></NavOpEsp></div>
    <div v-if="userRole=='Control de Calidad'"><Ccalidad @cambiomenu="cambiarMenu" :hacerMini="mini"></Ccalidad></div>
  </div>

<!-- FIN MENU OPCIONES SEGUN ROL -->
    <div v-if="mini==false">
      <v-spacer class="mt-4"></v-spacer>
      <v-btn color="green" dark class="w-56 ml-4">
        <v-icon class="mr-6">mdi-account-arrow-left-outline</v-icon>
        LOGOUT
        </v-btn>
    </div>
  </v-navigation-drawer>
</v-app>
</template>

<script>
//components
import NavGJ from '@/components/generadorJobs/NavGJ';
import NavOpEsp from '@/components/operadorEsp/NavOpEsp';
import Ccalidad from '@/components/controlCalidad/navCC';

//mixins
import {roles} from '@/assets/mixins/roles.js';


  export default {
    name:'Navigation',
    mixins: [roles],

    components: {
      NavGJ,
      NavOpEsp,
      Ccalidad,
    },

    props: {
      mini: {
        type: Boolean,
        default: false,
      }
    },
    
    methods: {
      cambiarMenu(data){
        this.newMenu = data;
        this.$emit('cambiomenu', data);
      },
      cambiarRol(rol) {
        this.userRole = rol.name;
        localStorage.rol = rol.name;
        //debug
        //console.log("el rol pasó a ser " + rol.name)
        
        //hay que cambiar dashboard por defecto también al cambiar rol usuario
        this.cambiarMenu(rol.default)
      },

    },

    watch: {
      userRole() {/**/},
      mini(){},
    },

    data () {
      return {
      avatar: 'data:image/jpeg;base64,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',
      closeOnClick: true,
      drawer: true,
      menu: false,
      userName: localStorage.usuario,
      userRole: localStorage.rol,
      roles, //desde mixins configuramos fuera
      }
    },
  }
</script>
