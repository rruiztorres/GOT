<template>
    <aside class="h-screen w-64 shadow-md mx-8 float-left bg-white bg-opacity-80 ">
        <!--user-->
        <UserMenu></UserMenu>
        <menuGJ></menuGJ>
        <!--fin opciones menu-->
    </aside> <!--menu-->
</template>

<script>

//iconos svg
import Vue from 'vue';
import { CogIcon } from "@vue-hero-icons/solid"; Vue.component('CogIcon', CogIcon);
import { CalendarIcon } from "@vue-hero-icons/solid"; Vue.component('CalendarIcon', CalendarIcon);
import { UserIcon } from "@vue-hero-icons/solid"; Vue.component('UserIcon', UserIcon);
import { ViewListIcon } from "@vue-hero-icons/solid"; Vue.component('ViewListIcon', ViewListIcon);
import { LogoutIcon } from "@vue-hero-icons/solid"; Vue.component('LogoutIcon', LogoutIcon);

import menuGJ from '../components/generadorJobs/menuGJ';
import UserMenu from '@/components/UserMenu';

export default {
    name: 'Sidebar',
    components: {
        menuGJ,
        UserMenu,
    },

    methods: {

    }
}
</script>