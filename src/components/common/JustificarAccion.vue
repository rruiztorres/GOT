<template>
  <v-card light class="returnJobWindow">
    <v-card-title class="returnJobWindowTitle" dark
      >{{ title }}
      <v-spacer></v-spacer>
    </v-card-title>
    <div class="returnJobWindowWrapper">
      <v-card-text>{{ text }}</v-card-text>
      <v-textarea
        class="textAreaJob"
        filled
        auto-grow
        :rules="[rules.required, rules.counter]"
        counter
        v-model="justificacion"
      ></v-textarea>
    </div>
    <v-card-actions class="returnJobWindowActions">
      <v-spacer></v-spacer>
      <v-btn class="button" color="error" @click="closeWithoutSave()">
        CANCELAR
      </v-btn>
      <v-btn
        class="button"
        :disabled="justificacion == '' || justificacion.length >= 100"
        color="success"
        @click="closeAndSave()"
      >
        ACEPTAR
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "JustificarAccion",
  props: ["title", "text"],
  data() {
    return {
      rules: {
        required: (value) => !!value || "Este campo es obligatorio.",
        counter: (value) => value.length <= 100 || "Máximo 100 caracteres",
      },
      justificacion: "",
    };
  },
  methods: {
    closeWithoutSave() {
      this.justificacion = "";
      this.$emit("close", this.justificacion);
    },

    closeAndSave() {
      this.$emit("close", this.justificacion);
    },
  },
};
</script>

<style scoped>
.returnJobWindow {
  margin: auto 1rem;
  width: 90vw;
  max-width: 30rem;
}

.returnJobWindowTitle {
  background-color: #039be5;
  color: white;
  font-weight: 400 !important;
}

.returnJobWindowWrapper {
  padding: 0.5rem;
}

.returnJobWindowActions {
  background-color: #cfd8dc;
}
</style>
