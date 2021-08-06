<template>
    <div>
      <v-list>
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Gestion de Incidencias</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
        </div>
          <v-list-item
            v-for="opcionIncidencia in gestIncidencias"
            :key="opcionIncidencia.name"
            @click="activar(opcionIncidencia.active)"
            class="hover:bg-blue-100"
          >
            <v-list-item-icon>
              <v-icon color="#1E40AF" class="mr-3">{{ opcionIncidencia.icon }}</v-icon>
              <v-list-item-title class="text-xs text-black">{{ opcionIncidencia.name }}</v-list-item-title>
            </v-list-item-icon>
          </v-list-item>
      </v-list>


      <v-list>
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Gestion de Jobs</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
        </div>

          <v-list-item
            v-for="opcionJob in gestJobs"
            :key="opcionJob.name"
            @click="activar(opcionJob.active)"
            class="hover:bg-blue-100"
          >
            <v-icon color="#1E40AF" class="mr-3">{{ opcionJob.icon }}</v-icon>
            <v-list-item-content><v-list-item-title class="text-xs text-black">{{ opcionJob.name }}</v-list-item-title></v-list-item-content>
          </v-list-item>
        
      </v-list>


      <v-list>
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Informes</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
          
        </div>
        <v-list-item
          v-for="informe in informes"
          :key="informe.name"
          class="hover:bg-blue-100"
        >
            <v-icon color="#1E40AF" class="mr-3">{{ informe.icon }}</v-icon>
            <v-list-item-content><v-list-item-title class="text-xs text-black">{{ informe.name }}</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
  </div> 
</template>

<script>

export default {
    name: 'NavGJ',
    props: {
        hacerMini: {
            type: Boolean,
            default: false,
        }
    },

     methods: {
      activar(datos) {
        this.$emit('cambiomenu', datos);
      },
      cambiarRol(rol) {
        this.userRole = rol;
        localStorage.rol = rol;
        //debug
        //console.log("el rol pasó a ser " + rol)
      },
    },

    watch: {
      userRole() {},
    },

    data() {
        return {
        gestIncidencias: [
          {name:'Nueva Incidencia', icon:'mdi-map-marker-alert', active: 'NuevaIncidenciaGJ'},
          {name:'Incidencias en Bandeja', icon:'mdi-inbox-arrow-down', active:'IncBdjGJ'},
          {name:'Incidencias en Triaje', icon:'mdi-ambulance', active:'IncTriajeGJ'},
          {name:'Acciones globales', icon:'mdi-table-eye'},
        ],
        gestJobs: [ 
          {name:'Jobs Devueltos', icon:'mdi-briefcase-remove', active:'JobsDevGJ'},
          {name:'Jobs en Triaje', icon:'mdi-ambulance', active:'JobsTriajeGJ'},
          {name:'Acciones globales', icon:'mdi-table-eye'},
        ],
        informes: [
          {name:'Vista General', icon:'mdi-finance'},
          {name:'Mis KPI', icon:'mdi-card-account-details-star'},
        ],
        }
    },

}
</script>
