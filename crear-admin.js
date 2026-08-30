// Crea o actualiza un usuario administrador en la tabla "usuarios".
// Uso: node crear-admin.js <email> <contraseña> [nombre] [apellido]
// La contraseña se encripta con bcrypt (10 rondas), igual que en producción.
import bcrypt from 'bcrypt';
import pool from './config/db.js';

const email = process.argv[2]
const contraseña = process.argv[3]
const nombre = process.argv[4] || 'Administrador'
const apellido = process.argv[5] || 'Granova'
const rol = 'admin'

if (!email || !contraseña) {
  console.error('Uso: node crear-admin.js <email> <contraseña> [nombre] [apellido]')
  process.exit(1)
}

async function crearAdmin() {
  try {
    const hash = await bcrypt.hash(contraseña, 10)
    const existe = await pool.query('SELECT id_usuario FROM usuarios WHERE email = $1', [email])

    if (existe.rows.length > 0) {
      await pool.query(
        'UPDATE usuarios SET contraseña = $1, rol = $2, estado = $3, nombre = $4, apellido = $5 WHERE email = $6',
        [hash, rol, 'activo', nombre, apellido, email]
      )
      console.log('✅ Usuario actualizado:', email)
    } else {
      await pool.query(
        'INSERT INTO usuarios (nombre, apellido, email, rol, contraseña, estado) VALUES ($1, $2, $3, $4, $5, $6)',
        [nombre, apellido, email, rol, hash, 'activo']
      )
      console.log('✅ Usuario creado:', email)
    }

    console.log('Rol:', rol)
    console.log('Estado: activo')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    pool.end()
  }
}

crearAdmin()