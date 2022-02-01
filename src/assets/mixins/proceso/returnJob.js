import axios from 'axios';

export const returnJob = {
    methods: {
        returnJob(job, observaciones){
            job.nuevoEstado = 'En bandeja';
            job.nombre_operador = null;
            this.ejecucion = 0;

            //OBJECTO LOG
            this.log = {
              idEventoLogger: 12, //JOB DEVUELTO A BANDEJA GENÉRICA
              procesoJob: 'GOT',
              usuario: localStorage.usuario,
              observaciones: observaciones,
              departamento: '',
              resultadoCC: '',
            }
            
            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
            .then((data) => {
              if(data.status != 201){
                this.ejecucion = 1;
              } 
            })     
        return this.ejecucion;
        }, 
    },
}