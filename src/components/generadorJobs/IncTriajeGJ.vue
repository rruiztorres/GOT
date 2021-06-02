<template>
    <div class="mx-8">

      <h1 class="ml-2 text-2xl font-bold my-6">
      Incidencias en Triaje
      </h1>

      <v-app> 
        <div class="overflow-y-auto">
        
          <v-data-table
            :headers="headers"
            :items="incidencias"
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

                <v-dialog v-model="dialog" max-width="1700">
                  <div class="bg-white p-6">
                    <h1>Hago cosas</h1>
                  </div>
                </v-dialog>
                
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                   <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                   <h3 class="text-center text-l">Esta acción borrará la incidencia actual ¿Desea continuar?</h3>
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

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>

            <template v-slot:item.estado="{item}">
              <v-chip :color="getColor(item.estado)" dark>
                {{ item.estado }}
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


  export default {
    name:'IncTriajeGJ',
    mixins: [getColor],
    
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search:'',
      headers: [
        { text: 'Incidencia', align: 'start', sortable: true, value: 'id_inc' },
            { text: 'Estado', align: 'start', sortable: true, value: 'estado' },
            { text: 'Vía Entrada', align: 'start', sortable: true, value: 'via_ent' },
            { text: 'Prioridad', align: 'start', sortable: true, value: 'prioridad' },
            { text: 'Seguimiento', align: 'start', sortable: true, value: 'seguimiento' },
            { text: 'Procedencia', align: 'start', sortable: true, value: 'procedencia' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      incidencias: [],
      editedIndex: -1,
      editedItem: {
        id_inc:'',
        estado:'',
        via_ent:'',
        prioridad:'',
        seguimiento:'',
        procedencia:'',
      },
      defaultItem: {
        id_inc:'',
        estado:'',
        via_ent:'',
        prioridad:'',
        seguimiento:'',
        procedencia:'',
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
                              if (this.incidenciasBruto[this.elemento].estado == 'En Triaje') {
                               this.incidencias.push(this.incidenciasBruto[this.elemento])            
                              }     
                          }
          //debug
          console.log('InciGEO (IncTriajeGJ) -> Incidencias recuperadas y filtradas correctamente'); 
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

