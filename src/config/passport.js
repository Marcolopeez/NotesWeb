//Este archivo nos sirve para poder autentificar a los usuarios, gracias al módulo passport y passport-local.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User')                                     //Requerimos el usuario para poder hacer busquedas en la base de datos.

passport.use(new LocalStrategy(                                            //Con este método podemos definir una nueva estrategia de autentificación.
    {usernameField: 'email'},                                              //Esto es con lo que el usuario se logea, espeficamos que es el email.
    async (email, password, done) => {                                     //Aqui definimos los parámetros que vamos a recibir. El 'done' es un callback. 
    const user = await User.findOne({email: email});                        //Aqui buscamos en la base de datos el email introducido.
    if(!user){                                                             //Si no existe significa que no hay ningun usuario con el correo introducido.
        return done(null, false /*,{message: 'Not User found.'}*/);             //Enviamos null para decir que no hay ningún error, false para decir que no ya usuario, y el mensaje a mostrar. (LOS MENSAJES SON PARA FLASH, QUE AUN NO LO TENGO INSTALADO)
    }
    else{       
        const match = await user.matchPassword(password);                        //Si se identifica el correo comprobamos si está bien la contraseña.
        if(match){                                                         //Si está bien:
            return done(null, user);                                       //Enviamos null para decir que no hay ningun error y devolvemos user porque está bien la password.
        }
        else{                                                              //Y si está mal:
            return done(null, false/*, {message: 'Not User found.'}*/);     //Enviamos null para decir que no hay ningun error, devolvemos false porque no se ha identificado el usuario y el mensaje a mostrar.
        }
    }
}));


//Con este método cuando el usuario se logea almacenamos su id.

passport.serializeUser( (user, done) => {               //toma el usuario y el callback.
    done(null, user.id);                                //Aqui almacenamos el id del usuario para crear la sesión.
});

//Con este método hacemos el proceso inverso, tomamos el id y generamos el usuario.

passport.deserializeUser( (id, done) => {
    User.findById(id,(err, user) => {                   //Hacemos una busqueda en la base de datos del id.
        done(err, user);                                //Aqui retorna el error en caso de que lo haya o en caso contrario el usuario.
    })
})