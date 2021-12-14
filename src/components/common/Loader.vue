<template>
    <div class="bg-blue-800" style="height:10.05rem;">
        <!--Generador de Jobs-->
        <div v-if="activarMenu == 'altaJobsErrores'"><AltaJobsErrores @closed="menuDefault"></AltaJobsErrores></div>
        <div v-if="activarMenu == 'JobsTriajeGJ'"><JobsTriajeGJ></JobsTriajeGJ></div>
        <div v-if="activarMenu == 'AltaExpediente'"><AltaExpediente @closed="menuDefault"></AltaExpediente></div>
        <div v-if="activarMenu == 'EditarExpediente'"><EditarExpediente></EditarExpediente></div>
        <div v-if="activarMenu == 'RecuperarJobs'"><RecuperarJobs></RecuperarJobs></div>
        <div v-if="activarMenu == 'ErroresNoAsign'"><ErroresNoAsign></ErroresNoAsign></div>

        <!--Operador especializado-->
        <div v-if="activarMenu == 'BandejaOpEsp'"><BandejaOpEsp></BandejaOpEsp></div>
        <!--Comun a ambos -->
        <div v-if="activarMenu == 'BandejaMisJobs'"><BandejaMisJobs></BandejaMisJobs></div>
        <!--Operador-->
        <div v-if="activarMenu == 'BandejaOp'"><BandejaOp></BandejaOp></div>

    </div>
</template>

<script>
    import JobsTriajeGJ from '@/components/generadorJobs/JobsTriajeGJ';
    import AltaJobsErrores from '@/components/generadorJobs/altaJobsErrores';
    import AltaExpediente from '@/components/generadorJobs/altaExpediente';
    import EditarExpediente from '@/components/generadorJobs/editarExpediente';
    import BandejaOpEsp from '@/components/operadorEsp/BandejaOpEsp';
    import BandejaOp from '@/components/common/BandejaOp';
    import BandejaMisJobs from '@/components/common/BandejaMisJobs';
    import RecuperarJobs from '@/components/generadorJobs/RecuperarJobs';
    import ErroresNoAsign from '@/components/generadorJobs/ErroresNoAsign';



    export default {
        name:'Loader',
        components: {
            JobsTriajeGJ,
            AltaJobsErrores,
            AltaExpediente,
            EditarExpediente,
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