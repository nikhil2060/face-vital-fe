import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Medal,
  Activity,
  WarningCircle,
  Download,
  ShareNetwork,
  Brain,
  Scales,
  Star,
  Check,
  Warning,
  ArrowLeft,
  Spinner,
} from '@phosphor-icons/react';
import { useReport } from '../context/ReportContext';

// Loading spinner for async data fetching
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <Spinner size={40} className="animate-spin text-blue-500" />
      <p className="mt-4 text-gray-600">Loading report data...</p>
    </div>
  </div>
);

// Error display component for handling errors
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex h-screen items-center justify-center">
    <div className="rounded-lg bg-white p-8 text-center shadow-lg">
      <WarningCircle size={48} className="mx-auto text-red-500" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        Error Loading Report
      </h2>
      <p className="mt-2 text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Main report component
const SRTReport = ({ data }) => {
  // Safe check to ensure data exists
  if (!data) {
    return <p>Report data is not available.</p>;
  }

  // Calculate risk level based on total score
  const calculateRiskLevel = (score) => {
    if (score >= 7) return { level: 'Low', color: 'text-green-500' };
    if (score >= 4) return { level: 'Moderate', color: 'text-yellow-500' };
    return { level: 'High', color: 'text-red-500' };
  };

  const riskAssessment = calculateRiskLevel(data.totalScore || 0);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    window.print();
  };

  // Handle report sharing
  const handleShareReport = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback method for copying
      const tempInput = document.createElement('input');
      tempInput.value = window.location.href;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Report link copied to clipboard!');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          SRT Analysis Report
        </h1>
        <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
      </nav>

      {/* Score Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <Medal size={32} weight="duotone" className="text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Score
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                {data.totalScore?.toFixed(1) || 'N/A'}/10
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <Activity size={32} weight="duotone" className="text-purple-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Performance
              </h2>
              <div className="flex space-x-4">
                <p>Sitting: {data.sitScore?.toFixed(1) || 'N/A'}/5</p>
                <p>Rising: {data.riseScore?.toFixed(1) || 'N/A'}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <WarningCircle
              size={32}
              weight="duotone"
              className="text-orange-500"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Risk Level
              </h2>
              <p className={`text-xl font-semibold ${riskAssessment.color}`}>
                {riskAssessment.level} Risk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Postural Control */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-3">
            <Brain size={24} weight="duotone" className="text-indigo-500" />
            <h3 className="text-lg font-semibold">Postural Control</h3>
          </div>
          <div className="mt-2">
            <div className="mb-1 flex justify-between">
              <span>Score:</span>
              <span className="font-semibold">
                {(data.posturalControl * 10).toFixed(1) || 'N/A'}/10
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${data.posturalControl * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-3">
            <Scales size={24} weight="duotone" className="text-blue-500" />
            <h3 className="text-lg font-semibold">Balance</h3>
          </div>
          <div className="mt-2">
            <div className="mb-1 flex justify-between">
              <span>Score:</span>
              <span className="font-semibold">
                {(data.balance * 10).toFixed(1) || 'N/A'}/10
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${data.balance * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coordination */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-3">
            <Activity size={24} weight="duotone" className="text-green-500" />
            <h3 className="text-lg font-semibold">Coordination</h3>
          </div>
          <div className="mt-2">
            <div className="mb-1 flex justify-between">
              <span>Score:</span>
              <span className="font-semibold">
                {(data.coordination * 10).toFixed(1) || 'N/A'}/10
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${data.coordination * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Recommendations */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Analysis Results</h2>

          {/* Strengths */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium text-green-600">
              Strengths
            </h3>
            <div className="space-y-3">
              {data.feedback?.strengths?.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <Check size={20} weight="bold" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <h3 className="mb-3 text-lg font-medium text-red-600">
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {data.feedback?.improvements?.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-red-600"
                >
                  <Warning size={20} weight="bold" />
                  <span>{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Recommended Exercises</h2>
          <div className="space-y-4">
            {data.feedback?.recommendations?.map((recommendation, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center space-x-2 text-blue-600">
                  <Star size={20} weight="duotone" />
                  <span className="font-medium">{recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          <Download size={20} weight="bold" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={handleShareReport}
          className="flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
        >
          <ShareNetwork size={20} weight="bold" />
          <span>Share Report</span>
        </button>
      </div>
    </div>
  );
};

// Main Page Component
const SRTReportPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://srt.actofit.com:3000';

  const { reportId } = useParams();
  const navigate = useNavigate();
  const { reportData, setReportData } = useReport();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!reportId) {
        setError('Invalid report ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/report/${reportId}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch report');
        }

        // Let the context handle the data validation and storage
        setReportData(result);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setReportData(null); // Clear report data on error
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have data for this report ID
    if (!reportData || reportData.reportId !== reportId) {
      fetchReportData();
    } else {
      setLoading(false);
    }
  }, [reportId, reportData?.reportId]); // Only depend on reportId and current reportId

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        message={`Error loading report: ${error}`}
        onRetry={() => {
          setLoading(true);
          setError(null);
          setReportData(null);
          navigate(0);
        }}
      />
    );
  }

  if (!reportData?.data) {
    return (
      <div className="p-4 text-center">
        <h2 className="mb-4 text-xl font-semibold">No Data Available</h2>
        <p className="mb-4 text-gray-600">
          Unable to load report data. Please try again.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <SRTReport data={reportData.data} />;
};

export default SRTReportPage;
