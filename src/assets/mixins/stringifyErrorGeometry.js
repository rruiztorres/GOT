//Formatea la geometria de errores para la insercion en BD

export const stringifyErrorGeometry = {
    methods: {
        stringifyErrorGeometry(geometry){
        //Formatea la geometria de jobs para la insercion en BD
            this.coordinates = geometry.coordinates;
            this.string = 'POINT(';
            this.coordinate = this.coordinates.toString();
            this.coordinate = this.coordinate.replace(',',' ');
            this.string = this.string + this.coordinate;
            this.string = this.string + ')';
            return this.string;
        },
    },
}