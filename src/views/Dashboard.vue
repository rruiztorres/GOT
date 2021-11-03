<template>
    <v-app class="font-sans subpixel-antialiased">
        <div class="h-screen font-sans text-left text-sm">
            <div class="w-full h-screen bg-blue-50" >
                <Navigation 
                    @cambiomenu="cambiarMenu" 
                    :mini="newMini"
                    class="float-left">
                </Navigation>
               
                <div>
                    <div class="h-20 bg-blue-800 text-white shadow-xl p-5">
                            <div class="flex">
                                <v-btn tile icon dark @click="hacerMini()">
                                    <v-icon large>mdi-view-headline</v-icon>
                                </v-btn>
                                <h6 class="text-xl flex-grow"></h6>
                                <img class="border border-white h-10 mr-6" src="@/assets/logoIGNmini.png">
                            </div>
                    </div>
                </div>
                
                <v-main>
                    <Loader
                        @cambiomenu="cambiarMenu" 
                        :activarMenu="newMenu" 
                        :userRole="userRole">
                    </Loader></v-main>
            </div>
        </div>
    </v-app>
</template>

<script>

//componentes
import Loader from '@/components/common/Loader';
import Navigation from '@/components/common/Navigation';

//mixins
import {roles} from '@/assets/mixins/roles.js';

    export default {
        name:"Dashboard",
        mixins: [roles],
        components:{
            Navigation,
            Loader,
            },

        created(){
            //ejecutamos initialize al cargar pagina
            this.initialize()
        },

        methods: {

            //asigna el panel que debe activarse de acuerdo al array "roles" recibido como mixin property.
            initialize(){
                this.rolDefault = localStorage.rol;
                for(this.rol in roles) {
                    if (roles[this.rol].name == this.rolDefault){
                        this.newMenu = roles[this.rol].default;
                    }
                }
            },

            //...   
            cambiarMenu(data){
                this.newMenu = data;
            },
            //..
             hacerMini(){
                this.newMini = !this.newMini;
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
                numJobOpEsp: 0,
            }
        },
        
       
        
    }

</script>