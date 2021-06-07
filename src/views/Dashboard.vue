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

//mixins
import {roles} from '@/assets/mixins/roles.js';

    export default {
        name:"Dashboard",
        mixins: [roles],
        components:{
            Header,
            Navigation,
            Loader,
            },

        created(){
            this.initialize()
        },

        methods: {
            //asigna panel activo por defecto segun array roles desde mixins
            initialize(){
                this.rolDefault = localStorage.rol;
                for(this.rol in roles) {
                    if (roles[this.rol].name == this.rolDefault){
                        this.newMenu = roles[this.rol].default;
                    }
                }
            },

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