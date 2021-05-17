<template>
<div>
    <div class="mt-2  p-4 flex items-center">
        <div class="rounded-full w-12 h-12 bg-white border">
            <h6 class="mt-2 text-xl text-center">RR</h6>
        </div>  

        <div class="ml-2 text-gray-700">
            <h6 class="text-xs font-bold">Raúl Ruiz Torres</h6>
            <p>Generador de Jobs</p>
        </div>
    </div> <!-- fin user --> 


    <div class="flex ml-4">
        <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
            <CogIcon></CogIcon>
        </span> <!--configuracion-->

        <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
            <CalendarIcon></CalendarIcon>
        </span> <!--calendario-->

        <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
            <ViewListIcon></ViewListIcon>
        </span> <!--cambio de rol-->

        <div v-if="menu">
            <ul>
                <li v-for="item in items" :key="item.name">
                    {{item.name}}
                </li>
            </ul>
        </div>

        <span class="transition duration-300 ease-in-out hover:bg-white m-1 p-3 border-white">
            <LogoutIcon></LogoutIcon>
        </span> <!--logout -->
    </div>
    <!-- opciones menu -->
</div>

</template>


<script>

export default {
    data() {
        const menu = false;
        return {menu};
    },
    created() {
        this.setMenuRole()
    },
    methods: {
        setMenuRole(){
            this.items = [
                {name:'item1'},
                {name:'item2'},
                {name:'item3'},
            ]
        },
        showMenu(){
            console.log("soy un menu");
        },
    },
}

</script>