import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AssetProvider } from "./context/AssetContext";
import { AppLayout } from "./components/layout/AppLayout";
import { AccessGate } from "./components/layout/AccessGate";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PetaAset from "./pages/PetaAset";
import DataAset from "./pages/DataAset";
import DetailAset from "./pages/DetailAset";
import IntegrasiBapenda from "./pages/IntegrasiBapenda";
import StatusRiwayat from "./pages/StatusRiwayat";
import Laporan from "./pages/Laporan";
import Pengaturan from "./pages/Pengaturan";
import SurveyLapangan from "./pages/mobile/SurveyLapangan";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { role } = useAuth();
  return <Navigate to={role ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AssetProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/peta-aset" element={<PetaAset />} />
            <Route path="/data-aset" element={<DataAset />} />
            <Route path="/data-aset/:kode" element={<DetailAset />} />
            <Route
              path="/bapenda"
              element={
                <AccessGate path="/bapenda">
                  <IntegrasiBapenda />
                </AccessGate>
              }
            />
            <Route path="/riwayat" element={<StatusRiwayat />} />
            <Route
              path="/laporan"
              element={
                <AccessGate path="/laporan">
                  <Laporan />
                </AccessGate>
              }
            />
            <Route
              path="/survey"
              element={
                <AccessGate path="/survey">
                  <SurveyLapangan />
                </AccessGate>
              }
            />
            <Route path="/pengaturan" element={<Pengaturan />} />
          </Route>

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AssetProvider>
    </AuthProvider>
  );
}
