<template>
<div class="bg-white p-6">
  <div class="flex">
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
             data-projection="EPSG:4326" style="height: 700px">
      <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>

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
    
        <div class="w-2/5 ml-4">
            <h1 class="text-xl py-2 mb-2">Consulta de Incidencia: <br/>
                <b>{{incidencia.id_inc}}</b> 
            </h1>
            <div>
                Estado: {{incidencia.estado}}<br/>
                Prioridad: {{incidencia.prioridad}}<br/>
                Procedencia: {{incidencia.procedencia}}<br/>
                Zoom: {{ zoom }}<br>
                Center: {{ center }}<br>
            <br/>
            <hr/>
                <h1 class="text-xl py-2 mb-2">Jobs Asociados a la incidencia</h1>
                <h2>{{incidencia.geometria_job}}</h2>
            </div>
            
        </div>
    </div>
    
</div>
</template>

<script>
  export default {
    props: ['incidencia'],
    watch: {
        incidencia(){
            console.log("ha cambiado la incidencia");
        },
    },
    data () {
      return { 
                zoom: 16,
                center:  [2.8921749697459456, 39.4950283449287],
                error: [2.8921749697459456, 39.4950283449287],
                job: this.incidencia.geometria_job,
            }
    },
  }
</script>