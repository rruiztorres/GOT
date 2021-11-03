<template>
  <div>
    <v-list class="mb-4">
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2 text-l font-bold"
          >Bandejas de Jobs</v-list-item-title
        >
      </div>
      <div v-if="hacerMini == true"></div>
      <v-list-item
        dense
        v-for="opcionJob in gestJobs"
        :key="opcionJob.name"
        @click="activar(opcionJob.active)"
        class="hover:bg-blue-100"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ opcionJob.icon }}</v-icon>
          <v-list-item-title
            class="text-xs text-black"
            >{{ opcionJob.name }}</v-list-item-title
          >
          <!-- -->
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-list class="mb-4">
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2 text-l font-bold"
          >Gestión IDVs</v-list-item-title
        >
      </div>
      <div v-if="hacerMini == true"></div>

      <v-list-item
        dense
        v-for="opcionIDV in idvs"
        :key="opcionIDV.name"
        @click="activar(opcionIDV.active)"
        class="hover:bg-blue-100"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ opcionIDV.icon }}</v-icon>
          <v-list-item-title class="text-xs text-black">{{
            opcionIDV.name
          }}</v-list-item-title>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-list class="mb-4">
      <div v-if="hacerMini == false">
        <v-list-item-title class="ml-4 my-2 text-l font-bold"
          >Informes</v-list-item-title
        >
      </div>
      <div v-if="hacerMini == true"></div>
      <v-list-item
        dense
        v-for="informe in informes"
        :key="informe.name"
        class="hover:bg-blue-100"
        @click="activar(opcionJob.active)"
      >
        <v-list-item-icon>
          <v-icon color="#1E40AF" class="mr-3">{{ informe.icon }}</v-icon>
          <v-list-item-title class="text-xs text-black">{{
            informe.name
          }}</v-list-item-title>
        </v-list-item-icon>
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
    },
    numJobsBdjaOpEsp: {
      default: 0,
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
        { name: "Mis Jobs", icon: "mdi-briefcase-account", active: "BandejaMisJobs"},
        { name: "Bandeja Operador Esp.", icon: "mdi-inbox-multiple", active: "BandejaOpEsp"},
        { name: "Bandeja Operador", icon: "mdi-inbox", number: 780, active: "BandejaOp" },
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
