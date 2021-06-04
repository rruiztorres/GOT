<template>
<v-app class="font-sans h-full">
  <v-navigation-drawer 
    class="bg-blue-900"
    dark v-model="drawer" :mini-variant.sync="mini" permanent src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg">
   

<!-- PANEL USUARIO -->
    <template>
      <div class="text-center pt-6">
        <v-menu
        v-model="menu"
        :close-on-click="closeOnClick"
        :nudge-width="80"
        offset-x
        class="transition duration-1500 ease-in-out"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-img
            dark
            v-bind="attrs"
            v-on="on"
            > 

            <div v-if="mini==false">
              <img
              src="https://medicaenergy.com/assets/images/default-user.png"
              class="w-20 border-2 border-gray-400 rounded-full m-auto hover:opacity-70 transition duration-300 ease-in-out"
              >
            </div>
            <div v-if="mini==true">
              <img
              src="https://medicaenergy.com/assets/images/default-user.png"
              class="w-10 border-2 border-gray-400 rounded-full m-auto hover:opacity-70 transition duration-300 ease-in-out"
              >
            </div>

            </v-img>

            <v-list-item-content>
              <div v-if="mini==false">
                <v-list-item-title 
                v-model="userName"
                class="text-white"
                >
                {{userName}}
                </v-list-item-title>
              
                <v-list-item-subtitle 
                v-model="userRole"
                class="text-white"
                > 
                {{userRole}}
                </v-list-item-subtitle>
              </div>
            </v-list-item-content>

          </template>

          <!-- MENU DESPLEGABLE USUARIO -->
          <v-card>
            <v-list>
              <v-list-item class="w-80">
                <v-list-item-avatar>
                  <img
                  src="https://medicaenergy.com/assets/images/default-user.png"
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

  <div v-if="userRole=='Generador de Jobs'"><NavGJ @cambiomenu="cambiarMenu" :hacerMini="mini"></NavGJ></div>
  <div v-if="userRole=='Operador Especializado'"><NavOpEsp @cambiomenu="cambiarMenu" :hacerMini="mini"></NavOpEsp></div>
  <div v-if="userRole=='Control de Calidad'"><Ccalidad @cambiomenu="cambiarMenu" :hacerMini="mini"></Ccalidad></div>
  

<!-- FIN MENU OPCIONES SEGUN ROL -->

  <v-divider></v-divider>
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
        console.log("el rol pasó a ser " + rol.name)
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
