<template>
  <div>
    <v-app class="font-sans shadow-md rounded px-8 mr-8">
        <div class="flex">
        <h1 class="text-xl font-bold py-4 mt-2 flex-grow">Errores sin asignar</h1>
        <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1" class="m-auto">
          <v-icon x-large>mdi-help-box</v-icon>
        </v-btn>
      </div>

      <div class="overflow-y-auto">
        <v-card elevation="0" class="mb-4">
          <div>
            <div class="p-3 flex bg-blue-500 w-full items-center">
              <v-btn dark color="info" class="mr-3">VER EN MAPA</v-btn>
              <v-btn :disabled="groupActions()" dark color="error" class="mr-3">BORRAR</v-btn>
              <v-spacer></v-spacer>

              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                class="bg-white p-2"
              ></v-text-field>
            </div>
          </div>
        </v-card>

        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="errores"
          :search="search"
          class="font-sans"
          item-key="id_error"
          show-select>
          <template v-slot:top>
            <v-overlay :value="dialogDelete">
                <v-card class="p-3 w-80">
                    <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                    <h3 class="text-center text-l">Esta acción borrará el error seleccionado ¿Desea continuar?</h3>
                    <v-card-actions>
                        <div class="mt-6 flex">
                            <v-btn class="w-24 bg-red-500" dark text @click="dialogDelete = false">CANCELAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn class="w-24 bg-green-500" dark text>OK</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-overlay>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn title="Editar Job" icon dark class="bg-red-500 mr-1">
              <v-icon @click="deleteItem(item)"> mdi-trash-can </v-icon>
            </v-btn>
          </template>

          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>
        </v-data-table>

        <!--MENSAJES DE INFORMACION-->
        <v-overlay :value="showMessage">
          <v-alert
            class="mx-7"
            :color="messageType"
            dark
            border="top"
            icon="mdi-alert-circle-outline"
            transition="scale-transition"
          >
            {{ message }}
          </v-alert>
        </v-overlay>

      </div>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJobError } from '@/assets/mixins/generarJobError';


export default {
  name: "ErroresNoAsign",
  mixins: [getColor, generarJobError],

  data: () => ({
    dialog: false,
    dialogDelete: false,
    selected: [],
    search: "",
    headers: [
        { text: "Estado", align: "start", sortable: true, value: "estado"},
        { text: "Tema", align: "start", sortable: true, value: "tema_error"},
        { text: "Tipo", align: "start", sortable: true, value: "tipo_error"},
        { text: "Descripción", align: "start", sortable: true, value: "descripcion"},
        { text: "Via de Entrada", align: "start", sortable: true, value: "via_ent"},
        { text: "Fecha de inserción", align: "start", sortable: true, value: ""},
        { text: "Acciones", value: "actions", sortable: false },
    ],
    errores: [],
    editedIndex: -1,
    editedItem: {
      estado: "",
      job: "",
      expediente: "",
      gravedad_job: "",
      deteccion_job: "",
      arreglo_job: "",
      resumen:"",
    },
    defaultItem: {
      estado: "",
      job: "",
      expediente: "",
      gravedad_job: "",
      deteccion_job: "",
      arreglo_job: "",
      resumen:"",
    },

    showMessage: false,
    message: '',
    messageType: '',
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },

  methods: {

    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },


    groupActions(){
      if (this.selected == 0){
        return true
      } else {
        return false
      }
    },

    updateData(data){
      if (data == true) {
        this.initialize();
      }
    },

    initialize() {
      //Reinicia los datos de los errores
      this.errores = [];
      this.estado = 'Marcado'
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/erroresEstado/` + this.estado)  
        .then((data) => {
          this.erroresBruto = data.data.errores;
          for (this.elemento in this.erroresBruto) {
            //se realiza el filtro para los errores marcados sin job asignado
              if(this.erroresBruto[this.elemento].error == null){
                this.errores.push(this.erroresBruto[this.elemento]);
              }
          }
        })
        .catch((data) => {
          console.log(data)
        })
    },

    editItem(item) {
      this.editedIndex = this.errores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.errores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.errores.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    dialogClose() {
      this.dialog = false;
      this.initialize();
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.errores[this.editedIndex], this.editedItem);
      } else {
        this.errores.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>

<style>
.v-application--wrap {
  min-height: 1vh !important;
}
</style>
