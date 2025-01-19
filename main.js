const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');

// Requiere el controlador de contacto
const contactoController = require('./controller/controllermodel'); 
const verificarCaptcha = require('./middlewares/captchamiddleware')

// Configurar Express
const app = express();
const PORT = 3000;

// Conexión a MongoDB (para el formulario de contacto)
mongoose.connect('mongodb://localhost:27017/contactoDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(express.urlencoded({ extended: true })); // Parsear los datos del formulario
app.use(express.json()); // Parsear los datos JSON
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos como CSS, JS

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para mostrar el formulario de contacto
app.get('/contacto', contactoController.showForm);

// Ruta para guardar el contacto
app.post('/contacto/guardar', async (req, res) => {
    const { gRecaptchaResponse, nombre, correo, comentario } = req.body;
    
    // Verificar CAPTCHA
    const secretKey = '6LcypLwqAAAAAM-awIWcizLvzlPtjMq-tGbuFBIi'; // Usa tu clave secreta de Google reCAPTCHA

    const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: secretKey,
            response: gRecaptchaResponse
        }
    });

    if (googleResponse.data.success) {
        // CAPTCHA validado correctamente, procesamos los datos
        await contactoController.saveContacto(req, res);  // Llama al método de tu controlador para guardar el contacto
    } else {
        res.status(400).send('Verificación de CAPTCHA fallida.');
    }
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('opciones'); // Asegúrate de tener esta vista, o redirige a alguna página de opciones
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
