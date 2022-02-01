export const getColor = {
    methods: {
        getColor(estado){
            
            if (estado == 'Deteccion de errores') return '#ffffff';         //blanco
            else if (estado == 'En bandeja') return '#ff6600'               //naranja
            else if (estado == 'En bandeja_op') return '#d93d00'            //naranja
            else if (estado == 'En triaje') return '#ffcc00';               //amarillo
            else if (estado == 'Desestimada') return '#0066ff';             //azul
            else if (estado == 'No afecta / Se deriva') return '#0066ff';   //azul
            else if (estado == 'Pendiente') return '#ffcc00';               //amarillo
            else if (estado == 'Solucionada') return '#009933';             //verde

            else if (estado == 'Marcado') return '#d0e4f5';                 //azul claro
            else if (estado == 'Pendiente solución') return '#ffcc00';      //amarillo
            else if (estado == 'Solucionado') return '#009933';             //verde
            else if (estado == 'Desestimado') return '#0066ff';             //azul    
            else if (estado == 'Error versión') return '#f54b42';           //rojo
            else if (estado == 'Versión generada') return '#009933';        //verde
            else if (estado == 'Ejecución') return '#ffcc00';               //amarillo
            else if (estado == 'Conciliado') return '#009933';        //verde
            


            //EXPEDIENTES
            else if (estado == 'Cerrado') return '#f54b42';                  //rojo
            else if (estado == 'Abierto') return '#009933';                  //verde
        }
    },
}

    
