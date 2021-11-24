<template>
  <v-app class="font-sans shadow-md rounded px-8 mr-8">
    <h1 class="text-xl font-bold py-4 mt-2">
      Alta de Expediente
    </h1>

    <template>
      <v-card class="p-4 mb-8 mt-4" style="height:43rem;">
        <v-row>
          <v-col cols="4">
            <v-row align="center" class="ml-1 p-3">
              <!--TODO:Evitar que crezca-->
              <v-text-field
                v-model="nExp"
                class="mt-12"
                filled
                label="Número de expediente"
                outlined
                :rules="[rules.required, rules.counter]"
              ></v-text-field>
            </v-row>

            <v-subheader>Fecha</v-subheader>
            <v-row align="center" class="ml-1 p-3">
              <v-date-picker
                locale="es-ES"
                full-width
                v-model="date1"
                :show-current="true"
              ></v-date-picker>
            </v-row>
          </v-col>
          <v-col cols="8">
            <v-subheader>Observaciones</v-subheader>
            <div
              class="ml-4 p-3 border border-gray-200 shadow bg-gray-100"
              style="height:32rem;"
            >
              <TextEditor @editor="storeObservationsExp"></TextEditor>
            </div>
          </v-col>
        </v-row>
          <v-card-actions class="mt-8">
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="closeExpediente">CANCELAR</v-btn>
            <v-btn color="success" dark @click="saveExpediente">ACEPTAR</v-btn>
          </v-card-actions>
      </v-card>
    </template>

    <!--MENSAJES ALERTA FLOTANTES -->
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

  </v-app>
</template>

<script>
import TextEditor from "@/components/common/TextEditor";
import axios from 'axios';

export default {
  components: {
    TextEditor,
  },

  mounted(){
    this.initializeParameters();
    this.retrieveExpFromBD();
  },

  methods:{
    initializeParameters(){
      this.nExp = '';
      this.storeObservationsExp('');
    },

    closeExpediente(){
      this.$emit('closed', 'JobsTriajeGJ');
    },

    storeObservationsExp(data){
      this.observaciones = data;
    },

    retrieveExpFromBD(){
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/expedientes`)
      .then((data) => {
        this.expedientesBD = data.data.respuesta;
      })
    },

    checkData(datos){
      if (datos.date1 == '' || datos.numExp == '' || datos.observaciones == ''){
        this.throwMessage('red','error','No pueden existir campos vacios, revise los datos', true)
      } else {
        // comprobamos que expediente no existe ya en BD
        this.compruebaExp = 'ok';
        for (this.index in this.expedientesBD){
          if (this.expedientesBD[this.index].expediente == datos.numExp){
            this.throwMessage('red','error','El número de expediente ya existe', true)
            this.compruebaExp = 'error'
          }
        }
      }
      return this.compruebaExp;
    },

    saveExpediente(){
      let newExp = {
        numExp: this.nExp,
        fecha: this.date1,
        observaciones: this.observaciones,
        finalizado: false
      }
      const datosCorrectos = this.checkData(newExp);
      if (datosCorrectos == 'ok'){
        
        axios
          .post(`${process.env.VUE_APP_API_ROUTE}/expediente`, newExp)
          .then((data) => {
              if (data.status == 201){
                this.throwMessage('green', 'success', `Expediente ${this.nExp} creado correctamente`, false)
                setTimeout(this.closeInfoMessage,1500);
                this.initializeParameters();
              }
          })
        }
    },
    
    throwMessage(color, tipo, mensaje, aceptar){
        this.mensajeFlotante.visibilidad = true;
        this.mensajeFlotante.color = color;                 //colores: red, green, orange, yellow, purple
        this.mensajeFlotante.type = tipo;                   //type: success, info, warning, error
        this.mensajeFlotante.mensaje = mensaje;
        this.mensajeFlotante.aceptar = aceptar;             //Muestra el boton de "entendido"
    },

    closeInfoMessage(){
        this.mensajeFlotante.visibilidad = false;
    },
  },

  data() {
    return {
      date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      
      observaciones: '',
      nExp:'',
      expedientesBD:[],

      visibilidadMensajeInfo: true,
      mensajeFlotante:  {
          visibilidad: false,
          color: "green",             
          type: "success",            
          mensaje: "introduzca texto",
          aceptar: true,  
      },

      //REGLAS NUMERO EXPEDIENTE 	2021_00000001
      rules: {
        required: value => !!value || 'Este campo es obligatorio.',
        counter: value => value.length == 13 || 'El formato debe ser AAAA_00000000',
      },
    };
  },
};
</script>
