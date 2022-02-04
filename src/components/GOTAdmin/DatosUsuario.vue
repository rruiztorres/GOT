<template>
    <v-card class="cardContainer">
        {{usuario}}
    </v-card>
</template>

<script>

export default{
    name: 'DatosUsuario',
    props: ["usuario"],
    data(){
        return {
            foo: null
        }
    }
}
</script>

<style scoped>
    .cardContainer {
        height: 75vh;
        padding: 1rem;
    }
</style>
