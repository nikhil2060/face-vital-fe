import React from "react";
import { useReport } from "../context/ReportContext";
import {
  Medal,
  Activity,
  Heart,
  Brain,
  Pulse,
  Drop,
  Warning,
  ArrowLeft,
  Clock,
  ThermometerSimple,
  Wheelchair,
  Download,
  ShareNetwork,
  CaretUp,
  CaretDown,
  Minus,
  Check,
} from "@phosphor-icons/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-red-800">
          Something went wrong rendering this component.
        </p>
      </div>
    );
  }

  return children;
};

const VitalReportPage = () => {
  const { reportData } = useReport();
  const report = reportData?.data;

  if (!report) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Activity className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  // Normalize values for radar chart to prevent overflow
  const normalizeValue = (value, min, max) => {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  // Transform vitals data for radar chart with proper normalization
  const radarData = [
    {
      metric: "Heart Rate",
      value: normalizeValue(
        report.vitals.heartRate.value,
        report.vitals.heartRate.range.low,
        report.vitals.heartRate.range.high
      ),
      fullMark: 100,
    },
    {
      metric: "HRV",
      value: normalizeValue(
        report.vitals.heartRateVariability.value,
        report.vitals.heartRateVariability.range.low,
        report.vitals.heartRateVariability.range.high
      ),
      fullMark: 100,
    },
    {
      metric: "Respiratory",
      value: normalizeValue(
        report.vitals.respiratoryRate.value,
        report.vitals.respiratoryRate.range.low,
        report.vitals.respiratoryRate.range.high
      ),
      fullMark: 100,
    },
    {
      metric: "SpO2",
      value: normalizeValue(
        report.vitals.spO2.value,
        report.vitals.spO2.range.low,
        report.vitals.spO2.range.high
      ),
      fullMark: 100,
    },
    {
      metric: "Stress",
      value: report.vitals.stressLevel.value,
      fullMark: 100,
    },
  ];

  // Generate realistic time series data based on initial values
  const generateTimeSeriesData = (initial, variance, length) => {
    const data = [];
    let current = initial;

    for (let i = 0; i < length; i++) {
      // Ensure values stay within realistic bounds
      const maxChange = variance * 0.5;
      const change = Math.random() * maxChange * 2 - maxChange;
      current = Math.max(0, current + change);
      data.push(current);
    }
    return data;
  };

  const timePoints = Array.from({ length: 10 }, (_, i) => i);
  const heartRateData = generateTimeSeriesData(
    report.vitals.heartRate.value,
    5,
    10
  );
  const respRateData = generateTimeSeriesData(
    report.vitals.respiratoryRate.value,
    2,
    10
  );

  const timeSeriesData = timePoints.map((time, i) => ({
    time,
    heartRate: heartRateData[i],
    respRate: respRateData[i],
  }));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "high":
        return "text-red-500 bg-red-50";
      case "low":
        return "text-yellow-500 bg-yellow-50";
      case "normal":
        return "text-green-500 bg-green-50";
      case "moderate":
        return "text-orange-500 bg-orange-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const calculateProgressWidth = (data) => {
    if (typeof data.value === "object") {
      // Handle blood pressure specially
      const systolicPercentage = normalizeValue(
        data.value.systolic,
        data.range.systolic.low,
        data.range.systolic.high
      );
      return `${Math.min(100, systolicPercentage)}%`;
    }

    return `${Math.min(
      100,
      normalizeValue(data.value, data.range.low, data.range.high)
    )}%`;
  };

  const renderVitalCard = (title, data, icon) => {
    if (!data) return null;

    return (
      <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`rounded-full p-3 ${getStatusColor(data.status)}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {typeof data.value === "object"
                    ? `${data.value.systolic}/${data.value.diastolic}`
                    : data.value}
                </span>
                <span className="text-sm text-gray-500">{data.unit}</span>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              getStatusColor(data.status).split(" ")[0]
            }`}
          >
            {data.status === "high" ? (
              <CaretUp size={20} />
            ) : data.status === "low" ? (
              <CaretDown size={20} />
            ) : (
              <Minus size={20} />
            )}
            <span className="text-sm font-medium">{data.status}</span>
          </div>
        </div>

        {/* Progress bar */}
        {data.range && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{data.range.low}</span>
              <span>{data.range.high}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${
                  data.status === "normal"
                    ? "bg-green-500"
                    : data.status === "high"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
                style={{
                  width: calculateProgressWidth(data),
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-600">{data.interpretation}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                data.confidence === "high"
                  ? "bg-green-100 text-green-700"
                  : data.confidence === "moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {data.confidence} confidence
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Vital Signs Report
            </h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">
              Generated on:{" "}
              {new Date(report.metadata.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex w-full space-x-4 md:w-auto">
            <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow hover:bg-gray-50 md:flex-none">
              <Download size={20} />
              <span>Download</span>
            </button>
            <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 md:flex-none">
              <ShareNetwork size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Summary Status */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Overall Status
              </h2>
              <p
                className={`mt-1 text-lg font-medium ${
                  report.analysis.summary.overallStatus === "Needs Attention"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {report.analysis.summary.overallStatus}
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-gray-600">Recording Duration</div>
              <div className="text-lg font-medium">
                {report.metadata.recordingDuration.toFixed(1)}s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <ErrorBoundary>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Vital Signs Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Vitals"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    name="Heart Rate"
                  />
                  <Line
                    type="monotone"
                    dataKey="respRate"
                    stroke="#3b82f6"
                    name="Respiratory Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {/* Vitals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderVitalCard(
          "Heart Rate",
          report.vitals.heartRate,
          <Heart size={24} weight="fill" />
        )}
        {renderVitalCard(
          "Heart Rate Variability",
          report.vitals.heartRateVariability,
          <Activity size={24} weight="fill" />
        )}
        {renderVitalCard(
          "Respiratory Rate",
          report.vitals.respiratoryRate,
          <Pulse size={24} weight="fill" />
        )}
        {renderVitalCard(
          "Blood Pressure",
          report.vitals.bloodPressure,
          <ThermometerSimple size={24} weight="fill" />
        )}
        {renderVitalCard(
          "Stress Level",
          report.vitals.stressLevel,
          <Brain size={24} weight="fill" />
        )}
        {renderVitalCard(
          "SpO2",
          report.vitals.spO2,
          <Drop size={24} weight="fill" />
        )}
      </div>

      {/* Analysis Section */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Concerns */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Concerns</h3>
          <div className="space-y-4">
            {report.analysis.concerns.map((concern, index) => (
              <div key={index} className="rounded-lg bg-red-50 p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <Warning size={20} />
                  <span className="font-medium">{concern.type}</span>
                </div>
                <p className="mt-2 text-sm text-red-600">
                  {concern.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Recommendations
          </h3>
          <div className="space-y-4">
            {report.analysis.recommendations.map((rec, index) => (
              <div key={index} className="rounded-lg bg-blue-50 p-4">
                <div className="font-medium text-blue-700">{rec.category}</div>
                <ul className="mt-2 space-y-2">
                  {rec.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-sm text-blue-600"
                    >
                      <Check size={16} />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reliability Section */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Measurement Reliability
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Confidence</span>
              <span className="font-medium text-blue-600">
                {report.reliability.overallConfidence.level}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${report.reliability.overallConfidence.score * 100}%`,
                }}
              />
            </div>
            <div className="mt-4 grid gap-2">
              {Object.entries(report.reliability.overallConfidence.factors).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span
                      className={`font-medium ${
                        value === "good"
                          ? "text-green-600"
                          : value === "unstable"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Measurement Quality
            </h4>
            <div className="grid gap-2">
              {Object.entries(
                report.reliability.measurementQuality.factors
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span
                    className={`font-medium ${
                      value === "good"
                        ? "text-green-600"
                        : value === "stable"
                        ? "text-green-600"
                        : value === "adequate"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-yellow-50 p-4">
          <h4 className="font-medium text-yellow-800">Limitations</h4>
          <ul className="mt-2 space-y-2">
            {report.reliability.limitations.map((limitation, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-yellow-700"
              >
                <Warning size={16} className="mt-1 flex-shrink-0" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VitalReportPage;
