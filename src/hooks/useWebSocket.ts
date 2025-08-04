import { useState, useEffect } from 'react';

interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  leakDetected: boolean;
}

interface SensorData {
  [room: string]: SensorReading[];
}

export function useWebSocket(url: string): SensorData {
  const [data, setData] = useState<SensorData>({});
  
  useEffect(() => {
    // Mock data for demo - replace with actual WebSocket connection
    const rooms = ["Living Room", "Kitchen", "Bedroom", "Office"];
    
    // Initialize with some historical data
    const initialData: SensorData = {};
    rooms.forEach(room => {
      initialData[room] = [];
      for (let i = 0; i < 10; i++) {
        initialData[room].push({
          timestamp: new Date(Date.now() - (10 - i) * 60000).toISOString(),
          temperature: 18 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          leakDetected: Math.random() > 0.95
        });
      }
    });
    setData(initialData);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = { ...prevData };
        rooms.forEach(room => {
          const latest: SensorReading = {
            timestamp: new Date().toISOString(),
            temperature: 18 + Math.random() * 15,
            humidity: 40 + Math.random() * 40,
            leakDetected: Math.random() > 0.9
          };
          newData[room] = [...(newData[room] || []).slice(-20), latest];
        });
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [url]);
  
  return data;
}
