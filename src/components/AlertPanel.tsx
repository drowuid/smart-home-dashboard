import { useEffect } from "react";

interface AlertsPanelProps {
  alerts: string[];
  onClose: () => void;
}

export default function AlertsPanel({ alerts, onClose }: AlertsPanelProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 flex flex-col animate-slide-in">
      <div className="flex justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Alert History</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✖</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={idx} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
              {alert}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No alerts yet.</p>
        )}
      </div>
    </div>
  );
}
