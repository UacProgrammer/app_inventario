import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Save, RefreshCw, Trash2, AlertTriangle, Info } from 'lucide-react';

export default function Settings() {
  const { assets, employees, categories, locations } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-gray-500 mt-1">Administra la configuración del sistema</p>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Información del Sistema</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total de Activos</p>
              <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Empleados</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Ubicaciones</p>
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Categorías de Activos</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Ubicaciones</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {locations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{loc.name}</p>
                  <p className="text-sm text-gray-500">{loc.address}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {assets.filter(a => a.location === loc.name).length} activos
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Gestión de Datos</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Almacenamiento Local</p>
              <p className="text-sm text-blue-700">Los datos se guardan en el almacenamiento local del navegador. Usa la opción de exportar en Reportes para crear backups.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Restablecer Datos</p>
              <p className="text-sm text-yellow-700">Esta acción eliminará todos los datos y restaurará los datos de ejemplo. No se puede deshacer.</p>
            </div>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              <RefreshCw className="w-4 h-4" />
              Restablecer Datos de Ejemplo
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-900 mb-3">¿Estás seguro? Se perderán todos los cambios.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Sí, restablecer
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Acerca de</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 rounded-xl p-3">
              <span className="text-white text-2xl">📦</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">AssetTrack</h4>
              <p className="text-gray-500">Sistema de Gestión de Activos v1.0</p>
              <p className="text-sm text-gray-400 mt-1">Inspirado en Snipe-IT • Desarrollado con React + TypeScript</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
