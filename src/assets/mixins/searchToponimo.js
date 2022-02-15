import axios from 'axios';

export const searchToponimo = {
    methods: {
        searchToponimo(toponimo){  
            const url ="https://www.idee.es/communicationsPoolServlet/SearchAssistant?";
            const maxResults = 8;

            axios
            .get(url + 'name_equals='+ toponimo +'&maxresults=' + maxResults)
            .then(response => this.resultado = response.data)
            return this.resultado;   
        },
    },
}
