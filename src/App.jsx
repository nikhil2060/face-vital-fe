import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReportProvider } from "./context/ReportContext";
import HomePage from "./pages/Homepage";

import FaceMeshOverlay from "./pages/VideoRecorder";
import VitalReportPage from "./pages/VitalReportPage";

const App = () => {
  return (
    <ReportProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/record" element={<FaceMeshOverlay />} />
          <Route path="/report/:reportId" element={<VitalReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ReportProvider>
  );
};

export default App;
