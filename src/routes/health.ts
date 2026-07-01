import { Router, Request, Response } from "express";
import pool from "../config/database";
const router = Router();

/**
 * GET /health
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica el estado del servidor y la base de datos
 *     responses:
 *       200:
 *         description: Servidor y BD funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 message: { type: string }
 *                 server:
 *                   type: object
 *                   properties:
 *                     timestamp: { type: string, format: date-time }
 *                     environment: { type: string }
 *                 database:
 *                   type: object
 *                   properties:
 *                     status: { type: string, example: connected }
 *                     queryTimestamp: { type: string }
 *       500:
 *         description: Error de conexión con la BD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: error }
 *                 database:
 *                   type: object
 *                   properties:
 *                     status: { type: string, example: disconnected }
 *                     error: { type: string }
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Ejecutar una consulta simple para verificar la BD
    const result = await pool.query(
      "SELECT NOW() as timestamp, version() aspg_version",
    );
    // Si llegamos aquí, la BD está conectada
    res.status(200).json({
      status: "ok",
      message: "TaskFlow API funcionando correctamente 🚀",
      server: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      },
      database: {
        status: "connected",
        queryTimestamp: result.rows[0].timestamp,
      },
    });
  } catch (error) {
    // Si hay error, la BD no está disponible
    const message = error instanceof Error ? error.message : "Errordesconocido";
    res.status(500).json({
      status: "error",
      message: "Error al conectar con la base de datos",
      server: {
        timestamp: new Date().toISOString(),
      },
      database: {
        status: "disconnected",
        error: message,
      },
    });
  }
});
export default router;
