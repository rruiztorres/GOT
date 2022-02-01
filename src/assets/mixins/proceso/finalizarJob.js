import axios from 'axios';

export const finalizarJob = {
    
    methods: {
        finalizarJob(job){
            job.nuevoEstado = 'Conciliado';
            job.nombre_operador = localStorage.usuario;
            this.ejecucion = true;

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/reconcileVersion`, [job,])
            .then((data) => {
                if(data.status != 201){
                    this.ejecucion = false;
                }
            })

            return this.ejecucion;
        },
    },
}