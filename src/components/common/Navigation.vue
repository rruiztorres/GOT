<template>
  <div>
    <!-- PANEL USUARIO -->
    <div>
      <v-menu v-model="menu" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <div class="userActionsContainer">
            <div class="menuAvatarContainer">
              <img src="@/assets/img/avatarIGN.png" />
            </div>

            <v-list class="userShowData">
              <v-list-item-content>
                <v-list-item-title v-model="userName">
                  {{ userName }}
                </v-list-item-title>
                <v-list-item-subtitle v-model="userRole">
                  {{ userRole }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list>

            <!--BOTONES CONFIGURACION USUARIO -->
            <v-row class="groupConfigButtons">
              <v-col cols="4">
                <v-btn title="Configuración" dark color="#2563EB">
                  <v-icon title="Configuración" dark>mdi-cog</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn title="Avisos" dark color="#2563EB">
                  <!-- MUESTRA NOTIFICACIONES EN BOTONES
                    <v-badge overlap content="3" color="error">
                    <v-icon title="Avisos" dark>mdi-bell-outline</v-icon>
                  </v-badge>-->
                  <v-icon title="Avisos" dark>mdi-bell-outline</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn
                  title="Cambio de Rol"
                  dark
                  color="#2563EB"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon title="Cambio de Rol" dark
                    >mdi-account-convert</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>

        <!-- MENU DESPLEGABLE CAMBIO DE ROL -->
        <v-card class="userPanelContainer">
          <!-- DATOS DE USUARIO -->
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="@/assets/img/avatarIGN.png"></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="userName">
                  {{ userName }}
                </v-list-item-title>
                <v-list-item-subtitle>rrtorres@ign.es</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!-- SELECCION DE ROL -->
          <v-list nav dense>
            <v-list-item-group v-model="activeRole" color="primary">
              <v-list-item v-for="rol in roles" :key="rol.name"  @click="changeRol(rol)">
                <v-list-item-icon>
                  <v-icon v-text="rol.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="userRole">{{rol.name}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- LOGOUT -->
          <div class="logoutBtn">
            <v-btn block class="info" @click="doLogout()"><v-icon class="logoutIcon">mdi-power-standby</v-icon>LOGOUT</v-btn>
          </div>

        </v-card>
      </v-menu>
    </div>

    <!-- FIN PANEL USUARIO -->
    <v-divider></v-divider>

    <!-- MENU OPCIONES SEGUN ROL -->
    <div>
      <div v-if="userRole == 'Generador de Jobs'">
        <NavGJ @cambiomenu="changeMenu"></NavGJ>
      </div>
      <div v-if="userRole == 'Operador Especializado'">
        <NavOpEsp @cambiomenu="changeMenu"></NavOpEsp>
      </div>
      <div v-if="userRole == 'Control de Calidad'">
        <Ccalidad @cambiomenu="changeMenu"></Ccalidad>
      </div>
      <div v-if="userRole == 'Soporte BDIG'">
        <NavSopBDIG @cambiomenu="changeMenu"></NavSopBDIG>
      </div>
      <div v-if="userRole == 'GOT Admin'">
        <NavGOTAdmin @cambiomenu="changeMenu"></NavGOTAdmin>
      </div>
      <div v-if="userRole == 'Gestor'">
        <NavGestor @cambiomenu="changeMenu"></NavGestor>
      </div>
    </div>

    <!-- FIN MENU OPCIONES SEGUN ROL -->
    <div>
      <v-spacer></v-spacer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

//components
import NavGJ from "@/components/generadorJobs/NavGJ";
import NavOpEsp from "@/components/operadorEsp/NavOpEsp";
import Ccalidad from "@/components/controlCalidad/navCC";
import NavSopBDIG from "@/components/soporteBDIG/NavSopBDIG"
import NavGOTAdmin from "@/components/GOTAdmin/NavGOTAdmin";
import NavGestor from "@/components/gestor/NavGestor";

//mixins
import { getUserNavIcons } from "@/assets/mixins/getUserNavIcons";
import { getDefaultPanel } from "@/assets/mixins/getDefaultPanel";

export default {
  name: "Navigation",
  mixins: [getUserNavIcons, getDefaultPanel],
  components: { NavGJ, NavOpEsp, Ccalidad, NavSopBDIG, NavGOTAdmin, NavGestor, },

  created(){
    this.initialize();
  },

  methods: {
    async initialize(){
      await axios
      .get(`${process.env.VUE_APP_API_ROUTE}/getUserRoles/`+ this.usr)
      .then((data) => {
        this.rolesBD = data.data.roles;
        for(this.index in this.rolesBD){
          this.newRole = {
            name: this.rolesBD[this.index],
            icon: this.getUserNavIcons(this.rolesBD[this.index]),
            default: this.getDefaultPanel(this.rolesBD[this.index])
          }
          this.roles.push(this.newRole)          
        }
        //MARCAR ROL ACTIVO EN MENU
        this.activeRole = this.activeRoleMenu(localStorage.rol)
      })      
    },

    activeRoleMenu(rol){
      for (this.index in this.roles){
        if (rol === this.roles[this.index].name){
          return parseInt(this.index)
        }
      }
    },

    changeMenu(data) {
      this.newMenu = data;
      this.$emit("cambiomenu", data);
    },

    changeRol(rol) {
      this.userRole = rol.name;
      localStorage.rol = rol.name;
      this.changeMenu(rol.default);
    },

    doLogout() {
      localStorage.usuario = null;
      localStorage.usrRoles = null;
      localStorage.token = null;
      localStorage.rol = null;
      this.$router.push("/");
    }
  },

  data() {
    return {
      closeOnClick: true,
      drawer: true,
      menu: false,
      usr: localStorage.usrName,
      userName: localStorage.usuario,
      userRole: localStorage.rol,
      roles: [],
      activeRole: 1,
      items: [
        { }
      ]
    };
  },
};
</script>

<style scoped>
  .menuAvatarContainer { 
    padding-top: 1.5rem;
  }

  .menuAvatarContainer > img {
    height: 5.5rem;
    width: 5.6rem;
    display: block;
    margin: 0 auto;
    border-radius: 100%;
    border: 2px solid white;
  }

  .userActionsContainer {
    background-color: #1e40af;
    height: 14.7rem;
  }

  .userShowData {
    text-align: center;
    color: white;
  }

  .groupConfigButtons {
    width: 100%;
    padding-left: 1rem;
  }

  .userPanelContainer {
    font-weight: 400 !important;
  }

  .userName {
    font-weight: 500 !important;
    font-size: 115%;
  }

  .userRole {
    font-weight: 500 !important;
    font-family: 'Montserrat';
  }

  .logoutBtn {
    font-weight: 400 !important;
    margin: 0rem 0.5rem 0rem 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .logoutIcon {
    margin-right: 0.5rem;
  }
</style>
