/* 
Recibe array de objetos (jobs)
Componentes que lo usan: EditarJob, altaJobsErrores

*/
import axios from "axios";

export const generarJobError = {
    methods: {
        generarJobError(jobs, errores) {
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
                        if (jobs[index].nombre_operador == null){
                            //No tiene operador asignado = bandeja genérica
                            this.actualizarJob = {
                                nuevoEstado: 'En bandeja',
                                nombre_operador: null, 
                                job: jobs[index].job
                            };
                        } else {
                            //Si tiene operador asignado = asignacion directa a su bandeja
                            this.actualizarJob = {
                                nuevoEstado: 'En bandeja_op',
                                nombre_operador: jobs[index].nombre_operador,
                                job: jobs[index].job
                            };
                        }
                        axios
                        .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, this.actualizarJob)
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

                if (errores.length != 0) {
                    //Hay errores registrados
                    for (let errorIndex in errores){
                        //Los datos no se han guardado
                        if (errores[errorIndex].job == null) {
                            const enviarDatos = {
                                procesadoOK: false,
                                mensaje: "Por favor, guarde los datos antes de generar"
                            };
                            return enviarDatos;
                        } else {
                            //Grabar en base de datos
                            this.actualizarError = {
                                nuevoEstado: "Pendiente_solución",
                                error: errores[errorIndex].idError
                            };

                            axios
                            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosError`, this.actualizarError)
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
            }
            const enviarDatos = {
                procesadoOK: true,
                mensaje: "Generación correcta"
            };
            return enviarDatos;
        },
    },
}
