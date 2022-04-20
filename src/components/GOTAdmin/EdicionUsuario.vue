<template>
  <div>
    <v-card light class="editUserContainer">
      <v-card-title class="editUserTitle">
        EDICIÓN DE USUARIO
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn class="fontControl" color="error" dark @click="closeEdicion">CANCELAR</v-btn>
          <v-btn class="fontControl" color="success" dark >ACEPTAR</v-btn>
        </v-card-actions>
      </v-card-title>
      <v-card-text>

          <v-tabs
            fixed-tabs
            background-color="#0341a6"
            dark
          >
            <v-tab class="fontControl">Datos</v-tab>
            <v-tab class="fontControl">Roles</v-tab>

            <v-tabs-slider color="#76aff5"></v-tabs-slider>

            <v-tab-item><DatosUsuario :usuario="usuario"></DatosUsuario></v-tab-item>
            <v-tab-item>Roles</v-tab-item>


          </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import DatosUsuario from "@/components/GOTAdmin/DatosUsuario";


export default {
    name: "EdicionUsuario",
    props: ["usuario"],
    components: {DatosUsuario},

    data(){
        return{
            foo: null,
        }
    },

    methods:{
        closeEdicion(){
            this.$emit("closed", false)
        }
    }
}
</script>

<style scoped>
.fontControl {
    font-weight: 400 !important;
}

.editUserContainer {
  width: 80vw;
  max-width: 900px;
  max-height: 95vh;
  overflow-y: auto;
}

.editUserTitle {
  background-color: #4287f5;
  font-weight: 400 !important;
  color: white;
  margin-bottom: 1rem;
  width: 100%;
}

h3 {
  font-weight: 400 !important;
  margin: 0rem 0rem 0.25rem 0rem;
}

</style>
