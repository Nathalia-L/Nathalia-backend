import bcrypt from 'bcrypt';
import pool from './config/db.js';

async function crearEmpleado() {
  try {
    const contraseña = 'Empleado123!';
    const hash = await bcrypt.hash(contraseña, 10);
    
    console.log('Hash generado:', hash);
    
    const result = await pool.query(`
      INSERT INTO usuarios (nombre, apellido, email, rol, contraseña, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_usuario, nombre, apellido, email, rol, estado
    `, ['Empleado', 'Test', 'empleado.test@granova.cr', 'empleado', hash, 'activo']);
    
    console.log('✅ Empleado creado:', result.rows[0]);
    console.log('\nCredenciales para ingresar:');
    console.log('Email: empleado.test@nathalia.cr');
    console.log('Contraseña: Empleado123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

crearEmpleado();
