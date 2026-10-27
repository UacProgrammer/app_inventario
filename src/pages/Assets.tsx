import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { Plus, Search, Filter, Eye, Edit, Trash2, ArrowRightLeft, XCircle, CheckCircle, Package } from 'lucide-react';
import { AssetStatus } from '../types';

export default function Assets() {
  const { assets, employees, categories, locations, deleteAsset, returnAsset, markDamaged, markSold, moveToStorage, markFree } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>((searchParams.get('status') as AssetStatus) || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchSearch = search === '' || 
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.brand.toLowerCase().includes(search.toLowerCase()) ||
        asset.model.toLowerCase().includes(search.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === '' || asset.status === statusFilter;
      const matchCategory = categoryFilter === '' || asset.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [assets, search, statusFilter, categoryFilter]);

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
    almacen: 'Almacén',
    dañado: 'Dañado',
    vendido: 'Vendido',
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setShowDeleteConfirm(null);
  };

  const handleQuickAction = (assetId: string, action: string) => {
    switch(action) {
      case 'return': returnAsset(assetId, 'Devolución rápida'); break;
      case 'damaged': markDamaged(assetId, 'Marcado como dañado'); break;
      case 'sold': markSold(assetId, 'Vendido'); break;
      case 'storage': moveToStorage(assetId, 'Movido a almacén'); break;
      case 'free': markFree(assetId, 'Marcado como libre'); break;
    }
    setShowActions(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Activos</h2>
          <p className="text-gray-500 mt-1">{filteredAssets.length} activos encontrados</p>
        </div>
        <Link to="/assets/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <Plus className="w-5 h-5" />
          Nuevo Activo
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca, modelo, serie..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={e => { const val = e.target.value; setStatusFilter(val as AssetStatus | ''); if(val) { setSearchParams({ status: val }); } else { setSearchParams({}); } }}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="libre">Libre</option>
              <option value="asignado">Asignado</option>
              <option value="almacen">Almacén</option>
              <option value="dañado">Dañado</option>
              <option value="vendido">Vendido</option>
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asignado a</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                        {categories.find(c => c.name === asset.category)?.icon || '📦'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{asset.name}</p>
                        <p className="text-sm text-gray-500">{asset.brand} - {asset.model}</p>
                        <p className="text-xs text-gray-400">S/N: {asset.serialNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{asset.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[asset.status]}`}>
                      {statusLabels[asset.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {asset.assignedTo ? employees.find(e => e.id === asset.assignedTo)?.name || '-' : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {asset.purchasePrice ? `$${asset.purchasePrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 relative">
                      <Link to={`/assets/${asset.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalle">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link to={`/assets/${asset.id}/edit`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setShowActions(showActions === asset.id ? null : asset.id)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Acciones"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(asset.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Actions dropdown */}
                      {showActions === asset.id && (
                        <div className="absolute right-0 top-12 z-20 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                          {(asset.status === 'libre' || asset.status === 'almacen') && (
                            <Link to={`/assets/${asset.id}/assign`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                              <ArrowRightLeft className="w-4 h-4" /> Asignar a empleado
                            </Link>
                          )}
                          {asset.status === 'asignado' && (
                            <button onClick={() => handleQuickAction(asset.id, 'return')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left">
                              <CheckCircle className="w-4 h-4" /> Devolver a almacén
                            </button>
                          )}
                          {asset.status !== 'dañado' && (
                            <button onClick={() => handleQuickAction(asset.id, 'damaged')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 w-full text-left">
                              <XCircle className="w-4 h-4" /> Marcar como dañado
                            </button>
                          )}
                          {asset.status !== 'vendido' && (
                            <button onClick={() => handleQuickAction(asset.id, 'sold')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 w-full text-left">
                              <Package className="w-4 h-4" /> Marcar como vendido
                            </button>
                          )}
                          {(asset.status === 'asignado' || asset.status === 'dañado') && (
                            <button onClick={() => handleQuickAction(asset.id, 'storage')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 w-full text-left">
                              <Package className="w-4 h-4" /> Mover a almacén
                            </button>
                          )}
                          {asset.status !== 'libre' && asset.status !== 'asignado' && asset.status !== 'vendido' && (
                            <button onClick={() => handleQuickAction(asset.id, 'free')} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left">
                              <CheckCircle className="w-4 h-4" /> Marcar como libre
                            </button>
                          )}
                        </div>
                      )}

                      {/* Delete confirmation */}
                      {showDeleteConfirm === asset.id && (
                        <div className="absolute right-0 top-12 z-20 w-64 bg-white rounded-lg shadow-lg border border-red-200 p-4">
                          <p className="text-sm text-gray-700 mb-3">¿Eliminar este activo? Esta acción no se puede deshacer.</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleDelete(asset.id)} className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700">
                              Eliminar
                            </button>
                            <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-200">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No se encontraron activos</p>
            <p className="text-gray-400 text-sm mt-1">Intenta cambiar los filtros o crea un nuevo activo</p>
          </div>
        )}
      </div>
    </div>
  );
}
