import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import AssetForm from './pages/AssetForm';
import AssignAsset from './pages/AssignAsset';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/new" element={<AssetForm />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path="/assets/:id/edit" element={<AssetForm />} />
            <Route path="/assets/:id/assign" element={<AssignAsset />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
}

export default App;
