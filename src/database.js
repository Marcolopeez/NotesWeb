//Archivo para poder conectar con la base de datos. (Será usado por el archivo index.js).

const mongoose = require('mongoose');                           //Aqui estamos usando el modulo mongoose el cual nos sirve para conectar el server con la dataBase.

mongoose.connect('mongodb://localhost/notes-db-app', {          //Usamos el método connect, que nos sirve para conectarnos a una dirección de internet, como en este caso la dataBase está en nuestra propia maquina local, le decimos que se conecte al localhost y luego le ponemos el nombre de la Base de datos. Si existe la usa y sino la crea.
    
    useCreateIndex: true,                                       //...
    useNewUrlParser: true,                                      //...
    useFindAndModify: false                                     //...Configuraciones por defecto, para que no den error y nos deja modificar etc.

})

.then(db => console.log('DB is connected'))                     //Si se conecta muestra ese mensaje por consola.
.catch(err => console.error(err))                               //En caso contrario muestra el error por consola.