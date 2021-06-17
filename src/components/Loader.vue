<template>
<div>

    <!--Generador de Jobs-->
    <div v-if="activarMenu == 'IncTriajeGJ'"><IncTriajeGJ></IncTriajeGJ></div>
    <div v-if="activarMenu == 'IncBdjGJ'"><IncBdjGJ></IncBdjGJ></div>
    <div v-if="activarMenu == 'JobsDevGJ'"><JobsDevGJ></JobsDevGJ></div>
    <div v-if="activarMenu == 'JobsTriajeGJ'"><JobsTriajeGJ></JobsTriajeGJ></div>
    <div v-if="activarMenu == 'NuevaIncGJ'"><NuevaIncGJ></NuevaIncGJ></div>

</div>
</template>

<script>
import NuevaIncGJ from '@/components/generadorJobs/NuevaIncGJ';
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
        NuevaIncGJ,
    },
    props: {
        activarMenu: {
            type: String,
        },
    },
}
</script>

<style>

</style>