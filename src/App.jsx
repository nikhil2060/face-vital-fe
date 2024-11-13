import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import VideoRecorder from "./pages/VideoRecorder";
import SRTReport from "./pages/SRTReport";
import { ReportProvider } from "./context/ReportContext";
import SRTReportPage from "./pages/SRTReport";
import FaceMeshOverlay from "./pages/VideoRecorder";

const App = () => {
  return (
    <ReportProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/record" element={<FaceMeshOverlay />} />
          <Route path="/report/:reportId" element={<SRTReportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ReportProvider>
  );
};

export default App;
