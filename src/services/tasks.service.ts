import prisma from '../config/prisma'; 
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types'; 
 
export const tasksService = { 
 
  async findByProject(projectId: string, status?: string) { 
    return prisma.task.findMany({ 
      where: { projectId, ...(status && { status: status as any }) }, 
      include: { 
        assignee: { select: { id: true, name: true, email: true } }, 
        _count:   { select: { comments: true } }, 
      }, 
      orderBy: { createdAt: 'desc' }, 
    }); 
  }, 
 
  async findById(id: string) { 
    return prisma.task.findUnique({ 
      where: { id }, 
      include: { 
        assignee: { select: { id: true, name: true, email: true } }, 
        project:  { select: { id: true, name: true, ownerId: true } }, 
        comments: { 
          include: { user: { select: { id: true, name: true } } }, 
          orderBy: { createdAt: 'asc' }, 
        }, 
      }, 
    }); 
  }, 
 
  // Solo el owner del proyecto puede crear tasks 
  async create(data: CreateTaskDto, requesterId: string) { 
    const project = await prisma.project.findUnique({ where: { id: 
data.projectId } }); 
    if (!project) throw { status: 404, message: 'Proyecto no encontrado' }; 
    if (project.ownerId !== requesterId) 
      throw { status: 403, message: 'Solo el dueño del proyecto puede crear tareas' }; 
 
    return prisma.task.create({
      data: {
        title:       data.title,
        description: data.description,
        status:      data.status ?? 'TODO',
        projectId:   data.projectId,
        assignedTo:  data.assignedTo,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        _count:   { select: { comments: true } },
      },
    });
  }, 
 
  // Owner del proyecto O usuario asignado pueden actualizar el status 
  async update(id: string, data: UpdateTaskDto, requesterId: string) { 
    const task = await prisma.task.findUnique({ 
      where: { id }, include: { project: true }, 
    }); 
    if (!task) throw { status: 404, message: 'Tarea no encontrada' }; 
 
    const canEdit = task.project.ownerId === requesterId || task.assignedTo === 
requesterId; 
    if (!canEdit) 
      throw { status: 403, message: 'No tienes permiso para modificar esta tarea' }; 
 
    return prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        _count:   { select: { comments: true } },
      },
    }); 
  }, 
 
  async remove(id: string, requesterId: string) { 
    const task = await prisma.task.findUnique({ 
      where: { id }, include: { project: true }, 
    }); 
    if (!task) throw { status: 404, message: 'Tarea no encontrada' }; 
    if (task.project.ownerId !== requesterId) 
      throw { status: 403, message: 'Solo el dueño puede eliminar tareas' }; 
 
    await prisma.task.delete({ where: { id } }); 
  }, 
};