<template>
<v-app class="font-sans">
<v-dialog 
    v-model="dialog" 
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    class="h-full">
    <div class="bg-blue-50 h-full">
        <v-toolbar
            dark
            color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="compruebaDatos"
                >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Alta de Incidencia {{incSerial}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn class="w-24 bg-red-500 mr-5" dark text @click="compruebaDatos">CANCELAR</v-btn>
                <v-btn class="w-38 bg-gray-500 mr-5" dark text @click="guardarDatos">GUARDAR DATOS</v-btn>
                <v-btn class="w-24 bg-green-500 mr-5" dark text >GENERAR</v-btn>
        </v-toolbar>

            <template>
            <v-card>
                <v-tabs
                    fixed-tabs
                    background-color="#0341a6"
                    dark
                >
                    <v-tab>Descripción de Incidencia</v-tab>
                    <v-tab>Localización en el Mapa</v-tab>
                    <v-tab>Resumen de la Incidencia</v-tab>
                    <v-tab>Datos Adjuntos</v-tab>

                    <v-tabs-slider color="#76aff5"></v-tabs-slider>
                
                    <!--DATOS DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <v-card
                            class="p-4 mb-8 mt-4" style="height:43rem;"
                            >
                            <v-row align="center">
                                <v-subheader class="ml-3">Código Incidencia</v-subheader>
                                <h1 class="text-xl text-black"><b>{{incSerial}}</b></h1>
                            </v-row>

                            <v-row>
                                <v-col cols="8">
                                    <v-subheader>Descripción Incidencia</v-subheader>
                                    <div 
                                    class="ml-4 p-3 border border-gray-200 shadow bg-gray-100"
                                    style="height:34.5rem;"
                                    >
                                        <TextEditor @editor = storeDescIncidencia></TextEditor>
                                    </div>
                                </v-col>

                                <v-col cols="4">
                                    <v-subheader>Vía de Entrada</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        return-object
                                        :items="inViaEntrada"
                                        v-model='selectViaEntrada'
                                        ></v-select>
                                    </v-row>

                                    <v-subheader>Procedencia</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        :items="inProcedencia"
                                        v-model='selectProcedencia'
                                        ></v-select>
                                    </v-row>

                                    <v-subheader>Prioridad</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-select
                                        filled
                                        :items="inPrioridad"
                                        v-model='selectPrioridad'
                                        ></v-select>
                                    </v-row>

                                    <v-row align="center" style="margin-left:1px; margin-bottom:1rem;">
                                        <v-subheader>Realizar seguimiento</v-subheader><v-switch v-model="activaSeguimiento"></v-switch>
                                    </v-row>

                                    <v-subheader>E-mail seguimiento</v-subheader>
                                    <v-row align="center" class="ml-1 p-3">
                                        <v-text-field
                                        :disabled = !activaSeguimiento
                                        filled
                                        v-model="email"
                                        :rules="emailRules"
                                        ></v-text-field>
                                    </v-row>   
                                </v-col>
                            </v-row>   
                            </v-card>
                        </v-card>
                    </v-tab-item> <!--FIN DATOS INCIDENCIA -->

                    <!--LOCALIZACIÓN EN EL MAPA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        style="height:50rem;"
                        >
                            <Map @jobs="storeJobs" @errores="storeErrors" :incidencia="incSerial" perfil="editar"></Map>
                         </v-card>
                    </v-tab-item> <!-- FIN LOCALIZACION EN EL MAPA -->

                    <!--RESUMEN DE LA INCIDENCIA-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                            <h1 class="text-2xl font-black mb-2">Incidencia {{incidencia.id_inc}}</h1>
                                <v-data-table
                                    :headers="incidenciaHeaders"
                                    :items="incidencia"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.estado`]="{ item }">
                                        <v-chip :color="getColor(item.estado)" dark>
                                            {{ item.estado }}
                                        </v-chip>
                                    </template>

                                    <template v-slot:[`item.descripcion`]="{ item }">
                                        <span v-html="item.descripcion"></span>
                                    </template>
                                </v-data-table>

                            <v-spacer class="m-4"></v-spacer>
                            
                            <h1 class="text-2xl font-black mb-2">Jobs</h1>
                                <v-data-table
                                    :loading="jobLoading"
                                    loading-text="Esperando jobs. Si registró jobs en mapa haga clic en Guardar datos para ver los cambios."
                                    :headers="jobHeaders"
                                    :items="jobs"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.estado`]="{ item }">
                                        <v-chip :color="getColor(item.estado)" dark>
                                            {{ item.estado }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                        
                            <v-spacer class="m-4"></v-spacer>
             
                            <h1 class="text-2xl font-black mb-2">Errores</h1>
                                <v-data-table
                                    :loading="errorLoading"
                                    loading-text="Esperando errores. Si registró errores haga clic en Guardar datos para ver los cambios."
                                    :headers="errorHeaders"
                                    :items="errores"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.estado`]="{ item }">
                                        <v-chip :color="getColor(item.estado)" dark>
                                            {{ item.estado }}
                                        </v-chip>
                                    </template>
                                </v-data-table>
                        </v-card>
                    </v-tab-item> <!--FIN RESUMEN DE LA INCIDENCIA-->

                    <!--DATOS ADJUNTOS-->
                    <v-tab-item>
                        <v-card 
                        flat
                        class="p-8"
                        >
                           EMPTY
                         </v-card>
                    </v-tab-item> <!-- FIN DATOS ADJUNTOS -->
                </v-tabs>

                <!--MENSAJES DE INFORMACION-->
                <v-overlay :value="showMessage">
                    <v-alert
                    class="mx-7"
                    :color="messageType"
                    dark
                    border="top"
                    icon="mdi-alert-circle-outline"
                    transition="scale-transition"
                    >
                    {{message}}
                    </v-alert>
                </v-overlay>

                <v-overlay :value="showAlert">
                  <v-card class="p-3 w-80">
                   <h1 class="p-3 text-center font-bold text-2xl">ATENCIÓN</h1>
                   <h3 class="text-center text-l">Existen datos sin guardar en la incidencia ¿desea cerrar sin guardar los cambios?</h3>
                      <v-card-actions>
                        <div class="mt-6 flex">
                            <v-btn class="w-24 bg-red-500" dark text @click="closeAlert">CANCELAR</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn class="w-24 bg-green-500" dark text @click="closeDialog">OK</v-btn>
                        </div>
                      </v-card-actions>
                  </v-card>
                </v-overlay>

            </v-card>
        </template>
    </div>
</v-dialog>
</v-app>
</template>

<script>

    import TextEditor from '@/components/TextEditor';
    import Map from '@/components/Map';
    import axios from 'axios';
    import {getColor} from '@/assets/mixins/getColor.js';
    import pointInPolygon from 'point-in-polygon';

    export default {
        components: {
            TextEditor,
            Map,
        },

        mixins: [
            getColor
        ],

        created () {
            this.initializeIncSerial();
            this.initializeViaEnt();
            this.initializeProced();
            this.initializePrioridad();
        },

        mounted(){
            //Si no se cambia el select del formulario guardará los valores por defecto
            this.viaEntrada = this.selectViaEntrada
            this.procedencia = this.selectProcedencia
        },

        watch:{
            selectViaEntrada(){
                this.viaEntrada = this.selectViaEntrada
            },
            selectProcedencia(){
                this.procedencia = this.selectProcedencia
            },
            selectPrioridad(){
                this.prioridad = this.selectPrioridad
            },
            jobs(){
                if (this.jobs.length != 0){
                    this.jobLoading=false;
                }
            },
            errores(){
                if (this.errores.length != 0){
                    this.errorLoading=false;
                }
            }
        },

        methods: {
            closeIncidencia(){
                this.showInfo("hello world", "blue")
            },

            compruebaDatos(){
                if (this.incidencia.length != 0){
                    this.closeDialog();
                } else {
                    this.openAlert();
                }
            },

            openAlert(){
                this.showAlert = true;
            },

            closeAlert(){
                this.showAlert = false;
            },

            closeDialog() {
                this.dialog = false;
                //Al cerrar el dialogo devuelve el valor por defecto para GJ a loader
                //TODO: habría que definir el valor por defecto en una función global
                this.$emit('closed', 'IncTriajeGJ');
            },

            /*TODO: Mejorar la gestion de los numeros de serie
            avanzaIncSerial e initializeIncSerial tienen una parte común que habría que hacer
            en función única
            */
            avanzaIncSerial(){
                this.type = "IGN_C_";
                axios
                .get(this.url + 'serials/' + this.type)
                //recuperamos el ultimo serial registrado en BD
                .then(data => { 
                    if (data != null){
                        this.id = data.data.mensaje[0].serial_id;
                        this.id = this.id + 1;

                        //grabamos nuevo serial en BD
                        this.serial = {
                            id: this.id,
                            type: this.type,
                        };
                        axios
                        .put(this.url + 'updateSerial/', this.serial)
                        .then( data => {console.log(data.data.mensaje)})
                    }
                })
            },

            initializeIncSerial () {
                this.type = "IGN_C_";
                axios
                .get(this.url + 'serials/' + this.type)
                //recuperamos el ultimo serial registrado en BD
                .then(data => { 
                    if (data != null){
                        this.id = data.data.mensaje[0].serial_id;
                        this.incSerial = this.type + parseInt(this.id);
                    }
                })

            },

            initializeViaEnt() {
                axios
                    .get(this.url + 'viaentrada')
                    .then(data =>   {
                                    this.objViaEnt = (data.data.response)
                                        for (this.index in this.objViaEnt) {
                                            this.inViaEntrada.push(this.objViaEnt[this.index].via_ent)
                                        }
                                    },
                        )
            },

            initializeProced() {
                axios
                    .get(this.url + 'procedencia')
                    .then(data =>   {
                                    this.objProced = (data.data.response)
                                        for (this.index in this.objProced) {
                                            this.inProcedencia.push(this.objProced[this.index].proc)
                                        }
                                    },
                        )
            },

            initializePrioridad() {
                axios
                    .get(this.url + 'prioridad')
                    .then(data =>   {
                                    this.objProced = (data.data.response)
                                        for (this.index in this.objProced) {
                                            this.inPrioridad.push(this.objProced[this.index].inc_prioridad)
                                        }
                                    },
                        )
            },

            //Lo que recogemos del text editor
            storeDescIncidencia(returnedText){
                this.returnedTextIncidencia = returnedText
            },

            showInfo(message, type){
                this.showMessage = true;
                this.message = message;
                this.messageType = type;
            },
            closeInfo(){
                this.showMessage = false;
            },

            recDataError(){
                //Comprueba si hay errores registrados en mapa
                if (this.errores.length > 0){
                    //Si hay Jobs registrados asigna errores a jobs espacialmente
                    this.asignErrorToJob();
                    for (this.index in this.errores) {
                        axios
                        .post( this.url + 'postErrores', this.errores[this.index])
                        .then( data => {
                            if (data.data.status == 200){
                                this.showInfo("Datos guardados correctamente", "green");
                                setTimeout(this.closeInfo,2000);
                            } else {
                                this.showInfo("Error al guardar!", "red");
                                setTimeout(this.closeInfo,2000);
                            }
                        })
                        .catch(error => {console.warn("algo fue mal al grabar el error ", error)})
                    }
                }
            },

            recDataJob(){
                if(this.jobs.length > 0){
                    for (this.index in this.jobs) {
                        axios
                        .post( this.url + 'postJobs', this.jobs[this.index])
                        .then( data => {
                            if (data.data.status == 200) {
                            //TODO: debería confirmar que jobs y errores se guardan bien
                            }
                        })
                        .catch(error => {console.warn("Algo fue mal al grabar el job ",error)})                                              
                    }
                }
            },

            recDataIncidencia(){
                axios
                .post(this.url + 'postIncidencia', this.incidencia[0])
                .then( /*data => {TODO: debería confirmar que incidencias se guardan bien}*/)
                .catch(error => {console.warn("Algo fue mal al grabar la incidencia ",error)}) 
            },

            updateDataIncidencia(){
                this.storeIncidencia();
                axios
                .put(this.url + 'updateIncidencia' + this.incidencia)
                .then(data => { console.log( "Incidencia actualizada correctamente ", data)})
            },

            updateDataError(){
                axios
                .put(this.url + 'updateErrores' + this.errores)
                .then(data => { console.log ("Errores actualizados correctamente ", data)})
            },

            updateDataJobs(){
                axios
                .put(this.url + 'updateJobs' + this.jobs)
                .then(data => { console.log ("Jobs actualizados correctamente ", data)})
            },

            compruebaIncidenciaBd(){
                axios
                .get(this.url + 'incidencias/'+ this.incidencia[0].id_inc)
                .then(data => {
                    if (data.data.mensaje.length > 0){
                            this.existe = true;
                        } else {
                            this.existe = false;
                        }    
                })
                return this.existe;
            },

            compruebaErrorBD(){
                for (this.index in this.errores){
                    axios
                    .get(this.url + 'errores/' + this.errores[this.index].idError)
                    .then(data => {
                        if (data.data.mensaje.length > 0){
                            this.existe = true;
                        } else {
                            this.existe = false;
                        }
                    })
                }
                return this.existe;
            },

            compruebaJobBD(){
                for (this.index in this.jobs){
                    axios
                    .get(this.url + 'jobs/' + this.jobs[this.index].id_job)
                    .then(data => {
                        if (data.data.mensaje.length > 0){
                            this.existe = true;
                        } else {
                            this.existe = false;
                        }
                    })
                }
                return this.existe;
            },

            guardarDatos(){
                //Grabamos datos de incidencia antes de comenzar
                this.storeIncidencia(); 
                //Existe la incidencia existe en BD?
                this.existeIncidencia = this.compruebaIncidenciaBd(); 
                if (this.existeIncidencia == true) {
                    //La Incidencia existe en BD -> Actualizamos 
                    this.updateDataIncidencia();
                    //Existen errores asociados a la incidencia en BD?
                    this.existeError = this.compruebaErrorBD();
                    if (this.existeError == true) {
                        //existen errores asociados a incidencia en BD -> Actualizamos 
                        this.updateDataError();
                        //existen jobs asociados a incidencia en BD?
                        this.existeJob = this.compruebaJobBD();
                        if (this.existeJob == true){
                            //existen jobs asociados a incidencia en BD -> Actualizamos
                            this.updateDataJobs();
                        } else {
                            //no existen jobs asociados a incidencia en BD -> Grabamos
                            this.recDataJob();
                        }
                    } else {
                        //no existen errores asociados a incidencia en BD
                        //hay errores registrados para grabar? -> Grabamos
                        this.recDataError();
                        //hay jobs registrados para grabar? -> Afirmativo Grabamos
                        this.recDataJob();
                    }
                } else {
                    //La Incidencia no existe en BD -> Grabamos
                    this.recDataIncidencia();
                    //Hay errores registrados para grabar? -> Afirmativo Grabamos
                    this.recDataError();
                    //Hay Jobs registrados para grabar? -> Afirmativo Grabamos
                    this.recDataJob();
                    //Avanzamos Serial de incidencias
                    this.avanzaIncSerial();                
                }          
            },

            storeIncidencia(){
                this.incidencia = [{
                    id_inc:this.incSerial,
                    via_ent: this.viaEntrada,
                    prioridad: 'Normal',
                    seguimiento: this.activaSeguimiento,
                    procedencia: this.procedencia,
                    estado: 'En Triaje',
                    descripcion:this.returnedTextIncidencia,         
                    eMail: this.email,
                }]
            },

            storeJobs(jobs){
                this.jobs = jobs;
            },
            storeErrors(errores){
                this.errores = errores;
            },
            asignErrorToJob() {
                for (this.indexError in this.errores) {
                    //reinicia el valor, necesario para detectar ediciones
                    this.errores[this.indexError].job = '';
                    this.point = [
                        this.errores[this.indexError].geometry.coordinates[0],
                        this.errores[this.indexError].geometry.coordinates[1],
                    ];

                    for (this.indexJob in this.jobs) {
                        this.polygon = [this.jobs[this.indexJob].geometry.coordinates[0]];
                        this.inside = pointInPolygon(this.point, this.polygon[0]);
                        if (this.inside == true) {
                            //Esta dentro del Job
                            this.errores[this.indexError].job = this.jobs[this.indexJob].idJob;
                        }
                    }
                }
            },
        },

        data () {
            return {
                url: 'http://10.13.86.114:3000/',    //url:puerto del servicio API
                dialog: true,

                incSerial:'',
                emailRules: [
                    v => /.+@.+/.test(v) || 'Debe introducir un email válido, por ejemplo: "usuario@incigeo.com"',
                ],
                inViaEntrada: [],
                selectViaEntrada: 'Directo',        //Determina valor por defecto para el formulario -> TODO: Funcion para determinar esto
                inProcedencia: [],                  //Procedencias recogidas desde base de datos
                selectProcedencia: 'IGN / CNIG',    //Determina valor por defecto para el formulario -> TODO: Funcion para determinar esto
                inPrioridad:[],                     //Prioridades recogidas desde Base de datos
                selectPrioridad: 'Normal',          //Determina valor por defecto para el formulario -> TODO: Funcion para determinar esto

                incidencia:[],                      //Almacen de datos para incidencia
                viaEntrada:'',                      //Select desde formulario si no se cambia recoge valor por defecto
                procedencia:''  ,                   //Select desde formulario si no se cambia recoge valor por defecto
                activaSeguimiento: false,           //Flag seguimiento
                email:'',                           //Select desde formulario

                errores:[],                         //Almacen de errores
                jobs:[],                            //Almacen de jobs

                jobLoading: true,                   //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado jobs        
                errorLoading: true,                 //En Resumen de la incidencia muestra la barra de carga mientras no se hayan registrado errores  

                showMessage: false,                 //Muestra mensajes de información en la parte inferior de la pantalla
                showAlert: false,                   //Muestra ventana de alerta
                message: '',                        //Determina el texto mostrado en el mensaje de información
                messageType: '',                    //green para success, red para error, blue para info.

                incidenciaHeaders: [
                    {text: 'Estado', value: 'estado' },
                    {text: 'Descripción', value:'descripcion' },
                    {text: 'Vía Entrada', value:'via_ent' },
                    {text: 'Procedencia', value:'procedencia'},
                    {text: 'Seguimiento', value:'seguimiento' },
                    {text: 'E-mail', value:'eMail' },
                ],

                jobHeaders : [
                    { text: 'Estado', value:'estado'},                
                    { text: 'Id Job', value:'idJob'},
                    { text: 'Arreglar en', value:'arreglo' },
                    { text: 'Asignación', value: 'deteccion' },
                    { text: 'Descripcion', value: 'descripcion' },
                    { text: 'Asignación', value: 'asignacion' },
                    { text: 'Tipo operador', value: 'bandeja' },
                ],

                errorHeaders : [
                    { text: 'Estado', value: 'estado' },                
                    { text: 'Id Error', value:'idError'},
                    { text: 'Asignado a Job', value: 'job' },
                    { text: 'Error de', value: 'tipoError' },
                    { text: 'Tema Error', value: 'tema' },
                    { text: 'Descripcion', value: 'descripcion' },
                ],
            }
        },
    }
</script>