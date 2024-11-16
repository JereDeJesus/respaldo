const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Para manejar datos de formularios
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos
app.set('view engine', 'ejs'); // Configurar EJS
app.set('views', path.join(__dirname, 'views'));

// Datos simulados
let items = [];

// Rutas
app.get('/', (req, res) => {
    res.render('index', { items });
});

app.post('/add', (req, res) => {
    const { name } = req.body;
    if (name) {
        items.push(name); // Agrega el elemento
    }
    res.redirect('/'); // Redirige a la página principal
});

app.post('/delete', (req, res) => {
    const { name } = req.body;
    items = items.filter(item => item !== name); // Elimina el elemento
    res.redirect('/');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});