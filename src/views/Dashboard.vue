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
import {getDefaultPanel} from "@/assets/mixins/getDefaultPanel";

export default {
  name: "Dashboard",
  mixins: [getDefaultPanel],
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
    //Asigna el panel que debe activarse por defecto. El panel por defecto se configura en la funcion getDefaultPanel
    //TODO: Parametro configurable en panel admin
    initialize() {
      this.userRole = localStorage.rol;
      this.newMenu = this.getDefaultPanel(localStorage.rol)
    },

    cambiarMenu(data) {
      this.newMenu = data;
    },
  },

  data() {
    let newMenu = this.newMenu;

    return {
        drawer:null,
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

