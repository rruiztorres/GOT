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

        <v-btn class="pl-0" icon @click.stop="mini = !mini">
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
                @click="cambiarRol(rol.name)" 
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
  <div>
      <v-list>
        <div v-if="!mini">
          <v-list-item-title class="ml-4 my-2">Gestion de Incidencias</v-list-item-title>
        </div>
        <div v-if="mini">
          <v-list-item-title class="ml-3 my-2">INC</v-list-item-title>
        </div>

          <v-divider></v-divider>
          <v-list-item
            v-for="opcionIncidencia in gestIncidencias"
            :key="opcionIncidencia.name"
            link
            @click="activar(opcionIncidencia.active)"
          >
            <v-list-item-icon>
              <v-icon>{{ opcionIncidencia.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text-xs">{{ opcionIncidencia.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

      </v-list>

      <v-divider></v-divider>

      <v-list>
        <div v-if="!mini">
          <v-list-item-title class="ml-4 my-2">Gestion de Jobs</v-list-item-title>
        </div>
        <div v-if="mini">
          <v-list-item-title class="ml-3 my-2">JOB</v-list-item-title>
        </div>

          <v-divider></v-divider>
          <v-list-item
            v-for="opcionJob in gestJobs"
            :key="opcionJob.name"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ opcionJob.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="text-xs">{{ opcionJob.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <div v-if="!mini">
          <v-list-item-title class="ml-4 my-2">Informes</v-list-item-title>
        </div>
        <div v-if="mini">
          <v-list-item-title class="ml-3 my-2">KPI</v-list-item-title>
        </div>
        <v-divider></v-divider>
        <v-list-item
          v-for="informe in informes"
          :key="informe.name"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ informe.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-xs">{{ informe.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>  
  </div> 
<!-- FIN MENU OPCIONES SEGUN ROL -->

  <v-divider></v-divider>
  </v-navigation-drawer>
</v-app>
</template>

<script>
  export default {
    name:'Navigation',

    methods: {
      activar(datos) {
        this.$emit('cambiomenu', datos);
      },
      cambiarRol(rol) {
        this.userRole = rol;
        localStorage.rol = rol;
        console.log("el rol pasó a ser " + rol)
      }
    },

    watch: {
      userRole() {},
    },

    data () {
        return {
        drawer: true,
        userName: localStorage.usuario,
        userRole: localStorage.rol,

        //objetos datos
        roles: [
          {name:'Generador de Jobs'},
          {name:'Operador Especializado'},
          {name:'Control de Calidad'},
        ],
        config: [
          {name:'Cambio de Rol', icon:'mdi-account-convert'},
          {name:'Mi Calendario', icon:'mdi-calendar-month'},
          {name:'Configuracion', icon:'mdi-cog'},
          {name:'Cerrar Sesión', icon:'mdi-location-exit'},
        ],
        gestIncidencias: [
          {name:'Nueva Incidencia', icon:'mdi-map-marker-alert'},
          {name:'Incidencias en Bandeja', icon:'mdi-inbox-arrow-down', active:'IncBdjGJ'},
          {name:'Incidencias en Triaje', icon:'mdi-ambulance', active:'IncTriajeGJ'},
          {name:'Acciones globales', icon:'mdi-table-eye'},
        ],
        gestJobs: [ 
          {name:'Jobs Devueltos', icon:'mdi-briefcase-remove'},
          {name:'Jobs en Triaje', icon:'mdi-ambulance'},
          {name:'Acciones globales', icon:'mdi-table-eye'},
        ],
        informes: [
          {name:'Vista General', icon:'mdi-finance'},
          {name:'Mis KPI', icon:'mdi-card-account-details-star'},
        ],

        mini: false,
      }
    },
  }
</script>

<style>

</style>