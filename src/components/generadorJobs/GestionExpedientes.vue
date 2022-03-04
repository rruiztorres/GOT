<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Gestión de Expedientes</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <div>
      <!--PANEL ACCIONES SUPERIOR -->
      <v-card elevation="0">
        <v-row class="panelFuncionesCard">
          <v-col cols="12" md="6">
            <v-row class="buttonGroup">
              <v-col cols="12" md="4">
                <v-btn
                  class="btn"
                  :disabled="selected.length != 0"
                  dark
                  color="success"
                  @click="showWindowNewExp = !showWindowNewExp"
                >
                  <v-icon>
                    mdi-plus
                  </v-icon>

                  NUEVO EXP.
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  class="btn"
                  :disabled="checkAction('Cerrar')"
                  dark
                  color="error"
                  @click="stateFinalizarExp(true)"
                >
                  CERRAR
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  class="btn"
                  :disabled="checkAction('Abrir')"
                  dark
                  color="success"
                  @click="stateFinalizarExp(false)"
                >
                  VOLVER A ABRIR
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
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
        :items="expedientes"
        item-key="expediente"
        :search="search"
        show-select
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn title="editar" icon dark class="editButton" :disabled="item.finalizado === true"
            ><v-icon @click="dummy(item)"> mdi-lead-pencil </v-icon></v-btn
          >
          <v-btn title="ver estado" icon dark class="infoButton" :disabled="item.finalizado === true"
            ><v-icon @click="showStateExp(item)"> mdi-chart-areaspline </v-icon></v-btn
          >
        </template>

        <template v-slot:no-data>
          <NoData :mensaje="noDataMensaje" :opcion="noDataOpcion"></NoData>
        </template>

        <template v-slot:[`item.finalizado`]="{ item }">
          <v-chip :color="getColor(formatFinalizado(item.finalizado))" dark>
            {{formatFinalizado(item.finalizado)}}
          </v-chip>
        </template>
      </v-data-table>
    </div>

    <!--VENTANA NUEVO EXPEDIENTE-->
    <v-overlay :value="showWindowNewExp">
      <NuevoExpediente
        @closed="closeWindowExp"
        @updateExp="updateStoredExp"
      ></NuevoExpediente>
    </v-overlay>

    <!--VENTANA ESTADO EXPEDIENTE-->
    <v-dialog fullscreen :value="showStateExpWindow">
      <EstadoExpediente
      v-if="showStateExpWindow === true"
      :expediente="mostrarEstadoExp"
      @close="closeEstadoExp"
      >
      </EstadoExpediente>
    </v-dialog>

    <!-- MENSAJES DE ALERTA FLOTANTES -->
    <template>
      <v-dialog v-model="mensajeFlotante.visibilidad" max-width="49rem">
        <v-alert
          class="floatMsg" 
          :color="mensajeFlotante.color"
          :type="mensajeFlotante.type"
          prominent
        >
          <v-row no-gutters>
            <v-col cols="9">
              {{ mensajeFlotante.mensaje }}
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="mensajeFlotante.aceptar == true"
                @click="closeInfoMessage()"
                >ENTENDIDO</v-btn
              >
            </v-col>
          </v-row>
        </v-alert>
      </v-dialog>
    </template>

    
  </div>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor.js";
import NuevoExpediente from "@/components/generadorJobs/NuevoExpediente";
import EstadoExpediente from "@/components/generadorJobs/EstadoExpediente";
import NoData from "@/components/common/NoData";

export default {
  name: "GestionExpedientes",
  mixins: [getColor],
  components: { NuevoExpediente, NoData, EstadoExpediente },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    singleSelect: false,
    selected: [],
    search: "",
    headers: [
      {
        text: "Estado",
        align: "start",
        sortable: true,
        value: "finalizado",
      },
      {
        text: "Expediente",
        align: "start",
        sortable: true,
        value: "expediente",
      },
      {
        text: "Fecha Inicio",
        align: "start",
        sortable: true,
        value: "fecha",
      },
      {
        text: "Fecha Fin",
        align: "start",
        sortable: true,
        value: "",
      },
      {
        text: "Observaciones",
        align: "start",
        sortable: true,
        value: "textoPlano",
      },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    expedientes: [],
    editedIndex: -1,
    editedItem: {
      finalizado: "",
      expediente: "",
      fecha: "",
      textoPlano: "",
    },

    //NUEVO EXPEDIENTE
    showWindowNewExp: false,

    //ESTADO EXPEDIENTE
    showStateExpWindow: false,
    mostrarEstadoExp: undefined,

    //MENSAJES FLOTANTES
    mensajeFlotante: {
      visibilidad: false,
      color: "green",
      type: "success",
      mensaje: "introduzca texto",
      aceptar: true,
    },

    //NO DATA
    noDataMensaje: 'Parece que aun no tienes expedientes creados',
    noDataOpcion: 'Si deseas crear un nuevo expediente haz clic en el botón verde "NUEVO EXP." ',
  }),

  created() {
    this.initialize();
  },

  methods: {

    closeEstadoExp(data){
      this.showStateExpWindow = data
    },

    showStateExp(expediente){
      this.mostrarEstadoExp = expediente;
      this.showStateExpWindow = true;
    },

    checkAction(isopen){
      //COMPROBAR ACCION (abrir / cerrar)
      if (isopen === 'Abrir'){
        this.accion = false
      } else {
        this.accion = true
      }
      
      if(this.selected.length > 0){
        this.check = false;
        for (this.index in this.selected){
          if (this.selected[this.index].finalizado == this.accion){
            this.check = true
          }
        }
        return this.check;
      } else {
        return true
      }
    },


    formatFinalizado(estado){
      if(estado === false){
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    },

    closeInfoMessage() {
      this.mensajeFlotante.visibilidad = false;
    },

    throwMessage(color, tipo, mensaje, aceptar) {
      this.mensajeFlotante.visibilidad = true;
      this.mensajeFlotante.color = color; //colores: red, green, orange, yellow, purple
      this.mensajeFlotante.type = tipo; //type: success, info, warning, error
      this.mensajeFlotante.mensaje = mensaje;
      this.mensajeFlotante.aceptar = aceptar; //Muestra el boton de "entendido"
    },

    stateFinalizarExp(isopen) {
      let proceso = 0;
      let estado = isopen;
      for (this.index in this.selected) {
        this.selected[this.index].finalizado = estado;
        axios
          .put(`${process.env.VUE_APP_API_ROUTE}/updateExpediente`, this.selected[this.index])
          .then((data) => {
            if (data.status != 201) {
              proceso = 1;
            }
          });
      }
      if (proceso == 0) {
        this.selected = [];
        this.throwMessage("green", "success", "Expedientes actualizados con éxito", false);
        setTimeout(this.closeInfoMessage, 1500);
      } else {
        this.throwMessage("red", "error", "Error inesperado. Revise los datos", true);
      }
    },

    updateStoredExp(update) {
      if (update == true) {
        this.initialize();
      }
    },

    closeWindowExp(closed) {
      if (closed == true) {
        this.showWindowNewExp = false;
      }
    },

    initialize() {
      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/expedientes`)
        //se realiza el filtro para los jobs en triaje y la asignación del job_id
        .then((data) => {
          this.expedientes = data.data.respuesta;
          for (this.index in this.expedientes) {
            //Devuelve texto plano desde html para la tabla
            this.texto = this.expedientes[this.index].observaciones;
            this.texto = this.texto.replace(/<[^>]*>/g, "");
            this.expedientes[this.index].textoPlano = this.texto;

            //Devuelve fecha en formato YYYY-MM-DD
            this.fecha = this.expedientes[this.index].fecha;
            this.fechaCortada = this.fecha.slice(0, 10);
            this.expedientes[this.index].fecha = this.fechaCortada;
          }
        });
    },
  },
};
</script>

<style>
.v-application--wrap {
  min-height: 1vh !important;
}

.panelContainer {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.2);
}

.panelHeader {
  display: flex;
}

.panelHeader-title {
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

.infoButton {
  background-color: #EF6C00;
}

.floatMsg{
  margin-bottom: 0rem;
}

</style>
