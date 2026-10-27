import React from 'react';
import { useStore } from '../store/StoreContext';
import { Package, Users, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { getStats, assets, employees, categories } = useStore();
  const stats = getStats();

  const recentAssets = [...assets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const pieData = [
    { name: 'Libre', value: stats.libre, color: '#10b981' },
    { name: 'Asignado', value: stats.asignado, color: '#3b82f6' },
    { name: 'Almacén', value: stats.almacen, color: '#8b5cf6' },
    { name: 'Dañado', value: stats.dañado, color: '#ef4444' },
    { name: 'Vendido', value: stats.vendido, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const categoryData = categories.map(cat => ({
    name: cat.name,
    count: assets.filter(a => a.category === cat.name).length
  })).filter(d => d.count > 0);

  const statusColors: Record<string, string> = {
    libre: 'bg-green-100 text-green-800',
    asignado: 'bg-blue-100 text-blue-800',
    almacen: 'bg-purple-100 text-purple-800',
    dañado: 'bg-red-100 text-red-800',
    vendido: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    libre: 'Libre',
    asignado: 'Asignado',
    almacen: 'Almacén',
    dañado: 'Dañado',
    vendido: 'Vendido',
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium ml-1">Valor total: ${stats.totalValue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Asignados</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.asignado}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{((stats.asignado / stats.total) * 100).toFixed(0)}% del total</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">En Almacén</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.almacen + stats.libre}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">{stats.libre} libres, {stats.almacen} en almacén</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Dañados</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.dañado}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight className="w-4 h-4 text-red-500" />
            <span className="text-red-600 font-medium ml-1">Requieren atención</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activos por Categoría</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Activos Recientes</h3>
            <Link to="/assets" className="text-blue-600 text-sm font-medium hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAssets.map(asset => (
              <Link key={asset.id} to={`/assets/${asset.id}`} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                  {categories.find(c => c.name === asset.category)?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{asset.name}</p>
                  <p className="text-sm text-gray-500">{asset.brand} - {asset.model}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[asset.status]}`}>
                  {statusLabels[asset.status]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h3>
          </div>
          <div className="p-4 space-y-3">
            <Link to="/assets/new" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-blue-800">Nuevo Activo</span>
            </Link>
            <Link to="/reports" className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <div className="bg-green-600 p-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-green-800">Ver Reportes</span>
            </Link>
            <Link to="/assets?status=dañado" className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              <div className="bg-red-600 p-2 rounded-lg">
                <XCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-red-800">Activos Dañados ({stats.dañado})</span>
            </Link>
            <Link to="/assets?status=libre" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="bg-purple-600 p-2 rounded-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-purple-800">Disponibles ({stats.libre})</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
