import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useTheme } from "../hooks/useTheme";

// Types
interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  leakDetected: boolean;
}

interface SensorData {
  [room: string]: SensorReading[];
}

interface NotificationBannerProps {
  message: string;
  onClose: () => void;
}

interface AlertsPanelProps {
  alerts: string[];
  onClose: () => void;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: number;
}


// Mock WebSocket hook for demo
function useWebSocket(): SensorData {
  const [data, setData] = useState<SensorData>({});
  useEffect(() => {
    const rooms = ["Living Room", "Kitchen", "Bedroom", "Office"];
    const interval = setInterval(() => {
      const newData: SensorData = {};
      rooms.forEach(room => {
        if (!newData[room]) newData[room] = data[room] || [];
        const latest: SensorReading = {
          timestamp: new Date().toISOString(),
          temperature: 18 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          leakDetected: Math.random() > 0.9
        };
        newData[room] = [...(newData[room] || []).slice(-20), latest];
      });
      setData(newData);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return data;
}

// Notification Banner Component
function NotificationBanner({ message, onClose }: NotificationBannerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 animate-slide-down">
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  );
}

// Alerts Panel Component
function AlertsPanel({ alerts, onClose }: AlertsPanelProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-96 h-full bg-white/90 backdrop-blur-xl shadow-2xl border-l border-white/20 flex flex-col animate-slide-in-right">
        <div className="flex justify-between items-center p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Alert History
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 p-4 rounded-xl text-sm shadow-sm hover:shadow-md transition-shadow"
              >
                {alert}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-gray-500">No alerts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-3xl opacity-90">{icon}</div>
        <div className="text-right">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm opacity-75">{title}</div>
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center text-sm opacity-90">
          <span className={`mr-2 ${change > 0 ? '↗' : '↘'}`}>{change > 0 ? '↗' : '↘'}</span>
          <span>{Math.abs(change)}% from last hour</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const sensorData = useWebSocket();
  const [notification, setNotification] = useState<string | null>(null);
  const lastAlertRef = useRef<string | null>(null);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const [alertHistory, setAlertHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'alerts' | 'settings'>('overview');
  const { theme, toggleTheme } = useTheme();
  const [thresholds, setThresholds] = useState<{ [room: string]: { temp: number; humidity: number } }>({
    "Living Room": { temp: 28, humidity: 70 },
    "Kitchen": { temp: 30, humidity: 75 },
    "Bedroom": { temp: 26, humidity: 65 },
    "Office": { temp: 29, humidity: 72 },
  });

  // Monitor sensor readings for alerts
  useEffect(() => {
    Object.entries(sensorData).forEach(([room, readings]) => {
      const latest = readings[readings.length - 1];
      if (!latest) return;

      if (latest.temperature > (thresholds[room]?.temp ?? Infinity)) {
        const message = `🔥 ${room}: Temperature exceeded ${thresholds[room].temp}°C!`;
        if (lastAlertRef.current !== message) {
          setNotification(message);
          setAlertHistory((prev) => [...prev, message]);
          lastAlertRef.current = message;
        }
      } else if (latest.humidity > (thresholds[room]?.humidity ?? Infinity)) {
        const message = `💧 ${room}: Humidity exceeded ${thresholds[room].humidity}%!`;
        if (lastAlertRef.current !== message) {
          setNotification(message);
          setAlertHistory((prev) => [...prev, message]);
          lastAlertRef.current = message;
        }
      }
    });
  }, [sensorData, thresholds]);

  // Calculate overview stats
  const totalRooms: number = Object.keys(sensorData).length;
  const avgTemp: number = Object.values(sensorData).reduce((acc, readings) => {
    const latest = readings[readings.length - 1];
    return acc + (latest?.temperature || 0);
  }, 0) / Math.max(totalRooms, 1);
  const avgHumidity: number = Object.values(sensorData).reduce((acc, readings) => {
    const latest = readings[readings.length - 1];
    return acc + (latest?.humidity || 0);
  }, 0) / Math.max(totalRooms, 1);
  const activeAlerts: number = alertHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white/10 backdrop-blur-xl border-r border-white/10">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">IoT</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Smart Home</h1>
                <p className="text-white/60 text-sm">Control Center</p>
              </div>
            </div>

            <nav className="space-y-2">
              {([
                { id: 'overview', icon: '📊', label: 'Overview' },
                { id: 'sensors', icon: '🌡️', label: 'Sensors' },
                { id: 'alerts', icon: '⚠️', label: 'Alerts', badge: alertHistory.length },
                { id: 'settings', icon: '⚙️', label: 'Settings' },
              ] as { id: 'overview' | 'sensors' | 'alerts' | 'settings'; icon: string; label: string; badge?: number }[]).map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'alerts') setShowAlerts(true);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin User</p>
                  <p className="text-white/60 text-xs">Online</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'sensors' && 'Sensor Monitoring'}
                  {activeTab === 'alerts' && 'Alert Management'}
                  {activeTab === 'settings' && 'System Settings'}
                </h1>
                <p className="text-white/60">Real-time IoT monitoring and control</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-white hover:bg-white/20 transition"
                >
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
                <button
                  onClick={() => setShowAlerts(true)}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 text-white px-4 py-2 rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>🔔</span>
                  <span>Alerts ({alertHistory.length})</span>
                </button>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">System Online</span>
              </div>

            </div>
          </header>

          {/* Alerts Panel */}
          {showAlerts && <AlertsPanel alerts={alertHistory} onClose={() => setShowAlerts(false)} />}

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">
            {/* Notification Banner */}
            {notification && (
              <NotificationBanner message={notification} onClose={() => setNotification(null)} />
            )}

            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Active Rooms"
                    value={totalRooms}
                    icon="🏠"
                    color="from-blue-500 to-cyan-500"
                    change={5}
                  />
                  <StatsCard
                    title="Avg Temperature"
                    value={`${avgTemp.toFixed(1)}°C`}
                    icon="🌡️"
                    color="from-orange-500 to-red-500"
                    change={-2}
                  />
                  <StatsCard
                    title="Avg Humidity"
                    value={`${avgHumidity.toFixed(1)}%`}
                    icon="💧"
                    color="from-teal-500 to-blue-500"
                    change={3}
                  />
                  <StatsCard
                    title="Active Alerts"
                    value={activeAlerts}
                    icon="⚠️"
                    color="from-yellow-500 to-orange-500"
                    change={activeAlerts > 0 ? 100 : -50}
                  />
                </div>

                {/* Room Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.entries(sensorData).map(([room, readings], idx) => {
                    const latest = readings[readings.length - 1];
                    const tempData = readings.slice(-10).map((reading, i) => ({
                      name: i,
                      temperature: reading.temperature,
                      humidity: reading.humidity
                    }));

                    return (
                      <div
                        key={room}
                        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {/* Room Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{room}</h3>
                            <p className="text-white/60 text-sm">
                              {latest ? new Date(latest.timestamp).toLocaleTimeString() : 'No data'}
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${latest ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/20">
                            <div className="text-orange-400 text-2xl mb-2">🌡️</div>
                            <div className="text-2xl font-bold text-white">
                              {latest?.temperature.toFixed(1) ?? "--"}°C
                            </div>
                            <div className="text-white/60 text-sm">Temperature</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/20">
                            <div className="text-blue-400 text-2xl mb-2">💧</div>
                            <div className="text-2xl font-bold text-white">
                              {latest?.humidity.toFixed(1) ?? "--"}%
                            </div>
                            <div className="text-white/60 text-sm">Humidity</div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className={`text-center py-3 px-4 rounded-xl font-medium mb-4 ${latest?.leakDetected
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                          {latest?.leakDetected ? '🚨 Leak Detected!' : '✅ All Systems Normal'}
                        </div>

                        {/* Mini Chart */}
                        <div className="h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tempData}>
                              <defs>
                                <linearGradient id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="temperature"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill={`url(#gradient-${idx})`}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'sensors' && Object.keys(sensorData).length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {Object.entries(sensorData).map(([room, readings]) => {
                  const chartData = readings.slice(-20).map((reading) => ({
                    time: new Date(reading.timestamp).toLocaleTimeString(),
                    temperature: reading.temperature,
                    humidity: reading.humidity
                  }));

                  return (
                    <div key={room} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">{room} Trends</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                              dataKey="time"
                              stroke="rgba(255,255,255,0.6)"
                              fontSize={12}
                            />
                            <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(16px)',
                                color: 'white'
                              }}
                              labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              stroke="#f97316"
                              strokeWidth={3}
                              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="humidity"
                              stroke="#06b6d4"
                              strokeWidth={3}
                              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {Object.keys(sensorData).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <span className="text-4xl">📡</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Connecting to Sensors</h3>
                <p className="text-white/60 text-center max-w-md">
                  Establishing connection to IoT devices and gathering sensor data...
                </p>
                <div className="flex space-x-2 mt-6">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}