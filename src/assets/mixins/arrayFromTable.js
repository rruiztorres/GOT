function arrayFromTable(url, metodo, nombreAtributo){
let arrayExit = [];

    axios   .get(url + metodo)
            .then(data =>   {
                            this.returnedObject = (data.data.response)
                                for (this.index in this.returnedObject){
                                    let newElement = this.returnedObject[this.index].(nombreAtributo)
                                    arrayExit.push(newElement);
                                }
                            },
                    )
return arrayExit;
}