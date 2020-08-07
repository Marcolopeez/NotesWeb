//Aqui irán las urls, o rutas, en las que los usuarios se pueden registrar o hacer login(autentificarse).

const express = require('express');
const router = express.Router();

//Requerimos el modelo de datos del usuario para poder guardarlos mas abajo en el signup.
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0)
    {
        errors.push({text: 'Please insert your name'});
    }
    if(email.length <= 0)
    {
        errors.push({text: 'Please insert your email'});
    }
    if(password.length <= 0)
    {
        errors.push({text: 'Please insert your password'});
    }
    if(confirm_password.length <= 0)
    {
        errors.push({text: 'Please insert your confirm password'});
    }
    if((password != confirm_password) && (password.length > 0) && (confirm_password.length > 0)){
        errors.push({text: 'Passwords do not match'});
    }
    if((password.length < 4) && (password.length > 0) ){
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }
    else{
        const emailUser = await User.findOne({email: email});       //Por si el email ya existe.
        if(emailUser){
            //aqui habría que lanzar con flash un mensaje que dijese que ya existe una cuenta para ese correo.
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});              //Aqui creamos el nuevo objeto, el nuevo usuario.
        newUser.password = await newUser.encryptPassword(password);     //Aqui guardamos la contraseña encriptada.
        await newUser.save();                                           //Aqui guardamos el usuario.

        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;