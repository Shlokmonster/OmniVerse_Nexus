import { ManageSimulationUseCase } from '../../core/usecases/project/ManageSimulationUseCase.js';
import { prisma } from '../../infrastructure/database/prisma/connection.js';

// Mock in-memory stores
let mockProjects = [
  {
    id: 'proj-1',
    name: 'Global City Simulation',
    description: 'Digital twin for major metropolitan regions',
    status: 'Active',
    organizationId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockTelemetries = [];
let mockScalingEvents = [];

export class ProjectController {
  constructor() {
    this.manageSimulationUseCase = new ManageSimulationUseCase(prisma);
  }

  getProjects = async (req, res) => {
    try {
      const organizationId = req.user.organizationId;
      
      // Try real DB first
      try {
        const projects = await this.manageSimulationUseCase.getProjects(organizationId);
        return res.status(200).json({
          success: true,
          data: projects
        });
      } catch (dbErr) {
        return res.status(200).json({
          success: true,
          data: mockProjects
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  createProject = async (req, res) => {
    try {
      const { name, description } = req.body;
      const organizationId = req.user.organizationId;
      
      if (!organizationId) {
        return res.status(400).json({
          success: false,
          error: 'User must belong to an organization to create projects.'
        });
      }

      try {
        const project = await this.manageSimulationUseCase.createProject({
          name,
          description,
          organizationId
        });
        return res.status(201).json({
          success: true,
          data: project
        });
      } catch (dbErr) {
        const newProject = {
          id: `proj-${Date.now()}`,
          name,
          description,
          status: 'Active',
          organizationId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockProjects.push(newProject);
        return res.status(201).json({
          success: true,
          data: newProject
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getProjectDetails = async (req, res) => {
    try {
      const { id } = req.params;
      
      try {
        const details = await this.manageSimulationUseCase.getProjectDetails(id);
        
        if (!details) {
          return res.status(404).json({
            success: false,
            error: 'Project not found.'
          });
        }
        return res.status(200).json({
          success: true,
          data: details
        });
      } catch (dbErr) {
        const details = mockProjects.find(p => p.id === id);
        if (!details) {
          return res.status(404).json({
            success: false,
            error: 'Project not found.'
          });
        }
        return res.status(200).json({
          success: true,
          data: { ...details, telemetries: mockTelemetries.filter(t => t.projectId === id) }
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  addTelemetry = async (req, res) => {
    try {
      const { id } = req.params;
      const { nodeName, status, health, latency, traffic, aqi, energy } = req.body;

      try {
        const telemetry = await this.manageSimulationUseCase.addTelemetry(id, {
          nodeName,
          status,
          health,
          latency,
          traffic,
          aqi,
          energy
        });
        return res.status(201).json({
          success: true,
          data: telemetry
        });
      } catch (dbErr) {
        const newTelemetry = {
          id: `telemetry-${Date.now()}`,
          projectId: id,
          nodeName,
          status: status || 'Active',
          health: parseFloat(health) || 100,
          latency: parseInt(latency) || 0,
          traffic: parseFloat(traffic) || 0,
          aqi: parseInt(aqi) || 0,
          energy: parseFloat(energy) || 0,
          createdAt: new Date().toISOString()
        };
        mockTelemetries.push(newTelemetry);
        return res.status(201).json({
          success: true,
          data: newTelemetry
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  logScalingEvent = async (req, res) => {
    try {
      const { serviceName, actionType, count } = req.body;
      
      try {
        const event = await this.manageSimulationUseCase.logScalingEvent(serviceName, actionType, count);
        return res.status(201).json({
          success: true,
          data: event
        });
      } catch (dbErr) {
        const newEvent = {
          id: `scale-${Date.now()}`,
          serviceName,
          actionType,
          count: parseInt(count),
          timestamp: new Date().toISOString()
        };
        mockScalingEvents.push(newEvent);
        return res.status(201).json({
          success: true,
          data: newEvent
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  getScalingEvents = async (req, res) => {
    try {
      try {
        const events = await this.manageSimulationUseCase.getScalingEvents();
        return res.status(200).json({
          success: true,
          data: events
        });
      } catch (dbErr) {
        return res.status(200).json({
          success: true,
          data: mockScalingEvents
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

export const projectController = new ProjectController();
