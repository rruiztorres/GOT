<template>
    <div class="loaderBack">
        <div>
            <!--Generador de Jobs-->
            <div v-if="activarMenu == 'altaJobsErrores'"><AltaJobsErrores @closed="menuDefault"></AltaJobsErrores></div>
            <div v-if="activarMenu == 'JobsTriajeGJ'"><JobsTriajeGJ></JobsTriajeGJ></div>
            <div v-if="activarMenu == 'GestionExpedientes'"><GestionExpedientes></GestionExpedientes></div>
            <div v-if="activarMenu == 'RecuperarJobs'"><RecuperarJobs></RecuperarJobs></div>
            <div v-if="activarMenu == 'ErroresNoAsign'"><ErroresNoAsign></ErroresNoAsign></div>

            <!--Operador especializado-->
            <div v-if="activarMenu == 'BandejaOpEsp'"><BandejaOpEsp></BandejaOpEsp></div>
            <!--Comun a ambos -->
            <div v-if="activarMenu == 'BandejaMisJobs'"><BandejaMisJobs></BandejaMisJobs></div>
            <!--Operador-->
            <div v-if="activarMenu == 'BandejaOp'"><BandejaOp></BandejaOp></div>
        </div>
    </div>
</template>

<script>
    import JobsTriajeGJ from '@/components/generadorJobs/JobsTriajeGJ';
    import AltaJobsErrores from '@/components/generadorJobs/altaJobsErrores';
    import GestionExpedientes from '@/components/generadorJobs/GestionExpedientes';
    import BandejaOpEsp from '@/components/operadorEsp/BandejaOpEsp';
    import BandejaOp from '@/components/operadores/BandejaOp';
    import BandejaMisJobs from '@/components/common/BandejaMisJobs';
    import RecuperarJobs from '@/components/generadorJobs/RecuperarJobs';
    import ErroresNoAsign from '@/components/generadorJobs/ErroresNoAsign';

    export default {
        name:'Loader',
        components: {
            JobsTriajeGJ,
            AltaJobsErrores,
            GestionExpedientes,
            BandejaOpEsp,
            BandejaOp,
            BandejaMisJobs,
            RecuperarJobs,
            ErroresNoAsign,
        },

        props: ['activarMenu'],

        methods:{
            menuDefault(data){
                this.$emit('cambiomenu', data);
            },
        },
    }
</script>

<style scoped>
    .loaderBack {
        height: 10.7rem;
        background-color: #1e40af;
    }
</style>