import { useMemo, useState } from "react";
import { buildDoctorAnalytics } from "../../services/doctorService";
import DashboardBarChart from "./DashboardBarChart";
import DashboardPieChart from "./DashboardPieChart";
import DashboardLineChart from "./DashboardLineChart";

function DoctorAnalyticsCharts({ patients }) {
  const [ageRiskLimit, setAgeRiskLimit] = useState(60);

  const [visibleCharts, setVisibleCharts] = useState({
    ageGroups: false,
    attention: false,
    status: false,
    medication: false,
    recentReports: false,
    averagePain: false,
  });

  const analytics = useMemo(() => {
    return buildDoctorAnalytics(patients, ageRiskLimit);
  }, [patients, ageRiskLimit]);

  const toggleChart = (chartName) => {
    setVisibleCharts((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Patient Analytics
          </h3>

          <p className="text-gray-600">
            Visual summary of patient age groups, pain status and monitoring needs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Follow-up age:
          </label>

          <input
            type="number"
            min="1"
            max="120"
            value={ageRiskLimit}
            onChange={(event) => {
              const value = Number(event.target.value);
              setAgeRiskLimit(value || 60);
            }}
            className="w-20 border rounded-lg px-2 py-1"
          />
        </div>
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <AnalyticsCard
          title={`Patients age ${ageRiskLimit}+`}
          value={analytics.olderPatientsCount}
          description="Patients that may need closer monitoring because of age."
        />

        <AnalyticsCard
          title="Teenage patients"
          value={analytics.teenPatientsCount}
          description="Patients between ages 13 and 19."
        />

        <AnalyticsCard
          title="Needs follow-up"
          value={analytics.followUpPatientsCount}
          description="Patients with High Alert or Needs Follow-up status."
        />
      </div>

      <div className="text-center mb-6">
        <p className="text-xl font-bold text-green-700">
         Click "Show Graph" to view the analytics for each section below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartToggleCard
          title="Age Groups"
          isVisible={visibleCharts.ageGroups}
          onToggle={() => toggleChart("ageGroups")}
        >
          <DashboardBarChart
            title="Age Groups"
            description="Patient distribution by age category."
            data={analytics.ageGroups}
          />
        </ChartToggleCard>

        <ChartToggleCard
          title="Patients Needing Attention"
          isVisible={visibleCharts.attention}
          onToggle={() => toggleChart("attention")}
        >
          <DashboardBarChart
            title="Patients Needing Attention"
            description="Risk factors that may require closer medical follow-up."
            data={analytics.monitoringPriorityGroups}
          />
        </ChartToggleCard>

        <ChartToggleCard
          title="Clinical Status Distribution"
          isVisible={visibleCharts.status}
          onToggle={() => toggleChart("status")}
        >
          <DashboardPieChart
            title="Clinical Status Distribution"
            description="Current patient status according to latest pain level."
            data={analytics.statusGroups}
          />
        </ChartToggleCard>

        <ChartToggleCard
          title="Medication in Latest Report"
          isVisible={visibleCharts.medication}
          onToggle={() => toggleChart("medication")}
        >
          <DashboardBarChart
            title="Medication in Latest Report"
            description="Whether medication was taken in the latest report."
            data={analytics.medicationGroups}
          />
        </ChartToggleCard>

        <ChartToggleCard
          title="Recent Report Coverage"
          isVisible={visibleCharts.recentReports}
          onToggle={() => toggleChart("recentReports")}
        >
          <DashboardBarChart
            title="Recent Report Coverage"
            description="Shows whether patients submitted a report in the last 7 days."
            data={analytics.recentReportGroups}
          />
        </ChartToggleCard>

        <ChartToggleCard
          title="Average Pain by Age Group"
          isVisible={visibleCharts.averagePain}
          onToggle={() => toggleChart("averagePain")}
        >
          <DashboardLineChart
            title="Average Pain by Age Group"
            description="Average latest pain level for each age group."
            data={analytics.averagePainByAgeGroups}
            valueSuffix="/10"
          />
        </ChartToggleCard>
      </div>
    </div>
  );
}

function ChartToggleCard({ title, isVisible, onToggle, children }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-bold text-gray-800">{title}</h4>

        <button
          type="button"
          onClick={onToggle}
          className="px-3 py-1 text-sm rounded-lg border border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
        >
          {isVisible ? "Hide Graph" : "Show Graph"}
        </button>
      </div>

      {isVisible && (
  <div className="mt-4">
    {children}
  </div>
)}
    </div>
  );
}

function AnalyticsCard({ title, value, description }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <p className="text-sm text-green-700 font-medium">{title}</p>
      <p className="text-3xl font-bold text-green-800">{value}</p>
      <p className="text-sm text-green-700 mt-1">{description}</p>
    </div>
  );
}

export default DoctorAnalyticsCharts;