<template>
<v-app class="font-sans h-full">
    <v-navigation-drawer 
    class="bg-blue-900"
    dark v-model="drawer" :mini-variant.sync="mini" permanent src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg">
   
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
                <v-img src="https://randomuser.me/api/portraits/women/28.jpg"></v-img>
              </v-list-item-avatar>
                      
            </v-list-item>

            <v-list-item class="pl-0 flex-none w-36">
              <v-list-item-content>
                
                <v-list-item-title>
                  {{ usrname }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-xs">Generador de Jobs</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>

        <v-btn class="pl-0" icon @click.stop="mini = !mini">
            <v-icon>mdi-menu-open</v-icon>
        </v-btn>


      </v-list-item>

      <v-divider></v-divider>

      <v-list class="flex">
        <v-list-item
        v-for="configuracion in config" 
        :key="configuracion.name"
        link
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-title v-bind="attrs" v-on="on" link >
              <v-icon class="m-auto">{{configuracion.icon}}</v-icon>
              </v-list-item-title>
            </template>
            <span>{{configuracion.name}}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

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
      }
    },

    data () {
      const usrname = localStorage.usuario;
      
        return {
        drawer: true,
        usrname,

        //objetos datos
        config: [
          {name:'Configuracion', icon:'mdi-cog'},
          {name:'Cambio de Rol', icon:'mdi-account-hard-hat'},
          {name:'Mi Calendario', icon:'mdi-calendar-month'},
          {name:'Cerrar Sesión', icon:'mdi-account-arrow-left'},
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