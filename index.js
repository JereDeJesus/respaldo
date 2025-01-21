const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const nodemailer = require("nodemailer");  // Requerimos nodemailer
const app = express();

// Configuración de la conexión a la base de datos
let conexion = mysql.createConnection({
    host: "localhost",
    database: "usuarios",
    user: "root",
    password: "", // Asegúrate de usar la contraseña correcta
});

conexion.connect(function (err) {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.stack);
        return;
    }
    console.log("Conectado a la base de datos como ID", conexion.threadId);
});

// Configuración de EJS y middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Especificamos la carpeta donde están las vistas
app.use(express.static(path.join(__dirname, "public"))); // Asegúrate de tener los archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // Cambia esto si usas otro servicio de correo
    auth: {
        user: "jeremaya.halu@gmail.com", // Tu correo electrónico
        pass: "dcnb eroe etsu fuyz" // Tu contraseña o contraseña de aplicación
    }
});

// Ruta para la página principal con opciones
app.get("/", (req, res) => {
    res.render("opciones"); // Renderiza la vista 'opciones.ejs'
});

// Ruta para el formulario de registro
app.get("/formulario", (req, res) => {
    res.render("formulario"); // Renderiza la vista 'formulario.ejs'
});

// Ruta para manejar el envío del formulario de registro
app.post("/add", (req, res) => {
    const datos = req.body;

    let nombre = datos.nombre;
    let correo = datos.correo;
    let comentario = datos.comentario;

    // Obtener la dirección IP del cliente
    let direccion_ip = req.ip;

    // Si la IP es ::1, la cambiamos a 127.0.0.1
    if (direccion_ip === "::1") {
        direccion_ip = "127.0.0.1";
    }

    // Obtener la fecha y hora actual
    const fecha_hora = new Date(); // Fecha y hora de la solicitud

    // Insertar los datos en la base de datos
    const registrar = `INSERT INTO contactosmodel (nombre, correo, comentario, direccion_ip, fecha_hora) 
    VALUES ('${nombre}', '${correo}', '${comentario}', '${direccion_ip}', '${fecha_hora.toISOString()}')`;

    conexion.query(registrar, function (error) {
        if (error) {
            console.error("Error al almacenar los datos:", error);
            res.status(500).send("Error al almacenar los datos.");
        } else {
            console.log("Datos almacenados");

            // Enviar correo de confirmación o notificación
            const mailOptions = {
                from: "jeremaya.halu@gmail.com", // De quien está enviando el correo
                to: "programacion2ais@dispostable.com, naycitoacosta@gmail.com", // Lista de destinatarios
                subject: "Nuevo Comentario de Contacto",
                text: `Se ha recibido un nuevo comentario:

Nombre: ${nombre}
Correo: ${correo}
Comentario: ${comentario}

Dirección IP: ${direccion_ip}
Fecha y hora: ${fecha_hora.toISOString()}`
            };

            // Enviar el correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error al enviar el correo:", error);
                    return res.status(500).send("Error al enviar el correo.");
                }
                console.log("Correo enviado:", info.response);
                res.send("Datos almacenados y correo enviado correctamente.");
            });
        }
    });
});

// Ruta para el formulario de cálculo
app.get("/index", (req, res) => {
    res.render("index"); // Renderiza la vista 'index.ejs'
});

// Inicia el servidor
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
