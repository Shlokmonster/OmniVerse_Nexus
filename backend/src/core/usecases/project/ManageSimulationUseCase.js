import { logger } from '../../../infrastructure/services/LoggerService.js';

export class ManageSimulationUseCase {
  constructor(prismaClient) {
    this.prisma = prismaClient;
  }

  async getProjects(organizationId) {
    const query = organizationId ? { where: { organizationId } } : {};
    return this.prisma.project.findMany(query);
  }

  async getProjectDetails(projectId) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        telemetries: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });
  }

  async createProject({ name, description, organizationId }) {
    return this.prisma.project.create({
      data: {
        name,
        description,
        organizationId,
        status: 'Active'
      }
    });
  }

  async updateProjectStatus(projectId, status) {
    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: { status }
    });

    // Log the change
    logger.info(`Simulation ${projectId} status updated to ${status}`);
    return updated;
  }

  async addTelemetry(projectId, telemetryData) {
    return this.prisma.telemetry.create({
      data: {
        projectId,
        nodeName: telemetryData.nodeName,
        status: telemetryData.status || 'Active',
        health: parseFloat(telemetryData.health || '100'),
        latency: parseInt(telemetryData.latency || '0', 10),
        traffic: parseFloat(telemetryData.traffic || '0'),
        aqi: parseInt(telemetryData.aqi || '0', 10),
        energy: parseFloat(telemetryData.energy || '0')
      }
    });
  }

  async logScalingEvent(serviceName, actionType, count) {
    return this.prisma.scalingEvent.create({
      data: {
        serviceName,
        actionType,
        count: parseInt(count, 10)
      }
    });
  }

  async getScalingEvents() {
    return this.prisma.scalingEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20
    });
  }
}
