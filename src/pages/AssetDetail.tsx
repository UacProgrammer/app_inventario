import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { ArrowLeft, Edit, ArrowRightLeft, XCircle, CheckCircle, Package, Clock, MapPin, DollarSign, User, Hash } from 'lucide-react';

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssetById, getEmployeeById, categories, returnAsset, markDamaged, markSold, moveToStorage, markFree, deleteAsset } = useStore();
  const asset = getAssetById(id || '');

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Activo no encontrado</p>
        <Link to="/assets" className="text-blue-600 hover:underline mt-2 inline-block">Volver a activos</Link>
      </div>
    );
  }

  const employee = asset.assignedTo ? getEmployeeById(asset.assignedTo) : null;
  const category = categories.find(c => c.name === asset.category);

  const statusColors: Record<string, string> = {
    libre: 'bg-green-100 text-green-800 border-green-200',
    asignado: 'bg-blue-100 text-blue-800 border-blue-200',
    almacen: 'bg-purple-100 text-purple-800 border-purple-200',
    dañado: 'bg-red-100 text-red-800 border-red-200',
    vendido: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusLabels: Record<string, string> = {
    libre: 'Libre',
    asignado: 'Asignado',
    almacen: 'En Almacén',
    dañado: 'Dañado',
    vendido: 'Vendido',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/assets')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[asset.status]}`}>
              {statusLabels[asset.status]}
            </span>
          </div>
          <p className="text-gray-500 mt-1">{asset.brand} - {asset.model} | S/N: {asset.serialNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/assets/${asset.id}/edit`} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            <Edit className="w-4 h-4" /> Editar
          </Link>
          {(asset.status === 'libre' || asset.status === 'almacen') && (
            <Link to={`/assets/${asset.id}/assign`} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <ArrowRightLeft className="w-4 h-4" /> Asignar
            </Link>
          )}
          {asset.status === 'asignado' && (
            <button onClick={() => { returnAsset(asset.id, 'Devolución manual'); }} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
              <CheckCircle className="w-4 h-4" /> Devolver
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Información del Activo</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Número de Serie</p>
                  <p className="font-medium text-gray-900">{asset.serialNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Categoría</p>
                  <p className="font-medium text-gray-900">{category?.icon} {asset.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium text-gray-900">{asset.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Precio de Compra</p>
                  <p className="font-medium text-gray-900">{asset.purchasePrice ? `$${asset.purchasePrice.toLocaleString()}` : 'No registrado'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha de Compra</p>
                  <p className="font-medium text-gray-900">{asset.purchaseDate || 'No registrada'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Asignado a</p>
                  <p className="font-medium text-gray-900">
                    {employee ? `${employee.name} (${employee.department})` : 'Sin asignar'}
                  </p>
                  {asset.assignedDate && (
                    <p className="text-xs text-gray-400 mt-0.5">Desde: {asset.assignedDate}</p>
                  )}
                </div>
              </div>
              {asset.notes && (
                <div className="sm:col-span-2 flex items-start gap-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 text-center">📝</div>
                  <div>
                    <p className="text-sm text-gray-500">Notas</p>
                    <p className="font-medium text-gray-900">{asset.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Cambiar Estado</h3>
            </div>
            <div className="p-6 flex flex-wrap gap-3">
              {(asset.status === 'libre' || asset.status === 'almacen') && (
                <Link to={`/assets/${asset.id}/assign`} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200">
                  <ArrowRightLeft className="w-4 h-4" /> Asignar
                </Link>
              )}
              {asset.status === 'asignado' && (
                <button onClick={() => returnAsset(asset.id)} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200">
                  <CheckCircle className="w-4 h-4" /> Devolver a Almacén
                </button>
              )}
              {asset.status !== 'dañado' && (
                <button onClick={() => markDamaged(asset.id)} className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200">
                  <XCircle className="w-4 h-4" /> Marcar Dañado
                </button>
              )}
              {asset.status !== 'vendido' && (
                <button onClick={() => markSold(asset.id)} className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-200">
                  <Package className="w-4 h-4" /> Marcar Vendido
                </button>
              )}
              {asset.status !== 'libre' && asset.status !== 'asignado' && asset.status !== 'vendido' && (
                <button onClick={() => markFree(asset.id)} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg hover:bg-emerald-100 transition-colors font-medium border border-emerald-200">
                  <CheckCircle className="w-4 h-4" /> Marcar Libre
                </button>
              )}
              {(asset.status === 'asignado' || asset.status === 'dañado') && (
                <button onClick={() => moveToStorage(asset.id)} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-lg hover:bg-purple-100 transition-colors font-medium border border-purple-200">
                  <Package className="w-4 h-4" /> Mover a Almacén
                </button>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Historial</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...asset.history].reverse().map((entry, index) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    {index < asset.history.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-900 text-sm">{entry.action}</p>
                    {entry.to && <p className="text-xs text-blue-600">→ {entry.to}</p>}
                    {entry.from && <p className="text-xs text-orange-600">← {entry.from}</p>}
                    {entry.notes && <p className="text-xs text-gray-500 mt-0.5">{entry.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
