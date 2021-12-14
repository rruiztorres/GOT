function getZoomByExtent(altura, anchura){
    if (anchura <= 535.4243033695966) {
        if (altura <= 702.6388334439835) {
            const zoom = 17.5;
            return zoom
        }
    }
    else if (anchura <= 1084.3608919996768){
        if (altura <= 1418.7899521470536 ){
            const zoom = 16.5;
            return zoom
        }
    }
    else if (anchura <= 2195.746354520321){
        if (altura <= 2837.579904294922 ){
            const zoom = 15.5;
            return zoom
        }
    }
    else if (anchura <= 4269.882141709328){
        if (altura <= 5594.0860970390495 ){
            const zoom = 14.5;
            return zoom
        }
    }
    else if (anchura <= 8566.788853920065){
        if (altura <= 11161.147623561905 ){
            const zoom = 13.5;
            return zoom
        }
    }
    else if (anchura <= 17079.52856680937){
        if (altura <= 22214.196965054958 ){
            const zoom = 12.5;
            return zoom
        }
    }
    else if (anchura <= 33402.36915913038){
        if (altura <= 44536.492212176905 ){
            const zoom = 11.5;
            return zoom
        }
    }
    else if (anchura <= 68318.11426721979){
        if (altura <= 90153.96724503895 ){
            const zoom = 10.5;
            return zoom
        }
    }
    else if (anchura <= 136203.83540617023){
        if (altura <= 177281.18259216298){
            const zoom = 9.5;
            return zoom
        }
    }
    else if (anchura <= 274137.2433254402){
        if (altura <= 358021.51021051506){
            const zoom = 8.5;
            return zoom
        }
    }
    else if (anchura <= 546544.91413779){
        if (altura <= 710854.302881747){
            const zoom = 7.5;
            return zoom
        }
    }
    else if (anchura <= 1082712.3931970196){
        if (altura <= 1418249.4607373069){
            const zoom = 6.5;
            return zoom
        } else {
            const zoom = 5.5;
            return zoom
        }
    }
}

export const getMapExtent = {
    methods: {   
      getMapExtent(data){
        let extent = data.extent;
        let centroid = data.centroid;
        
        //Formateo de data
        extent = extent.split(",");
        extent[4] = extent[4].slice(0,-2);
        extent[0] = extent[4];
        centroid = centroid.slice(6,-1);
        centroid = centroid.split(" ");
        
        //Calculo distancia puntos anchura
        const anchXa = (extent[0].split(" "))[0]
        const anchYa = (extent[0].split(" "))[1]
        const anchXb = (extent[1].split(" "))[0]
        const anchYb = (extent[1].split(" "))[1]
        const distanciaAnchura = Math.sqrt((Math.pow((anchXb-anchXa),2))+(Math.pow((anchYb-anchYa),2)))

        //Calculo distancia puntos altura
        const altXa = (extent[3].split(" "))[0]
        const altYa = (extent[3].split(" "))[1]
        const altXb = (extent[4].split(" "))[0]
        const altYb = (extent[4].split(" "))[1]
        const distanciaAltura =  Math.sqrt((Math.pow((altXb-altXa),2))+(Math.pow((altYb-altYa),2)))

        //Ajuste zoom segun extent
        const zoom = getZoomByExtent(distanciaAnchura, distanciaAltura)
        
        //Salida
        const datosExtent = {
            centro: centroid,
            nuevoZoom: zoom,
        }
        return datosExtent;
      }
    },
}