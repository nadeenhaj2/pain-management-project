import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Header({ role, onOpenPersonalArea, activeTab, onTabChange }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [navExpanded, setNavExpanded] = useState(true);

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  if (role === "doctor") {
    return (
      <header className="bg-white shadow p-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className={`relative flex items-center justify-center ${navExpanded ? "mb-4" : "mb-0"}`}>
            <h1 className="text-3xl font-bold text-blue-700">
              PainCare Assistant
            </h1>

            <button
              onClick={() => setNavExpanded(prev => !prev)}
              className="absolute right-0 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              {navExpanded ? "▲ Hide" : "▼ Menu"}
            </button>
          </div>

          {navExpanded && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onTabChange("dashboard")}
                className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "dashboard" ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                📊 Doctor Dashboard
              </button>

              <button
                onClick={() => onTabChange("alerts")}
                className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "alerts" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
              >
                🚨 Pain Alerts
              </button>

              <button
                onClick={() => onTabChange("patients")}
                className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "patients" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                👥 Patients
              </button>

              <button
                onClick={() => onTabChange("clinical")}
                className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "clinical" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}
              >
                🩺 Clinical Summary
              </button>

              <button
                onClick={() => onTabChange("notes")}
                className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "notes" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
              >
                📝 Doctor Notes
              </button>

              <button
                onClick={onOpenPersonalArea}
                className="bg-yellow-100 text-yellow-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-yellow-200"
              >
                Personal Area
              </button>

              <button
                onClick={toggleDarkMode}
                className="bg-slate-800 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-slate-700"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow p-5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className={`relative flex items-center justify-center ${navExpanded ? "mb-4" : "mb-0"}`}>
          <h1 className="text-3xl font-bold text-blue-700">
            PainCare Assistant
          </h1>

          <button
            onClick={() => setNavExpanded(prev => !prev)}
            className="absolute right-0 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            {navExpanded ? "▲ Hide" : "▼ Menu"}
          </button>
        </div>

        {navExpanded && (
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onTabChange("painreport")}
              className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "painreport" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
            >
              🔴 Pain Report
            </button>

            <button
              onClick={() => onTabChange("medication")}
              className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "medication" ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
            >
              💊 Medication
            </button>

            <button
              onClick={() => onTabChange("doctornotes")}
              className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "doctornotes" ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}`}
            >
              📋 Doctor Notes
            </button>

            <button
              onClick={() => onTabChange("chatbot")}
              className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "chatbot" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}
            >
              💬 Chatbot
            </button>

            <button
              onClick={() => onTabChange("trends")}
              className={`px-8 py-4 rounded-xl text-xl font-bold ${activeTab === "trends" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              📈 Trends
            </button>

            <button
              onClick={onOpenPersonalArea}
              className="bg-yellow-100 text-yellow-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-yellow-200"
            >
              Personal Area
            </button>

            <button
              onClick={toggleDarkMode}
              className="bg-slate-800 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-slate-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
