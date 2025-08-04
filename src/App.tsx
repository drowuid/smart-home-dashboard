import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Main Content Only */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
  </Router>
  );
}
