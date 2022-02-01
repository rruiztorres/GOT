import axios from 'axios';

export const marcarErrVersSolu = {
    
    methods: {
        marcarErrVersSolu(job){
            job.nuevoEstado = 'Versión generada';
            job.nombre_operador = localStorage.usuario;
      
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