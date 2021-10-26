export const asignarValoresDefault = {
    
    created(){
        this.asignarValoresDefault();
    },
    methods: {
        asignarValoresDefault(objetoAPI, columnaID){
            for (this.index in objetoAPI){
                if (objetoAPI[this.index].defecto == true){
                    
                    return objetoAPI[this.index][columnaID] - 1;
                }
            }
        },
    },
}