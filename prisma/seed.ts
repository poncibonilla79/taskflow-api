import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Insertando seed data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@taskflow.com' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'demo@taskflow.com',
      passwordHash,
    },
  });
  console.log(`  ✅ Usuario: ${user.name} (${user.email})`);

  const project1 = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Proyecto Alpha',
      description: 'Primer proyecto de prueba',
      ownerId: user.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Proyecto Beta',
      description: 'Segundo proyecto de prueba',
      ownerId: user.id,
    },
  });
  console.log(`  ✅ Proyectos: ${project1.name}, ${project2.name}`);

  const task1 = await prisma.task.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      title: 'Configurar base de datos',
      description: 'Instalar y configurar PostgreSQL',
      status: 'DONE',
      projectId: project1.id,
      assignedTo: user.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: '00000000-0000-0000-0000-000000000012' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000012',
      title: 'Diseñar API REST',
      description: 'Definir los endpoints de la API',
      status: 'IN_PROGRESS',
      projectId: project2.id,
      assignedTo: user.id,
    },
  });
  console.log(`  ✅ Tareas: ${task1.title}, ${task2.title}`);

  const comment1 = await prisma.comment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000021' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000021',
      content: 'Ya terminé la configuración de la BD',
      taskId: task1.id,
      userId: user.id,
    },
  });

  const comment2 = await prisma.comment.upsert({
    where: { id: '00000000-0000-0000-0000-000000000022' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000022',
      content: 'Tengo dudas sobre el diseño de los endpoints',
      taskId: task2.id,
      userId: user.id,
    },
  });
  console.log(`  ✅ Comentarios: ${comment1.content}, ${comment2.content}`);

  console.log('\n🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
