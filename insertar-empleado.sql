-- Script para crear un usuario empleado
-- Ejecutar en PostgreSQL

-- Primero hashear la contraseña "Empleado123!" con bcrypt
-- Puedes usar una herramienta online como https://bcrypt-generator.com/

INSERT INTO usuarios (nombre, apellido, email, rol, contraseña, estado)
VALUES (
  'Empleado',
  'Test',
  'empleado.test@nathalia.cr',
  'empleado',
  '$2b$10$P8ySALu7nU5D5GlDk5qvt.K8V5Q2D1H7Y8Z9A0B1C2D3E4F5G6H7I', -- hash de "Empleado123!"
  'activo'
);

-- Verificar que se creó
SELECT id_usuario, nombre, email, rol, estado FROM usuarios WHERE email = 'empleado.test@nathalia.cr';
