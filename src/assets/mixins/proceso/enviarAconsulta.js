import axios from 'axios';

export const enviarAconsulta = {
    
    methods: {
        enviarAconsulta(job){
            job.nuevoEstado = 'En consulta';
            job.nombre_operador = localStorage.usuario;
            this.ejecucion = true;

            //OBJECTO LOG
            this.log = {
                idEventoLogger: 14, //JOB ENVIADO A CONSULTA
                procesoJob: 'GOT',
                usuario: localStorage.usuario,
                observaciones: '',
                departamento: '',
                resultadoCC: '',
            }

            axios
            .post(`${process.env.VUE_APP_API_ROUTE}/cambioEstadosJob`, [job, this.log])
            .then((data) => {
                if(data.status != 201){
                    this.ejecucion = false;
                }
            })

            return this.ejecucion;
        },
    },
}