import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

export default function AssignAsset() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssetById, employees, assignAsset } = useStore();
  const asset = getAssetById(id || '');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [notes, setNotes] = useState('');

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Activo no encontrado</p>
        <button onClick={() => navigate('/assets')} className="text-blue-600 hover:underline mt-2">Volver</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    assignAsset(asset.id, selectedEmployee, notes || undefined);
    navigate(`/assets/${asset.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asignar Activo</h2>
          <p className="text-gray-500 mt-1">Asigna este activo a un empleado</p>
        </div>
      </div>

      {/* Asset Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <ArrowRightLeft className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-blue-900">{asset.name}</p>
          <p className="text-sm text-blue-700">{asset.brand} - {asset.model} | S/N: {asset.serialNumber}</p>
          <p className="text-xs text-blue-600 mt-1">Estado actual: {asset.status}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empleado *</label>
            <select
              required
              value={selectedEmployee}
              onChange={e => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Seleccionar empleado...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} - {emp.department} ({emp.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas de asignación</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Motivo de la asignación, observaciones..."
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
            Cancelar
          </button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">
            <ArrowRightLeft className="w-4 h-4" />
            Asignar Activo
          </button>
        </div>
      </form>
    </div>
  );
}
