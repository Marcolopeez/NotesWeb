//Aqui irán las url, rutas, de la página principal, por ejemplo /about, /contact... 

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/About', (req, res) => {
    res.render('about');
})

module.exports = router;