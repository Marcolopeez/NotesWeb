//Aqui iran las url que usaran los usuarios para manejar sus notas, crearlas, eliminarlas, actualizarla...

const express = require('express');
const router = express.Router();

const Note = require('../models/Note')                          //Aqui requerimos el modelo de datos creado en models para la base de datos. Gracias a este Note podemos crear, editar, eliminar notas...
const { isAutheticated } = require('../helpers/auth');

router.get('/notes/add', isAutheticated, (req, res) => {                        
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAutheticated, async(req, res) => {             //Esto es lo del action de new-note. Cuando nos llega del formulario una peticion post lo que hacemos es almacenar en un objeto el titulo y la descripcion recivida del post, es decir, del req.body, (eso lo hacemos en la siguiente liena). OJO, el 'async', es por que es un proceso ASINCRONO, al mandar el servidor los datos a la base. Por ello, debemos de especificarlo.
    const {title, description} = req.body;

    const errors = [];                                          //Esto es típico, se hace para enviar errores.
    if(!title){ 
        errors.push({text: 'Please Write a Title.'});           //Si no hay 'título' creamos un error.
    }
    if(!description){
        errors.push({text: 'Please Write a Description.'});     //Si no hay 'description' creamos un error.
    }
    if(errors.length > 0){                                      //Aqui comprobamos si hay algun error creado.
        res.render('notes/new-note', {                          //En ese caso, renderizamos el formulario de nuevo y mostramos los errores. También mostramos el titulo y la descripcion introducidos.
            errors, 
            title, 
            description
        });
    }else{
        const newNote = new Note({title, description});          //Aqui creamos nuestra nota nueva de la clase o esquema Note.
        newNote.user = req.user.id;                              //Con esto enlazamos la nota creada con el id del usuario, para que solo la vea él.
        await newNote.save();                                    //Con esto se crea la nota en la dataBase.  OJO, con el await avisamos que este proceso puede tomar unos segundos, especificamos que es un proceso asíncrono.
        res.redirect('/notes');
    }
});

router.get('/notes', isAutheticated, async(req, res) => {
   const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
   res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAutheticated, async (req, res) => {                       //Esta es la ruta que se manda al darle al lapiz de editar.
    const note = await Note.findById(req.params.id);                      //Aqui obtenemos de la base de datos la nota apartir del id que se nos pasa.
    res.render('notes/edit-note', {note});                                //Aqui la renderizamos para mostrarla.
})

router.put('/notes/edit-note/:id', isAutheticated, async (req, res) => {                         //Esta es la ruta que obtenemos cuando el usuario guarda el edit.
    const {title, description} = req.body;    
    
    const errors = [];                                          //Esto es típico, se hace para enviar errores.

    if(!title){ 
        errors.push({text: 'Please Write a Title.'});           //Si no hay 'título' creamos un error.
    }

    if(!description){
        errors.push({text: 'Please Write a Description.'});     //Si no hay 'description' creamos un error.
    }

    if(errors.length > 0){                                      //Aqui comprobamos si hay algun error creado.
        const note = await Note.findById(req.params.id);
        res.render('notes/edit-note',                           //En ese caso, renderizamos el formulario de nuevo y mostramos los errores. También mostramos el titulo y la descripcion introducidos.
            {errors, 
            note
            });
        
    }else{
        await Note.findByIdAndUpdate(req.params.id, {title, description});          //"findByIdAndUpdate" nos permite buscar por id y luego actualizar los datos que introdujamos en el segundo parámetro.
        res.redirect('/notes');                                                     //Una vez actualizado redireccionamos a notes.
    }                                  
});

router.delete('/notes/delete/:id', isAutheticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});

module.exports = router;
