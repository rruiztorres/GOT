import axios from 'axios';

export const startJob = {

    methods: {
        startJob(job){
            //OBJECTO LOG
            this.log = {
                idEventoLogger: 12, //JOB DEVUELTO A BANDEJA GENÉRICA
                procesoJob: 'GOT',
                usuario: localStorage.usuario,
                observaciones: '',
                departamento: '',
                resultadoCC: '',
              }

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/createVersion`, [job, this.log])
        }
    }
    

}