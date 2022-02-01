import axios from 'axios';

export const pausarJob = {
    
    methods: {
        pausarJob(job, observaciones){
            job.nuevoEstado = 'Pausa';
            job.nombre_operador = localStorage.usuario;
      
            //OBJECTO LOG
            this.log = {
                idEventoLogger: 24, //OPERADOR PAUSA EL JOB
                procesoJob: 'GOT',
                usuario: localStorage.usuario,
                observaciones: observaciones,
                departamento: '',
                resultadoCC: '',
            }

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
            .then((data) => {
                if(data.status == 201){
                    return true;
                } else {
                    return false;
                }
            })
        },
    },
}