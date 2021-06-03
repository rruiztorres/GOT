<template >
    <div >
        <div class="h-screen font-sans text-left text-sm">
            <!--container-->
            <div class="w-full h-screen" >
                <!--menu-->
                <Navigation @cambiomenu="cambiarMenu" :mini="newMini" class="float-left mr-8"></Navigation>
                <!--header-->
                <Header @cambiarMini="cambioMini"></Header>
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
                console.log("DB -> recibido cambio menu")
            },
            cambioMini(data){
                this.newMini = data;
                console.log("DB -> recibido cambio mini a " + this.newMini)
            },
        },

        data(){
        const userRole = 'Generador de Jobs';
        let newMenu = this.newMenu;
        let newMini = this.mini;

            return{
                userRole,
                newMenu,
                newMini,
    
            }
        },
       
        
    }

</script>

<style>

</style>