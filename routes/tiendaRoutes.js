import { Router } from "express"
import { obtenerContenido, guardarContenido } from "../controllers/tiendaController.js"
import { verificarToken } from "../middleware/verificarToken.js"
import { verificarAdmin } from "../middleware/verificarAdmin.js"

const router = Router()

router.get("/", obtenerContenido)
router.put("/", verificarToken, verificarAdmin, guardarContenido)

export default router