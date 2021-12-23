<template>
  <div>
    <v-list 
      dense
      v-for="navGroup in navItems"
      :key="navGroup.name">
      
      <v-subheader class="ml-2 font-bold">{{navGroup.group}}</v-subheader><hr/>
  
      <v-list-item
        dense
        v-for="opcionJob in navGroup.items"
        :key="opcionJob.name"
        @click="emitChangeMenu(opcionJob.active)"
        class="hover:bg-blue-100"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ opcionJob.icon }}</v-icon>
          <v-list-item-title class="text-xs text-black">{{ opcionJob.name }}</v-list-item-title>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

  </div>

  
</template>

<script>

export default {
    name: 'NavGJ',

    methods: {
      emitChangeMenu(datos) {
        this.$emit('cambiomenu', datos);
      },
      changeRole(rol) {
        this.userRole = rol;
        localStorage.rol = rol;
      },
    },

    watch: {
      userRole() {},
    },

    data() {
        return {
          navItems:[
            { group: 'Jobs',
              items: [
                {name:'Alta de Jobs / Errores', icon:'mdi-briefcase-plus', active:'altaJobsErrores'}, 
                {name:'Jobs en Triaje', icon:'mdi-briefcase-search', active:'JobsTriajeGJ'},
                {name:'Recuperar Jobs', icon:'mdi-briefcase-upload', active:'RecuperarJobs'},
              ]
            },
            { group: 'Expedientes',
              items: [
                {name:'Gestionar Expedientes', icon:'mdi-file-document-edit', active:'GestionExpedientes'},
              ]
            },
            {
              group: 'Errores sin Asignar',
              items: [
                {name:'Gestionar Errores', icon:'mdi-map-marker-question', active:'ErroresNoAsign'},
              ]
            },
            {
              group: 'Informes',
              items: [
                {name:'Vista General', icon:'mdi-finance'},
              ]
            },
          ],

        // FIN DATA
        }
    },

}
</script>
