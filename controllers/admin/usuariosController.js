import pool from "../../config/db.js"
import bcrypt from "bcrypt"
import * as XLSX from "xlsx"

export async function getUsuarios(req, res) {
  try {
    const result = await pool.query(`
      SELECT *
      FROM usuarios
      ORDER BY id_usuario ASC
    `);

    res.json({ ok: true, usuarios: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

export async function crearUsuario(req, res) {
  try {
    const { nombre, apellido = '', email, rol = 'empleado', contraseña = 'Temporal123!' } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ ok: false, error: 'Nombre y email son obligatorios.' });
    }

    // Validar que el rol sea válido
    const rolesValidos = ['admin', 'empleado', 'gerente'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ ok: false, error: `Rol inválido. Debe ser uno de: ${rolesValidos.join(', ')}` });
    }

    // Verificar que el email no exista ya en usuarios
    const emailExiste = await pool.query(
      'SELECT email FROM usuarios WHERE email = $1',
      [email]
    );

    if (emailExiste.rows.length > 0) {
      return res.status(400).json({ ok: false, error: 'Ese email ya está registrado como usuario del sistema.' });
    }

    // Hash de la contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(`
      INSERT INTO usuarios (nombre, apellido, email, contraseña, rol, estado)
      VALUES ($1, $2, $3, $4, $5, 'activo')
      RETURNING id_usuario, nombre, apellido, email, rol, estado
    `, [nombre, apellido, email, contraseñaHash, rol]);

    res.status(201).json({ 
      ok: true, 
      usuario: result.rows[0],
      mensaje: `Usuario ${rol} creado. Contraseña temporal: ${contraseña}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

export async function cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ ok: false, error: 'El estado es obligatorio.' });
    }

    const result = await pool.query(`
      UPDATE usuarios
      SET estado = $1
      WHERE id_usuario = $2
      RETURNING *
    `, [estado, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado.' });
    }

    res.json({ ok: true, usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM usuarios
      WHERE id_usuario = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado.' });
    }

    res.json({ ok: true, eliminado: true, usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
}