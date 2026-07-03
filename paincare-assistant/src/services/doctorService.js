const USERS_API_URL = "https://pain-management.onrender.com/api/users";
const PAIN_REPORTS_API_URL = "https://pain-management.onrender.com/api/pain-reports";

export async function getDoctorDashboardData(currentDoctor) {
  try {
    const usersResponse = await fetch(USERS_API_URL);
    const reportsResponse = await fetch(PAIN_REPORTS_API_URL);

    const usersData = await usersResponse.json();
    const reportsData = await reportsResponse.json();

    if (!usersResponse.ok || !reportsResponse.ok) {
      return {
        success: false,
        message: "Failed to fetch doctor dashboard data",
        patients: [],
      };
    }

    const users = usersData.users || [];
    const reports = reportsData.reports || [];

    const doctorUsername = currentDoctor?.username;
    const doctorName = currentDoctor?.name;

    const patients = users
      .filter((user) => {
        return (
          user.role === "patient" &&
          (
            user.physician === doctorUsername ||
            user.physician === doctorName ||
            user.doctor === doctorUsername ||
            user.doctor === doctorName ||
            user.doctorUsername === doctorUsername ||
            user.doctorName === doctorName
          )
        );
      })
      .map((patient) => {
        const patientReports = reports.filter((report) => {
          return (
            report.username === patient.username ||
            report.patientUsername === patient.username ||
            report.patientName === patient.name ||
            report.name === patient.name
          );
        });

        const sortedReports = [...patientReports].sort((a, b) => {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        });

        const latestReport = sortedReports[0];

        const lastPain = latestReport
          ? latestReport.painLevel ??
            latestReport.pain ??
            latestReport.painScore ??
            null
          : null;

        return {
          ...patient,

          reports: sortedReports,
          reportsCount: patientReports.length,

          lastPain,
          status: getPatientStatus(lastPain),

          medicationTaken: latestReport?.medicationTaken ?? "",
          lastReportDate: latestReport?.createdAt ?? latestReport?.date ?? null,

          lastReport: latestReport || null,
        };
      });

    return {
      success: true,
      patients,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Server error",
      patients: [],
    };
  }
}

export function getPatientStatus(lastPain) {
  if (lastPain === null || lastPain === undefined || lastPain === "") {
    return "No Reports";
  }

  if (Number(lastPain) >= 8) {
    return "High Alert";
  }

  if (Number(lastPain) >= 6) {
    return "Needs Follow-up";
  }

  return "Stable";
}

export function getTotalPatients(patients) {
  return patients.length;
}

export function getHighPainPatients(patients) {
  return patients.filter((patient) => Number(patient.lastPain) >= 8);
}

export function getAveragePainLevel(patients) {
  const patientsWithReports = patients.filter((patient) => {
    return patient.lastPain !== null && patient.lastPain !== undefined;
  });

  if (patientsWithReports.length === 0) {
    return 0;
  }

  const totalPain = patientsWithReports.reduce((sum, patient) => {
    return sum + Number(patient.lastPain);
  }, 0);

  return (totalPain / patientsWithReports.length).toFixed(1);
}

export function buildClinicalSummary(patients) {
  return patients.map((patient) => {
    const lastPain = patient.lastPain;
    const reportsCount = patient.reportsCount;

    let priority = "Low";
    let recommendation = "Continue routine monitoring.";

    if (lastPain === null || lastPain === undefined) {
      priority = "No Data";
      recommendation = "No pain reports submitted yet.";
    } else if (Number(lastPain) >= 8) {
      priority = "High";
      recommendation =
        "High pain level detected. Patient should be reviewed by medical staff.";
    } else if (Number(lastPain) >= 6) {
      priority = "Medium";
      recommendation =
        "Pain level is elevated. Follow-up is recommended.";
    }

    return {
      username: patient.username,
      name: patient.name,
      diagnosis: patient.diagnosis,
      reportsCount,
      lastPain,
      status: patient.status,
      priority,
      recommendation,
    };
  });
}

export function buildDoctorAnalytics(patients, ageRiskLimit = 60) {
  const patientList = Array.isArray(patients) ? patients : [];
  const riskAge = Number(ageRiskLimit) || 60;

  return {
    olderPatientsCount: patientList.filter((p) => Number(p.age) >= riskAge).length,

    teenPatientsCount: patientList.filter((p) => {
      const age = Number(p.age);
      return age >= 13 && age <= 19;
    }).length,

    followUpPatientsCount: patientList.filter((p) => {
      return p.status === "High Alert" || p.status === "Needs Follow-up";
    }).length,

    ageGroups: buildAgeGroups(patientList, riskAge),
    monitoringPriorityGroups: buildMonitoringPriorityGroups(patientList, riskAge),
    statusGroups: buildStatusGroups(patientList),
    medicationGroups: buildMedicationGroups(patientList),
    recentReportGroups: buildRecentReportGroups(patientList),
    averagePainByAgeGroups: buildAveragePainByAgeGroups(patientList, riskAge),
  };
}

function buildAgeGroups(patients, riskAge) {
  return [
    {
      label: "Children under 13",
      value: patients.filter((p) => Number(p.age) > 0 && Number(p.age) < 13).length,
    },
    {
      label: "Teenagers 13-19",
      value: patients.filter((p) => Number(p.age) >= 13 && Number(p.age) <= 19).length,
    },
    {
      label: `Adults 20-${riskAge - 1}`,
      value: patients.filter((p) => Number(p.age) >= 20 && Number(p.age) < riskAge).length,
    },
    {
      label: `Age ${riskAge}+`,
      value: patients.filter((p) => Number(p.age) >= riskAge).length,
    },
    {
      label: "Unknown age",
      value: patients.filter((p) => !Number.isFinite(Number(p.age)) || Number(p.age) <= 0).length,
    },
  ];
}

function buildMonitoringPriorityGroups(patients, riskAge) {
  return [
    {
      label: "High pain 7+",
      value: patients.filter((p) => hasPainReport(p) && Number(p.lastPain) >= 7).length,
    },
    {
      label: `Age ${riskAge}+`,
      value: patients.filter((p) => Number(p.age) >= riskAge).length,
    },
    {
      label: "Teenagers 13-19",
      value: patients.filter((p) => Number(p.age) >= 13 && Number(p.age) <= 19).length,
    },
    {
      label: "Medication not taken",
      value: patients.filter((p) => normalizeMedicationTaken(p.medicationTaken) === "notTaken").length,
    },
    {
      label: "Low report activity",
      value: patients.filter((p) => Number(p.reportsCount) <= 1).length,
    },
  ];
}

function buildStatusGroups(patients) {
  return [
    {
      label: "High Alert",
      value: patients.filter((p) => p.status === "High Alert").length,
    },
    {
      label: "Needs Follow-up",
      value: patients.filter((p) => p.status === "Needs Follow-up").length,
    },
    {
      label: "Stable",
      value: patients.filter((p) => p.status === "Stable").length,
    },
    {
      label: "No Reports",
      value: patients.filter((p) => p.status === "No Reports").length,
    },
  ];
}

function buildMedicationGroups(patients) {
  return [
    {
      label: "Medication taken",
      value: patients.filter((p) => normalizeMedicationTaken(p.medicationTaken) === "taken").length,
    },
    {
      label: "Medication not taken",
      value: patients.filter((p) => normalizeMedicationTaken(p.medicationTaken) === "notTaken").length,
    },
    {
      label: "No medication data",
      value: patients.filter((p) => normalizeMedicationTaken(p.medicationTaken) === "unknown").length,
    },
  ];
}

function buildRecentReportGroups(patients) {
  const today = new Date();

  const reportedRecently = patients.filter((patient) => {
    if (!patient.lastReportDate) return false;

    const reportDate = new Date(patient.lastReportDate);
    const diffInDays = (today - reportDate) / (1000 * 60 * 60 * 24);

    return diffInDays <= 7;
  });

  return [
    {
      label: "Reported in last 7 days",
      value: reportedRecently.length,
    },
    {
      label: "No recent report",
      value: patients.length - reportedRecently.length,
    },
  ];
}

function buildAveragePainByAgeGroups(patients, riskAge) {
  return [
    {
      label: "Under 13",
      value: calculateAveragePain(
        patients.filter((p) => Number(p.age) > 0 && Number(p.age) < 13)
      ),
    },
    {
      label: "13-19",
      value: calculateAveragePain(
        patients.filter((p) => Number(p.age) >= 13 && Number(p.age) <= 19)
      ),
    },
    {
      label: `20-${riskAge - 1}`,
      value: calculateAveragePain(
        patients.filter((p) => Number(p.age) >= 20 && Number(p.age) < riskAge)
      ),
    },
    {
      label: `${riskAge}+`,
      value: calculateAveragePain(
        patients.filter((p) => Number(p.age) >= riskAge)
      ),
    },
  ];
}

function calculateAveragePain(patients) {
  const patientsWithPain = patients.filter((patient) => {
    return patient.lastPain !== null && patient.lastPain !== undefined;
  });

  if (patientsWithPain.length === 0) {
    return 0;
  }

  const totalPain = patientsWithPain.reduce((sum, patient) => {
    return sum + Number(patient.lastPain);
  }, 0);

  return Number((totalPain / patientsWithPain.length).toFixed(1));
}

function hasPainReport(patient) {
  return patient.lastPain !== null && patient.lastPain !== undefined;
}

function normalizeMedicationTaken(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (
    normalizedValue === "yes" ||
    normalizedValue === "true" ||
    normalizedValue === "taken"
  ) {
    return "taken";
  }

  if (
    normalizedValue === "no" ||
    normalizedValue === "false" ||
    normalizedValue === "nottaken" ||
    normalizedValue === "not taken"
  ) {
    return "notTaken";
  }

  return "unknown";
}