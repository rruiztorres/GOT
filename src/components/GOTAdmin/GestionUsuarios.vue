<template>
  <div class="panelContainer">
    <div class="panelHeader">
      <h2 class="panelHeader-title">Gestion de usuarios</h2>
      <v-spacer></v-spacer>
      <v-btn title="Obtener Ayuda" tile icon color="primary" elevation="1">
        <v-icon x-large>mdi-help-box</v-icon>
      </v-btn>
    </div>

    <v-card flat>
      <div>
        <!--PANEL ACCIONES SUPERIOR -->
        <v-card elevation="0">
          <v-row class="panelFuncionesCard">
            <v-col cols="12" md="7">
              <v-row class="buttonGroup">
                <v-col cols="12" md="4">
                  <v-btn class="btn" dark color="success">
                    <v-icon>mdi-plus</v-icon>
                    NUEVO USUARIO
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn class="btn" dark color="error">
                    DESACTIVAR USUARIO
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="5">
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
          :headers="userHeaders"
          :items="usuarios"
          key="id"
          :search="search"
          show-select
        >
          <template v-slot:[`item.activo`]="{ item }">
            <v-chip :color="getColor(item.activo)" small dark>
              {{ item.activo }}
            </v-chip>
          </template>

          <template v-slot:[`item.username`]="{ item }">
            <span style="color:blue; text-decoration:underline;">{{
              item.username
            }}</span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              class="editButton"
              elevation="2"
              icon
              dark
              @click="editUser(item)"
            >
              <v-icon> mdi-lead-pencil </v-icon>
            </v-btn>
          </template>

          <template v-slot:top>
            <!-- VENTANA EDICION JOB -->
            <v-overlay
              :value="dialog"
              transition="dialog-bottom-transition"
            >
              <EdicionUsuario :usuario="user" @closed="closeEdicion"></EdicionUsuario>
            </v-overlay>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import {getColor} from "@/assets/mixins/getColor";
import EdicionUsuario from "@/components/GOTAdmin/EdicionUsuario";

export default {
  name: "GestionUsuarios",
  mixins: [getColor],
  components: {EdicionUsuario},

    data() {
        return {
        foo: null,
        search: '',
        dialog: false,
        user: undefined,
        userHeaders: [
            { text: "Nombre", align: "start", sortable: true, value: "nombre" },
            { text: "Apellidos", align: "start", sortable: true, value: "apellidos" },
            { text: "Grupo Trabajo", align: "start", sortable: true, value: "grupo" },
            { text: "Nombre usuario", align: "start", sortable: true, value: "username"},
            { text: "Fecha Alta", align: "start", sortable: true, value: "fechaAlta" },
            { text: "Activo", align: "start", sortable: true, value: "activo" },
            { text: "Organización", align: "start", sortable: true, value: "organizacion" },
            { text: "Editar", align: "start", sortable: true, value: "actions" },
        ],
        usuarios: [
            { nombre: 'Raúl', apellidos: 'Ruiz Torres', grupo:'Operadores, Generador de Jobs, Soporte BDIG', username: 'rrtorres', fechaAlta: '01-01-2022', id:1, activo: true, organizacion: 'IGN'},
            { nombre: 'Pepe', apellidos: 'Pérez García', grupo:'Operadores', username: 'pperez', fechaAlta: '10-01-2022', id:2, activo: true, organizacion: 'IGN'},
            { nombre: 'John', apellidos: 'Doe', grupo:'Generador de Jobs', username: 'jdoe', fechaAlta: '03-02-2022', id:3, activo: true, organizacion: 'Mapitas s.a.'},
            { nombre: 'Jane', apellidos: 'Doe', grupo:'Soporte BDIG', username: 'jadoe', fechaAlta: '25-01-2022', id:4, activo: false, organizacion: 'Mapitas s.a.'},
        ]
        };
    },

    methods:{
        editUser(user){
            this.dialog = true;
            this.user = user;
        },

        closeEdicion(data){
          if(data == false){
            this.dialog = data;
          }
        }
    }
};
</script>

<style scoped>
    .panelFuncionesCard {
        background-color: #4287f5;
        margin-bottom: 1rem;
    }

    .buttonGroup {
        padding: 0.5rem;
    }

    .textField {
        background-color: white;
        padding: 0.5rem;
    }
</style>