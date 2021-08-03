<template>
<div>
    <div class="h-18 p-6 bg-blue-800 text-white shadow-xl">
        <span class="flex items-center">
            <v-btn dark class="rounded-full bg-gray-700 shadow-l" icon @click="hacerMini()">
                <v-icon 
                v-if="mini==false"
                >
                    mdi-view-week
                </v-icon>
                <v-icon 
                v-if="mini==true"
                >
                    mdi-view-sequential
                </v-icon>
            </v-btn>
            <h6 class="text-xl flex-grow"></h6>
            <img class="border border-white h-10 mr-6" src="../assets/logoIGN.jpg">
        </span>
    </div>
    <div class="h-2 bg-blue-700 text-white">
    </div>
</div>
</template>


<script>

export default {
    methods: {
        hacerMini(){
        this.mini = !this.mini;
        this.$emit('cambiarMini', this.mini);
      },
    },
    data() {
        return {
            mini:false,
        }
    }
}
</script>