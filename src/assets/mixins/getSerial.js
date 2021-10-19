export const getSerial = {
    
    data(){

    },
    created(){
        this.getSerial();
    },
    methods: {
        getSerial(){
            this.year = new Date().getFullYear().toString();
            this.serial = '000000' // -> Obtener ultimo serial disponible desde base de datos
        }
    },
}