<template>
<v-app class="font-sans h-full">
  <v-navigation-drawer 
    class="bg-blue-900"
    dark v-model="drawer" :mini-variant.sync="mini" permanent src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg">
   

<!-- PANEL USUARIO -->
      <v-list-item class="p-0 h-24">
        <v-list>
          <!--mini avatar-->
          <div v-if="mini" class="bg-blue-800 rounded-full ml-3">
            <v-icon class="w-8 h-8">mdi-account-circle</v-icon>
          </div>

          <!--avatar completo-->
          <div v-if="!mini" class="flex">
            <v-list-item class="w-16 ml-0">    
              <v-list-item-avatar>
                <v-img src="https://randomuser.me/api/portraits/men/3.jpg"></v-img>
              </v-list-item-avatar>      
            </v-list-item>

            <v-list-item
            class="pl-0 flex-none w-36">
              <v-list-item-content>
                <v-list-item-title v-model="userName">{{userName}}</v-list-item-title>
                <v-list-item-subtitle v-model="userRole" class="text-xs">{{userRole}}</v-list-item-subtitle>
              </v-list-item-content>

            </v-list-item>

          </div> <!-- fin avatar -->
        </v-list>

        <!--BOTON MINI-->
        <v-btn class="pl-0" icon @click="hacerMini">
            <v-icon>mdi-menu-open</v-icon>
        </v-btn>
      </v-list-item>
<!-- FIN PANEL USUARIO -->

  <v-divider></v-divider>

<!-- ICONOS ACCIONES USUARIO -->

      <v-list class="flex">
        <template>
          <div class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  link
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                <v-icon>mdi-cog</v-icon>
              </v-btn>
        </template>

            <v-list>
              <v-list-item
                v-for="rol in roles"
                :key="rol.name"
                class="hover:bg-gray-200"
                @click="cambiarRol(rol)" 
              >
                <v-list-item-title
                class="text-xs">
                {{ rol.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

          </v-menu>
        </div>
        </template>

      </v-list>
<!-- FIN ICONOS ACCIONES USUARIO -->

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

    methods: {
      activar(datos) {
        this.$emit('cambiomenu', datos);
      },
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
      hacerMini() {
        this.mini = !this.mini;
      },
    },

    watch: {
      userRole() {
        //
      },
      mini() {
        this.$emit('hacerMini', this.mini);
      },
    },

    data () {
        return {
        drawer: true,
        mini: false,
        userName: localStorage.usuario,
        userRole: localStorage.rol,
        roles, //desde mixins configuramos fuera

        //objetos datos
        config: [
          {name:'Cambio de Rol', icon:'mdi-account-convert'},
          {name:'Mi Calendario', icon:'mdi-calendar-month'},
          {name:'Configuracion', icon:'mdi-cog'},
          {name:'Cerrar Sesión', icon:'mdi-location-exit'},
        ],
      }
    },
  }
</script>

<style>

</style>