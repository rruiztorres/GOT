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
  name: "NavGJ",
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
                {name:'Mis Jobs', icon:'mdi-briefcase-account', active:'BandejaMisJobs'}, 
                {name:'Bandeja Operador Esp.', icon:'mdi-inbox-outline', active:'BandejaOpEsp'},
                {name:'Bandeja Operador', icon:'mdi-inbox', active:'BandejaOp'},
              ]
            },
            { group: "IDV",
              items: [
                {name:'Nueva IDV', icon:'mdi-briefcase-account', active:''},
                {name:"IDV's en edición", icon:'mdi-briefcase-account', active:''},

              ]
            },
            {
              group: 'Informes',
              items: [
                {name:'Vista General', icon:'mdi-finance', active:''},
              ]
            },
          ],
        // FIN DATA
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
