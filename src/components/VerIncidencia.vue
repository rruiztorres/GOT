<template>
<div class="bg-gray-200 pb-6">
    <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Incidencia {{incidencia.id_inc}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="w-24 bg-red-500 mr-5" dark text @click="closeDialog">CANCELAR</v-btn>
          <v-btn class="w-24 bg-green-500" dark text>GUARDAR</v-btn>
        </v-toolbar>
  <div class="flex">

    <!--MAP--> 
    <vl-map 
        :load-tiles-while-animating="false" 
        :load-tiles-while-interacting="true"
        data-projection="EPSG:4326"
        class="mt-4 ml-4 shadow-lg border border-white" 
        style="height: 800px">

        <vl-view 
            :zoom.sync="zoom" 
            :center.sync="center">
        </vl-view>

    <!-- MI MAPA CANVAS -->
        <vl-layer-tile id="osm">
            <vl-source-osm></vl-source-osm>
        </vl-layer-tile>

    <!--GEOMETRIAS MAPA-->
        <vl-layer-vector>
            <vl-feature>
                <vl-geom-point
                    :coordinates="error">
                </vl-geom-point>

                <vl-style-box>
                    <vl-style-circle :radius="10">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                    </vl-style-circle>
                </vl-style-box>
            </vl-feature>
        </vl-layer-vector>
    </vl-map>
    
        <!--PANEL DATOS INCIDENCIA-->
        <div class="w-3/5 m-4 p-2">
            <div>
                <h1 class="text-xl mb-1">DATOS DE LA INCIDENCIA</h1>
                <table class="mr-6 text-justify shadow-md w-full">
                <tbody>
                    <tr class="bg-gray-100"><td class="p-3"><b>Estado:</b></td><td class="p-3">{{incidencia.estado}}</td></tr>
                    <tr class="bg-white"><td class="p-3"><b>Prioridad:</b></td><td class="p-3">{{incidencia.prioridad}}</td></tr>
                    <tr class="bg-gray-100"><td class="p-3"><b>Procedencia:</b></td><td class="p-3">{{incidencia.procedencia}}</td></tr>
                    <tr class="bg-white"><td class="p-3"><b>Seguimiento:</b></td><td class="p-3"></td></tr>
                    <tr class="bg-gray-100"><td class="p-3"><b>Descripción:</b></td><td class="p-3">{{incidencia.descripcion}}</td></tr>
                    
                </tbody>
                </table>
            
               
            <br/>
                <h1 class="text-xl mb-1">JOBS ASOCIADOS A LA INCIDENCIA {{incidencia.id_inc}}</h1>
                <table class="p-6 text-justify shadow-md w-full">
                <tbody>
                    <tr class="bg-gray-100">
                        <td class="p-3"><b>IGN_C_202100001-J01</b></td>
                        <td class="p-3">Patatin</td>
                        <td class="p-3">Fulano</td>
                        <td class="p-3">Mengano</td>
                    </tr>
                    <tr class="bg-gray-100">
                        <td class="p-3"><b>IGN_C_202100001-J02</b></td>
                        <td class="p-3">Patatin</td>
                        <td class="p-3">Fulano</td>
                        <td class="p-3">Mengano</td>
                    </tr>
                    
                </tbody>
                </table>
            </div>
            

            <div class="mt-6">
                Zoom: {{ zoom }}<br>
                Center: {{ center }}<br>
            </div>
        </div>
    </div>
    
</div>
</template>

<script>
import {getColor} from '@/assets/mixins/getColor.js';

  export default {
    props: ['incidencia', 'error' ,'center'],
    mixins: [getColor],
    watch: {
        incidencia(){
            console.log("ha cambiado la incidencia")},
    },
    methods:{
        closeDialog(){
            this.dialog = false;
            this.$emit('dialog', this.dialog);
        }
    },
    data () {
        return { 
                zoom: 15,
            }
    },
  }
</script>