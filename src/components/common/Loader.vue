<template>
<div>
    <div class="bg-blue-800" style="height:9rem;">
        <!--Generador de Jobs-->
        <div v-if="activarMenu == 'altaJobsErrores'"><AltaJobsErrores @closed="menuDefault"></AltaJobsErrores></div>
        <div v-if="activarMenu == 'JobsDevGJ'"><JobsDevGJ></JobsDevGJ></div>
        <div v-if="activarMenu == 'JobsTriajeGJ'"><JobsTriajeGJ></JobsTriajeGJ></div>
        <div v-if="activarMenu == 'AltaExpediente'"><AltaExpediente @closed="menuDefault"></AltaExpediente></div>
        <div v-if="activarMenu == 'EditarExpediente'"><EditarExpediente></EditarExpediente></div>

        <!--Operador especializado-->
        <div v-if="activarMenu == 'BandejaOpEsp'"><BandejaOpEsp></BandejaOpEsp></div>

    </div>
</div>
</template>

<script>
import JobsDevGJ from '@/components/generadorJobs/JobsDevGJ';
import JobsTriajeGJ from '@/components/generadorJobs/JobsTriajeGJ';
import AltaJobsErrores from '@/components/generadorJobs/altaJobsErrores';
import AltaExpediente from '@/components/generadorJobs/altaExpediente';
import EditarExpediente from '@/components/generadorJobs/editarExpediente';
import BandejaOpEsp from '@/components/operadorEsp/BandejaOpEsp';



export default {
    name:'Loader',
    components: {
        JobsDevGJ,
        JobsTriajeGJ,
        AltaJobsErrores,
        AltaExpediente,
        EditarExpediente,
        BandejaOpEsp,
    },

    props: ['activarMenu'],

    methods:{
        menuDefault(data){
            this.$emit('cambiomenu', data);
        }
    },
}
</script>

<style>

</style>