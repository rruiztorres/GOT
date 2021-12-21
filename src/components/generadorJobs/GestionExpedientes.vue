<template>
  <div style="width:98%;" class="m-auto rounded-md bg-white p-4 shadow-md">
    <h1 class="text-xl font-bold py-4 mt-2">
      Gestión de Expedientes
    </h1>

    <div class="overflow-y-auto" style="height:88vh;">
      <!--PANEL ACCIONES SUPERIOR -->
      <v-card elevation="0" class="mb-4">
        <v-row class="m-0 bg-blue-500 items-center">
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="4">
                <v-btn
                  class="w-full"
                  :disabled="selected.length != 0"
                  dark
                  color="success"
                  @click="showWindowNewExp = !showWindowNewExp"
                >
                  <v-icon class="mr-1">
                    mdi-plus
                  </v-icon>

                  NUEVO EXP.
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  class="w-full"
                  :disabled="selected.length == 0"
                  dark
                  color="success"
                  @click="closeExpediente()"
                >
                  FINALIZAR
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  class="w-full"
                  :disabled="selected.length == 0"
                  dark
                  color="warning"
                  @click="deleteExpediente()"
                >
                  VOLVER A ABRIR
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              class="bg-white p-2"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="expedientes"
        item-key="expediente"
        :search="search"
        class="font-sans"
        show-select
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn title="editar" icon dark class="bg-blue-500 mr-1"
            ><v-icon @click="dummy(item)"> mdi-lead-pencil </v-icon></v-btn
          >
          <v-btn title="ver estado" icon dark class="bg-green-500"
            ><v-icon @click="dummy(item)"> mdi-chart-areaspline </v-icon></v-btn
          >
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>

        <template v-slot:[`item.finalizado`]="{ item }">
          <v-chip :color="getColor(item.finalizado)" dark>
            {{ item.finalizado }}
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

    <!-- MENSAJES DE ALERTA FLOTANTES -->
    <template>
        <v-dialog v-model="mensajeFlotante.visibilidad" max-width="49rem">
            <v-alert
            :color="mensajeFlotante.color"
            :type="mensajeFlotante.type"
            prominent
            class="mb-0"
            >
            <v-row no-gutters>
                <v-col cols="9" class="m-auto pl-2">
                    {{mensajeFlotante.mensaje}}
                </v-col>
                <v-col cols="3">
                    <v-btn v-if="mensajeFlotante.aceptar == true" @click="closeInfoMessage()">ENTENDIDO</v-btn>
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

export default {
  name: "GestionExpedientes",
  mixins: [getColor],
  components: { NuevoExpediente },

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

    //MENSAJES FLOTANTES
    mensajeFlotante:  {
        visibilidad: false,
        color: "green",             
        type: "success",            
        mensaje: "introduzca texto",
        aceptar: true,  
    },
  }),

  created() {
    this.initialize();
  },

  methods: {
    closeInfoMessage(){
        this.mensajeFlotante.visibilidad = false;
    },

    throwMessage(color, tipo, mensaje, aceptar){
        this.mensajeFlotante.visibilidad = true;
        this.mensajeFlotante.color = color;                 //colores: red, green, orange, yellow, purple
        this.mensajeFlotante.type = tipo;                   //type: success, info, warning, error
        this.mensajeFlotante.mensaje = mensaje;
        this.mensajeFlotante.aceptar = aceptar;             //Muestra el boton de "entendido"
    },

    closeExpediente(){
      let proceso = 0;

      for (this.index in this.selected){
        //TODO: Formateo de datos no necesario cuando actualicemos tabla
        this.selected[this.index].finalizado = true;
        this.selected[this.index].fechaInicio = this.selected[this.index].fecha;
       
        axios
        .put(`${process.env.VUE_APP_API_ROUTE}/updateExpediente`, this.selected[this.index])
        .then((data) =>{
          if (data.status != 201){
            proceso = 1
          }
        })
      } 
      //Comprobar ejecución
      if (proceso == 0){
        this.selected[this.index].finalizado = 'Cerrado'
        this.throwMessage("green", "success", "Expedientes actualizados con éxito", false)
        setTimeout(this.closeInfoMessage, 1500)
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

            //Devuelve estado en formato Abierto / Cerrado para la tabla
            if (this.expedientes[this.index].finalizado == true) {
              this.expedientes[this.index].finalizado = "Cerrado";
            } else {
              this.expedientes[this.index].finalizado = "Abierto";
            }
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
</style>
