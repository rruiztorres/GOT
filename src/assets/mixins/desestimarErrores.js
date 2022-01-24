import axios from 'axios';

export const desestimarErrores = {
    methods: {
        desestimarErrores(errores, observaciones) {
            let ejecucion = 0;

            //ACTUALIZAR ESTADO ERRORES DENTRO DE JOB
            this.erroresDesestimar = errores;
            for (this.longErrores in this.erroresDesestimar){
                this.actualizarError = {
                    nuevoEstado: "Desestimado",
                    id_error: this.erroresDesestimar[this.longErrores].id_error,
                    observaciones: observaciones,
                };
                axios
                .put(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosError`, this.actualizarError)
                .then( (data) => {
                    if (data.data.status != 201){
                        ejecucion = 1
                    }
                })
            }            
        return ejecucion;   
        }
    }
}