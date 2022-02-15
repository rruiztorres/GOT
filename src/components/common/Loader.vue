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
            
            <!--Soporte BDIG -->
            <div v-if="activarMenu == 'BandejaErrCrear'"><BandejaErrCrear></BandejaErrCrear></div>
            <div v-if="activarMenu == 'BandejaErrFin'"><BandejaErrFin></BandejaErrFin></div>

            <!-- GOT Admin -->
            <div v-if="activarMenu == 'GestionUsuarios'"><GestionUsuarios></GestionUsuarios></div>

            <!--GESTOR -->
            <div v-if="activarMenu == 'EstadisticasGestor'"><EstadisticasGestor></EstadisticasGestor></div>
            <div v-if="activarMenu === 'VerMapa'"><VerMapa></VerMapa></div>
            <div v-if="activarMenu ==='JobsGestor'"><JobsGestor></JobsGestor></div>
            <div v-if="activarMenu === 'ErroresGestor'"><ErroresGestor></ErroresGestor></div>
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
    import BandejaErrCrear from "@/components/soporteBDIG/BandejaErrCrear";
    import BandejaErrFin from "@/components/soporteBDIG/BandejaErrFin";
    import GestionUsuarios from "@/components/GOTAdmin/GestionUsuarios";
    import EstadisticasGestor from "@/components/gestor/EstadisticasGestor";
    import VerMapa from "@/components/gestor/VerMapa";
    import JobsGestor from "@/components/gestor/JobsGestor";
    import ErroresGestor from "@/components/gestor/ErroresGestor";

    
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
            BandejaErrCrear,
            BandejaErrFin,
            GestionUsuarios,
            EstadisticasGestor,
            VerMapa,
            JobsGestor,
            ErroresGestor,
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