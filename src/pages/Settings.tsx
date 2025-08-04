import { useState, useEffect } from "react";

interface Thresholds {
  [room: string]: { temp: number; humidity: number };
}

export default function Settings() {
  const [thresholds, setThresholds] = useState<Thresholds>({});

  // Load thresholds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("thresholds");
    if (saved) setThresholds(JSON.parse(saved));
    else {
      setThresholds({
        "Living Room": { temp: 28, humidity: 70 },
        "Kitchen": { temp: 30, humidity: 75 },
      });
    }
  }, []);

  // Save thresholds when updated
  useEffect(() => {
    if (Object.keys(thresholds).length > 0) {
      localStorage.setItem("thresholds", JSON.stringify(thresholds));
    }
  }, [thresholds]);

  const updateThreshold = (room: string, field: "temp" | "humidity", value: number) => {
    setThresholds((prev) => ({
      ...prev,
      [room]: { ...prev[room], [field]: value },
    }));
  };

  return (
    <div className="p-8 flex-1 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Sensor Settings</h1>
      <div className="space-y-6">
        {Object.entries(thresholds).map(([room, values]) => (
          <div key={room} className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{room}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Temperature Threshold (°C)</label>
                <input
                  type="number"
                  value={values.temp}
                  onChange={(e) => updateThreshold(room, "temp", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Humidity Threshold (%)</label>
                <input
                  type="number"
                  value={values.humidity}
                  onChange={(e) => updateThreshold(room, "humidity", Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
