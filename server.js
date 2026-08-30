import express from "express"
import "dotenv/config"
import cors from "cors"
import dns from "node:dns"

// Railway no soporta IPv6 — forzamos IPv4 para Gmail y APIs externas
dns.setDefaultResultOrder("ipv4first")

// Rutas de Jhon
import authRoutes      from "./routes/authRoutes.js"
import usuariosRoutes  from "./routes/usuariosRoutes.js"
import preferenciasRoutes from "./routes/preferenciasRoutes.js"

// Rutas tuyas
import productosRoutes from "./routes/productosRoutes.js"
import pedidosRoutes   from "./routes/pedidosRoutes.js"
import facturasRoutes  from "./routes/facturasRoutes.js"
import correoRoutes    from "./routes/correoRoutes.js"

// Comentarios del catálogo (frontend escribe en /resenas)
import resenasRoutes   from "./routes/resenasRoutes.js"

// Contenido público de la tienda Nathalia (textos, logo, catálogo e imágenes)
import tiendaRoutes from "./routes/tiendaRoutes.js"
import { asegurarTabla } from "./controllers/tiendaController.js"

// Rutas admin (Daniel)
import dashboardRoutes    from "./routes/admin/dashboardRoutes.js"
import inventarioRoutes   from "./routes/admin/inventarioRoutes.js"
import ventasRoutes       from "./routes/admin/ventasRoutes.js"
import alertasAdminRoutes from "./routes/admin/alertasRoutes.js"
import pedidosAdminRoutes from "./routes/admin/pedidosRoutes.js"
import usuariosAdminRoutes from "./routes/admin/usuariosRoutes.js"
import reportesRoutes from "./routes/admin/reportes.js"

const app    = express()
const puerto = process.env.PORT || 3000

app.set('trust proxy', 1)
const origenesPermitidos = [
  'http://localhost:5173',
  'https://nathalia-frontend.vercel.app'
];

app.use(cors({
  origin: origenesPermitidos,
  credentials: true
}));

app.disable('x-powered-by')
// Las imágenes subidas viajan como base64 dentro del contenido → límite amplio
app.use(express.json({ limit: '40mb' }))

// Rutas cliente
app.use("/auth",      authRoutes)
app.use("/usuarios",  usuariosRoutes)
app.use("/productos", productosRoutes)
app.use("/pedidos",   pedidosRoutes)
app.use("/resenas",   resenasRoutes)
app.use("/api/preferencias", preferenciasRoutes)


// Rutas tuyas con prefijo /api
app.use("/api/productos", productosRoutes)
app.use("/api/pedidos",   pedidosRoutes)
app.use("/api/facturas",  facturasRoutes)
app.use("/api/correo",    correoRoutes)

// Rutas admin
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/inventario", inventarioRoutes)
app.use("/api/ventas",     ventasRoutes)
app.use("/api/alertas",    alertasAdminRoutes)
app.use("/api/admin/pedidos", pedidosAdminRoutes)
app.use("/api/usuarios",   usuariosAdminRoutes)
app.use("/api/reportes",   reportesRoutes)

// Contenido de la tienda: GET público (lo consumen todos los visitantes)
// y PUT protegido (solo admin guarda los cambios).
app.use("/api/tienda/contenido", tiendaRoutes)


app.get("/", (req, res) => {
  res.json({ mensaje: "Backend de Granova activo" })
})

asegurarTabla()
  .then(() => {
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`)
    })
  })
  .catch((error) => {
    console.error("No se pudo preparar la tabla de contenido:", error.message)
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto} (sin tabla de contenido)`)
    })
  })