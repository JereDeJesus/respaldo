const axios = require('axios');
const ContactoService = require('../services/contactoServices');

class ContactoController {
  // Método para mostrar el formulario de contacto
  static showForm(req, res) {
    res.render('index', { title: 'Formulario de Contacto', message: '¡Bienvenido!' });
  }

  // Método para guardar un contacto en la base de datos usando el servicio
  static async saveContacto(req, res) {
    const { nombre, correo, comentario, 'g-recaptcha-response': captchaResponse } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !correo || !comentario) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    // Verificar el CAPTCHA con Google
    const secretKey = '6LcypLwqAAAAAM-awIWcizLvzlPtjMq-tGbuFBIi'; // Sustituir con tu clave secreta de Google reCAPTCHA

    try {
      // Hacer la solicitud de verificación a Google reCAPTCHA
      const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: secretKey,
          response: captchaResponse
        }
      });

      // Si el CAPTCHA es exitoso
      if (googleResponse.data.success) {
        // Llamar al servicio para agregar el contacto
        const success = await ContactoService.addContacto(nombre, correo, comentario);

        if (success) {
          res.status(201).send('Comentario enviado con éxito.');
        } else {
          res.status(500).send('Error al guardar el comentario.');
        }
      } else {
        // Si el CAPTCHA no es válido
        res.status(400).send('Verificación de CAPTCHA fallida.');
      }
    } catch (error) {
      // Manejar errores de la solicitud
      res.status(500).send('Error al verificar el CAPTCHA.');
    }
  }
}

module.exports = ContactoController;
