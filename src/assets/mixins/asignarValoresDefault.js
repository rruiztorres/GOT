export const asignarValoresDefault = {
    
    created(){
        this.asignarValoresDefault();
    },
    methods: {
        asignarValoresDefault(objeto){
            for (this.index in objeto){
                if (objeto[this.index].default == true){
                    return objeto[this.index].id - 1;
                }
            }
        },
    },
}