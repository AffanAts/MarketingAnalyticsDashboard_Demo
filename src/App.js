import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppData } from './hooks/useAppData';
import Dashboard from './pages/Dashboard';
import FunnelAnalysis from './pages/FunnelAnalysis';
import InquiryList from './pages/InquiryList';
import ChannelReport from './pages/ChannelReport';
import WebsiteMetrics from './pages/WebsiteMetrics';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';

export default function App() {
  const appData = useAppData();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard appData={appData} />} />
        <Route path="/funnel" element={<FunnelAnalysis appData={appData} />} />
        <Route path="/inquiries" element={<InquiryList appData={appData} />} />
        <Route path="/channels" element={<ChannelReport appData={appData} />} />
        <Route path="/website" element={<WebsiteMetrics appData={appData} />} />
        <Route path="/settings" element={<Settings appData={appData} />} />
        <Route path="/admin" element={<AdminDashboard appData={appData} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
