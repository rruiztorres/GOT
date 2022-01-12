<template>
  <v-row>
    <v-col cols="12" md="4">

      <!-- LOG DEL JOB -->
      <v-card class="card">
        <v-card-title class="processTitle">LOG DEL JOB</v-card-title>
        <v-list three-line>
          <template v-for="item in log">
            <v-list-item :key="item.hora" :class="item.class">
              <v-list-item-avatar>
                <v-icon :title="item.procDesc" :class="item.claseProceso" dark>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-subtitle
                  v-html="`${item.fecha} - ${item.hora}`"
                ></v-list-item-subtitle>
                <v-list-item-title v-html="item.title"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="item.subtitle"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-col>

    <!-- ACCIONES DISPONIBLES -->
    <v-col cols="12" md="3">
      <!-- Las card las podemos sacar a componente?-->
      <v-card class="card">
        <v-card-title class="processTitle">ACCIONES DISPONIBLES</v-card-title>
          <div class="actionBtnGroup">
            <v-btn class="actionBtn" block color="error" @click="dummy()">Pausar Job</v-btn>
            <v-btn class="actionBtn" block color="primary" @click="dummy()">Otra cosa</v-btn>
            <v-btn class="actionBtn" block color="primary" @click="dummy()">Otra cosa</v-btn>
            <v-btn
              block
              :loading="buttonLoading"
              color="success"
              @click="buttonLoading = !buttonLoading"
            >
              <v-icon dark>mdi-robot-industrial</v-icon>
              Solicitar Versión
            </v-btn>
          </div>
      </v-card>
    </v-col>

    <!-- RESUMEN JOB -->
    <v-col cols="12" md="5">
      <!-- Las card las podemos sacar a componente?-->
      <v-card class="card">
        <v-card-title class="processTitle">
          ESTADO
          <v-spacer></v-spacer>
          <v-btn elevation="2" class="processBtn" dark text>
            GESTIONAR SOLUCIÓN</v-btn
          >
        </v-card-title>
        <div class="cardContainer">
          <v-row>
            <v-col cols="12">
              <v-card class="card cardContainer cardBgGray">
                <div>
                  <h2>Job</h2>
                </div>
                <v-data-table
                  :headers="jobHeaders"
                  :items="[job]"
                  hide-default-footer
                >
                  <template v-slot:[`item.estado`]="{ item }">
                    <v-chip :color="getColor(item.estado)" dark>
                      {{ item.estado }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-card class="card cardContainer cardBgGray">
                <div class="errorsTitle">
                  <h2>Errores</h2>
                  <v-spacer></v-spacer>
                  <v-alert dense outlined class="alertErrors" type="error">
                    El job aun tiene errores pendientes de solución
                  </v-alert>
                </div>
                <v-data-table
                  :headers="errorHeaders"
                  :items="errores"
                  hide-default-footer
                >
                  <template v-slot:[`item.estado`]="{ item }">
                    <v-chip :color="getColor(item.estado)" dark>
                      {{ item.estado }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import { getLogIcons } from "@/assets/mixins/getLogIcons";
import { getColor } from "@/assets/mixins/getColor";

export default {
  name: "Logger",

  props: ["jobsRecibidos", "erroresRecibidos", "actualizarInfo"],

  mixins: [getLogIcons, getColor],

  computed: {
    returnJob() {
      return this.jobsRecibidos;
    },

    returnErrores() {
      return this.erroresRecibidos;
    },

    returnInfo() {
      return this.actualizarInfo;
    },
  },

  created() {
    this.initialize();
    this.actualizarInfo == false;
  },

  watch: {
    jobsRecibidos() {
      this.initialize();
    },

    actualizarInfo() {
      console.log("actualizar es->", this.actualizarInfo);
      if (this.actualizarInfo == true) {
        console.log("ejecuto initialize por actualizacion info");
        this.initialize();
      }
    },

    log() {
      console.log("el log cambio");
    },
  },

  methods: {
    initialize() {
      //Reinicio de variables
      if (this.jobsRecibidos != undefined) {
        this.job = this.jobsRecibidos;
      }

      if (this.erroresRecibidos != undefined) {
        this.errores = this.erroresRecibidos;
      }

      this.log = [];

      axios
        .get(`${process.env.VUE_APP_API_ROUTE}/getLogByJob/` + this.job.job)
        .then((data) => {
          if (data.status == 201) {
            this.returnFormatLog(data.data.log);
          }
        });
    },

    returnFormatLog(log) {
      for (this.index in log) {
        this.arrayFecha = log[this.index].fecha.split("T");
        this.logNewEntry = {
          claseProceso: "green",
          class: "",
          icon: this.getLogIcons(log[this.index].codigo),
          procDesc: log[this.index].codigo,
          fecha: this.arrayFecha[0],
          hora: this.arrayFecha[1].slice(0, -1),
          title: log[this.index].evento,
          subtitle: log[this.index].descripcion,
        };
        this.log.push(this.logNewEntry);
      }
    },
  },

  data() {
    return {
      buttonLoading: false,
      log: [],

      jobHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Detectado en", value: "deteccion_job" },
        { text: "Gravedad", value: "gravedad_job" },
        { text: "Descripción", value: "descripcion" },
      ],

      errorHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Error", value: "error" },
        { text: "Descripcion", value: "descripcion" },
      ],
    };
  },
};
</script>

<style scoped>
.card {
  border: 1px solid white;
  max-height: 84vh;
  overflow-y: auto;
}

h2 {
  font-weight: 400 !important;
}

.processTitle {
  background-color: #bfdbfe;
  font-weight: 400 !important;
}

.processBtn {
  background-color: green;
  font-weight: 400 !important;
}

.actionBtnGroup {
  padding: 1rem;
}

.actionBtn {
  font-weight: 400 !important;
  margin-bottom: 0.5rem;
}

.cardContainer {
  padding: 1rem;
}

.cardBgGray {
  background-color: #eceff1;
}

.alertErrors {
  margin: 0rem 0rem 0.5rem 0rem !important;
  font-weight: 400 !important;
}

.alertContainer {
  margin-top: 0.5rem;
}

.errorsTitle {
  display: flex;
}
</style>
