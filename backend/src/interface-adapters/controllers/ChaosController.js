
import { chaosSimulationService } from '../../infrastructure/services/ChaosSimulationService.js';

export class ChaosController {
  getAllScenarios(req, res) {
    try {
      const scenarios = chaosSimulationService.getAllScenarios();
      return res.json({ success: true, data: scenarios });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  startSimulation(req, res) {
    try {
      const { scenarioId, intensity = 50, recoveryTime = 180 } = req.body;
      const result = chaosSimulationService.startSimulation(scenarioId, intensity, recoveryTime);
      if (result.error) {
        return res.status(400).json({ success: false, error: result.error });
      }
      return res.json({ success: true, data: result.simulation });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  stopSimulation(req, res) {
    try {
      const simulation = chaosSimulationService.stopSimulation();
      return res.json({ success: true, data: simulation });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  getActiveSimulation(req, res) {
    try {
      const simulation = chaosSimulationService.getActiveSimulation();
      return res.json({ success: true, data: simulation });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  getSimulationHistory(req, res) {
    try {
      const history = chaosSimulationService.getSimulationHistory();
      return res.json({ success: true, data: history });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const chaosController = new ChaosController();
