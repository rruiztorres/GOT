<template>
    <div>
      <v-app class="font-sans shadow-md rounded px-8 mr-8">
        
      <h1 class="text-xl font-bold py-4 mt-2">
      Jobs Devueltos
      </h1>
      
        <div class="overflow-y-auto">
          <v-card elevation="0" class="mb-4">
            <div>
              <div class="p-3 flex bg-blue-500 w-full items-center">
                <v-btn disabled dark color="primary" class="mr-3">ACCION 1</v-btn>           
                <v-btn disabled dark color="primary" class="mr-3">ACCION 2</v-btn> 
                <v-spacer></v-spacer>

                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  class="bg-white p-2"
                ></v-text-field>
              </div>
            </div>
          </v-card>

          <v-data-table
          v-model="selected"
            :headers="headers"
            :items="jobs"
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

            <template v-slot:[`item.job_estado`]="{ item }">
              <v-chip :color="getColor(item.job_estado)" dark>
                {{ item.job_estado }}
              </v-chip>
            </template>

          </v-data-table>
        </div>
      </v-app>
    </div>
 
</template>

<script>
import axios from 'axios';
import {getColor} from '@/assets/mixins/getColor.js';

import VerIncidencia from '@/components/common/VerIncidencia';


  export default {
    name:'JobsDevGJ',
    mixins: [getColor],
    components: {
      VerIncidencia,
    },

    data: () => ({
      dialog: false,
      dialogDelete: false,
      selected:[],
      search:'',
      headers: [
        { text: 'Job', align: 'start', sortable: true, value: 'job_id'},
        { text: 'Estado', align: 'start', sortable: true, value: 'job_estado' },
        { text: 'Gravedad', align: 'start', sortable: true, value: 'job_gravedad' },
        { text: 'Detectado en', align: 'start', sortable: true, value: 'job_detectado' },
        { text: 'Arreglar en', align: 'start', sortable: true, value: 'job_arreglar' },
        { text: 'Descripción', align: 'start', sortable: true, value: 'job_desc' },
        //pendiente determinar acciones
        //{ text: 'Acciones', value: 'actions', sortable: false },
      ],
      jobs: [],
      editedIndex: -1,
      editedItem: {
        id_inc:'',
        job_estado:'',
        job_prioridad:'',
        job_detectado:'',
        job_arreglar:'',
      },
      defaultItem: {
        id_inc:'',
        job_estado:'',
        job_prioridad:'',
        job_detectado:'',
        job_arreglar:'',
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
          .get(url+'jobs')
          //se realiza el filtro para los jobs devueltos
          .then(data => {
                          this.jobsBruto = data.data.response;
                          for (this.elemento in this.jobsBruto) {
                              //filtramos jobs segun estado
                              if (this.jobsBruto[this.elemento].job_estado == 'Devuelto') {
                               this.jobs.push(this.jobsBruto[this.elemento])            
                              }     
                          }
          })
      },

      editItem (item) {
        this.editedIndex = this.jobs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.jobs.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.jobs.splice(this.editedIndex, 1)
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
          Object.assign(this.jobs[this.editedIndex], this.editedItem)
        } else {
          this.jobs.push(this.editedItem)
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

