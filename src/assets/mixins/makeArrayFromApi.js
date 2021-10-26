export const makeArrayFromApi = {
    
    data(){

    },
    created(){
        this.makeArrayFromApi();
    },
    methods: {
        makeArrayFromApi(objetoAPI, arrayCrear, columnaBD){
            for (this.index in objetoAPI){
                arrayCrear.push(objetoAPI[this.index][columnaBD])
            }
            return arrayCrear;
        },
    },
}