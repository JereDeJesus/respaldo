// middlewares/captchaMiddleware.js
const axios = require('axios');

const verificarCaptcha = async (req, res, next) => {
  const { 'g-recaptcha-response': captchaResponse } = req.body;

  if (!captchaResponse) {
    return res.status(400).send('Captcha no proporcionado.');
  }

  const secretKey = '6LcypLwqAAAAAM-awIWcizLvzlPtjMq-tGbuFBIi'; // Sustituir con tu clave secreta de Google reCAPTCHA

  try {
    // Hacer la solicitud de verificación a Google reCAPTCHA
    const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: captchaResponse
      }
    });

    // Si el CAPTCHA es exitoso, pasa al siguiente middleware o controlador
    if (googleResponse.data.success) {
      return next();
    } else {
      return res.status(400).send('Verificación de CAPTCHA fallida.');
    }
  } catch (error) {
    // Manejar errores de la solicitud
    return res.status(500).send('Error al verificar el CAPTCHA.');
  }
};

module.exports = verificarCaptcha;
