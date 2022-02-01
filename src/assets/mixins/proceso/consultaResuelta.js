import axios from 'axios';

export const consultaResuelta = {
    
    methods: {
        consultaResuelta(job, observaciones){
            job.nuevoEstado = 'En triaje';
            job.nombre_operador = localStorage.usuario;
      
            //OBJECTO LOG
            this.log = {
                idEventoLogger: 16, //JOB CONSULTA RESUELTA
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