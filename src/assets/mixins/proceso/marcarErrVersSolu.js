import axios from 'axios';

export const marcarErrVersSolu = {
    
    methods: {
        marcarErrVersSolu(job){
            job.nuevoEstado = 'Versión generada';
                       
            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job,])
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