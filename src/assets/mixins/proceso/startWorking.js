import axios from 'axios';

export const startWorking = {

    methods: {
        startWorking(job){
            //NUEVO ESTADO
            job.nuevoEstado = 'Ejecución';

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job])            
        }
    }
    

}