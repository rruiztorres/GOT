<template>
    <div class="actionsWrapper" v-if="loadAction != true">
        <!-- JOB SELECCIONADO PARA TRABAJAR || JOB GENERADO DIRECTO A OPERADOR -->
        <div v-if="accion =='JST' || accion =='JAO' || accion =='JGE' && job.nombre_operador != null">
            <div v-if="activeRole === 'Operador' || activeRole === 'Operador Especializado'">
                <v-btn class="actionBtn" block color="success" @click="createVersion">Solicitar Versión</v-btn>
                <v-btn class="actionBtn" block color="error" @click="showDevolverWindow = true">Devolver a Bandeja</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="success">Job generado correctamente</v-alert>
            </div>
        </div>

        <!-- JOB GENERADO A BANDEJA GENÉRICA -->
        <div v-else-if="accion =='JGE' || accion == 'JBG'">
            <div v-if="activeRole === 'Operador Especializado' || activeRole === 'Operador'">
                <v-btn class="actionBtn" block color="success" @click="asignJob">Asignarse el Job</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="success">El job ya ha sido asignado</v-alert>
            </div>
        </div>

        <!-- JOB EN TRIAJE || INSERCIÓN JOB MANUAL DESDE GOT -->
        <div v-else-if="accion =='JET' || accion == 'IMA' || accion == 'IEM' || accion == 'JCR' || accion == 'JMD'">
            <v-btn class="actionBtn" block color="success" @click="generateJobErrors">Generar el Job</v-btn>
            <v-btn class="actionBtn" block color="warning" @click="sendConsulta">Enviar a consulta</v-btn>
            <v-btn class="actionBtn" block color="error" @click="showDesestimarWindow = true">Desestimar el Job</v-btn>
        </div>

        <!-- JOB ENVIADO A CONSULTA -->
        <div v-else-if="accion =='JEC'">
            <v-btn class="actionBtn" block color="success" @click="showConsultaWindow = true">Consulta Resuelta</v-btn>
        </div>

        <!-- JOB RECUPERADO A TRIAJE -->
        <div v-else-if="accion ==='JRT'||accion === 'JDT'">
            <div v-if="activeRole === 'Generador de Jobs'">
                <v-btn class="actionBtn" block color="success" @click="generateJobErrors">Generar el Job</v-btn>
                <v-btn class="actionBtn" block color="warning" @click="sendConsulta">Enviar a consulta</v-btn>
                <v-btn class="actionBtn" block color="error" @click="showDesestimarWindow = true" >Desestimar el Job</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="success">El job ha sido devuelto a triaje</v-alert>
            </div>
        </div>

        <!-- JOB RECUPERADO A TRIAJE -->
        <div v-else-if="accion === 'VGE'|| accion === 'EPS'">
            <div v-if="activeRole === 'Operador' || activeRole === 'Operador Especializado'">
                <v-btn class="actionBtn" block color="success" @click="startWorkingOnJob">Empezar a trabajar</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="success">El job ha sido enviado a su operador.</v-alert>
            </div>
        </div>

        <!-- ERROR CREAR VERSION -->
        <div v-else-if="accion =='VER'">
            <div v-if="activeRole === 'Soporte BDIG'">
                <v-btn class="actionBtn" block color="warning">Relanzar Versionado</v-btn>
                <v-btn class="actionBtn" block color="success" @click="checkSolution">Marcar como solucionado</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="info">La versión no se ha generado correctamente. Un usuario de Soporte BDIG atenderá la incidencia.</v-alert>
            </div>
        </div>

        <!-- EL OPERADOR TRABAJA EN EL JOB -->
        <div v-else-if="accion =='JEJ' || accion == 'ESO' || accion == 'EDE'">
            <div v-if="activeRole === 'Operador' || activeRole === 'Operador Especializado'">
                <v-btn class="actionBtn" block color="success" @click="checkFinalizar">Finalizar Job</v-btn>
                <v-btn class="actionBtn" block color="warning" @click="showPauseWindow = true">Pausar Job</v-btn>
                <v-btn class="actionBtn" block color="info">Solicitar soporte</v-btn>
                <v-btn class="actionBtn" block color="error" @click="showDevolverAtriajeWindow = true">Devolver el Job a triaje</v-btn>
            </div>
            <div v-else>
                <v-alert dense type="info">No existen acciones disponibles</v-alert>
            </div>
        </div>

        <!-- ERROR FIN PARA USUARIO -->
        <div v-else-if="accion =='EFT'">
            <v-alert dense type="error">
                Se han detectado errores en las validaciones sin justificar o solucionar. 
                Revise el job en el entorno de edición. Cuando haya terminado vuelva a esta
                ventana y ejecute de nuevo "Finalizar Job"
            </v-alert>
            <v-btn class="actionBtn" block color="success" @click="checkFinalizar">Finalizar Job</v-btn>
        </div>

        <!-- JOB EN PAUSA -->
        <div v-else-if="accion =='JPO'">
            <v-btn class="actionBtn" block color="success" @click="returnEjecucion">Volver a ejecución</v-btn>
        </div>

        <!-- NO HAY ACCIONES -->
        <div v-else>
            <v-alert dense type="info"><b>{{log.evento}}</b> no tiene acciones asociadas</v-alert>
        </div>



        <!--TODO: podriamos modelar esto -->
        <!--JUSTIFICAR DESESTIMAR-->
        <v-overlay :value="showDesestimarWindow">
            <JustificarAccion 
            title="Desestimar el Job" 
            text="Indique el motivo por el cual desea desestimar el Job:"
            @close="justifyDesestimate"
            ></JustificarAccion>
        </v-overlay>

        <!--JUSTIFICAR DEVOLVER JOB A BANDEJA-->
        <v-overlay :value="showDevolverWindow">
            <JustificarAccion 
            title="Devolver el Job a Bandeja" 
            text="Indique el motivo por el cual desea devolver el Job a bandeja:"
            @close="justifyReturn"
            ></JustificarAccion>
        </v-overlay>

        <!-- JUSTIFICAR DEVOLVER A TRIAJE-->
        <v-overlay :value="showDevolverAtriajeWindow">
            <JustificarAccion 
            title="Devolver Job a Triaje" 
            text="Indique brevemente el problema con el job:"
            @close="justifyReturnTriaje"
            ></JustificarAccion>
        </v-overlay>

        <!--JUSTIFICAR PAUSA-->
        <v-overlay :value="showPauseWindow">
            <JustificarAccion 
            title="Pausar Job" 
            text="Indique el motivo por el cual desea pausar el Job:"
            @close="justifyPause"
            ></JustificarAccion>
        </v-overlay>

        <!-- CONSULTA RESUELTA-->
        <v-overlay :value="showConsultaWindow">
            <JustificarAccion 
            title="Consulta resuelta" 
            text="Indique brevemente la solución a la consulta:"
            @close="resolveConsulta"
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
    <div v-else>
        <v-progress-circular
            class="loading"
            :size="80"
            :width="5"
            color="primary"
            indeterminate
        ></v-progress-circular>
        <p class="loadText">Por favor, espere</p>
    </div>
</template>

<script>
import axios from "axios";

//MIXINS
import {desestimarJobs} from "@/assets/mixins/proceso/desestimarJobs";
import {asignarmeJob} from "@/assets/mixins/proceso/asignarmeJob";
import {returnJob} from "@/assets/mixins/proceso/returnJob";
import {startJob} from "@/assets/mixins/proceso/startJob";
import {startWorking} from "@/assets/mixins/proceso/startWorking";
import {pausarJob} from "@/assets/mixins/proceso/pausarJob";
import {volverEjecucion} from "@/assets/mixins/proceso/volverEjecucion";
import {marcarErrVersSolu} from "@/assets/mixins/proceso/marcarErrVersSolu";
import {enviarAconsulta} from "@/assets/mixins/proceso/enviarAconsulta";
import {consultaResuelta} from "@/assets/mixins/proceso/consultaResuelta";
import {generarJobError} from "@/assets/mixins/generarJobError";
import {devolverJobTriaje} from "@/assets/mixins/proceso/devolverJobTriaje";
import {finalizarJob} from "@/assets/mixins/proceso/finalizarJob";

//COMPONENTS
import JustificarAccion from "@/components/common/JustificarAccion";

    export default {
        name: "AccionesDisponibles",
        props: ["job", "errores"],
        mixins: [
            desestimarJobs, 
            asignarmeJob, 
            returnJob, 
            startJob, 
            startWorking, 
            pausarJob, 
            volverEjecucion, 
            marcarErrVersSolu, 
            enviarAconsulta,
            consultaResuelta,
            generarJobError,
            devolverJobTriaje,
            finalizarJob,
        ],
        components: {JustificarAccion,},
        
        data(){
            return {
                accion: null,
                showDesestimarWindow: false,
                showDevolverWindow: false,
                showDevolverAtriajeWindow: false,
                showPauseWindow: false,
                showConsultaWindow: false,
                log:'',
                loadAction: false,
                showMessage: false,
                messageType: "success",
                message: "Accion realizada correctamente",
                activeRole: localStorage.rol,
            }
        },

        created(){
            this.getLastAction();
        },
        
        methods:{
            generateJobErrors(){
                this.loadAction = true;
                this.generarJobError([this.job], this.errores)
                setTimeout(this.updateAction, 1000)
            },

            checkFinalizar(){
                this.ejecucion = true;

                if(this.errores.length != 0){
                    for (this.index in this.errores){
                        if(this.errores[this.index].estado != 'Solucionado'){
                            this.ejecucion = false;
                        }
                    }
                }

                //AVISO EN CASO DE QUE EXISTAN ERRORES SIN SOLUCIONAR O DESESTIMAR
                if (this.ejecucion === false){
                    this.showInfo("Existen errores pendientes de solucionar o desestimar", "error")
                    setTimeout(this.closeInfo, 1500)
                } else {
                    this.loadAction = true;
                    this.finalizarJob(this.job);
                    setTimeout(this.updateAction, 5500)
                }
            },

            resolveConsulta(data){
                this.showConsultaWindow = false;
                if (data != ''){
                    this.loadAction = true;
                    this.consultaResuelta(this.job, data)
                    setTimeout(this.updateAction, 1000)
                }
            },

            sendConsulta(){
                this.loadAction = true; 
                this.enviarAconsulta(this.job);
                setTimeout(this.updateAction, 1000)
            },

            checkSolution(){
                this.loadAction = true; 
                this.marcarErrVersSolu(this.job);
                setTimeout(this.updateAction, 1000)
            },

            returnEjecucion(){
                this.loadAction = true; 
                this.startWorking(this.job);
                setTimeout(this.updateAction, 1000)
            },

            startWorkingOnJob(){
                this.loadAction = true; 
                this.startWorking(this.job);
                setTimeout(this.updateAction, 1000)
            },

            createVersion(){
                this.loadAction = true;      
                //CREARÁ VERSION Y ESCRIBE ESTADO EN BD
                this.startJob(this.job)
                //LEEREMOS DATOS EN BD CON UN DELAY 500ms SUPERIOR A LO QUE TARDA LA VERSION
                setTimeout(this.updateAction, 5500)
            },

            asignJob(){
                this.loadAction = true;
                this.ejecucion = this.asignarmeJob(this.job)
                if (this.ejecucion == true){
                    setTimeout(this.updateAction, 1000)
                }
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
                this.$emit('updateLog', {job:this.job, ejecucion: true});
                this.loadAction = false;
                this.showInfo(this.message, this.messageType)
                setTimeout(this.closeInfo, 1500)
            },

            //TODO: ¿no podriamos unificar en una sola funcion?
            justifyDesestimate(data){
                if (data != ''){
                    this.justificacion = data;
                    this.desestimarJobs([this.job], this.justificacion)
                    this.showDesestimarWindow = false;
                    this.loadAction = true;
                    setTimeout(this.updateAction, 500);
                } else {
                    this.showDesestimarWindow = false;
                }
            },

            justifyReturn(data){
                if (data != ''){
                    this.justificacion = data;
                    this.returnJob(this.job, this.justificacion)
                    this.showDevolverWindow = false;
                    this.loadAction = true;
                    setTimeout(this.updateAction, 500);
                } else {
                    this.showDevolverWindow = false;
                }
            },

            justifyReturnTriaje(data){
                if (data != ''){
                    this.justificacion = data;
                    this.devolverJobTriaje(this.job, this.errores, this.justificacion);
                    this.showDevolverAtriajeWindow = false;
                    this.loadAction = true;
                    setTimeout(this.updateAction, 500);
                } else {
                    this.showDevolverAtriajeWindow = false;
                }
            },

            justifyPause(data){
               if (data != ''){
                    this.justificacion = data;
                    this.pausarJob(this.job, this.justificacion)
                    this.showPauseWindow = false;
                    this.loadAction = true;
                    setTimeout(this.updateAction, 500);
                } else {
                    this.showPauseWindow = false;
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
    
    .actionsWrapper {
        padding: 0.5rem;
    }

    .loading {
        display: block;
        margin: 2rem auto;
    }

    .loadText {
        text-align: center;
    }

</style>