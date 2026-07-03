import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../common/Header";
import DoctorDashboard from "../doctorDashboard/DoctorDashboard";
import PersonalProfilePage from "../profile/PersonalProfilePage";
import {
  getDoctorDashboardData,
  getHighPainPatients,
} from "../../services/doctorService";

function DoctorHome() {
  const { currentUser, logout } = useUser();
  const [showPersonalArea, setShowPersonalArea] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [showCriticalPopup, setShowCriticalPopup] = useState(false);

  useEffect(() => {
    async function checkCritical() {
      const result = await getDoctorDashboardData();
      if (result.success) {
        const critical = getHighPainPatients(result.patients);
        if (critical.length > 0) {
          setCriticalPatients(critical);
          setShowCriticalPopup(true);
        }
      }
    }
    checkCritical();
  }, []);

  if (showPersonalArea) {
    return <PersonalProfilePage onBack={() => setShowPersonalArea(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {showCriticalPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-t-4 border-red-600">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl leading-none">🚨</span>
              <div>
                <h2 className="text-xl font-bold text-red-700">
                  Critical Pain Alert
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {criticalPatients.length}{" "}
                  {criticalPatients.length > 1 ? "patients have" : "patient has"}{" "}
                  reported critical pain levels (8+/10).
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {criticalPatients.map((patient) => (
                <div
                  key={patient.username}
                  className="bg-red-50 border border-red-200 rounded-xl p-3"
                >
                  <p className="font-semibold text-red-700">
                    {patient.name} — Pain level: {patient.lastPain}/10
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Location: {patient.lastLocation}&nbsp;·&nbsp;Type:{" "}
                    {patient.lastPainType}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCriticalPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setActiveTab("alerts");
                  setShowCriticalPopup(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                View Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        role="doctor"
        onOpenPersonalArea={() => setShowPersonalArea(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-green-700">Doctor Area</h2>
            <p className="text-sm text-green-700">
              Welcome, {currentUser.name}. This page contains doctor-related
              features.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Logout
          </button>
        </div>

        <DoctorDashboard activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}

export default DoctorHome;
