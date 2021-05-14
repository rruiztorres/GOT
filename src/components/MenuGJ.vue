<template>
<div class="mt-8">

    <div class="ml-4">
        <h1 class="text-xl my-4">Gestión Incidencias</h1>
    </div>
    <ul>
        <li 
        v-on:click="openPanel(accion.group, accion.name, true)" 
        class="hover:bg-gray-300 hover:shadow-inner text-left mb-2 w-full bg-gray-200 text-s px-4 py-3 mr-1 mb-1 ease-linear transition-all duration-50" 
        v-for="accion in gestionIncidencias" :key="accion.label">
        {{accion.label}}
        </li>
    </ul>


    <div class="ml-4">
        <h1 class="text-xl my-4">Menú principal</h1>
    </div>
    <ul>
        <li
        v-on:click="openPanel(accion.group, accion.name, true)"
        class="items-center flex hover:bg-gray-300 hover:shadow-inner text-left mb-2 w-full bg-gray-200 text-s px-4 py-3 mr-1 mb-1 ease-linear transition-all duration-50" 
        v-for="accion in menuPrincipal" :key="accion.label">
        <div class="flex-grow">
        {{accion.label}}
        </div>
        <div class="px-2 bg-red-500 text-white p-1 rounded">
        {{accion.pend}}
        </div>
        </li>
    </ul>

    <div class="ml-4">
        <h1 class="text-xl my-4">Informes</h1>
    </div>
    <ul>
        <li
        v-on:click="openPanel(accion.group, accion.name, true)"
        class="items-center flex hover:bg-gray-300 hover:shadow-inner text-left mb-2 w-full bg-gray-200 text-s px-4 py-3 mr-1 mb-1 ease-linear transition-all duration-50" 
        v-for="accion in informes" :key="accion.label">
        <div class="flex-grow">
        {{accion.label}}
        </div>
        </li>
    </ul>
</div> 
</template>

<script>

export default {

    created() {
        this.defineMenu(true);
    },
    
    methods: {
        defineMenu(){
            this.gestionIncidencias = [
                {group: 'gestionIncidencias', name: '', label:'Insertar incidencia', active: false},
                {group: 'gestionIncidencias', name: '', label:'Eliminar incidencia', active: false}
            ];
            this.menuPrincipal = [
                {group: 'menuPrincipal', name: 'IncBdjGJ', label:'Incidencias en Bandeja', pend: 15, active: false},
                {group: 'menuPrincipal', name: 'IncTriaje', label:'Incidencias en Triaje', pend: 0, active: false},
                {group: 'menuPrincipal', name: '', label:'IDV', pend: 0, active: false},
                {group: 'menuPrincipal', name: '', label:'Jobs Devueltos', pend: 0, active: false},
                {group: 'menuPrincipal', name: '', label:'Jobs en Triaje', pend: 0, active: false}
            ];
            this.informes = [
                {group: 'informes', name: '', label:'Vista General', active: true}, // --> vista definida por defecto
                {group: 'informes', name: '', label:'Mis KPI', active: false}
            ];
        },
        reloadMenu(){
            const menuList = this.gestionIncidencias + this.menuPrincipal + this.informes;
            for (this.element in menuList) {
                if (this.element.menu == true) {
                    this.element.menu = false;
                }
            }
        },
        openPanel(groupPanel, panel, isActive) {
            this.reloadMenu(); //evita dos paneles activos al mismo tiempo
            const menu = [groupPanel, panel, isActive];
            console.log (menu);
            return {menu};
            
        }, 
    }

}
</script>