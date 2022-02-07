<template>
<div id="app">
  <vl-map ref="map" data-projection="EPSG:3857">
    <vl-view :zoom.sync="zoom" :center.sync="center"></vl-view>
    
    <vl-layer-tile>
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>
    <vl-layer-vector-tile ref="vectorTileLayer">
      <vl-source-vector-tile :url="url"></vl-source-vector-tile>
    </vl-layer-vector-tile>
  </vl-map>
</div>
</template>

<script>
  export default {
        name: 'VectorTileMap',
    
        data () {
            return { 
                zoom: 2,
                center: [0, 0],
                url: 'https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/11/791/1016.pbf?token=AAPK9bd1fbc69f0b41c1acbefc67a6ec3738_dA6L31Mo_jYLwhQ5awh_9wMAP_c_ov-WxHn1ePvss9fM09ZH2WFioY8ZDmWJc8F',
            }
        },
  }
</script>

<style scoped>
  #app{
    height: 100vh;
  }
</style>