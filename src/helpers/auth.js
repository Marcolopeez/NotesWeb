const helpers = {};       //Creamos el objeto helpers.

helpers.isAutheticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    //AQUI IRIA UN MENSAJE DE FLASH DICIENDO QUE NO ESTA LOGEADO EL USUARIO.
    res.redirect('/users/signin');
}

module.exports = helpers;