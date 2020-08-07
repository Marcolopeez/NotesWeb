//En models decimos como van a lucir los datos en la dataBase. En este caso los usuarios.

const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require ('bcryptjs');                            //Con este require ya tenemos importado el módulo 'bcryptjs', y asi poder encriptar contraseñas.

const UserSchema = new Schema({                                 //Esta es la colección User, conformada por name, email, password y date.
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}                       //Añadimos date pero mongo igualmente lo añadiría si no lo hacemos nosotros.
});

//Como trabajamos con contraseñas debemos de encriptarlas. Para ello vamos a usar dos métodos. Para crear métodos con este modelo de datos ponemos "UserSchema.methods. + el nombre del método".

UserSchema.methods.encryptPassword = async (password) => {      //Este método recive una contraseña y la cifra gracias el módulo 'bcryptjs'.
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function(password) {   //Con este método comparamos la contraseña que introduce el usuario con la que tenemos almacenada en la dataBase. Para comprobar que sea la contraseña correcta. Esto lo hace encriptando la introducida y comparandolas una vez ambas han sido cifradas. Esto sirve para el log in(sing in) Como podemos obervar aqui no usamos flechas, sino la función 'function', eso es ya que con esta función podemos acceder a las propiedades, podemos acceder a ellas mediante 'this.' .
    return await bcrypt.compare(password, this.password);
}

//Ambos métodos de encriptación requieren tiempo, por lo que son asíncronos. Por ello hay que reflejarlo.(async, await).

module.exports = mongoose.model('User', UserSchema);