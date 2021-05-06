<template>
<v-app>
  <v-data-table
    :headers="headers"
    :items="incidencias"
    :search="search"
    sort-by="calories"
    class="font-sans"
  >
    

    <template v-slot:top>
      <v-text-field
        v-model="search"
        label="Buscar"
        class="mx-4"
      ></v-text-field>

      <v-toolbar
        flat
      >
        <v-toolbar-title><span class="text-2xl">Incidencias en Triaje</span></v-toolbar-title>

        <v-dialog v-model="dialog" max-width="1700">
        <div class="bg-white p-6">
          <h1>Hago cosas</h1>
        </div>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
    <template v-slot:item.estado="{item}">
          <v-chip
            :color="getColor(item.estado)"
            dark
          >
            {{ item.estado }}
          </v-chip>
        </template>
  </v-data-table>
</v-app>
</template>

<script>
import axios from 'axios';

  export default {
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
          .then(data => {this.incidencias = data.data.response, console.log(data.data)})
      },

      getColor (estado) {
        if (estado == 'Pendiente') return '#ffd000'; //amarillo
        else if (estado == 'Solucionada') return '#228B22'; //verde
        else if (estado == 'Devuelto') return '#FF0000' //rojo
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

