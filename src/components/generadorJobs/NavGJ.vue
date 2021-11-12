<template>
  <div>
    <v-list 
      class="mb-4" 
      v-for="navGroup in navItems"
      :key="navGroup.name">

      <div v-if="hacerMini==false">
        <v-list-item-title class="ml-4 my-2 text-l font-bold">{{navGroup.group}}</v-list-item-title>
      </div>

      <div v-if="hacerMini==true">
      </div>

      <v-list-item
        dense
        v-for="opcionJob in navGroup.items"
        :key="opcionJob.name"
        @click="activar(opcionJob.active)"
        class="hover:bg-blue-100"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ opcionJob.icon }}</v-icon>
          <v-list-item-title class="text-xs text-black">{{ opcionJob.name }}</v-list-item-title>
        </v-list-item-icon>
      </v-list-item>
    </v-list>


    <v-btn color="green" dark class="w-56 ml-4">
      <v-icon class="mr-6">mdi-email-outline</v-icon>
      ENVIAR AVISO
    </v-btn>
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
      },
    },

    watch: {
      userRole() {},
    },

    data() {
        return {
          navItems:[
            { group: 'Gestión de jobs',
              items: [
                {name:'Alta de Jobs / Errores', icon:'mdi-briefcase-plus', active:'altaJobsErrores'}, 
                {name:'Jobs Devueltos', icon:'mdi-briefcase-off', active:'JobsDevGJ'},
                {name:'Jobs en Triaje', icon:'mdi-briefcase-search', active:'JobsTriajeGJ'},
                {name:'Recuperar Jobs', icon:'mdi-briefcase-upload', active:'RecuperarJobs'},
              ]
            },
            { group: 'Gestion de Expedientes',
              items: [
                {group: 'Gestión de Expedientes', name:'Alta de expediente', icon:'mdi-note-plus', active:'AltaExpediente'}, 
                {group: 'Gestión de Expedientes',name:'Editar expedientes', icon:'mdi-file-document-edit', active:'EditarExpediente'},
                {group: 'Gestión de Expedientes',name:'Estado expedientes', icon:'mdi-note-search', active:''},
              ]
            },
            {
              group: 'Informes',
              items: [
                {group: 'Informes', name:'Vista General', icon:'mdi-finance'},
                {group: 'Informes',name:'Mis KPI', icon:'mdi-card-account-details-star'},
              ]
            },
          ],

        // FIN DATA
        }
    },

}
</script>
