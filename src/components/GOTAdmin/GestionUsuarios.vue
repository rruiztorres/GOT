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
                  <v-btn 
                  class="btn" dark color="success"
                  @click="newUser"
                  >
                    <v-icon>mdi-plus</v-icon>
                    NUEVO USUARIO
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn class="btn" dark color="error"
                  @click="disableUser(false)"
                  >
                    DESACTIVAR USUARIO
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn class="btn" dark color="success"
                  @click="disableUser(true)"
                  >
                    ACTIVAR USUARIO
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
          item-key="id_usuario"
          :search="search"
          v-model="selected"
          show-select
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
        >
          <template v-slot:[`item.activo`]="{ item }">
            <v-chip :color="getColor(item.activo)" small dark>
              {{ item.activo }}
            </v-chip>
          </template>

          <template v-slot:[`item.usuario`]="{ item }">
            <span style="color:blue; text-decoration:underline;">{{
              item.usuario
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

          <!-- PANEL EXPANSION -->
          <template v-slot:expanded-item="{ item }">
              <td colspan="5"></td>
              <td class="expansionPanel">
                <b>Otros roles del usuario:</b>
                <br/>
                <ul v-for="role in item.roles" :key="role">
                  <li>{{role}}</li>
                </ul>
              </td>
          </template>

          <template v-slot:top>
            <!-- VENTANA EDICION USUARIO -->
            <v-overlay
              :value="editDialog"
              transition="dialog-bottom-transition"
            >
              <EdicionUsuario :usuario="user" @closed="closeEdicion"></EdicionUsuario>
            </v-overlay>

            <!-- VENTANA NUEVO USUARIO -->
            <v-overlay
              :value="newUserDialog"
              transition="dialog-bottom-transition"
            >
              <NuevoUsuario @close="closeNewUser"></NuevoUsuario>
            </v-overlay>
          </template>
          
        </v-data-table>
      </div>
    </v-card>

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
  </div>
</template>

<script>
import axios from 'axios';
import {getColor} from "@/assets/mixins/getColor";

import EdicionUsuario from "@/components/GOTAdmin/EdicionUsuario";
import NuevoUsuario from "@/components/GOTAdmin/NuevoUsuario";

export default {
  name: "GestionUsuarios",
  mixins: [getColor],
  components: {EdicionUsuario, NuevoUsuario},

    data() {
        return {
        foo: null,
        search: '',
        editDialog: false,
        newUserDialog: false,
        user: undefined,
        selected: undefined,
        expanded: [],
        singleExpand: true,

        showMessage: false,
        messageType: 'info',
        message: 'undefined',

        userHeaders: [
            { text: "Nombre", align: "start", sortable: true, value: "nombre" },
            { text: "Apellidos", align: "start", sortable: true, value: "apellidos" },
            { text: "Nombre usuario", align: "start", sortable: true, value: "usuario"},
            { text: "Rol por defecto", align: "start", sortabable: true, value: "rol_defecto"},
            { text: "Fecha Alta", align: "start", sortable: true, value: "f_creacion" },
            { text: "Fecha Baja", align: "start", sortable: true, value: "fechaBaja" },
            { text: "Activo", align: "start", sortable: true, value: "activo" },
            { text: "Editar", align: "start", sortable: true, value: "actions" },
        ],
        usuarios: undefined,
        };
    },

    created(){
      this.initialize();
    },

    methods:{

        closeInfoMsg(){
          this.showMessage = false;
        },

        async initialize(){
          this.usuarios = [];
          
          await axios
          .get(`${process.env.VUE_APP_API_ROUTE}/getUsers`)
          .then((data) => {
            this.usuarios = data.data.usuarios;
          })
        },

        async disableUser(disable){
          this.proceso = 0;
          this.mensaje = undefined;
          for (this.index in this.selected){
            this.selected[this.index].activo = disable; //True - false
            axios 
            .put(`${process.env.VUE_APP_API_ROUTE}/updateUser`, this.selected[this.index])
            .then((data) => {
              if(data.status === 203){
                this.proceso = 1
              }
            })
          }
          if(this.proceso == 0){
            this.showMessage = true;
            this.messageType = 'success';
            this.message = 'Cambios realizados en usuario.'

            this.initialize();
            setTimeout(this.closeInfoMsg, 2000)
            this.selected = [];
          }
        },

        newUser(){
          this.newUserDialog = true;
        },

        editUser(user){
            this.editDialog = true;
            this.user = user;
        },

        closeEdicion(data){
          if(data == false){
            this.editDialog = data;
          }
        },

        closeNewUser(data){
          if(data === false){
            this.newUserDialog = data
            this.initialize();
          }
        },
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

    .expansionPanel {
      padding: 1rem 0rem 1rem 0rem !important;
    }
</style>