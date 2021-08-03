<template>
    <div>
      <v-app class="font-sans shadow-md rounded">
        
      <h1 class="ml-4 text-xl font-bold my-6">
      Incidencias en Triaje
      </h1>
      
        <div class="overflow-y-auto">
          <v-card elevation="0" class="mb-4">
            <div>
              <div class="p-4 flex bg-blue-500 w-full items-center">
                <v-btn disabled dark color="#3B82F6" class="mr-3">ACCION 1</v-btn>
                <v-btn disabled dark color="#3B82F6" class="mr-3">ACCION 2</v-btn>
                <v-btn disabled dark color="#3B82F6" class="mr-3">ACCION 3</v-btn>
                <v-btn disabled dark color="#3B82F6" class="mr-3">ACCION 4</v-btn>
                <v-btn disabled dark color="#3B82F6" class="mr-3">ACCION 5</v-btn>              
                
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
                        <v-btn class="w-24 bg-red-500" dark text @click="closeDelete">Cancel</v-btn>
                        <v-btn class="w-24 bg-green-500" dark text @click="deleteItemConfirm">OK</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                  </v-card>
                </v-dialog>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
    name:'IncTriajeGJ',
    mixins: [getColor],
    components: {
      VerIncidencia,
    },

    data: () => ({
      dialog: false,
      dialogDelete: false,
      search:'',
      headers: [
        { text: 'Incidencia', align: 'start', sortable: true, value: 'id_inc' },
        { text: 'Estado', align: 'start', sortable: true, value: 'inc_estado' },
        { text: 'Vía Entrada', align: 'start', sortable: true, value: 'inc_via_ent' },
        { text: 'Prioridad', align: 'start', sortable: true, value: 'inc_prioridad' },
        { text: 'Procedencia', align: 'start', sortable: true, value: 'inc_procedencia' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
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
    }),

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
    },
    created () {
      this.initialize()
    },
    
    methods: {
      initialize () {
        const url = 'http://10.13.86.114:3000/'; //url del servicio
        axios
          .get(url+'incidencias')
          //se realiza el filtro para las incidencias en triaje
          .then(data => {
                          this.incidenciasBruto = data.data.response;
                          for (this.elemento in this.incidenciasBruto) {
                              if (this.incidenciasBruto[this.elemento].inc_estado == 'En Triaje') {
                               this.incidencias.push(this.incidenciasBruto[this.elemento])            
                              }     
                          }
          //debug
          //console.log('InciGEO (IncTriajeGJ) -> Incidencias recuperadas y filtradas correctamente'); 
          })
      },

      editItem (item) {
        this.editedIndex = this.incidencias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.incidencias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.incidencias.splice(this.editedIndex, 1)
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
</style>

