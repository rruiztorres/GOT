<template>
    <v-container>
        <!--LOG DEL JOB-->
        <v-row>
            <v-col>
                <v-card>     
                    <v-card-title class="bg-blue-200">LOG DEL JOB</v-card-title>
                    <v-list three-line class="pt-0">
                        <template v-for="(item) in example">
                            <v-list-item
                            :key="item.title"
                            :class="item.class"
                            >
                                <v-list-item-avatar>
                                    <v-icon :title="item.procDesc" class="grey" dark>
                                        {{item.icon}}
                                    </v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-subtitle v-html="item.fecha"></v-list-item-subtitle>
                                    <v-list-item-title v-html="item.title"></v-list-item-title>
                                    <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card>
            </v-col>
            
            <!--ACCIONES DISPONIBLES-->
            <v-col>
                <!-- Las card las podemos sacar a componente?-->
                <v-card>
                    <v-card-title class="bg-blue-200">ACCIONES DISPONIBLES</v-card-title>
                    <v-card-actions>
                        <div class="w-full p-6">
                            <v-btn 
                                block 
                                color="error" 
                                class="mb-3" 
                                @click="dummy()">Pausar Job
                            </v-btn>
                            <v-btn 
                                block 
                                color="primary" 
                                class="mb-3" 
                                @click="dummy()">Otra cosa
                            </v-btn>
                            <v-btn 
                                block 
                                color="primary" 
                                class="mb-3" 
                                @click="dummy()">Otra cosa
                            </v-btn>
                            <v-btn 
                                block 
                                :loading="buttonLoading"
                                color="success" 
                                class="mb-3" 
                                @click="buttonLoading=!buttonLoading">
                                    <v-icon dark class="mr-4">
                                        mdi-robot-industrial
                                    </v-icon>
                                    Solicitar Versión
                            </v-btn>

                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
  name: "Logger",

  methods:{
      dummy(){
          console.log("hago cosas")
      }
  },
  
  data() {
    return {
        buttonLoading: false,

        example: [
        {
            class:"bg-green-100",
            icon: "mdi-robot-industrial",
            procDesc: "IPA",
            fecha: '12/12/2021 - 09:55:10',
            title: 'Versión Generada',
            subtitle: 'El proceso de versionado terminó con éxito',
        },
        {
            class: null,
            icon: "mdi-robot-industrial",
            procDesc: "VSO",
            fecha: '12/12/2021 - 09:55:10',
            title: 'Versión Solicitada',
            subtitle: 'El operador John Doe solicitó la versión del job',
        },
        {
            class: null,
            icon: "mdi-account-hard-hat",
            procDesc: "JAO",
            fecha: '12/12/2021 - 09:55:10',
            title: 'Job Asignado a Operador',
            subtitle: 'El generador de jobs Raúl Ruiz Torres asignó el job al operador John Doe',
        },
        {
            class: null,
            icon: "mdi-lead-pencil",
            procDesc: "JMD",
            fecha: '11/12/2021 - 12:20:22',
            title: 'Job Modificado',
            subtitle: 'El job ha sido editado por el generador de jobs Raúl Ruiz Torres',
        },
        {
            class: null,
            icon: "mdi-magnify",
            procDesc: "JET",
            fecha: '10/12/2021 - 10:03:58',
            title: 'Job en Triaje',
            subtitle: 'El job se encuentra en triaje',
        },
        {
            class: null,
            icon: "mdi-robot-industrial",
            procDesc: "IPA",
            fecha: '10/12/2021 - 10:03:56',
            title: 'Inserción por proceso automático',
            subtitle: 'Job insertado por proceso automático FME',
        },
      ],
    }
  }
}
</script>
