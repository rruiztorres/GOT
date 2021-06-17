<template>
    <div class="font-sans">
        <h1 class="ml-2 text-2xl font-bold my-6">
        Crear nueva Incidencia
        </h1>
        <v-app class="font-sans">
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                        >
                        Datos de la Incidencia
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                        >
                        Localización en el mapa
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step 
                        step="3">
                        Finalizar
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content 
                        step="1">
                            <v-card
                            class="mb-12"
                            color="grey lighten-1"
                            height="200px"
                            ></v-card>

                            <v-btn
                            color="primary"
                            @click="e1 = 2"
                            class="mr-2"
                            >
                            Siguiente
                            </v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card
                        class="mb-12"
                        color="grey lighten-1"
                        height="200px"
                        ></v-card>

                        <v-btn
                        color="secondary"
                        @click="e1 = e1-1"
                        class="mr-2"
                        >
                        Volver a paso 1 
                        </v-btn>

                        <v-btn
                        color="primary"
                        @click="e1 = 3"
                        class="mr-2"
                        >
                        Siguiente
                        </v-btn>

                        

                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card
                        class="mb-12"
                        color="grey lighten-1"
                        height="200px"
                        ></v-card>

                        <v-btn
                        color="secondary"
                        @click="e1 = e1-1"
                        class="mr-2"
                        >
                        Volver a paso 2 
                        </v-btn>

                        <v-btn
                        color="success"
                        @click="e1 = 1"
                        class="mr-2"
                        >
                        Finalizar
                        </v-btn>

                        <v-btn
                        
                        color="error"
                        class="mr-2">
                        Cancelar
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-app>
    </div>
</template>

<script>

  export default {
 
    data () {
      return {
        e1: 1,
      }
    },
  }
</script>