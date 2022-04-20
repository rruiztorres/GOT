export const getDefaultPanel = {
  data(){
    return {
      dPanelGeneradorJobs: 'JobsTriajeGJ',
      dPanelOperadorEspecializado: 'BandejaMisJobs',
      dPanelOperador: undefined,
      dPanelControlCalidad: undefined,
      dPanelGestor: 'EstadisticasGestor',
      dPanelSoporteBDIG: 'BandejaErrCrear',
      dPanelGOTAdmin: 'GestionUsuarios',
    }

  },

  methods:{
    getDefaultPanel(rol){
      if ( rol === 'Generador de Jobs'){ return this.dPanelGeneradorJobs }
      else if (rol === 'Operador Especializado'){ return this.dPanelOperadorEspecializado }
      else if (rol === 'Operador'){ return this.dPanelOperador }
      else if (rol === 'Control de Calidad'){ return this.dPanelControlCalidad }
      else if (rol === 'Gestor'){ return this.dPanelGestor }
      else if (rol === 'GOT Admin'){ return this.dPanelGOTAdmin }
   
    }
  }
}




