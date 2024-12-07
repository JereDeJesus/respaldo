// controllers/contactoController.js
const ContactoService = require('../services/contactoService');

class ContactoController {
  // Método para mostrar el formulario de contacto
  static showForm(req, res) {
    res.render('index', { title: 'Formulario de Contacto', message: '¡Bienvenido!' });
  }

  // Método para guardar un contacto en la base de datos usando el servicio
  static async saveContacto(req, res) {
    const { nombre, correo, comentario } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !comentario) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    // Llamar al servicio para agregar el contacto
    const success = await ContactoService.addContacto(nombre, correo, comentario);

    if (success) {
      res.status(201).send('Comentario enviado con éxito.');
    } else {
      res.status(500).send('Error al guardar el comentario.');
    }
  }
}

module.exports = ContactoController;
