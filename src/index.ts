import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import healthRouter   from './routes/health';
import authRouter     from './routes/auth';
import usersRouter    from './routes/users';
import projectsRouter from './routes/projects';
import tasksRouter    from './routes/tasks';
import commentsRouter from './routes/comments';
import { errorMiddleware } from './middleware/error.middleware';
import { sendSuccess, sendError } from './utils/response.util';

dotenv.config();
const app: Application = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health',       healthRouter);
app.use('/api/auth',     authRouter);
app.use('/api/users',    usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks',    tasksRouter);
app.use('/api/comments', commentsRouter);

app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, { project: 'TaskFlow API', version: '1.2.0', clase: 3,
    endpoints: ['/api/auth', '/api/users', '/api/projects', '/api/tasks', '/api/comments'] });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req: Request, res: Response) =>
  sendError(res, 404));

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API v3 — http://localhost:${PORT}`);
  console.log(`🔐 Auth:     /api/auth/register  /api/auth/login`);
  console.log(`✅ Tasks:    /api/tasks`);
  console.log(`💬 Comments: /api/comments\n`);
});

export default app;
