// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Requiere tus controladores
const contactoController = require('./controllers/contactoController');
const calculoController = require('./controllers/calculoController');

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

// Definir las rutas
// Ruta para mostrar el formulario de contacto
app.get('/contacto', contactoController.showForm);

// Ruta para guardar el contacto
app.post('/contacto/guardar', contactoController.saveContacto);

// Ruta para mostrar el formulario de cálculo
app.get('/calculo', calculoController.showForm);

// Ruta para guardar el cálculo
app.post('/calculo/guardar', calculoController.saveCalculo);

// Ruta de inicio, puede redirigir a alguna página principal si es necesario
app.get('/', (req, res) => {
  res.render('inicio'); // Asegúrate de tener esta vista, o redirige a alguna página de opciones
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
