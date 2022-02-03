<template>
  <v-card class="card" flat>
    <div class="dataTable">
      <h2>Jobs</h2>
      <v-data-table
        :headers="jobHeaders"
        :items="job"
        item-key="job"
        hide-default-footer
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            {{ item.estado }}
          </v-chip>
        </template>
      </v-data-table>
    </div>

    <div class="dataTable">
      <h2>Errores Asociados</h2>
      <v-data-table
        calculate-widths
        :headers="errorHeaders"
        :items="errores"
        item-key="error"
        hide-default-footer
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark>
            {{ item.estado }}
          </v-chip>
        </template>

        <template v-slot:no-data>
          <h2 class="errorNoData">No existen errores asociados al job</h2>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="errorBtn" title="Eliminar Error" icon dark>
            <v-icon @click="confirmDelete(item)">
              mdi-trash-can
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- AVISO ELIMINAR ERRORES -->
    <v-overlay :value="showAlertError">
      <v-card class="alertCard">
        <h1 class="alertCardTitle">ATENCIÓN</h1>
        <h4>Esta acción borrara el error.</h4>
        <h4>El borrado es permanente y <b>no puede deshacerse</b>.</h4>
        <br />
        <h3><b>¿Desea continuar?</b></h3>
        <v-card-actions>
          <div class="alertButtonGroup">
            <v-btn
              class="alertButton errorBtn"
              dark
              text
              @click="showAlertError = false"
            >
              CANCELAR
            </v-btn>
            <v-btn
              class="alertButton generateBtn"
              dark
              text
              @click="deleteError(errorBorrar)"
            >
              OK
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-overlay>

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
  </v-card>
</template>

<script>
import axios from "axios";
import { getColor } from "@/assets/mixins/getColor";

export default {
  name: "DatosJobErrores",
  props: ["job", "errores"],
  mixins: [getColor],

  data() {
    return {
      errorHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Error", value: "error" },
        { text: "Tema", value: "tema_error" },
        { text: "Tipo", value: "tipo_error" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Procedencia", value: "via_ent" },
        { text: "Acciones", value: "actions" },
      ],

      jobHeaders: [
        { text: "Estado", value: "estado" },
        { text: "Expediente", value: "expediente" },
        { text: "Perfil", value: "arreglo_job" },
        { text: "Detectado en", value: "deteccion_job" },
        { text: "Gravedad", value: "gravedad_job" },
        { text: "Asignado a", value: "asignacion_job" },
        { text: "Operador", value: "nombre_operador" },
        { text: "Descripción", value: "descripcion" },
      ],

      //ALERTA BORRADO ERRORES
      showAlertError: false,
      messageType: "", //green para success, red para error, blue para info.
      message: "",

      //MENSAJES DE INFORMACION
      showMessage: false,
    };
  },

  methods: {
    confirmDelete(errorBorrar) {
      this.showAlertError = true;
      this.errorBorrar = errorBorrar;
    },

    deleteError(error) {
      //OBJECTO LOG
      this.log = {
          idEventoLogger: 32, //ERROR DESESTIMADO GENERADOR DE JOBS
          procesoJob: 'GOT',
          usuario: localStorage.usuario,
          observaciones: 'Error eliminado en Triaje',
          departamento: '',
          resultadoCC: '',
      }

      if (error.error != null) {
        axios
          .delete(`${process.env.VUE_APP_API_ROUTE}/deleteError`, {
            data: { error: error, log: this.log },
          })
          .then((data) => {
            if (data.status == 201) {
              this.showInfo(data.data.mensaje, "green");
              setTimeout(this.closeInfo, 1000);

              //Actualizar array errores
              for (this.index in this.errores) {
                if (this.errores[this.index].error == error.error) {
                  this.errores.splice(this.index, 1);
                }
              }
            } else {
              this.showInfo(data.data.mensaje, "red");
              setTimeout(this.closeInfo, 2000);
            }
          });
      } else {
        this.showInfo("Error eliminado correctamente", "green");
        setTimeout(this.closeInfo, 2000);
        //Actualizar array errores
        for (this.index in this.errores) {
          if (this.errores[this.index].error == error.error) {
            this.errores.splice(this.index, 1);
          }
        }
      }
      this.showAlertError = false;
    },

    showInfo(message, type) {
      this.showMessage = true;
      this.message = message;
      this.messageType = type;
    },

    closeInfo() {
      this.showMessage = false;
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: 400 !important;
}

.card {
  height: 87vh;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.dataTable {
  margin: 1rem 1rem 2rem 1rem;
  padding: 1rem;
  background-color: #eceff1;
  border-radius: 3px;
}
</style>
