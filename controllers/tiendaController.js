import pool from "../config/db.js"

// Contenido de la tienda Nathalia (textos, logo, colores, portada y catálogo
// completo con imágenes). Se guarda como JSON en la tabla contenido_tienda
// para que TODOS los visitantes vean lo mismo, sin depender del localStorage
// del navegador del admin.

export async function asegurarTabla() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contenido_tienda (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      contenido JSONB NOT NULL,
      actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
}

// GET /api/tienda/contenido — público: todos los visitantes lo consultan
export async function obtenerContenido(_req, res) {
  try {
    const { rows } = await pool.query("SELECT contenido FROM contenido_tienda WHERE id = 1")
    res.status(200).json({ ok: true, data: rows[0]?.contenido || null })
  } catch (error) {
    console.error("Error leyendo contenido de tienda:", error.message)
    res.status(500).json({ ok: false, mensaje: "No se pudo leer el contenido de la tienda" })
  }
}

// PUT /api/tienda/contenido — solo admin: sube/actualiza el contenido completo
export async function guardarContenido(req, res) {
  try {
    const { contenido } = req.body
    if (!contenido || typeof contenido !== "object") {
      return res.status(400).json({ ok: false, mensaje: "Se esperaba el contenido de la tienda" })
    }
    await pool.query(
      `INSERT INTO contenido_tienda (id, contenido, actualizado_en)
       VALUES (1, $1::jsonb, now())
       ON CONFLICT (id) DO UPDATE SET contenido = EXCLUDED.contenido, actualizado_en = now()`,
      [JSON.stringify(contenido)]
    )
    res.status(200).json({ ok: true, mensaje: "Contenido de la tienda guardado" })
  } catch (error) {
    console.error("Error guardando contenido de tienda:", error.message)
    res.status(500).json({ ok: false, mensaje: "No se pudo guardar el contenido de la tienda" })
  }
}