
import { globalDataStore } from '../../infrastructure/services/DigitalTwinSimulationService.js';

export class DigitalTwinController {
  getGlobalData = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        data: globalDataStore
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  getCountryData = async (req, res) => {
    try {
      const { countryId } = req.params;
      const country = globalDataStore.countries.find(c => c.id === countryId);
      if (!country) {
        return res.status(404).json({
          success: false,
          error: 'Country not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: {
          country,
          data: globalDataStore.realtimeData[countryId]
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  
  getCityData = async (req, res) => {
    try {
      const { countryId, cityId } = req.params;
      const country = globalDataStore.countries.find(c => c.id === countryId);
      if (!country) {
        return res.status(404).json({
          success: false,
          error: 'Country not found'
        });
      }
      
      const city = country.cities.find(c => c.id === cityId);
      if (!city) {
        return res.status(404).json({
          success: false,
          error: 'City not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          city,
          data: globalDataStore.realtimeData[countryId].cities[cityId],
          historical: globalDataStore.historicalData[`${countryId}-${cityId}`]
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

export const digitalTwinController = new DigitalTwinController();
