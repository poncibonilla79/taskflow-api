import { Router, Request, Response } from "express";
import pool from "../config/database";
import { sendSuccess, sendError } from "../utils/response.util";
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
    const result = await pool.query(
      "SELECT NOW() as timestamp, version() as pg_version",
    );
    sendSuccess(res, {
      server: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      },
      database: {
        status: "connected",
        queryTimestamp: result.rows[0].timestamp,
      },
    }, "TaskFlow API funcionando correctamente");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    sendError(res, 500, "Error al conectar con la base de datos");
  }
});
export default router;
