<template>
    <div>
      <v-app class="font-sans shadow-md rounded p-8 mr-8">
        
      <h1 class="ml-4 text-xl font-bold my-6">
      Incidencias en Bandeja
      </h1>
      
        <div class="overflow-y-auto">
          <v-card elevation="0" class="mb-4">
            <div>
              <div class="p-4 flex bg-blue-500 w-full items-center">
                <v-btn :disabled=disabledEliminar dark color="#EF4444" class="mr-3" @click="deleteItem()">ELIMINAR</v-btn>           
                <v-btn dark color="primary" class="mr-3" @click="dummy()">VER INFO</v-btn> 
                <v-spacer></v-spacer>

                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  class="bg-white p-3"
                ></v-text-field>
              </div>
            </div>
          </v-card>

          <v-data-table
          v-model="selected"
            :headers="headers"
            :items="incidencias"
            :search="search"
            class="font-sans"
            show-select
          >

            <template v-slot:top>
           
                <!-- VENTANA EDICION INCIDENCIA -->
                <v-dialog 
                v-model="dialog" 
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                class="h-full">
                  <VerIncidencia 
                    @dialog="dialogClose" 
                    :incidencia="editedItem" 
                    :error="editedItem.geometria_error"
                    :center="editedItem.geometria_error"
                  ></VerIncidencia>
                </v-dialog>
                <!-- FIN VENTANA EDICION INCIDENCIA -->
                
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                   <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                   <h3 class="text-center text-l">Esta acción borrará la incidencia ¿Desea continuar?</h3>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="w-24 bg-red-500" dark text @click="closeDelete">CANCELAR</v-btn>
                        <v-btn class="w-24 bg-green-500" dark text @click="deleteItemConfirm">OK</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                  </v-card>
                </v-dialog>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn title="editar" icon dark class="bg-blue-500 mr-1" @click="editItem(item)"><v-icon small> mdi-pencil </v-icon></v-btn>
              <v-btn title="consultar" icon dark class="bg-green-500"><v-icon small @click="editItem(item)"> mdi-eye </v-icon></v-btn>
            </template>

            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>

            <template v-slot:[`item.inc_estado`]="{ item }">
              <v-chip :color="getColor(item.inc_estado)" dark class="m-1 w-32">{{ item.inc_estado }}</v-chip>
            </template>
          </v-data-table>
        </div> 
      </v-app>
    </div>
 
</template>

<script>
import axios from 'axios';
import {getColor} from '@/assets/mixins/getColor.js';

import VerIncidencia from '@/components/VerIncidencia';


  export default {
    name:'IncBdjGJ',
    mixins: [getColor],
    components: {
      VerIncidencia,
    },

    data() {
      return {
        dialog: false,
        dialogDelete: false,
        disabledEliminar: true,
        search:'',
        headers: [
          { text: 'Incidencia', align: 'start', sortable: true, value: 'id_inc' },
          { text: 'Estado', align: 'start', sortable: true, value: 'inc_estado' },
          { text: 'Vía Entrada', align: 'start', sortable: true, value: 'inc_via_ent' },
          { text: 'Prioridad', align: 'start', sortable: true, value: 'inc_prioridad' },
          { text: 'Procedencia', align: 'start', sortable: true, value: 'inc_procedencia' },
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        selected: [],
        incidencias: [],
        editedIndex: -1,
        editedItem: {
          id_inc:'',
          inc_estado:'',
          inc_via_ent:'',
          inc_prioridad:'',
          inc_procedencia:'',
        },
        defaultItem: {
          id_inc:'',
          inc_estado:'',
          inc_via_ent:'',
          inc_prioridad:'',
          inc_procedencia:'',
        },
      }
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      selected(){
        if (this.selected.length > 0){
          this.disabledEliminar = false;
        } else {
          this.disabledEliminar = true;
        }
      },
    },
    created () {
      this.initialize()
    },
    
    methods: {

      dummy() {
          console.log(this.selected)
      },

      initialize () {
        const url = 'http://10.13.86.114:3000/'; //url del servicio
        axios
          .get(url+'incidencias')
          //se realiza el filtro para las incidencias en bandeja
          .then(data => {
                          this.incidenciasBruto = data.data.response;
                          for (this.elemento in this.incidenciasBruto) {
                              if (this.incidenciasBruto[this.elemento].inc_estado == 'En Bandeja') {
                               this.incidencias.push(this.incidenciasBruto[this.elemento])            
                              }     
                          }
          //debug
          //console.log('InciGEO (IncBdjGJ) -> Incidencias recuperadas y filtradas correctamente'); 
          })
      },

      editItem (item) {
        this.editedIndex = this.incidencias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem () {
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        for (this.index in this.selected) {
          this.incidenciaBorrar = this.selected[this.index].id_inc
          for (this.indexIncidencia in this.incidencias){
            this.incidenciaAlmacenada = this.incidencias[this.indexIncidencia].id_inc;
            if (this.incidenciaBorrar == this.incidenciaAlmacenada){
              //TODO: El borrado debe ser en base de datos y array
              this.incidencias.splice(this.indexIncidencia,1)
            }
          }
        }
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      
      dialogClose(){
        this.dialog = false;
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.incidencias[this.editedIndex], this.editedItem)
        } else {
          this.incidencias.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style>
  .v-application--wrap {
    min-height: 1vh !important;
  }

  .v-data-table-header {
    background-color:#E5E7EB;
  }
</style>

