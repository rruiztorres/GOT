<template>
  <div>
    <v-list>
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2">Gestión de Jobs</v-list-item-title>
      </div>
      <div v-if="hacerMini == true">
        <v-list-item-title class="ml-3 my-2">JOB</v-list-item-title>
      </div>
      <v-divider></v-divider>
      <v-list-item v-for="jobs in gestJobs" :key="jobs.name" link>
        <v-list-item-icon>
          <v-icon>{{ jobs.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xs">{{ jobs.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2">Incidencias</v-list-item-title>
      </div>
      <div v-if="hacerMini == true">
        <v-list-item-title class="ml-3 my-2">IDV</v-list-item-title>
      </div>
      <v-divider></v-divider>
      <v-list-item v-for="idv in idvs" :key="idv.name" link>
        <v-list-item-icon>
          <v-icon>{{ idv.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-xs">{{ idv.name }}</v-list-item-title>
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
  name: "NavGJ",
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
      gestJobs: [
        { name: "Mis Jobs", icon: "mdi-briefcase-account" },
        { name: "Bandeja Operador Esp.", icon: "mdi-inbox-multiple" },
        { name: "Bandeja Operador", icon: "mdi-inbox" },
      ],
      idvs: [
        { name: "Generar IDV", icon: "mdi-briefcase-account" },
        { name: "IDV's en edición", icon: "mdi-briefcase-account" },
      ],
      informes: [
        { name: "Vista General", icon: "mdi-finance" },
        { name: "Mis KPI", icon: "mdi-card-account-details-star" },
      ],
    };
  },
};
</script>
