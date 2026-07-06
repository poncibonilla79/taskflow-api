import { Router } from 'express'; 
import { authController } from '../controllers/auth.controller'; 
import { authMiddleware } from '../middleware/auth.middleware'; 
import { validate } from '../middleware/validate.middleware'; 
import { registerSchema, loginSchema } from '../schemas/auth.schemas'; 

const router = Router(); 

/**
 * POST /api/auth/register
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: El email ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: El email ya está registrado }
 */
router.post('/register', validate(registerSchema), authController.register); 

/**
 * POST /api/auth/login
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: Credenciales inválidas }
 */
router.post('/login',    validate(loginSchema),    authController.login); 

/**
 * GET /api/auth/me
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener información del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId: { type: string, format: uuid }
 *                     email: { type: string, format: email }
 *       401:
 *         description: Token requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: Token de autenticación requerido }
 */
router.get('/me', authMiddleware, authController.me); 

export default router;