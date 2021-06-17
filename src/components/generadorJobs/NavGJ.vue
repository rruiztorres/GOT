<template>
    <div>
      <v-list>
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2">Gestion de Incidencias</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
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
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2">Gestion de Jobs</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
          <v-list-item-title class="ml-3 my-2">JOB</v-list-item-title>
        </div>

          <v-divider></v-divider>
          <v-list-item
            v-for="opcionJob in gestJobs"
            :key="opcionJob.name"
            link
            @click="activar(opcionJob.active)"
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
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2">Informes</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
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
          {name:'Nueva Incidencia', icon:'mdi-map-marker-alert', active: 'NuevaIncGJ'},
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
