import prisma from '../config/prisma';

export const dashboardService = {

  async getStats(userId: string) {
    const pendingTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: { in: ['TODO', 'IN_PROGRESS'] },
      },
    });

    const activeProjects = await prisma.project.count({
      where: { ownerId: userId },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const completedToday = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: 'DONE',
        createdAt: { gte: todayStart },
      },
    });

    return {
      pendingTasks,
      activeProjects,
      completedToday,
    };
  },
};
