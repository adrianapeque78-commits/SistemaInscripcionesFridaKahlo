const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./database/connection");
const listadosRoutes = require("./routes/listadosRoutes");
const ruta = require.resolve("./routes/inscripcionesRoutes");
console.log("Cargando rutas desde:", ruta);

const inscripcionesRoutes = require("./routes/inscripcionesRoutes");
const authRoutes = require("./routes/authRoutes");
const docentesRoutes = require("./routes/docentesRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
console.log("Rutas de inscripciones cargadas");
app.use("/inscripciones", inscripcionesRoutes);
app.use("/listados", listadosRoutes);
app.use("/auth", authRoutes);
app.use("/docentes", docentesRoutes);
app.get("/prueba", (req, res) => {
    res.send("PRUEBA OK");
});
app.get("/", (req, res) => {
    res.send("🚀 Servidor del Sistema de Inscripciones Frida Kahlo funcionando correctamente");
});

// Probar conexión con PostgreSQL
app.get("/conexion", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");

        res.json({
            mensaje: "✅ Conexión exitosa con PostgreSQL",
            fechaServidor: resultado.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "❌ Error al conectar con PostgreSQL",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});