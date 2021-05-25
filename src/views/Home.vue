<template>
  <div class="home">
    <div class="font-sans text-gray-800 antialiased">
      <nav class="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 ">

        <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">

          <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <!--<a class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white" 
            href="#">
            BDIG
            </a>-->

            <button
              class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onclick="toggleNavbar('example-collapse-navbar')">
                <i class="text-white fas fa-bars"></i>
            </button>
          </div>
        
          <div class="lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none hidden" id="example-collapse-navbar">

            

            <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li class="flex items-center">
                <button
                  class="bg-white text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
                  type="button">
                  <i class="fas fa-arrow-alt-circle-down"></i> Ayuda
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
      <main>
        <section class="absolute w-full h-full">
          <div class="bg-gray-900 absolute top-0 w-full h-full"> <!--sin imagen fondo -->
          <!--<div class="bg-login-back bg-cover absolute top-0 w-full h-full">--> <!--con imagen fondo-->
          <!--background login --> 
          </div>
          <div class="container mx-auto px-4 h-full">
            <div class="flex content-center items-center justify-center h-full">
              <div class="w-full lg:w-4/12 px-4">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                  <div class="rounded-t mb-0 px-6 py-6">
                    <div class="text-center mb-3">
                      <h1 class="text-gray-500 text-3xl">
                        InciGEO
                      </h1>
                    </div>
                    <div class="btn-wrapper text-center">
                      <!--logo-->
                      <img class="w-4/5 m-auto" src="../assets/logoIGN.jpg">
                    </div>
                    <hr class="mt-6 border-b-1 border-gray-400" />
                  </div>

                  <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <form v-on:submit.prevent="login">
                      <div class="relative w-full mb-3">
                        <label
                          class="block uppercase text-gray-700 text-xs font-bold mb-2"
                          for="grid-password">
                          Usuario</label>
                          <input
                          autocomplete=username
                          v-model="usuario"
                          type="text"
                          class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Usuario"
                          required
                        />
                      </div>

                      <div class="relative w-full mb-3">
                        <label
                          class="block uppercase text-gray-700 text-xs font-bold mb-2"
                          for="grid-password">
                          Password
                        </label>
                        <input
                          autocomplete=current-password
                          v-model="password"
                          type="password"
                          class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                          placeholder="Password"
                          required
                        />
                      </div>

                      <div>
                        <label 
                          class="inline-flex items-center cursor-pointer">
                          <input
                            id="customCheckLogin"
                            type="checkbox"
                            class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                          />
                          <span class="ml-2 text-sm font-semibold text-gray-700">
                          Recuerdame
                          </span>
                        </label>
                      </div>

                      <div class="text-center mt-6 text-white">
                        <input
                          class="bg-gray-900 active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                          type="submit"
                          value="LOGIN"
                        >
                      </div>
                      <div v-if="error" role="alert">
                        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                          ¡Error!
                        </div>
                        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                           {{error_msg}}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer class="absolute w-full bottom-0 bg-gray-900 pb-6">
            <div class="container mx-auto px-4">
              <hr class="mb-6 border-b-1 border-gray-700" />
              <div class="flex flex-wrap items-center md:justify-between justify-center">
                <div class="w-full md:w-4/12 px-4">
                  <div class="text-sm text-white font-semibold py-1">
                    CC BY-NC-SA-ND 4.0
                    <a href="https://www.ign.es" class="text-white hover:text-gray-400 text-sm font-semibold py-1">
                    Instituto Geográfico Nacional</a>
                  </div>
              </div>
              <div class="w-full md:w-8/12 px-4">
                  <ul class="flex flex-wrap list-none md:justify-end  justify-center">
                    <li>
                      <a href="#" class="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3">
                      Proyecto BDIG
                      </a>
                    </li>
                    <li>
                      <a href="#" class="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3">
                      Acerca de
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: 'Home',
    components: {
    
    },
    data(){
      return{
        usuario:"",
        password:"",
        error: false,
        error_msg: ""
      }
    },
    methods:{
      login(){
        let json = {
          "usuario": this.usuario,
          "password": this.password,
        };

      const url = 'http://10.13.86.114:3000/';

        axios.post(url+'auth/'+this.usuario + '/' + this.password, json).then(data => 
        {
          if (data.data.status == 200) {
            localStorage.token = data.data.token;
            localStorage.usuario = data.data.usuario;
            localStorage.rol = data.data.rolDefecto;
            this.$router.push('Dashboard');
          } else {
            this.error = data.data.error;
            this.error_msg = data.data.error_msg;
            }
        })
      }
    }
  }
</script>
