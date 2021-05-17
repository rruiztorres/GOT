<template>
    <div class="h-screen font-sans text-left text-sm">
        <!--header-->
        <div class="w-screen">
            <!--menu-->
            <Sidebar></Sidebar>
            <Header></Header>
        </div> <!--fin header-->


        <!--paneles de rol-->
        <div>
            <Loader></Loader>
        </div>
    </div><!--container principal-->

</template>

<script>
//componentes
import Sidebar from '../components/Sidebar';
import Header from '@/components/Header';
import Loader from '@/components/Loader';


    export default {
        name:"Dashboard",
        components:{
            Sidebar,
            Header,
            Loader,
            },
        
    }

</script>

<style>

</style>