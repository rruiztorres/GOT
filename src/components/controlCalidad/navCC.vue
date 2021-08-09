<template>
    <div>
      <v-list class="mb-4">
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Gestion de Jobs</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
        </div>
          <v-list-item
          dense
            v-for="opcionCcalidad in cCalidad"
            :key="opcionCcalidad.name"
            @click="activar(opcionCcalidad.active)"
            class="hover:bg-blue-100"
          >
            <v-list-item-icon>
              <v-icon color="#1E40AF" class="mr-3">{{ opcionCcalidad.icon }}</v-icon>
              <v-list-item-title class="text-xs text-black">{{ opcionCcalidad.name }}</v-list-item-title>
            </v-list-item-icon>
          </v-list-item>
      </v-list>


      <v-list class="mb-4">
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Gestión IDVs</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
        </div>

          <v-list-item
            dense
            v-for="operador in operadores"
            :key="operador.name"
            @click="activar(operador.active)"
            class="hover:bg-blue-100"
          >
            <v-list-item-icon>
              <v-icon color="#1E40AF" class="mr-3">{{ operador.icon }}</v-icon>
              <v-list-item-title class="text-xs text-black">{{ operador.name }}</v-list-item-title>
            </v-list-item-icon>
          </v-list-item>
      </v-list>


      <v-list class="mb-4">
        <div v-if="hacerMini==false">
          <v-list-item-title class="ml-4 my-2 text-l font-bold">Informes</v-list-item-title>
        </div>
        <div v-if="hacerMini==true">
          
        </div>
        <v-list-item
        dense
          v-for="informe in informes"
          :key="informe.name"
          class="hover:bg-blue-100"
          @click="activar(opcionJob.active)"
        >
          <v-list-item-icon>
            <v-icon color="#1E40AF" class="mr-3">{{ informe.icon }}</v-icon>
            <v-list-item-title class="text-xs text-black">{{ informe.name }}</v-list-item-title>
          </v-list-item-icon>
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
