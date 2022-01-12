<template>
  <v-app id="gotApp">
    <v-navigation-drawer v-model="drawer" app floating color="#EFF6FF">
      <Navigation @cambiomenu="cambiarMenu"> </Navigation>
    </v-navigation-drawer>

    <!-- HEADER -->
    <v-app-bar app dark color="#1e40af" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <a href="https://www.ign.es" target="blank">
        <img class="logoHeader" src="@/assets/img/logo_web_IGN_CNIG.png">
      </a>
    </v-app-bar>

    <!-- LOADER -->
    <v-main>
      <div class="loaderDecorator">
        <Loader
        @cambiomenu="cambiarMenu"
        :activarMenu="newMenu"
        :userRole="userRole"
        class="loader"
        >
        </Loader>
      </div>
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

  beforeCreate(){
    window.history.forward();
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

<style scoped>
  .loader {
    padding: 1rem;
  }

  .logoHeader {
    border: 1px solid white;
    height: 80%;
    margin-top: 8px;
  }

  .loaderDecorator {
    background-color: #EFF6FF;
    height: 93.2vh;
  }

</style>

