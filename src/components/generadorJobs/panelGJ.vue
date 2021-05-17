<template>
<div class="mt-4">
    <div class="flex">
        <div class="h-full w-full bg-white rounded-lg shadow-sm mr-4">
            <!--v-if IncTriajeGJ == true activo -->
            <div>   <IncTriajeGJ></IncTriajeGJ> </div>

        </div>
    </div>
</div>        
</template>

<script>

import IncTriajeGJ from "@/components/generadorJobs/IncTriajeGJ";

    export default {
        name:"panelGJ",
        components:{
            IncTriajeGJ,
           
        },
    }


</script>
