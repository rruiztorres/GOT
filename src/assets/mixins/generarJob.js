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
                        //Actualizar estado en BD
                        let actualizar = {
                            nuevoEstado: 'En bandeja',
                            operador: jobs[index].operador,
                            job: jobs[index].job
                        };
                        axios
                        .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, actualizar)
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
