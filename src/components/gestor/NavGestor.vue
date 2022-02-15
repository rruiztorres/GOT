<template>
  <div>
    <v-list 
      dense
      v-for="navGroup in navItems"
      :key="navGroup.name">
      
      <h5 style="font-weight:400;">{{navGroup.group}}</h5>
  
      <v-list-item
        dense
        v-for="opcionJob in navGroup.items"
        :key="opcionJob.name"
        @click="emitChangeMenu(opcionJob.active)"
        class="itemButton"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ opcionJob.icon }}</v-icon>
          <v-list-item-title class="textItemButton">{{ opcionJob.name }}</v-list-item-title>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>  
</template>

<script>
export default {
  name: "NavGestor",
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
            { group: 'Informes',
              items: [
                {name:'Estadísticas', icon:'mdi-finance', active:'EstadisticasGestor'},
                {name:'Ver en mapa', icon:'mdi-map', active:'VerMapa'},
                {name:'Expedientes', icon:'mdi-file-document-edit', active:''},
                {name:'Jobs', icon:'mdi-briefcase', active:'JobsGestor'},
                {name:'Errores', icon:'mdi-map-marker', active:'ErroresGestor'},
                {name:'Operadores', icon:'mdi-account-supervisor-circle', active:''},
                {name:'Estadísticas empresas', icon:'mdi-bank', active:'VistaGeneral'},
              ]
            },
          ],
        }
    },
};
</script>

<style scoped>
  .subheader {
    border: 1px solid white
  }

  h5 {
    font-weight: 500 !important;
    font-size: 84%;
    padding: 0.5rem;
    margin-left: 0.6rem;
    border-bottom: 0.055rem solid #e3e4e8
  }

  .itemButton:hover {
    background-color: #dbeafe;
  }

  .textItemButton {
    font-weight: 400 !important;
  }

</style>
