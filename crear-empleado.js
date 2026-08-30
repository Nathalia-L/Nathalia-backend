import http from 'http';

const data = JSON.stringify({
  nombre: 'Empleado',
  apellido: 'nathalia',
  email: 'empleado@nathalia.cr',
  rol: 'empleado',
  contraseña: 'Empleado123!'
});

console.log('Creando empleado con:', data);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/usuarios',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log('✅ Respuesta:', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('Respuesta raw:', body);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});

req.write(data);
req.end();
