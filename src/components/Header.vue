<template>
<div>
    <div class="h-20 bg-blue-800 text-white shadow-xl p-5">
            <div class="flex">
                <v-btn tile icon dark @click="hacerMini()">
                    <v-icon large>mdi-view-headline</v-icon>
                </v-btn>
                <h6 class="text-xl flex-grow"></h6>
                <img class="border border-white h-10 mr-6" src="../assets/logoIGNmini.png">
            </div>
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