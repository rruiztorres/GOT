<template>
  <v-app class="font-sans">
    <v-navigation-drawer v-model="drawer" app floating color="#EFF6FF">
      <Navigation @cambiomenu="cambiarMenu"> </Navigation>
    </v-navigation-drawer>

    <!-- HEADER -->
    <v-app-bar app dark color="#1e40af" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!--<v-toolbar-title>GOT</v-toolbar-title>-->
      <v-spacer></v-spacer>
      <a href="https://www.ign.es" target="blank">
        <img
          class="border border-white h-10 mr-1"
          src="@/assets/img/logo_web_IGN_CNIG.png"
        />
      </a>
    </v-app-bar>

    <!-- LOADER -->
    <v-main> 
        <Loader
        @cambiomenu="cambiarMenu"
        :activarMenu="newMenu"
        :userRole="userRole"
        >
        </Loader>
    </v-main>
  </v-app>
</template>

<script>
//componentes
import Loader from "@/components/common/Loader";
import Navigation from "@/components/common/Navigation";

//mixins
import { roles } from "@/assets/mixins/roles.js";

export default {
  name: "Dashboard",
  mixins: [roles],
  components: {
    Navigation,
    Loader,
  },

  created() {
    //ejecutamos initialize al cargar pagina
    this.initialize();
  },

  methods: {
    //asigna el panel que debe activarse de acuerdo al array "roles" recibido como mixin property.
    initialize() {
      this.rolDefault = localStorage.rol;
      for (this.rol in roles) {
        if (roles[this.rol].name == this.rolDefault) {
          this.newMenu = roles[this.rol].default;
        }
      }
    },

    cambiarMenu(data) {
      this.newMenu = data;
    },
  },

  data() {
    const userRole = "Generador de Jobs";
    let newMenu = this.newMenu;

    return {
        drawer:null,
        userRole,
        newMenu,
    };
  },
};
</script>

