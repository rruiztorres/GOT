<template>
    <div class="h-80 mr-8">
            <h1 class="text-2xl font-bold my-6">
            Incidencias en Bandeja
            </h1>
            <div class="flex">
                <div class="w-3/4 bg-white p-6 rounded-lg shadow-sm mr-8">
                    <table class="w-full border text-center">
                        <thead>
                            <tr>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Incidencia</th>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Vía entrada</th>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Prioridad</th>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Seguimiento</th>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Procedencia</th>
                                <th class="bg-blue-100 mx-auto p-2 border border-white">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="p-1">IGN_C_202100001</td>
                                <td class="p-1">Directo</td>
                                <td class="p-1">Alta</td>
                                <td class="p-1">rrtorres@mitma.es</td>
                                <td class="p-1">IGN/CNIG</td>
                                <td class="p-1 flex">
                                    <input
                                        class="bg-green-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-3 py-1.5 rounded shadow outline-none focus:outline-none mr-1 mb-1 w-full"
                                        type="submit"
                                        value="Ver"
                                        >
                                    <input
                                        class="bg-red-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-3 py-1.5 rounded shadow outline-none focus:outline-none mr-1 mb-1 w-full"
                                        type="submit"
                                        value="Borrar"
                                        >
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="w-1/4 bg-white p-6 rounded-lg shadow-sm">
                    <p>Avisos</p>
                </div>
            </div>
        </div>
</template>

<script>
    
</script>
