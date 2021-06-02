<template>
<div>

    <div v-if="activarMenu == 'IncTriajeGJ'"><IncTriajeGJ></IncTriajeGJ></div>
    <div v-if="activarMenu == 'IncBdjGJ'"><IncBdjGJ></IncBdjGJ></div>

</div>
</template>

<script>
import IncTriajeGJ from '@/components/generadorJobs/IncTriajeGJ';
import IncBdjGJ from '@/components/generadorJobs/IncBdjGJ'


export default {
    name:'Loader',
    components: {
        IncTriajeGJ,
        IncBdjGJ,
    },
    props: {
        activarMenu: {
            type: String,
            default: 'IncTriajeGJ',
        },
    },
}
</script>

<style>

</style>