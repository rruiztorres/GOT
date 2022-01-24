import axios from 'axios';

export const desestimarJobs = {
    methods: {
        desestimarJobs(jobs, observaciones) {
            let ejecucion = 0;

            for (this.index in jobs){
                
                //OBJETO CAMBIO ESTADOS
                this.actualizarJob = {
                    nuevoEstado: 'Desestimado',
                    nombre_operador: jobs[this.index].nombre_operador,
                    job: jobs[this.index].job,
                    id_job: jobs[this.index].id_job
                };

                //OBJETO LOG
                this.log = {
                    idEventoLogger: 17, //JOB DESESTIMADO
                    procesoJob: 'GOT',
                    usuario: localStorage.usuario,
                    observaciones: observaciones,
                    departamento: '',
                    resultadoCC: '',
                }

                //CAMBIAR ESTADO DE JOB
                try{
                    axios
                    .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [this.actualizarJob, this.log])
                } catch (error) { if(error){ejecucion = 1}}
    

                //OBTENER ERRORES DENTRO DEL JOB
                try{
                    axios
                    .get(`${process.env.VUE_APP_API_ROUTE}/error/` + jobs[this.index].job)
                    .then( (data) => {

                        //ACTUALIZAR ESTADO ERRORES DENTRO DE JOB
                        this.errores = data.data.errores;
                        for (this.longErrores in this.errores){
                            this.actualizarError = {
                                nuevoEstado: "Desestimado",
                                id_error: this.errores[this.longErrores].id_error,
                            };

                            axios
                            .put(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosError`, this.actualizarError)
                        }
                    })
                } catch (error) { if(error){ejecucion = 1}}
            }
        return ejecucion;   
        }
    }
}