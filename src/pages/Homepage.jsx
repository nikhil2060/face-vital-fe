import { Camera, CaretRight, ChartLineUp, Heart } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        <div className="space-y-4 text-center">
          <Heart size={48} weight="duotone" className="mx-auto text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-900">VitalScan AI</h1>
          <p className="text-gray-600">
            Get instant health vitals analysis through advanced facial scanning
            technology
          </p>
        </div>

        <div className="space-y-6 pt-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex-shrink-0">
                <Camera size={24} weight="duotone" className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Quick Face Scan</p>
                <p className="text-sm text-gray-500">
                  30-second contactless measurement
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex-shrink-0">
                <ChartLineUp
                  size={24}
                  weight="duotone"
                  className="text-green-500"
                />
              </div>
              <div>
                <p className="font-medium">Comprehensive Analysis</p>
                <p className="text-sm text-gray-500">
                  Heart rate, stress level, oxygen saturation
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/record")}
          className="group relative flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
        >
          <span>Start Face Scan</span>
          <CaretRight
            size={20}
            weight="bold"
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <p className="text-center text-xs text-gray-500">
          Your privacy is our priority. All scans are processed locally.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
