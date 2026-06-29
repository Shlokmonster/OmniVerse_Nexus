
import { infrastructureService } from '../../infrastructure/services/InfrastructureService.js';

export class InfrastructureController {
  getInfrastructureData = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: infrastructureService.getData()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  getAwsData = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: infrastructureService.getData().aws
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  getKubernetesData = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: infrastructureService.getData().kubernetes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  getDatabaseData = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: infrastructureService.getData().databases
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

export const infrastructureController = new InfrastructureController();
