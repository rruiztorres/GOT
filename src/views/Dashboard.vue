<template>
    <div class="h-screen font-sans text-left text-sm">
        <!--header-->
        <div class="w-screen">
            <!--menu-->
            <aside class="h-screen w-64 p-4 shadow-md mx-8 float-left bg-white bg-opacity-80 ">
                <!--user-->
                <div class="mt-2 flex items-center">
                    <div class="rounded-full w-12 h-12 bg-white border">
                        <h6 class="mt-2 text-xl text-center">RR</h6>
                    </div>
                    <div class="ml-2 text-gray-700">
                        <h6 class="text-xs font-bold">rrtorres</h6>
                        <p>Generador de Jobs</p>
                    </div>
                </div> <!-- fin user --> 
                <div class="flex mt-4">
                    <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
                        <CogIcon></CogIcon>
                    </span> <!--configuracion-->
                    <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
                    <CalendarIcon></CalendarIcon>
                        </span> <!--calendario-->
                    <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
                    <ViewListIcon></ViewListIcon>
                        </span> <!--cambio de rol-->
                    <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
                        <LogoutIcon></LogoutIcon>
                    </span> <!--logout -->
                    
                </div>
            </aside> <!--menu-->

            <div class="p-6 bg-blue-900 text-white shadow-xl">
                <span class="flex items-center">
                <h6 class="text-xl flex-grow">InciGEO</h6>
                <img class="border border-white h-10 mr-6" src="../assets/logoIGN.jpg">
                </span>
            </div>
            <div class="p-4 bg-blue-800 text-white">
                <span class="flex mr-8">
                <h6 class="flex-grow">Dashboard</h6>
                <h6>InciGEO > Dashboard</h6>
                </span>
            </div>
        </div> <!--fin header-->


        <!--paneles de rol-->
        <div>
            <panelGJ>
            </panelGJ>
        </div>
    </div><!--container principal-->

</template>

<script>
//iconos svg
import Vue from 'vue';
import { CogIcon } from "@vue-hero-icons/solid"; Vue.component('CogIcon', CogIcon);
import { CalendarIcon } from "@vue-hero-icons/solid"; Vue.component('CalendarIcon', CalendarIcon);
import { UserIcon } from "@vue-hero-icons/solid"; Vue.component('UserIcon', UserIcon);
import { ViewListIcon } from "@vue-hero-icons/solid"; Vue.component('ViewListIcon', ViewListIcon);
import { LogoutIcon } from "@vue-hero-icons/solid"; Vue.component('LogoutIcon', LogoutIcon);

//componentes
import panelGJ from '../components/panelGJ.vue';
    export default {
        name:"Dashboard",
        components:{
            panelGJ
        }
    }
</script>

<style>

</style>