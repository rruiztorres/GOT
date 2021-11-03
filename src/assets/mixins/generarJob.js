/* 
Recibe array de objetos (jobs)
Componentes que lo usan: EditarJob, altaJobsErrores

*/
import axios from "axios";

export const generarJob = {
    methods: {
        generarJob(jobs) {
            if (jobs.length == 0) {
                //No existen jobs, lanzar alerta
                const enviarDatos = {
                    procesadoOK: false,
                    mensaje: "No existen jobs para generar, revise los datos"
                };
                return enviarDatos;
            } else {
                for (let index in jobs){
                    if (jobs[index].job == null){
                        const enviarDatos = {
                            procesadoOK: false,
                            mensaje: "Por favor, guarde los datos antes de generar"
                        };
                        return enviarDatos;
                    } else {
                        if (jobs[index].operador.length == 0){
                            //No tiene operador asignado
                            this.actualizar = {
                                nuevoEstado: 'En bandeja',
                                operador: null, 
                                job: jobs[index].job
                            };
                        } else {
                            //Si tiene operador asignado = asignacion directa a su bandeja
                            this.actualizar = {
                                nuevoEstado: 'En bandeja_op',
                                operador: jobs[index].operador,
                                job: jobs[index].job
                            };
                        }
                        axios
                        .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, this.actualizar)
                        .then(() => {
                            //No existen errores, no lanzar alerta
                        })
                        .catch((data) => {
                            const enviarDatos = {
                                procesadoOK: false,
                                mensaje: data.mensaje
                            };
                            return enviarDatos;
                        });
                    }
                }
            }
            const enviarDatos = {
                procesadoOK: true,
                mensaje: "Generación correcta"
            };
            return enviarDatos;
        },
    },
}
