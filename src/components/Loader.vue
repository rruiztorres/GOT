<template>
<div>
    <div class="bg-blue-800" style="height:8.4rem;">
        <!--Generador de Jobs-->
        <div v-if="activarMenu == 'IncTriajeGJ'"><IncTriajeGJ></IncTriajeGJ></div>
        <div v-if="activarMenu == 'IncBdjGJ'"><IncBdjGJ></IncBdjGJ></div>
        <div v-if="activarMenu == 'JobsDevGJ'"><JobsDevGJ></JobsDevGJ></div>
        <div v-if="activarMenu == 'JobsTriajeGJ'"><JobsTriajeGJ></JobsTriajeGJ></div>
        <div v-if="activarMenu == 'NuevaIncidenciaGJ'"><NuevaIncidenciaGJ @closed="menuDefault"></NuevaIncidenciaGJ></div>
    </div>
</div>
</template>

<script>
import NuevaIncidenciaGJ from '@/components/generadorJobs/NuevaIncidenciaGJ';
import IncTriajeGJ from '@/components/generadorJobs/IncTriajeGJ';
import IncBdjGJ from '@/components/generadorJobs/IncBdjGJ';
import JobsDevGJ from '@/components/generadorJobs/JobsDevGJ';
import JobsTriajeGJ from '@/components/generadorJobs/JobsTriajeGJ';



export default {
    name:'Loader',
    components: {
        IncTriajeGJ,
        IncBdjGJ,
        JobsDevGJ,
        JobsTriajeGJ,
        NuevaIncidenciaGJ,
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