<template>
  <div>
    <v-card id="map">
      <vl-map
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        :data-projection="epsg"
      >
        <vl-view :zoom.sync="zoom" :min-zoom="minZoom" :center.sync="center">
        </vl-view>

        <!--MAPA BASE-->
        <vl-layer-tile>
          <vl-source-xyz :url="urlTileBase"></vl-source-xyz>
        </vl-layer-tile>

        <!--GEOMETRIAS DE JOB-->
        <div>
          <!--JOBS EN TRIAJE -->
          <vl-layer-vector :z-index="1" v-if="estadoJob.includes('En triaje')">
            <vl-source-vector
              :features.sync="jobsTriaje"
              ident="jobsTriaje"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('En triaje')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS EN BANDEJA_OP -->
          <vl-layer-vector
            :z-index="2"
            v-if="estadoJob.includes('En bandeja_op')"
          >
            <vl-source-vector
              :features.sync="jobsEnBandeja_op"
              ident="jobsEnBandeja_op"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('En bandeja_op')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS EN BANDEJA -->
          <vl-layer-vector :z-index="3" v-if="estadoJob.includes('En bandeja')">
            <vl-source-vector
              :features.sync="jobsEnBandeja"
              ident="jobsEnBandeja"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('En bandeja')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS EN CONSULTA -->
          <vl-layer-vector
            :z-index="4"
            v-if="estadoJob.includes('En consulta')"
          >
            <vl-source-vector
              :features.sync="jobsEnConsulta"
              ident="jobsEnConsulta"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('En consulta')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS DESESTIMADOS -->
          <vl-layer-vector
            :z-index="5"
            v-if="estadoJob.includes('Desestimado')"
          >
            <vl-source-vector
              :features.sync="jobsDesestimados"
              ident="jobsDesestimados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Desestimado')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS VERSIÓN GENERADA -->
          <vl-layer-vector
            :z-index="6"
            v-if="estadoJob.includes('Versión generada')"
          >
            <vl-source-vector
              :features.sync="jobsVersionGenerada"
              ident="jobsVersionGenerada"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Versión generada')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS ERROR VERSIÓN -->
          <vl-layer-vector
            :z-index="7"
            v-if="estadoJob.includes('Error versión')"
          >
            <vl-source-vector
              :features.sync="jobsErrorVersion"
              ident="jobsErrorVersion"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Error versión')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS EN EJECUCION -->
          <vl-layer-vector :z-index="8" v-if="estadoJob.includes('Ejecución')">
            <vl-source-vector
              :features.sync="jobsEjecucion"
              ident="jobsEjecucion"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Ejecución')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS EN PAUSA -->
          <vl-layer-vector :z-index="9" v-if="estadoJob.includes('Pausa')">
            <vl-source-vector
              :features.sync="jobsEnPausa"
              ident="jobsEnPausa"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Pausa')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS CONCILIADOS -->
          <vl-layer-vector
            :z-index="10"
            v-if="estadoJob.includes('Conciliado')"
          >
            <vl-source-vector
              :features.sync="jobsConciliados"
              ident="jobsConciliados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Conciliado')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS ERROR FIN PARA USUARIO -->
          <vl-layer-vector
            :z-index="11"
            v-if="estadoJob.includes('Error_fin para usuario')"
          >
            <vl-source-vector
              :features.sync="jobsErrorFinUsuario"
              ident="jobsErrorFinUsuario"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Error_fin para usuario')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS ERROR FIN PARA SOPORTE -->
          <vl-layer-vector
            :z-index="12"
            v-if="estadoJob.includes('Error_fin para soporte')"
          >
            <vl-source-vector
              :features.sync="jobsErrorFinSoporte"
              ident="jobsErrorFinSoporte"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Error_fin para soporte')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- JOBS CONSOLIDADO -->
          <vl-layer-vector
            :z-index="13"
            v-if="estadoJob.includes('Consolidado')"
          >
            <vl-source-vector
              :features.sync="jobsConsolidado"
              ident="jobsConsolidado"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-stroke
                :color="getColor('Consolidado')"
                :width="4"
              ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>
        </div>

        <!--GEOMETRIAS DE ERROR -->
        <div>
          <!-- ERRORES MARCADOS -->
          <vl-layer-vector :z-index="1" v-if="estadoError.includes('Marcado')">
            <vl-source-vector
              :features.sync="erroresMarcados"
              ident="erroresMarcados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-circle :radius="5">
                <vl-style-fill :color="getColor('Marcado')"></vl-style-fill>
                <vl-style-stroke color="white" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>

          <!-- ERRORES PENDIENTES -->
          <vl-layer-vector
            :z-index="2"
            v-if="estadoError.includes('Pendiente solución')"
          >
            <vl-source-vector
              :features.sync="erroresPendientes"
              ident="erroresPendientes"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-circle :radius="5">
                <vl-style-fill
                  :color="getColor('Pendiente solución')"
                ></vl-style-fill>
                <vl-style-stroke color="white" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>

          <!-- ERRORES SOLUCIONADOS -->
          <vl-layer-vector
            :z-index="3"
            v-if="estadoError.includes('Solucionado')"
          >
            <vl-source-vector
              :features.sync="erroresSolucionados"
              ident="erroresSolucionados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-circle :radius="5">
                <vl-style-fill :color="getColor('Solucionado')"></vl-style-fill>
                <vl-style-stroke color="white" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>

          <!-- ERRORES DESESTIMADOS -->
          <vl-layer-vector
            :z-index="4"
            v-if="estadoError.includes('Desestimado')"
          >
            <vl-source-vector
              :features.sync="erroresDesestimados"
              ident="erroresDesestimados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-circle :radius="5">
                <vl-style-fill :color="getColor('Desestimado')"></vl-style-fill>
                <vl-style-stroke color="white" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>

          <!-- ERRORES RECHAZADOS -->
          <vl-layer-vector
            :z-index="5"
            v-if="estadoError.includes('Rechazados')"
          >
            <vl-source-vector
              :features.sync="erroresRechazados"
              ident="erroresRechazados"
            ></vl-source-vector>
            <vl-style-box>
              <vl-style-circle :radius="5">
                <vl-style-fill :color="getColor('Rechazados')"></vl-style-fill>
                <vl-style-stroke color="white" :width="3"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>
        </div>
      </vl-map>

      <!-- PANEL HERRAMIENTAS -->
      <v-card class="toolPanelContainer">
        <v-card-actions class="toolPanelActions">
          <h4>FILTROS</h4>
          <v-spacer></v-spacer>
          <v-btn dark text @click="showFilters = !showFilters">
            <v-icon>{{
              showFilters ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <v-card v-show="showFilters">
            <!-- FILTRO ESTADO JOB -->
            <v-list dense>
              <v-list-group :value="false">
                <template v-slot:activator>
                  <v-list-item-title>ESTADO JOB</v-list-item-title>
                </template>

                <!-- SELECT ALL -->
                <div class="row">
                  <div class="col">
                    <v-icon class="dotAll" color="black">mdi-circle</v-icon>
                    <span class="selAllTitle"><b>All / None</b></span>
                    <v-chip class="chip" x-small>
                      {{getTotals(panelJobs.series)}}
                    </v-chip>
                    <span class="colCheck">
                      <v-btn
                      small
                      dark
                      :color="selectJobsButton"
                      @click="selUnselAllJobs()"
                      ><v-icon>mdi-check</v-icon></v-btn>
                    </span>
                  </div>
                </div>

                <v-list-item-group multiple v-model="estadoJob">
                  <template v-for="(item, i) in panelJobs.tipos">
                    <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

                    <v-list-item
                      v-else
                      :key="`item-${i}`"
                      :value="item"
                      active-class="blue--text text--accent-4"
                    >
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-icon class="dot" :color="getColor(item)"
                              >mdi-circle</v-icon
                            >
                            {{ item }}
                            <v-chip class="chip" x-small>{{
                              panelJobs.series[i]
                            }}</v-chip>
                          </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            color="blue accent-4"
                          ></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list-group>
            </v-list>

            <!-- FILTRO ESTADO ERRORES -->
            <v-list dense>
              <v-list-group :value="false">
                <template v-slot:activator>
                  <v-list-item-title>ESTADO ERROR</v-list-item-title>
                </template>

                <!-- SELECT ALL -->
                <div class="row">
                  <div class="col">
                    <v-icon class="dotAll" color="black">mdi-circle</v-icon>
                    <span class="selAllTitle"><b>All / None</b></span>
                    <v-chip class="chip" x-small>{{
                      getTotals(panelErrores.series)}}
                    </v-chip>
                    <span class="colCheck">
                      <v-btn
                        small
                        dark
                        :color="selectErroresButton"   
                        @click="selUnselAllErrores()"
                      ><v-icon>mdi-check</v-icon>
                      </v-btn>
                    </span>
                  </div>
                </div>

                <v-list-item-group multiple v-model="estadoError">
                  <template v-for="(item, i) in panelErrores.tipos">
                    <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

                    <v-list-item
                      v-else
                      :key="`item-${i}`"
                      :value="item"
                      active-class="blue--text text--accent-4"
                    >
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-icon class="dot" :color="getColor(item)"
                              >mdi-circle</v-icon
                            >
                            {{ item }}
                            <v-chip class="chip" x-small>{{
                              panelErrores.series[i]
                            }}</v-chip>
                          </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            color="blue accent-4"
                          ></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list-group>
            </v-list>
          </v-card>
        </v-expand-transition>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getColor } from "@/assets/mixins/getColor";
import { createDataSeries } from "@/assets/mixins/createDataSeries";

export default {
  name: "MapaGestor",
  mixins: [getColor, createDataSeries],
  props: ["jobsRecibidos"],

  data() {
    return {
      //MAP
      epsg: "EPSG:3857",
      urlTileBase:
        "https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg",
      name: "TMS IGNBaseOrto",

      //VIEW
      zoom: 5.5,
      minZoom: 5.5,
      center: [-386025.74417069746, 4683331.210786856],

      //HERRAMIENTAS
      showFilters: false,

      //JOBS
      jobs: [],
      jobsTriaje: [],           
      jobsDesestimados: [],     
      jobsConciliados: [],       
      jobsEjecucion: [],        
      jobsEnBandeja: [],        
      jobsEnBandeja_op: [],     
      jobsEnPausa: [],          
      jobsErrorVersion: [],     
      jobsErrorFinUsuario: [],  
      jobsErrorFinSoporte: [],  
      jobsConsolidado: [],      
      jobsEnConsulta: [],       
      jobsVersionGenerada: [],  

      panelJobs: [],
      selectJobsButton: "blue",
      selectJobsIcon: "mdi-check",
      estadoJob: [],

      //ERRORES
      erroresPendientes: [],
      erroresSolucionados: [],
      erroresDesestimados: [],
      erroresRechazados: [],
      erroresMarcados: [],

      panelErrores: [],
      selectErroresButton: "blue",
      estadoError: [],
      estadosErrores: [],

    };
  },

  created() {
      if(!this.jobsRecibidos){
        this.getJobFromBD();
        this.getErroresFromBD();
      } else {
        //MODO EXPEDIENTE
        this.formatJobs(this.jobsRecibidos)
      }
  },

  methods: {
    selUnselAllJobs() {
      if (this.estadoJob.length > 0) {
        this.selectJobsButton = "grey";
        this.estadoJob = [];
      } else {
        this.estadoJob = this.panelJobs.tipos;
        this.selectJobsButton = "blue";
      }
    },

    selUnselAllErrores() {
      if (this.estadoError.length > 0) {
        this.selectErroresButton = "grey";
        this.estadoError = [];
      } else {
        this.estadoError = this.panelErrores.tipos;
        this.selectErroresButton = "blue";
      }
    },

    getTotals(array) {
      this.total = 0;
      for (this.index in array) {
        this.total = this.total + array[this.index];
      }
      return this.total;
    },

    getJobFromBD() {
      axios
      .get(`${process.env.VUE_APP_API_ROUTE}/jobs`).then((data) => {
        this.jobs = data.data.response;
        this.formatJobs(this.jobs);
      });
    },

    formatJobs(jobs) {
      for (this.index in jobs) {
        this.newJob = {
          id: uuidv4(),
          geometry: {
            coordinates: jobs[this.index].geometria.coordinates,
            type: jobs[this.index].geometria.type,
          },
          type: "Feature",
          features: jobs[this.index],
        };

        if (jobs[this.index].estado === "Ejecución") {
          this.jobsEjecucion.push(this.newJob);
        } else if (jobs[this.index].estado === "En triaje") {
          this.jobsTriaje.push(this.newJob);
        } else if (jobs[this.index].estado === "Desestimado") {
          this.jobsDesestimados.push(this.newJob);
        } else if (jobs[this.index].estado === "Conciliado") {
          this.jobsConciliados.push(this.newJob);
        } else if (jobs[this.index].estado === "En bandeja") {
          this.jobsEnBandeja.push(this.newJob);
        } else if (jobs[this.index].estado === "En bandeja_op") {
          this.jobsEnBandeja_op.push(this.newJob);
        } else if (jobs[this.index].estado === "Pausa") {
          this.jobsEnPausa.push(this.newJob);
        } else if (jobs[this.index].estado === "Versión generada") {
          this.jobsVersionGenerada.push(this.newJob);
        } else if (jobs[this.index].estado === "Error versión") {
          this.jobsErrorVersion.push(this.newJob);
        } else if (jobs[this.index].estado === "Error_fin para usuario") {
          this.jobsErrorFinUsuario.push(this.newJob);
        } else if (jobs[this.index].estado === "Error_fin para soporte") {
          this.jobsErrorFinSoporte.push(this.newJob);
        } else if (jobs[this.index].estado === "Consolidado") {
          this.jobsConsolidado.push(this.newJob);
        } else if (jobs[this.index].estado === "En consulta") {
          this.jobsEnConsulta.push(this.newJob);
        } else if (jobs[this.index].estado === "Versión generada") {
          this.jobsVersionGenerada.push(this.newJob);
        }
      }

      this.panelJobs = this.createDataSeries(jobs, "estado");
      this.estadoJob = this.panelJobs.tipos;
    },

    getErroresFromBD() {
      axios.get(`${process.env.VUE_APP_API_ROUTE}/errores`).then((data) => {
        this.formatErrores(data.data.errores);
      });
    },

    formatErrores(errores) {
      for (this.index in errores) {
        this.newError = {
          id: uuidv4(),
          geometry: {
            coordinates: errores[this.index].geometria.coordinates,
            type: errores[this.index].geometria.type,
          },
          type: "Feature",
        };

        if (errores[this.index].estado === "Pendiente solución") {
          this.erroresPendientes.push(this.newError);
        } else if (errores[this.index].estado === "Solucionado") {
          this.erroresSolucionados.push(this.newError);
        } else if (errores[this.index].estado === "Desestimado") {
          this.erroresDesestimados.push(this.newError);
        } else if (errores[this.index].estado === "Rechazado") {
          this.erroresRechazados.push(this.newError);
        } else if (errores[this.index].estado === "Marcado") {
          this.erroresMarcados.push(this.newError);
        }
      }

      this.panelErrores = this.createDataSeries(errores, "estado");
      this.estadoError = this.panelErrores.tipos;
    },
  },
};
</script>

<style scoped>
#map {
  height: 75.8vh;
}

h1,
h2,
h3,
h4 {
  font-weight: 400 !important;
}

.chip {
  margin-left: 0.5rem;
}

.dot {
  margin-right: 1rem;
}

.toolPanelContainer {
  position: absolute;
  top: 0.5rem;
  right: -0.5rem;
  margin-right: 1rem;
  width: 18rem;
  box-shadow: 0px 0px 5px 3px white;
  background-color: #003c8866;
  border-radius: 3px;
}

.toolPanelActions {
  color: white;
  background-color: #1e40af;
  border-radius: 0px 3px 0px 0px;
  border-radius: 0px 3px 0px 0px;
}

.toolPanelActions > h4 {
  margin-left: 0.4rem;
}

.selAll {
  display: contents;
  font-size: 80%;
  font-weight: 500;
}

.dotAll {
  margin-right: 0.25rem;
}

.row {
  width: 18rem;
  height: 2rem;
  margin: 0.5rem 0rem 1rem 0rem;
  padding-left: 1rem;
  font-size: 95%;
}

.col {
  flex-grow: 1;
  margin: 0 auto;
  padding: 0rem;
  height: 100%;
}

.colCheck {
  margin-left: 4rem;
}

.selAllTitle {
  margin-left: 0.85rem;
  font-size: 85%;
}

.tools {
  padding: 1rem;
  font-weight: 400;
}

.topBarToolPanel {
    border-radius: 0px 3px 0px 0px;
    height: 3.5rem;
    background-color: #1e40af;
}

.toolContainer {
    margin: 0 auto;
    width: 100%;
}

.toolBtn {
  flex-grow: 1;
}
</style>
