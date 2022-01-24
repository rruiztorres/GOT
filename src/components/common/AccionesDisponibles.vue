<template>
    <div class="actionBtnGroup">
        <!-- JOB SELECCIONADO PARA TRABAJAR || JOB GENERADO DIRECTO A OPERADOR -->
        <div v-if="accion =='JST' || accion =='JGE' && job.nombre_operador != null">
            <v-btn class="actionBtn" block color="success" @click="dummy(job)">Empezar a Trabajar en el Job</v-btn>
            <v-btn class="actionBtn" block color="error">Devolver a Bandeja</v-btn>
        </div>

        <!-- JOB GENERADO A BANDEJA GENÉRICA -->
        <div v-else-if="accion =='JGE' || accion == 'JBG'">
            <v-btn class="actionBtn" block color="success">Asignarse el Job</v-btn>
        </div>

        <!-- JOB EN TRIAJE || INSERCIÓN JOB MANUAL DESDE GOT -->
        <div v-else-if="accion =='JET' || accion == 'IMA'" >
            <v-btn class="actionBtn" block color="success">Generar el Job</v-btn>
            <v-btn class="actionBtn" block color="error" @click="showDesestimarWindow = true" :loading="loadAction">Desestimar el Job</v-btn>
        </div>

        <!-- JOB RECUPERADO A TRIAJE -->
        <div v-else-if="accion =='JRT'">
            <v-btn class="actionBtn" block color="success">Reasignar el Job</v-btn>
            <v-btn class="actionBtn" block color="error" @click="showDesestimarWindow = true" :loading="loadAction">Desestimar el Job</v-btn>
        </div>


        <!-- NO HAY ACCIONES -->
        <div v-else>
            <v-alert dense type="info"><b>{{log.evento}}</b> no tiene acciones asociadas</v-alert>
        </div>



        <!--JUSTIFICAR ACCION-->
        <v-overlay :value="showDesestimarWindow">
            <JustificarAccion 
            title="Desestimar el Job" 
            text="Indique el motivo por el cual desea desestimar el Job:"
            @close="justifyDesestimate"
            ></JustificarAccion>
        </v-overlay>


        <!--MENSAJES DE INFORMACION-->
        <v-overlay :value="showMessage">
          <v-alert
            :color="messageType"
            dark
            border="top"
            icon="mdi-alert-circle-outline"
            transition="scale-transition"
          >
            {{ message }}
          </v-alert>
        </v-overlay>

    </div>
</template>

<script>
import axios from "axios";

//mixins
import {desestimarJobs} from "@/assets/mixins/desestimarJobs";

//components
import JustificarAccion from "@/components/common/JustificarAccion";



    export default {
        name: "AccionesDisponibles",
        props: ["job"],
        mixins: [desestimarJobs,],
        components: {JustificarAccion,},
        
        data(){
            return {
                accion: null,
                showDesestimarWindow: false,
                log:'',
                loadAction: false,
                showMessage: false,
                messageType: null,
                message: null,
            }
        },

        computed: {
        },

        created(){
            this.getLastAction();
        },
        
        methods:{
            dummy(job){
                console.log("estoy ejecutando un proceso en el job", job.job)
            },

            closeInfo(){
                this.showMessage = false;
            },

            showInfo(message, type) {
                this.showMessage = true;
                this.message = message;
                this.messageType = type;
            },

            updateAction(){
                this.getLastAction();
                this.$emit('updateLog', true);
                this.loadAction = false;
                this.showInfo("Accion realizada correctamente", "success")
                setTimeout(this.closeInfo, 1500)

            },

            justifyDesestimate(data){
                if (data != ''){
                    this.justificacion = data;
                    this.desestimarJobs([this.job], this.justificacion)
                    this.showDesestimarWindow = false;
                    this.loadAction = true;
                    setTimeout(this.updateAction, 2000);
                    //this.$emit('updateLog', true)
                } else {
                    this.showDesestimarWindow = false;
                }
            },

            getLastAction(){
                axios
                .get(`${process.env.VUE_APP_API_ROUTE}/getLogByJob/` + this.job.job)
                .then((data) => {
                    if (data.status == 201) {
                        this.log = data.data.log[0];
                        this.accion = this.log.codigo;
                    }
                });
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