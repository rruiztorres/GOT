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
                                job: jobs[index].job,
                                id_job: jobs[index].id_job
                            };
                        } else {
                            //Si tiene operador asignado = asignacion directa a su bandeja
                            this.actualizarJob = {
                                nuevoEstado: 'En bandeja_op',
                                nombre_operador: jobs[index].nombre_operador,
                                job: jobs[index].job,
                                id_job: jobs[index].id_job
                            };
                        }

                        //Objeto Log
                        this.log = {
                            idEventoLogger: 7, //JOB GENERADO
                            procesoJob: 'GOT',
                            usuario: localStorage.usuario,
                            observaciones: '',
                            departamento: '',
                            resultadoCC: '',
                        }

                        axios
                        .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [this.actualizarJob, this.log])
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
                    for (this.errorIndex in errores){
                        //Definimos objeto error
                        this.actualizarError = {
                            nuevoEstado: "Pendiente_solución",
                            id_error: errores[this.errorIndex].id_error,
                        };

                        //Los datos no se han guardado
                        if (errores[this.errorIndex].job == null) {
                            const enviarDatos = {
                                procesadoOK: false,
                                mensaje: "Por favor, guarde los datos antes de generar"
                            };
                            return enviarDatos;
                        } else {
                            //Grabar en base de datos
                            console.log("estoy enviando error aqui", this.actualizarError)
                            axios
                            .put(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosError`, this.actualizarError)
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
