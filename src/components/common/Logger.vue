<template>
  <v-row>
    <v-col cols="12" md="4">
      <!-- LOG DEL JOB -->
      <v-card class="card">
        <v-card-title class="processTitle">LOG DEL JOB</v-card-title>
        <v-list three-line>
          <template v-for="item in log">
            <v-list-item :key="item.id_log" :class="item.class">
              <v-list-item-avatar>
                <v-icon :title="item.procDesc" :class="item.claseProceso" dark>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-subtitle
                  v-html="`${item.fecha}`"
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
      <v-card class="card">
        <v-card-title class="processTitle">ACCIONES DISPONIBLES</v-card-title>
        <div v-if="cargarAccion == true">
          <AccionesDisponibles
            :job="jobsRecibidos"
            :errores="erroresRecibidos"
            @updateLog="updateLog"
          ></AccionesDisponibles>
        </div>
      </v-card>
    </v-col>

    <!-- RESUMEN JOB -->
    <v-col cols="12" md="5">
      <!-- Las card las podemos sacar a componente?-->
      <v-card class="card">
        <v-card-title class="processTitle">ESTADO</v-card-title>
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
                <div class="cardTitleWrapper">
                    <h2 class="cardTitle">Errores</h2>
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

                  <template v-slot:no-data>
                    Este job no contiene errores asociados
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
import { getLogIconColors } from "@/assets/mixins/getLogIconColors";
import { getColor } from "@/assets/mixins/getColor";
import AccionesDisponibles from "@/components/common/AccionesDisponibles";

export default {
  name: "Logger",

  props: ["jobsRecibidos", "erroresRecibidos", "actualizarInfo"],
  mixins: [getLogIcons, getColor, getLogIconColors],
  components: { AccionesDisponibles },

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
      if (this.actualizarInfo == true) {
        this.initialize();
      }
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

    closeGestionarWindow(data){
      if (data === true){
        this.showGestionarWindow = false
      }
    },

    updateLog(data) {
      if (data.ejecucion === true) {
        this.initialize();
        //update job
        axios
          .get(
            `${process.env.VUE_APP_API_ROUTE}/getJobById/` +
              this.jobsRecibidos.job
          )
          .then((data) => {
            this.job = data.data.job;
          });

        //update errores
        if (this.errores != []) {
          axios
            .get(
              `${process.env.VUE_APP_API_ROUTE}/error/` + this.jobsRecibidos.job
            )
            .then((data) => {
              this.errores = data.data.errores;
            });
        }

        //update ver job
        this.$emit("updateJobErrores", {
          job: this.job,
          errores: this.errores,
        });
      }
    },

    returnFormatLog(log) {
      for (this.index in log) {
        this.formatDate = log[this.index].fecha.split(" ");
        this.date = this.formatDate[2] + 
        " / " + this.formatDate[1] + 
        " / " + this.formatDate[3] + 
        " - " + this.formatDate[4];

        this.logNewEntry = {
          id: log[this.index].id_log,
          claseProceso: this.getLogIconColors(log[this.index].codigo),
          class: "",
          icon: this.getLogIcons(log[this.index].codigo),
          procDesc: log[this.index].codigo,
          fecha: this.date,
          title: log[this.index].evento,
          subtitle: log[this.index].descripcion,
        };
        this.log.push(this.logNewEntry);
      }
      //Evita que se carguen datos en acciones antes de estar disponibles
      this.cargarAccion = true;
    },
  },

  data() {
    return {
      buttonLoading: false,
      log: undefined,
      cargarAccion: false,
      ultimaAccion: undefined,
      job: null,
      showGestionarWindow: false,

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
  max-height: 83vh;
  overflow-y: auto;
}

.cardTitleWrapper {
  display: flex;
}

.cardTitle {
  flex-grow: 1;
}

h2 {
  font-weight: 400 !important;
  margin-bottom: 0.5rem;
}

.processTitle {
  background-color: #bfdbfe;
  font-weight: 400 !important;
}

.processBtn {
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
  font-weight: 400 !important;
  display: block;
  margin: auto 0;
}
</style>
