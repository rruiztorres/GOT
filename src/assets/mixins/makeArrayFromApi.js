export const makeArrayFromApi = {
    
    data(){

    },
    created(){
        this.makeArrayFromApi();
    },
    methods: {
        makeArrayFromApi(objeto, array, propiedad){
            for (this.index in objeto){
                array.push(objeto[this.index][propiedad])
            }
            return array;
        },
    },
}