import axios from 'axios';

export const devolverJobTriaje = {
    
    methods: {
        devolverJobTriaje(job, errores, comentarios){
            job.nuevoEstado = 'En triaje';
            job.nombre_operador = localStorage.usuario;
            this.ejecucionJob = true;
            this.ejecucionErrores = true;

            //OBJECTO LOG
            this.log = {
                idEventoLogger: 22, //JOB DEVUELTO A TRIAJE OPERADOR
                procesoJob: 'GOT',
                usuario: localStorage.usuario,
                observaciones: comentarios,
                departamento: '',
                resultadoCC: '',
            }

            //IMPLEMENTAR EL BORRADO DE VERSION CUANDO ESTÉ DISPONIBLE

            //CAMBIAR ESTADO DE ERRORES
            for (this.index in errores){
                errores[this.index].nuevoEstado = 'Marcado';

                axios
                .put(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosError`, errores[this.index])
                .then( (data) => {
                    if(data.status != 201){
                        this.ejecucionErrores = false;
                    }
                })
            }

            //CAMBIAR DE ESTADO JOB
            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
            .then((data) => {
                if(data.status != 201){
                    this.ejecucionJob = false;
                }
            })

            //RESULTADO
            if (this.ejecucionJob === false || this.ejecucionErrores === false){
                return false
            } else {
                return true
            }
        },
    },
}