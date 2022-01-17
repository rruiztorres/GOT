<template>
    <!-- JOB SELECCIONADO PARA TRABAJAR || JOB GENERADO DIRECTO A OPERADOR -->
    <div v-if="accion =='JST' || accion =='JGE' && job.nombre_operador != null" class="actionBtnGroup">
        <v-btn class="actionBtn" block color="success" @click="dummy(job)">Empezar a Trabajar en el Job</v-btn>
        <v-btn class="actionBtn" block color="error">Devolver a Bandeja</v-btn>
    </div>

    <!-- JOB GENERADO A BANDEJA GENÉRICA -->
    <div v-else-if="accion =='JGE' || accion == 'JBG'" class="actionBtnGroup">
        <v-btn class="actionBtn" block color="success">Asignarse el Job</v-btn>
    </div>

    <!-- JOB EN TRIAJE || INSERCIÓN JOB MANUAL DESDE GOT -->
    <div v-else-if="accion =='JET' || accion == 'IMA'" class="actionBtnGroup">
        <v-btn class="actionBtn" block color="success">Generar el Job</v-btn>
        <v-btn class="actionBtn" block color="error">Desestimar el Job</v-btn>
    </div>

    <!-- JOB RECUPERADO A TRIAJE -->
    <div v-else-if="accion =='JRT'" class="actionBtnGroup">
        <v-btn class="actionBtn" block color="success">Reasignar el Job</v-btn>
        <v-btn class="actionBtn" block color="error">Desestimar el Job</v-btn>
    </div>


    <!-- NO HAY ACCIONES -->
    <div v-else class="actionBtnGroup">
        <v-alert dense type="info"><b>{{log[0].title}}</b> no tiene acciones asociadas</v-alert>
    </div>
</template>

<script>
    export default {
        name: "AccionesDisponibles",
        props: ["log", "job"],
        
        data(){
            return {
                accion: null,
            }
        },

        computed: {
            returnLog(){
                return this.log
            }
        },

        created(){
            this.getLastAction();
        },
        
        methods:{
            dummy(job){
                console.log("estoy ejecutando un proceso en el job", job.job)
            },

            getLastAction(){
                this.accion = this.log[0].procDesc
            }
        }
    };
</script>

<style scoped>
    .actionBtn {
        font-weight: 400 !important;
        margin: 0rem 0.5rem 0.5rem 0rem;
    }

</style>