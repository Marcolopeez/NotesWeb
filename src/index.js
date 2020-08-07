//Archivo para poder arrancar nuestro servidor, archivo principal de todo nuestro código.

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const Handlebars = require('handlebars');                                                             //Esta linea y la siguiente es para apañar el problema de la nueva actualizacion con respecto al tema de seguridad que no te deja acceder directamente a la dataBase y obtener la info o algo asi.
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');                 //...
const passport = require('passport');



//Initiliazations

const app = express();
require('./database');                                          //Inicializamos la dataBase
require('./config/passport');

// Settings -> Aqui irán todas nuestras configuraciones.

app.set('port', process.env.PORT || 3000);                      //Ponemos 'process.env.PORT' or '3000' para usar el puerto 3000 o usar, en el caso de que el servidor de la nube nos facilite un puerto, el puerto facilitado.
app.set('views', path.join(__dirname, 'views'));                //Esta linea de codigo nos sirve para decirle a node dónde está la carpeta 'views', para ello usamos el módulo 'path', que añade a la dirección actual, (que actualmente nos lleva a src), 'views'. Añade views. Y esto lo hacemos porque ahi van nuestros archivos html.
app.engine('.hbs', exphbs({                                     //Como en distintos html vamos a usar la misma navegación, esto nos va a servir para crearla.
    handlebars: allowInsecurePrototypeAccess(Handlebars),       //Esta linea es para solucionar el problema de la nueva actualizacion con respecto al tema de seguridad que no te deja acceder directamente a la dataBase y obtener la info o algo asi.KWWKWK
    defaultLayout: 'main',                                      //Aqui ponemos el nombre del archivo dónde la vamos a crear creo.
    layoutsDir: path.join(app.get('views'), 'layouts'),         //Aqui la dirección.
    partialsDir: path.join(app.get('views'), 'partials'),       //Aqui la dirección de partials, que sirve por si queremos hacer formularios creo...
    extname: '.hbs'                                             //Aqui la extensión de los archivos.
}));        
app.set('view engine', '.hbs');                                 //Aqui configuramos el motor de plantilla, el motor de las vistas, las views.
app.use(passport.initialize());
app.use(passport.session());


//Middlewares -> Aqui irán todas las funciones que serán ejecutadas antes de pasarlas a las rutas.

app.use(express.urlencoded({extended: false}))    // El metodo de express urlencoded sirve para cuando un formulario quiera enviarme un dto pueda entenderlo, como cuando un suuario se registre. Me llegará su correo y contraseña, para entenderlo necesito dicho módulo. La propiedad extended: false es para asegurarse que solo nos llega lo que queremos, no una imagen por ejemplo.
app.use(methodOverride('_method'));               // Este middlewares nos sirve para que los formularios puedan enviar otros tipos de métodos, no solo get y post, sino otros como put y delete.
app.use(session({
    secret: 'mysecretapp',                        //Palabra secreta que nosotros solo sabemos.
    resave: true,                                 //...
    saveUninitialized: true                       //... Estas son configuraciones por defecto mediante las cuales express nos deja poder autentificar al usuario y almacenar sus datos temporalmente.
}));

app.use(passport.initialize());
app.use(passport.session());




//Global Variables -> Aqui colocaremos datos que quramos que sean accesibles para toda nuestra aplicaion.

app.use((req, res, next) => {
    //Aqui faltan lineas de FLASH
    res.locals.user = req.user || null;
    next();   
});


//Routes -> Aqui van todas las rutas de la app, las cuales están implementadas en la carpeta 'routes'

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//Static Files -> Para configurar dónde estará la carpeta de archivos estáticos.

app.use(express.static(path.join(__dirname, 'public')));       //Esta linea de codigo nos sirve para decirle a node dónde está la carpeta 'public', para ello usamos el módulo 'path', que añade a la dirección actual, (que actualmente nos lleva a src), 'public'. Añade public.                              

//Server is listening -> Inicializamos el server.

app.listen(app.get('port'), () => {                            //Al poner 'port', definido en 'Settings', en vez de poner directamente 3000 nos facilita a si queremos cambiar el número del puerto hacerlo solo en settings, en la definición de port, y automaticamente se cambiaría en todo sitio donde usemos 'port'. 
    console.log('Server on port', app.get('port')   );
}) 