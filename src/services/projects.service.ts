import prisma from '../config/prisma'; 
import { CreateProjectDto, UpdateProjectDto, ProjectPublic } from 
'../types/project.types'; 
 
export const projectsService = { 

  async findAll() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { tasks: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
    });
  },

  async create(data: CreateProjectDto, userId: string): Promise<ProjectPublic> {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: userId,
      },
    });
  },

  async update(id: string, data: UpdateProjectDto, userId: string): Promise<ProjectPublic> {
    const project = await prisma.project.findUnique({ where: { id }, select: { ownerId: true } });
    if (!project) throw { status: 404, message: 'Proyecto no encontrado' };
    if (project.ownerId !== userId) throw { status: 403, message: 'No tienes permiso para modificar este proyecto' };
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async remove(id: string, userId: string): Promise<void> {
    const project = await prisma.project.findUnique({ where: { id }, select: { ownerId: true } });
    if (!project) throw { status: 404, message: 'Proyecto no encontrado' };
    if (project.ownerId !== userId) throw { status: 403, message: 'No tienes permiso para eliminar este proyecto' };
    await prisma.project.delete({ where: { id } });
  },
}; 