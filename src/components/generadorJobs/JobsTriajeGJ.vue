<template>
    <div class="mx-8">

      <h1 class="ml-2 text-2xl font-bold my-6">
      Jobs en Triaje
      </h1>

      <v-app> 
        <div class="overflow-y-auto">
        
          <v-data-table
            :headers="headers"
            :items="jobs"
            :search="search"
            class="font-sans"
            style="max-height:47rem;"
            >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                label="Buscar"
                class="mx-4"
              ></v-text-field>
            
              <v-toolbar flat>
                
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

              </v-toolbar>
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

import VerIncidencia from '@/components/VerIncidencia';


  export default {
    name:'JobsDevGJ',
    mixins: [getColor],
    components: {
      VerIncidencia,
    },

    data: () => ({
      dialog: false,
      dialogDelete: false,
      search:'',
      headers: [
        { text: 'Job', align: 'start', sortable: true, value: 'id_inc'},
        { text: 'Estado', align: 'start', sortable: true, value: 'job_estado' },
        { text: 'Prioridad', align: 'start', sortable: true, value: 'job_prioridad' },
        { text: 'Detectado en', align: 'start', sortable: true, value: 'job_detectado' },
        { text: 'Arreglar en', align: 'start', sortable: true, value: 'job_arreglar' },
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
          //se realiza el filtro para los jobs en Triaje y la asignación del job_id
          .then(data => {
                          this.jobsBruto = data.data.response;
                          for (this.elemento in this.jobsBruto) {
                              //referenciamos los -J01, -J02, etc. por cada incidencia.
                              this.jobsBruto[this.elemento].id_inc = this.jobsBruto[this.elemento].id_inc+'-J'+this.jobsBruto[this.elemento].job_id
                              //filtramos jobs segun estado
                              if (this.jobsBruto[this.elemento].job_estado == 'En Triaje') {
                               this.jobs.push(this.jobsBruto[this.elemento])            
                              }     
                          }
          //debug
          //console.log('InciGEO (JobsTriajeGJ) -> Jobs recuperados y filtrados correctamente'); 
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

