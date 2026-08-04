const pool = require("../database/connection");

const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        const resultado = await pool.query(
            `
            SELECT
                u.id,
                u.nombre,
                u.usuario,
                u.rol_id,
                u.grupo_id,
                u.activo
            FROM usuarios u
            WHERE u.usuario = $1
            AND u.password = $2
            AND u.activo = TRUE
            `,
            [usuario, password]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

        res.json(resultado.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

module.exports = {
    login
};