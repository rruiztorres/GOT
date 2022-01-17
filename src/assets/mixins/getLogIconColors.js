export const getLogIconColors = {
    methods: {
        getLogIconColors(input){
            if (
                input == 'IEM' ||
                input == 'IMA' ||
                input == 'JMD'              
                ){
                return 'green darken-1'       
            } 

            else if (
                input == 'JDE' ||
                input == 'JFD' ||
                input == 'VER' ||
                input == 'JDT' ||
                input == 'EFT' ||
                input == 'EGC' 
            ) {
                return "warning"
            }

            else if (
                input == 'EPS' ||
                input == 'JGE'
            ){
                return "info"
            }

            else {
                return "grey"
            }
        }
    }
}
