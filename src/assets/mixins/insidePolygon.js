function inside(point, vs) {
    /* Algoritmo raycasting
        Comprueba cuantas veces cruza un vector -emitido desde un punto- a un poligono
        Si el numero de veces que cruza es par consideramos que está dentro = TRUE
        Si el numero de veces que cruza es impar consideramos que está fuera = FALSE

    /* USO (Ejemplo)
    var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
    inside([ 1.5, 1.5 ], polygon); // true*/

    let x = point[0], y = point[1];

    this.inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0], yi = vs[i][1];
        let xj = vs[j][0], yj = vs[j][1];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (this.intersect) this.inside = !this.inside;
    }

    return this.inside;
};