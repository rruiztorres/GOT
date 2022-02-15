<template>
    <div class="panelContainer">
        <div class="panelHeader">
          <h2 class="panelHeader-title">Mapa Gestor</h2>
          <v-spacer></v-spacer>
          <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
              <v-icon x-large>mdi-help-box</v-icon>
          </v-btn>
        </div>

        <!-- MAPA -->
        <div>
          <MapaGestor></MapaGestor>
        </div>
    </div>
</template>

<script> 
import MapaGestor from "@/components/gestor/MapaGestor";

    export default {
        name: 'VerMapa',
        components: {MapaGestor,},
    }
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  font-weight: 400 !important;
}

.v-application--wrap {
  min-height: 1vh !important;
}

.panelContainer {
  background-color: white;
  height: 90vh;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.panelHeader {
  display: flex;
}

.panelHeader-title {
  font-weight: 500;
  margin-bottom: 2rem;
}
</style>