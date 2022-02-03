<template>
  <div class="panelContainer">
      <div class="panelHeader">
        <h2 class="panelHeader-title">Errores sin asignar</h2>
        <v-spacer></v-spacer>
        <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
          <v-icon x-large>mdi-help-box</v-icon>
        </v-btn>
      </div>

      <div>
         <!--PANEL ACCIONES SUPERIOR -->
        <v-card elevation="0">
          <v-row class="panelFuncionesCard">
              <v-col cols="12" md="8">
                <v-row class="buttonGroup">
                  <v-col cols="12" md="3" >
                    <v-btn 
                      class="btn"
                      :disabled="groupActions()" 
                      dark color="success"
                      @click="showMap = !showMap"
                      >
                      VER EN MAPA
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="3" >
                    <v-btn 
                      class="btn"
                      :disabled="groupActions()" 
                      dark color="error" 
                      @click="dialogJustify = true"
                      >
                      DESESTIMAR
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  class="textField"
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
        </v-card>

        <v-data-table
          class="dataTable"
          v-model="selected"
          :headers="headers"
          :items="errores"
          :search="search"
          item-key="id_error"
          group-by="via_ent"
          show-select>
          <template v-slot:top>
            <v-overlay :value="dialogDelete">
                <v-card>
                    <h1>ATENCIÓN</h1>
                    <h3>Esta acción borrará el error seleccionado ¿Desea continuar?</h3>
                    <v-card-actions>
                        <div>
                            <v-btn dark text @click="dialogDelete = false">CANCELAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn dark text>OK</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-overlay>
          </template>

          <template v-slot:no-data>
            <NoData :mensaje="noDataMensaje" :opcion="noDataOpcion"></NoData>
          </template>

          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>
        </v-data-table>

        <!-- VER EN MAPA -->
        <v-dialog
            v-if="showMap == true"
            style="heigth:100vh;"
            v-model="showMap"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
          <AsignarErrores
          :job="undefined"
          :errores="selected"
          @closeDialog="closeAsignar"
          @deleteErrores="updateTableErrors"
          ></AsignarErrores>
        </v-dialog>

        <!--MENSAJES DE INFORMACION-->
        <v-overlay :value="showMessage">
          <v-alert
            :color="messageType"
            dark
            border="top"
            icon="mdi-alert-circle-outline"
            transition="scale-transition"
          >
            {{ message }}
          </v-alert>
        </v-overlay>

        <!-- DESESTIMAR ERRORES -->
        <v-overlay :value="showJustifyWindow">
            <JustificarAccion
              title="Desestimar Errores"
              text="Indique el motivo por el cual desea desestimar el error:"
              @close="getJustification"
            >

            </JustificarAccion>
        </v-overlay>

        <v-overlay :value="dialogJustify">
          <v-card class="alertCard">
            <h1 class="alertCardTitle">ATENCIÓN</h1>
            <h4>Esta acción desestimará los errores seleccionados</h4>
            <h4>La desestimación es permanente y <b>no puede deshacerse</b></h4>
            <br/>
            <h3><b>¿Desea continuar?</b></h3>
            <v-card-actions>
              <div class="alertButtonGroup">
                <v-btn
                  class="alertButton errorBtn"
                  dark
                  text
                  @click="dialogJustify = false"
                  >CANCELAR</v-btn
                >
                <v-btn
                  class="alertButton generateBtn"
                  dark
                  text
                  @click="justifyDesestimate"
                  >OK</v-btn
                >
              </div>
            </v-card-actions>
          </v-card>
        </v-overlay>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import { generarJobError } from '@/assets/mixins/generarJobError';
import { desestimarErrores } from '@/assets/mixins/desestimarErrores';

import NoData from "@/components/common/NoData";
import AsignarErrores from "@/components/common/AsignarErrores";
import JustificarAccion from "@/components/common/JustificarAccion";


export default {
  name: "ErroresNoAsign",
  mixins: [getColor, generarJobError, desestimarErrores],
  components: { NoData, AsignarErrores, JustificarAccion },

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

    //MAP
    showMap: false,

    //NO DATA SLOT
    noDataMensaje: 'En estos momentos no existen Errores sin asignar',
    noDataOpcion: 'Puedes encontrar nuevos errores haciendo una revisión visual en Alta de Jobs / Errores',

    //DESESTIMAR ERRORES
    showJustifyWindow: false,
    dialogJustify: false,
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
    justifyDesestimate(){
      this.dialogJustify = false;
      this.showJustifyWindow = true;
    },

    getJustification(data){
      if (data != ''){
        this.justificacion = data;
        this.ejecucion = this.desestimarErrores(this.selected, this.justificacion)
        if (this.ejecucion === 0){
          for (this.index in this.errores){
            for (this.indexSelect in this.selected){
              if (this.errores[this.index].id_error === this.selected[this.indexSelect].id_error){
                this.errores.splice(this.index, 1)
              }
            }
          }
          this.showJustifyWindow = false;
          this.selected = [];
          this.showInfo('Los errores seleccionados se han desestimado correctamente', 'success')
          setTimeout(this.closeInfo(), 2000);
        }
      } else{
        this.showJustifyWindow = false;
      }
    },

    updateTableErrors(data){     
      for(this.index in this.errores){
        for(this.indexData in data){
          if(this.errores[this.index].id_error == data[this.indexData].id_error){
            this.errores.splice(this.index,1)
          }
        }
      }
    },

    closeAsignar(data){
      if (data == true){
        this.showMap = false;
        this.selected = [];
      }
    },

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

  .panelContainer {
    background-color:white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
  }

  .panelHeader {
    display: flex;
  }

  .panelHeader-title{
    font-weight: 500;
    margin-bottom: 2rem;
  }

  .panelFuncionesCard {
    background-color: #4287f5;
  }

  .dataTable {
    margin-top: 1rem;
  }

  .buttonGroup {
    padding: 0.5rem;
  }

  .btn {
      width: 100%;
      font-weight: 400;
  }

  .textField {
    background-color: white;
    padding: 0.5rem;
  }

  .deleteButton {
    background-color: #ef4444; 
  }
</style>
