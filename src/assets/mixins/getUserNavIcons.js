export const getUserNavIcons = {
    data(){
      return {
        generadorJobsIcon: 'mdi-account-edit',
        operadorEspIcon: 'mdi-account-hard-hat',
        operadorIcon:'mdi-account-hard-hat',
        controlCalidadIcon: 'mdi-account-eye',
        gestorIcon: 'mdi-account-tie',
        soporteBdigIcon: 'mdi-account-child',
        gotAdminIcon: 'mdi-account-tie-hat',
      }
  
    },
  
    methods:{
        getUserNavIcons(rol){
            if ( rol === 'Generador de Jobs'){ return this.generadorJobsIcon}
            else if (rol === 'Operador Especializado'){ return this.operadorEspIcon}
            else if (rol === 'Operador'){ return this.operadorIcon}
            else if (rol === 'Control de Calidad'){ return this.controlCalidadIcon}
            else if (rol === 'Gestor'){ return this.gestorIcon}
            else if (rol === 'Soporte BDIG'){ return this.soporteBdigIcon}
            else if (rol === 'GOT Admin'){ return this.gotAdminIcon}
            
            else { return 'mdi-cog'}
      }
    }
  }

  