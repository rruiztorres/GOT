<template>
  <div class="mx-8">
    <h1 class="ml-2 text-2xl font-bold my-6">
    Incidencias en Bandeja
    </h1>
    <div class="myTable">
    <v-app>
      <v-data-table
        :headers="cabecera"
        :items="incidencias"
        :items-per-page='10'
        :search="search"
        class="myTable"
        loading-text="Recuperando datos..."
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Buscar"
            class="mx-4"
          ></v-text-field>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';

  export default {
    data () {
        return {
          search:'',
          cabecera: [
            { text: 'Incidencia', align: 'start', sortable: true, value: 'id_inc' },
            { text: 'Estado', align: 'start', sortable: true, value: 'estado' },
            { text: 'Vía Entrada', align: 'start', sortable: true, value: 'via_ent' },
            { text: 'Prioridad', align: 'start', sortable: true, value: 'prioridad' },
            { text: 'Seguimiento', align: 'start', sortable: true, value: 'seguimiento' },
            { text: 'Procedencia', align: 'start', sortable: true, value: 'procedencia' },
            
          ],
          incidencias: [] //<-- recibimos datos desde mounted
      }
    },
    mounted(){
        const url = 'http://10.13.86.114:3000/'; //url del servicio
        axios
          .get(url+'incidencias')
          .then(data => {this.incidencias = data.data, console.log(data.data)})
    },
    methods: {
      getColor (estado) {
        if (estado == 'Pendiente') return '#FFC300'; //amarillo
        else if (estado == 'Solucionada') return '#228B22'; //verde
        else if (estado == 'Devuelto') return '#FF0000' //rojo
      },
    }
    
  }

</script>
  
<style>
  .v-application--wrap {
    min-height: 1vh !important;
  }
</style>