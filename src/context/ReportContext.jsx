import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext({
  reportData: null,
  setReportData: () => {},
});

export const ReportProvider = ({ children }) => {
  const [reportData, setReportData] = useState(null);

  const handleSetReportData = (result) => {
    console.log('Setting report data:', result); // Debug log

    if (!result || !result.success) {
      setReportData(null);
      return;
    }

    // Check if data exists and is not empty
    if (!result.data || Object.keys(result.data).length === 0) {
      console.error('Received empty data object:', result);
      return;
    }

    // Store the complete response structure
    setReportData({
      success: result.success,
      reportId: result.reportId,
      data: result.data, // Keep the original data structure
    });
  };

  return (
    <ReportContext.Provider
      value={{ reportData, setReportData: handleSetReportData }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
