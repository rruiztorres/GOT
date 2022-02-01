import axios from 'axios';

export const volverEjecucion = {
    
    methods: {
        volverEjecucion(job){
            job.nuevoEstado = 'Ejecución';
            job.nombre_operador = localStorage.usuario;
      
            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job])
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