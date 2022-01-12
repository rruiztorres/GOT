<template>
  <div class="noData">
    <img src="@/assets/img/no-data.png" />
    <h2>{{mensaje}}</h2>
    <h4>{{opcion}}</h4>
  </div>
</template>

<script>

export default {
    name: "NoData",

    props: ["mensaje", "opcion"],

    computed: {
      returnMensaje() {
        return this.mensaje, this.opcion
      }
    }
}

</script>
