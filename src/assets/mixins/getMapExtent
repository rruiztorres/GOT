export const getMapExtent = {

    methods: {
        distanciaPuntos(a ,b){
            const xa = a[0];
            const xb = b[0];
            const ya = a[1];
            const yb = b[1];

            const distancia = Math.sqrt( Math.pow((xb-xa),2) + Math.pow((yb-ya),2) );
            return distancia; 
        },

        getMapExtent(job){
            
            //Asginamos valor inicial
            let xMax = job.coordinates[0][0][0]
            let xMin = job.coordinates[0][0][0]
            let yMax = job.coordinates[0][0][1]
            let yMin = job.coordinates[0][0][1]

            const jobGeometry = job.coordinates[0];

            for (this.index in jobGeometry) {
                if (jobGeometry[this.index][0] > xMax) {
                    xMax = jobGeometry[this.index][0];
                }
                else if (jobGeometry[this.index][0] < xMin) {
                    xMin = jobGeometry[this.index][0];
                }
                else if (jobGeometry[this.index][1] < yMin) {
                    yMin = jobGeometry[this.index][1];
                }
                else if (jobGeometry[this.index][1] > yMax) {
                    yMax = jobGeometry[this.index][1];
                }
            }

            const distanciaA = this.distanciaPuntos([yMin, xMax], [yMin, xMin]);
            const distanciaB = this.distanciaPuntos([yMin, xMin], [yMax, xMin]);
            const anchoZoom = distanciaB;
            const factorCorreccionY = 0;
            const factorCorreccionX = 0;
            const centroMapa = [(distanciaB/2)+xMin+factorCorreccionX,(distanciaA/2)+yMin+factorCorreccionY];

            //Ajuste de zoom
            let zoom = 5.5;

            if (anchoZoom < 1000000 && anchoZoom > 600000) {
                zoom = 6;
            }

            else if (anchoZoom < 600000 && anchoZoom > 300001) {
                zoom = 7;
            }

            else if (anchoZoom < 300000 && anchoZoom > 150000) {
                zoom = 8;
            }

            else if (anchoZoom < 150000 && anchoZoom > 68966) {
                zoom = 9;
            }

            else if (anchoZoom < 68966 && anchoZoom > 34050) {
                zoom = 10.5;
            }

            else if (anchoZoom < 34050 && anchoZoom > 17241) {
                zoom = 11.5;
            }

            else if (anchoZoom < 17241 && anchoZoom > 8620) {
                zoom = 12.5;
            }

            else if (anchoZoom < 8620 && anchoZoom > 4256) {
                zoom = 13.5;
            }

            else if (anchoZoom < 4256 && anchoZoom > 2155) {
                zoom = 14.5;
            }

            else if (anchoZoom < 2155 && anchoZoom > 1074) {
                zoom = 15.5;
            }

            else if (anchoZoom < 1074 && anchoZoom > 537) {
                zoom = 16.5;
            }

            else if (anchoZoom < 537 && anchoZoom > 266) {
                zoom = 17.5;
            }

            else if (anchoZoom < 266 && anchoZoom > 138) {
                zoom = 18.5;
            }

            else if (anchoZoom < 138 && anchoZoom > 0) {
                zoom = 19.5;
            }

            const datosExtent = {
                centro: centroMapa,
                nuevoZoom : zoom,
            };

            return datosExtent;        
        },

        
            
        
    },
}