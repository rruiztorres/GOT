import axios from 'axios';

export const situarToponimoMapa = {
    methods: {
        situarToponimoMapa(idNGBE){
            const url = `https://www.idee.es/communicationsPoolServlet/Dispatcher?request=OpenQuerySource&query=%3Cogc%3AFilter%3E%3Cogc%3AFeatureId%20fid%3D%22${idNGBE}%22%2F%3E%3C%2Fogc%3AFilter%3E&sourcename=http%3A%2F%2Fwww.idee.es%2FcommunicationsPoolServlet%2FsourceAccessWFS-INSPIRE-NGBE.rdf&outputformat=application%2Fjson&_=1643961464328`

            axios
            .get(url)
            .then( (data) => {
                this.localizacion = data.data.results[0].location.split(" ")
                return this.localizacion;
            })
        },
    },
}
