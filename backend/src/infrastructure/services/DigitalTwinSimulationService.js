
// Digital Twin Simulation Service - simulates all required data types
import { logger } from './LoggerService.js';

// Define global data store
export const globalDataStore = {
  countries: [
    {
      id: 'usa',
      name: 'United States',
      code: 'US',
      cities: [
        { id: 'new-york', name: 'New York', lat: 40.7128, lon: -74.0060, population: 8335897 },
        { id: 'los-angeles', name: 'Los Angeles', lat: 34.0522, lon: -118.2437, population: 3971883 },
        { id: 'chicago', name: 'Chicago', lat: 41.8781, lon: -87.6298, population: 2746388 }
      ]
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      code: 'GB',
      cities: [
        { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278, population: 8961989 },
        { id: 'manchester', name: 'Manchester', lat: 53.4808, lon: -2.2426, population: 547627 }
      ]
    },
    {
      id: 'japan',
      name: 'Japan',
      code: 'JP',
      cities: [
        { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503, population: 37400068 },
        { id: 'osaka', name: 'Osaka', lat: 34.6937, lon: 135.5023, population: 2691185 }
      ]
    }
  ],
  // We'll store realtime data here
  realtimeData: {},
  historicalData: {},
  lastUpdated: new Date().toISOString()
};

// Initialize data store
for (const country of globalDataStore.countries) {
  globalDataStore.realtimeData[country.id] = {
    health: 95 + Math.random() * 5,
    earthquakes: [],
    flights: [],
    cities: {}
  };
  
  for (const city of country.cities) {
    globalDataStore.realtimeData[country.id].cities[city.id] = generateCityData(country.id, city.id);
    globalDataStore.historicalData[`${country.id}-${city.id}`] = generateHistoricalData();
  }
}

function generateCityData(countryId, cityId) {
  return {
    health: 90 + Math.random() * 10,
    traffic: {
      congestion: 20 + Math.random() * 70, // percentage
      averageSpeed: 20 + Math.random() * 40 // km/h
    },
    healthcare: {
      bedOccupancy: 60 + Math.random() * 30, // percentage
      waitTime: 15 + Math.random() * 45 // minutes
    },
    energy: {
      consumption: 1000 + Math.random() * 500, // MW
      renewablePercentage: 30 + Math.random() * 40 // %
    },
    water: {
      usage: 100 + Math.random() * 200, // million liters/day
      qualityIndex: 80 + Math.random() * 20 // 0-100
    },
    supplyChain: {
      onTimeDelivery: 70 + Math.random() * 25, // percentage
      inventoryLevel: 50 + Math.random() * 50 // percentage of capacity
    },
    population: {
      current: 0,
      density: 0,
      growthRate: 0
    },
    pollution: {
      aqi: 30 + Math.random() * 100, // air quality index
      pm25: 10 + Math.random() * 50, // μg/m³
      o3: 40 + Math.random() * 60 // ppb
    },
    weather: {
      temperature: 10 + Math.random() * 25, // °C
      humidity: 40 + Math.random() * 50, // %
      windSpeed: 5 + Math.random() * 20 // km/h
    },
    lastUpdated: new Date().toISOString()
  };
}

function generateHistoricalData() {
  const data = [];
  const now = Date.now();
  for (let i = 0; i < 60; i++) {
    data.push({
      timestamp: new Date(now - i * 5000).toISOString(), // 5 second intervals for last 5 minutes
      health: 90 + Math.random() * 10,
      trafficCongestion: 20 + Math.random() * 70,
      energyConsumption: 1000 + Math.random() * 500,
      aqi: 30 + Math.random() * 100
    });
  }
  return data.reverse();
}

// Update simulation data
export function updateSimulationData() {
  logger.info('Updating simulation data...');
  
  // Update countries
  for (const country of globalDataStore.countries) {
    globalDataStore.realtimeData[country.id].health = Math.max(0, Math.min(100, globalDataStore.realtimeData[country.id].health + (Math.random() * 2 - 1)));
    
    // Simulate earthquakes (rare)
    if (Math.random() < 0.05) {
      globalDataStore.realtimeData[country.id].earthquakes.push({
        id: `quake-${Date.now()}-${Math.random()}`,
        magnitude: 2 + Math.random() * 4,
        location: 'Near coast',
        timestamp: new Date().toISOString()
      });
      if (globalDataStore.realtimeData[country.id].earthquakes.length > 10) {
        globalDataStore.realtimeData[country.id].earthquakes.shift();
      }
    }
    
    // Simulate flights (random number between 50-150)
    globalDataStore.realtimeData[country.id].flights = generateFlightData();
    
    // Update cities
    for (const city of country.cities) {
      const cityData = globalDataStore.realtimeData[country.id].cities[city.id];
      
      // Update all metrics slightly
      cityData.health = Math.max(0, Math.min(100, cityData.health + (Math.random() * 2 - 1)));
      cityData.traffic.congestion = Math.max(0, Math.min(100, cityData.traffic.congestion + (Math.random() * 4 - 2)));
      cityData.traffic.averageSpeed = Math.max(10, Math.min(80, cityData.traffic.averageSpeed + (Math.random() * 2 - 1)));
      cityData.healthcare.bedOccupancy = Math.max(40, Math.min(100, cityData.healthcare.bedOccupancy + (Math.random() * 2 - 1)));
      cityData.healthcare.waitTime = Math.max(5, Math.min(90, cityData.healthcare.waitTime + (Math.random() * 2 - 1)));
      cityData.energy.consumption = Math.max(800, Math.min(2000, cityData.energy.consumption + (Math.random() * 50 - 25)));
      cityData.energy.renewablePercentage = Math.max(20, Math.min(80, cityData.energy.renewablePercentage + (Math.random() * 2 - 1)));
      cityData.water.usage = Math.max(50, Math.min(400, cityData.water.usage + (Math.random() * 10 - 5)));
      cityData.water.qualityIndex = Math.max(70, Math.min(100, cityData.water.qualityIndex + (Math.random() * 2 - 1)));
      cityData.supplyChain.onTimeDelivery = Math.max(60, Math.min(100, cityData.supplyChain.onTimeDelivery + (Math.random() * 2 - 1)));
      cityData.supplyChain.inventoryLevel = Math.max(30, Math.min(100, cityData.supplyChain.inventoryLevel + (Math.random() * 4 - 2)));
      cityData.pollution.aqi = Math.max(10, Math.min(200, cityData.pollution.aqi + (Math.random() * 6 - 3)));
      cityData.pollution.pm25 = Math.max(5, Math.min(100, cityData.pollution.pm25 + (Math.random() * 4 - 2)));
      cityData.pollution.o3 = Math.max(20, Math.min(120, cityData.pollution.o3 + (Math.random() * 4 - 2)));
      cityData.weather.temperature = Math.max(0, Math.min(40, cityData.weather.temperature + (Math.random() * 2 - 1)));
      cityData.weather.humidity = Math.max(20, Math.min(95, cityData.weather.humidity + (Math.random() * 2 - 1)));
      cityData.weather.windSpeed = Math.max(0, Math.min(50, cityData.weather.windSpeed + (Math.random() * 2 - 1)));
      cityData.lastUpdated = new Date().toISOString();
      
      // Add to historical data
      globalDataStore.historicalData[`${country.id}-${city.id}`].push({
        timestamp: cityData.lastUpdated,
        health: cityData.health,
        trafficCongestion: cityData.traffic.congestion,
        energyConsumption: cityData.energy.consumption,
        aqi: cityData.pollution.aqi
      });
      if (globalDataStore.historicalData[`${country.id}-${city.id}`].length > 60) {
        globalDataStore.historicalData[`${country.id}-${city.id}`].shift();
      }
    }
  }
  
  globalDataStore.lastUpdated = new Date().toISOString();
  
  return globalDataStore;
}

function generateFlightData() {
  const flights = [];
  const count = 50 + Math.floor(Math.random() * 100);
  for (let i = 0; i < count; i++) {
    flights.push({
      id: `flight-${Math.random().toString(36).substr(2, 9)}`,
      callsign: `AIR${Math.floor(Math.random() * 1000)}`,
      altitude: 5000 + Math.random() * 30000,
      velocity: 400 + Math.random() * 400,
      lat: 20 + Math.random() * 40,
      lon: -120 + Math.random() * 200,
      origin: ['JFK', 'LAX', 'LHR', 'HND', 'CDG'][Math.floor(Math.random() * 5)],
      destination: ['ATL', 'ORD', 'DFW', 'AMS', 'SIN'][Math.floor(Math.random() * 5)]
    });
  }
  return flights;
}
