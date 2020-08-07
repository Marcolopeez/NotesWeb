//En models decimos como van a lucir los datos en la dataBase, en este caso las notas.

const mongoose = require('mongoose');                   //Requerimos Mongoose, pero no para crear la base de datos, eso ya lo hemos hecho, lo hacemos para crear esquemas de datos. Al crear un esquema lo que estamos creando es como una clase que vamos a usar.
const {Schema} = mongoose;                              //Aqui pedimos solo los esquemas.

const NoteSchema = new Schema({                            
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},               //El default es para que cuando se cree la nota, como no se va a dar ninguna fecha, coja la actual.
    user: {type: String}
});

module.exports = mongoose.model('Note', NoteSchema);