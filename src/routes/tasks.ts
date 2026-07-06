import { Router } from 'express'; 
import { tasksController } from '../controllers/tasks.controller'; 
import { authMiddleware } from '../middleware/auth.middleware'; 
import { validate } from '../middleware/validate.middleware'; 
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas'; 

const router = Router(); 

/**
 * GET /api/tasks/project/:projectId
 * @openapi
 * /api/tasks/project/{projectId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tareas de un proyecto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, CANCELLED]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 count:
 *                   type: integer
 */
router.get('/project/:projectId', authMiddleware, tasksController.getByProject); 

/**
 * GET /api/tasks/:id
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Obtener tarea por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Datos de la tarea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id',                authMiddleware, tasksController.getById); 

/**
 * POST /api/tasks/
 * @openapi
 * /api/tasks/:
 *   post:
 *     tags: [Tasks]
 *     summary: Crear una tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Solo el dueño del proyecto puede crear tareas
 *       404:
 *         description: Proyecto no encontrado
 */
router.post('/',    authMiddleware, validate(createTaskSchema), 
tasksController.create); 

/**
 * PUT /api/tasks/:id
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Actualizar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: No tienes permiso para modificar esta tarea
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/:id',  authMiddleware, validate(updateTaskSchema), 
tasksController.update); 

/**
 * DELETE /api/tasks/:id
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Eliminar una tarea
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Tarea eliminada (sin contenido)
 *       403:
 *         description: Solo el dueño puede eliminar tareas
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', authMiddleware, tasksController.remove); 

export default router;