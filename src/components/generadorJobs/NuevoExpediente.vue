<template>
  <div>
    <v-card light class="newExpContainer">
      <v-card-title class="newExpTitle">
        {{tituloVentana}}
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn class="newExpBtn" color="error" dark @click="closeExpediente"
            >CANCELAR</v-btn
          >
          <v-btn 
          :disabled="returnObservacionesLength() > 255"
          class="newExpBtn" 
          color="success" 
          dark 
          @click="saveExpediente"
            >ACEPTAR</v-btn
          >
        </v-card-actions>
      </v-card-title>
      <v-card-text>
        <!--NUMERO EXPEDIENTE -->
        <v-row>
          <v-col cols="12">
            <h3 title="obligatorio">Número de Expediente <b>*</b></h3>
            <v-text-field
            :disabled="bloqNexp"
              v-model="nExp"
              filled
              :rules="[rules.required, rules.formNumExp]"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- OBSERVACIONES -->
        <v-row class="observaciones">
          <v-col cols="12">
            <h3 title="obligatorio">Observaciones <b>*</b></h3>
            <div>
              <TextEditor 
                :getObservaciones="observaciones"
                :edit="edit"
                @editor="storeObservationsExp"
              >
              </TextEditor>
            </div>
            <div class="obsLengthContainer">
              <h5 v-if="returnObservacionesLength()<=255" class="obsLengthOK">{{returnObservacionesLength()}}</h5>
              <h5 v-else class="obsLengthERR">{{returnObservacionesLength()}}</h5>
            </div>
          </v-col>
        </v-row>

        <!-- CALENDARIOS -->
        <v-row class="dateWrapper">
          <v-col cols="12" md="6" class="boxDateStart">
            <span class="dateSelectorContainer">
              <h3 class="dateSelected" title="obligatorio">
                Fecha Incio <b>*</b>
              </h3>
              <v-chip color="success">
                <b>{{ fechaInicio }}</b>
              </v-chip>
            </span>
            <v-row>
              <v-col cols="12">
                <v-date-picker
                  no-title
                  locale="es-ES"
                  :first-day-of-week="1"
                  :show-current="false"
                  class="widthCal"
                  color="green"
                  v-model="fechaInicio"
                ></v-date-picker>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="boxDateEnd">
            <span class="dateSelectorContainer">
              <h3 class="dateSelected">Fecha Fin</h3>
              <v-chip color="error" v-if="fechaFin != ''">
                <v-icon
                  title="Borrar fecha fin"
                  color="white"
                  @click="fechaFin = ''"
                  >mdi-close
                </v-icon>
                <b class="fechaFinText">{{ fechaFin }}</b>
              </v-chip>
            </span>
            <v-date-picker
              no-title
              locale="es-ES"
              :first-day-of-week="1"
              :show-current="false"
              class="widthCal"
              color="red"
              v-model="fechaFin"
            ></v-date-picker>
          </v-col>
        </v-row>
        <p class="oblText">
          Los campos marcados con <b>(*)</b> son obligatorios
        </p>
      </v-card-text>
    </v-card>

    <!--MENSAJES ALERTA FLOTANTES -->
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
import TextEditor from "@/components/common/TextEditor";

export default {
  name: "NuevoExpediente",
  components: { TextEditor },
  props: ['edit', 'editarExpediente', 'tituloVentana'],

  mounted() {
    this.initializeParameters();
    this.retrieveExpFromBD();
    
  },

  methods: {
    initializeParameters() {
      if(this.edit !== true){
        this.storeObservationsExp("");
      } else {
        //MODO EDICION
        this.nExp = this.editarExpediente.expediente;
        this.bloqNexp = true;
        this.fechaInicio = this.editarExpediente.fecha;
        this.observaciones = this.editarExpediente.textoPlano;
        this.finalizado = false;
      }
    },

    returnObservacionesLength(){
      let longitudCadena = this.observaciones.replace(/<[^>]*>/g, '')
      longitudCadena = longitudCadena.length;
      return longitudCadena;
    },

    closeExpediente() {
      this.$emit("closed", true);
    },

    storeObservationsExp(data) {
      this.observaciones = data;
    },

    retrieveExpFromBD() {
      axios.get(`${process.env.VUE_APP_API_ROUTE}/expedientes`).then((data) => {
        this.expedientesBD = data.data.respuesta;
      });
    },

    checkData(datos) {
      if (
        datos.fechaInicio == "" ||
        datos.numExp == "" ||
        datos.observaciones == ""
      ) {
        this.throwMessage("red", "error", "Los campos Número Expediente, Observaciones y Fecha Inicio son obligatorios", true);
      } else {
        if(this.edit === false){
          // comprobamos que expediente no existe ya en BD
          this.compruebaExp = "ok";
          for (this.index in this.expedientesBD) {
            if (this.expedientesBD[this.index].expediente == datos.numExp) {
              this.throwMessage("red", "error", "El número de expediente ya existe", true);
              this.compruebaExp = "error";
            }
          }
        } else {
          this.compruebaExp = "ok";
        }
      }
      return this.compruebaExp;
    },

    saveExpediente() {
      let newExp = {
            expediente: this.nExp,
            fecha: this.fechaInicio,
            fechaFin: this.fechaFin,
            observaciones: this.observaciones,
            finalizado: false,
          };
      const datosCorrectos = this.checkData(newExp);
      this.proceso = 0;

      if(this.edit !== true){
        //CREACION DE EXPEDIENTE
        if (datosCorrectos == "ok") {
          axios
            .post(`${process.env.VUE_APP_API_ROUTE}/expediente`, newExp)
            .then((data) => {
              if (data.status === 201) {this.initializeParameters();} 
              else { this.proceso = 1; }
            });
        }
      } else {
        //EDICIÓN EXPEDIENTE
          if (datosCorrectos == "ok") {
            axios
            .put(`${process.env.VUE_APP_API_ROUTE}/updateExpediente`, newExp)
            .then((data)=> {
              if (data.status === 203){this.proceso = 1;}
            })     
          }
        }
      
      if(this.proceso === 0){
        this.throwMessage("green", "success", `Datos guardados correctamente`, false);
        this.$emit("updateExp", true);
      } else {
        this.throwMessage("red", "error", `Error inesperado, por favor, revise los datos`, false);
      }
      setTimeout(this.closeInfoMessage, 1500)
    },

    throwMessage(color, tipo, mensaje, aceptar) {
      this.mensajeFlotante.visibilidad = true;
      this.mensajeFlotante.color = color; //colores: red, green, orange, yellow, purple
      this.mensajeFlotante.type = tipo; //type: success, info, warning, error
      this.mensajeFlotante.mensaje = mensaje;
      this.mensajeFlotante.aceptar = aceptar; //Muestra el boton de "entendido"
    },

    closeInfoMessage() {
      this.mensajeFlotante.visibilidad = false;
      this.closeExpediente();
    },
  },

  data() {
    return {
      fechaInicio: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

      fechaFin: "",

      observaciones: "",
      nExp: "",
      bloqNexp: false,
      expedientesBD: [],

      visibilidadMensajeInfo: true,
      mensajeFlotante: {
        visibilidad: false,
        color: "green",
        type: "success",
        mensaje: "introduzca texto",
        aceptar: true,
      },

      modal: false,

      rules: {
        required: (value) => !!value || "Este campo es obligatorio.",
        formNumExp: (value) =>
          value.length == 13 && value != "" || "El formato debe ser AAAA_00000000",
      },
    };
  },
};
</script>

<style scoped>
.newExpContainer {
  width: 80vw;
  max-width: 735px;
  max-height: 95vh;
  overflow-y: auto;
}

.newExpTitle {
  background-color: #4287f5;
  font-weight: 400 !important;
  color: white;
  margin-bottom: 1rem;
  width: 100%;
}

.newExpBtn {
  font-weight: 400 !important;
}

h3 {
  font-weight: 400 !important;
  margin: 0rem 0rem 0.25rem 0rem;
}

.dateSelected {
  margin-right: 1rem;
  display: inline;
}

.dateSelectorContainer {
  display: block;
  margin-bottom: 0.5rem !important;
  height: 2rem;
}

.fechaFinText {
  margin-left: 0.35rem;
}

.boxDateStart {
  background-color: #c8e6c9 !important;
  border: 1px solid white;
  border-radius: 4px;
}

.boxDateEnd {
  background-color: #ffcdd2 !important;
  border: 1px solid white;
  border-radius: 4px;
}

.dateWrapper {
  padding: 0.65rem;
}

.observaciones {
  margin-top: -28px;
}

.oblText {
  margin-top: 1rem;
}

.obsLengthOK {
  display: block;
  text-align: right;
  font-weight: 400 !important;
  margin-right: 0.5rem;
}

.obsLengthERR {
  display: block;
  text-align: right;
  font-weight: 400 !important;
  margin-right: 0.5rem;
  color:red;
}

.widthCal {
  width: 100vh;
}

</style>
