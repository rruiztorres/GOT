<template >
    <div >
        <div class="h-screen font-sans text-left text-sm">
            <!--container-->
            <div class="w-full h-full" >
                <!--menu-->
                <Navigation @cambiomenu="cambiarMenu" :userRole="userRole" class="float-left mr-8"></Navigation>
                <!--header-->
                <Header></Header>
                <!--paneles de rol-->
                <Loader class="mr-8" :activarMenu="newMenu" :userRole="userRole"></Loader>
            </div>
        </div>
    </div>
</template>

<script>
//componentes
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import Navigation from '@/components/Navigation';

    export default {
        name:"Dashboard",
        components:{
            Header,
            Navigation,
            Loader,
            },

        methods: {
            cambiarMenu(data){
                this.newMenu = data;
            }
        },

        data(){
        const userRole = 'Generador de Jobs';
        let newMenu = this.newMenu;
            return{
                userRole,
                newMenu,
                
            }
        },
       
        
    }

</script>

<style>

</style>