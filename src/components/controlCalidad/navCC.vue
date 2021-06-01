<template>
  <div>
    <v-list>
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2">Control de Calidad</v-list-item-title>
      </div>
      <div v-if="hacerMini == true">
        <v-list-item-title class="ml-3 my-2">CC</v-list-item-title>
      </div>
      <v-divider></v-divider>
      <v-list-item v-for="control in cCalidad" :key="control.name" link>
        <v-list-item-icon>
          <v-icon>{{ control.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xs">{{ control.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2">Operadores</v-list-item-title>
      </div>
      <div v-if="hacerMini == true">
        <v-list-item-title class="ml-3 my-2">OP</v-list-item-title>
      </div>
      <v-divider></v-divider>
      <v-list-item v-for="operador in operadores" :key="operador.name" link>
        <v-list-item-icon>
          <v-icon>{{ operador.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xs">{{ operador.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    

    <v-list>
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2">Informes</v-list-item-title>
      </div>
      <div v-if="hacerMini == true">
        <v-list-item-title class="ml-3 my-2">KPI</v-list-item-title>
      </div>
      <v-divider></v-divider>
      <v-list-item v-for="informe in informes" :key="informe.name" link>
        <v-list-item-icon>
          <v-icon>{{ informe.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xs">{{
            informe.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "NavCC",
  props: {
        hacerMini: {
            type: Boolean,
            default: false,
        }
    },
  methods: {
    activar(datos) {
      this.$emit("cambiomenu", datos);
    },
    cambiarRol(rol) {
      this.userRole = rol;
      localStorage.rol = rol;
      console.log("el rol pasó a ser " + rol);
    },
  },

  watch: {
    userRole() {},
  },

  data() {
    return {
      cCalidad: [
        { name: "Nuevo Control", icon: "mdi-book-search" },
        { name: "Jobs en Control", icon: "mdi-briefcase-search" },
        { name: "Controles en curso", icon: "mdi-clipboard-pulse" },
        ],
      operadores: [
        { name: "Estado operadores", icon: "mdi-account-group" },
        ],
      informes: [
        {name:'Vista General', icon:'mdi-finance'},
        {name:'Mis KPI', icon:'mdi-card-account-details-star'},
        ],
    };
  },
};
</script>
