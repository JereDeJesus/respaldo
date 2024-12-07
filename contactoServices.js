// services/contactoService.js
const Contacto = require('../models/contacto');

class ContactoService {
  // Método para agregar un contacto a la base de datos
  static async addContacto(nombre, correo, comentario) {
    try {
      const nuevoContacto = new Contacto({ nombre, correo, comentario });
      await nuevoContacto.save();
      return true; // Devuelve un valor indicativo de éxito
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      return false; // Devuelve un valor indicativo de error
    }
  }

  // Puedes agregar más métodos relacionados con contactos si es necesario
}

module.exports = ContactoService;
