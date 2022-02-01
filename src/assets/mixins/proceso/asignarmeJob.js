import axios from 'axios';

export const asignarmeJob = {
    
    methods: {
        asignarmeJob(job){
            job.nuevoEstado = 'En bandeja_op';
            job.nombre_operador = localStorage.usuario;
            this.ejecucion = true;

            //OBJECTO LOG
            this.log = {
                idEventoLogger: 11, //JOB SELECCIONADO PARA TRABAJAR
                procesoJob: 'GOT',
                usuario: localStorage.usuario,
                observaciones: '',
                departamento: '',
                resultadoCC: '',
            }

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
            .then((data) => {
                if(data.status != 201){
                    this.ejecucion = false;
                }
            })

            return this.ejecucion;
        },
    },
}