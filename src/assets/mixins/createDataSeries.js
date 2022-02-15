export const createDataSeries = {
  methods: {
    createDataSeries(data, propiedad) {
      this.tipoSinFiltrar = [];
      this.tiposFiltrados = [];
      this.serieTiposJob = [];

      //CREAMOS ARRAY
      for (this.index in data) {
        this.tipoSinFiltrar.push(data[this.index][propiedad]);
      }

      //VALORES UNICOS ARRAY
      this.tipoSinFiltrar = this.tipoSinFiltrar.sort();
      for (let i = this.tipoSinFiltrar.length - 1; i >= 0; i--) {
        if (this.tipoSinFiltrar[i] === this.tipoSinFiltrar[i - 1]) {
          this.tipoSinFiltrar.splice(i, 1);
        } else {
          this.tiposFiltrados.push(this.tipoSinFiltrar[i]);
        }
      }

      //DEVOLVER ESTADÍSTICAS
      for (this.index in data) {
        for (this.i in this.tiposFiltrados) {
          if (data[this.index][propiedad] === this.tiposFiltrados[this.i]) {
            if (this.serieTiposJob[this.i] === undefined) {
              this.serieTiposJob[this.i] = 1;
            } else {
              this.serieTiposJob[this.i]++;
            }
          }
        }
      }
      return { tipos: this.tiposFiltrados, series: this.serieTiposJob };
    },
  },
};
