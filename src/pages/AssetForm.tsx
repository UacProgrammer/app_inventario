import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { ArrowLeft, Save } from 'lucide-react';
import { AssetStatus } from '../types';

export default function AssetForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssetById, addAsset, updateAsset, categories, locations } = useStore();
  const existingAsset = id ? getAssetById(id) : undefined;
  const isEdit = !!existingAsset;

  const [form, setForm] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    category: '',
    status: 'almacen' as AssetStatus,
    location: '',
    purchaseDate: '',
    purchasePrice: '',
    notes: '',
  });

  useEffect(() => {
    if (existingAsset) {
      setForm({
        name: existingAsset.name,
        brand: existingAsset.brand,
        model: existingAsset.model,
        serialNumber: existingAsset.serialNumber,
        category: existingAsset.category,
        status: existingAsset.status,
        location: existingAsset.location,
        purchaseDate: existingAsset.purchaseDate || '',
        purchasePrice: existingAsset.purchasePrice?.toString() || '',
        notes: existingAsset.notes || '',
      });
    }
  }, [existingAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetData = {
      name: form.name,
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      category: form.category,
      status: form.status,
      location: form.location,
      purchaseDate: form.purchaseDate || undefined,
      purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
      notes: form.notes || undefined,
    };

    if (isEdit && existingAsset) {
      updateAsset(existingAsset.id, assetData);
      navigate(`/assets/${existingAsset.id}`);
    } else {
      addAsset(assetData);
      navigate('/assets');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Activo' : 'Nuevo Activo'}</h2>
          <p className="text-gray-500 mt-1">{isEdit ? 'Modifica los datos del activo' : 'Completa los datos para registrar un nuevo activo'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Activo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: MacBook Pro 14&quot;"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: Apple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={e => setForm({ ...form, model: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: MacBook Pro M3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie *</label>
                <input
                  type="text"
                  required
                  value={form.serialNumber}
                  onChange={e => setForm({ ...form, serialNumber: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ej: C02X1234ABCD"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Clasificación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  required
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                <select
                  required
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Seleccionar ubicación</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as AssetStatus })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="almacen">En Almacén</option>
                  <option value="libre">Libre</option>
                  <option value="dañado">Dañado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Purchase Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Compra</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={e => setForm({ ...form, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Compra ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link to={isEdit ? `/assets/${id}` : '/assets'} className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
            Cancelar
          </Link>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">
            <Save className="w-4 h-4" />
            {isEdit ? 'Guardar Cambios' : 'Crear Activo'}
          </button>
        </div>
      </form>
    </div>
  );
}
