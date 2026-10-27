import React, { useState, useMemo } from 'react';
import { useStore } from '../store/StoreContext';
import { BarChart3, Download, Filter, FileText, TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

export default function Reports() {
  const { assets, employees, categories, locations, getStats } = useStore();
  const [reportType, setReportType] = useState<'general' | 'status' | 'category' | 'location' | 'value' | 'history'>('general');
  const stats = getStats();

  const statusData = [
    { name: 'Libre', value: stats.libre, color: '#10b981' },
    { name: 'Asignado', value: stats.asignado, color: '#3b82f6' },
    { name: 'Almacén', value: stats.almacen, color: '#8b5cf6' },
    { name: 'Dañado', value: stats.dañado, color: '#ef4444' },
    { name: 'Vendido', value: stats.vendido, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const catAssets = assets.filter(a => a.category === cat.name);
      return {
        name: cat.name,
        total: catAssets.length,
        asignados: catAssets.filter(a => a.status === 'asignado').length,
        disponibles: catAssets.filter(a => a.status === 'libre' || a.status === 'almacen').length,
        dañados: catAssets.filter(a => a.status === 'dañado').length,
        value: catAssets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0),
      };
    }).filter(d => d.total > 0);
  }, [assets, categories]);

  const locationData = useMemo(() => {
    return locations.map(loc => {
      const locAssets = assets.filter(a => a.location === loc.name);
      return {
        name: loc.name,
        total: locAssets.length,
        asignados: locAssets.filter(a => a.status === 'asignado').length,
        value: locAssets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0),
      };
    }).filter(d => d.total > 0);
  }, [assets, locations]);

  const departmentData = useMemo(() => {
    const deptMap: Record<string, { count: number; value: number }> = {};
    assets.filter(a => a.status === 'asignado' && a.assignedTo).forEach(a => {
      const emp = employees.find(e => e.id === a.assignedTo);
      if (emp) {
        if (!deptMap[emp.department]) deptMap[emp.department] = { count: 0, value: 0 };
        deptMap[emp.department].count++;
        deptMap[emp.department].value += a.purchasePrice || 0;
      }
    });
    return Object.entries(deptMap).map(([name, data]) => ({ name, ...data }));
  }, [assets, employees]);

  const allHistory = useMemo(() => {
    const entries: { date: string; action: string; asset: string }[] = [];
    assets.forEach(a => {
      a.history.forEach(h => {
        entries.push({ date: h.date, action: h.action, asset: a.name });
      });
    });
    return entries.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
  }, [assets]);

  const exportCSV = () => {
    let csvContent = '';
    let headers = '';
    let rows: string[] = [];

    switch (reportType) {
      case 'general':
        headers = 'Nombre,Marca,Modelo,Serie,Categoría,Estado,Ubicación,Precio,Asignado a\n';
        rows = assets.map(a => {
          const emp = a.assignedTo ? employees.find(e => e.id === a.assignedTo)?.name || '' : '';
          return `"${a.name}","${a.brand}","${a.model}","${a.serialNumber}","${a.category}","${a.status}","${a.location}",${a.purchasePrice || 0},"${emp}"`;
        });
        break;
      case 'status':
        headers = 'Estado,Cantidad,Valor Total\n';
        rows = statusData.map(d => `"${d.name}",${d.value},${assets.filter(a => {
          const statusMap: Record<string, string> = { 'Libre': 'libre', 'Asignado': 'asignado', 'Almacén': 'almacen', 'Dañado': 'dañado', 'Vendido': 'vendido' };
          return a.status === statusMap[d.name];
        }).reduce((s, a) => s + (a.purchasePrice || 0), 0)}`);
        break;
      case 'category':
        headers = 'Categoría,Total,Asignados,Disponibles,Dañados,Valor\n';
        rows = categoryData.map(d => `"${d.name}",${d.total},${d.asignados},${d.disponibles},${d.dañados},${d.value}`);
        break;
      case 'location':
        headers = 'Ubicación,Total,Asignados,Valor\n';
        rows = locationData.map(d => `"${d.name}",${d.total},${d.asignados},${d.value}`);
        break;
      case 'value':
        headers = 'Departamento,Activos Asignados,Valor Total\n';
        rows = departmentData.map(d => `"${d.name}",${d.count},${d.value}`);
        break;
      case 'history':
        headers = 'Fecha,Acción,Activo\n';
        rows = allHistory.map(h => `"${h.date}","${h.action}","${h.asset}"`);
        break;
    }

    csvContent = headers + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const reportTypes = [
    { id: 'general' as const, label: 'Inventario General', icon: FileText, desc: 'Listado completo de todos los activos' },
    { id: 'status' as const, label: 'Por Estado', icon: BarChart3, desc: 'Distribución de activos por estado' },
    { id: 'category' as const, label: 'Por Categoría', icon: Package, desc: 'Activos agrupados por categoría' },
    { id: 'location' as const, label: 'Por Ubicación', icon: Filter, desc: 'Activos distribuidos por ubicación' },
    { id: 'value' as const, label: 'Valor por Departamento', icon: DollarSign, desc: 'Valor de activos por departamento' },
    { id: 'history' as const, label: 'Historial de Movimientos', icon: TrendingUp, desc: 'Registro de cambios y movimientos' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
          <p className="text-gray-500 mt-1">Genera reportes detallados de tus activos</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTypes.map(rt => (
          <button
            key={rt.id}
            onClick={() => setReportType(rt.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              reportType === rt.id
                ? 'bg-blue-50 border-blue-300 shadow-sm'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
            }`}
          >
            <rt.icon className={`w-5 h-5 mb-2 ${reportType === rt.id ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-medium ${reportType === rt.id ? 'text-blue-900' : 'text-gray-700'}`}>{rt.label}</p>
            <p className="text-xs text-gray-500 mt-0.5 hidden lg:block">{rt.desc}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {reportType === 'general' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Marca/Modelo</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Serie</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ubicación</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Asignado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assets.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{a.brand} {a.model}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 font-mono text-xs">{a.serialNumber}</td>
                    <td className="px-6 py-3"><span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">{a.status}</span></td>
                    <td className="px-6 py-3 text-sm text-gray-600">{a.location}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{a.purchasePrice ? `$${a.purchasePrice.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{a.assignedTo ? employees.find(e => e.id === a.assignedTo)?.name : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'status' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen</h3>
                <div className="space-y-3">
                  {statusData.map(d => (
                    <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="font-medium text-gray-700">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{d.value}</span>
                        <span className="text-sm text-gray-500 ml-2">({((d.value / stats.total) * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'category' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="asignados" stackId="a" fill="#3b82f6" name="Asignados" />
                <Bar dataKey="disponibles" stackId="a" fill="#10b981" name="Disponibles" />
                <Bar dataKey="dañados" stackId="a" fill="#ef4444" name="Dañados" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Asignados</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Disponibles</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Dañados</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoryData.map(d => (
                    <tr key={d.name}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{d.total}</td>
                      <td className="px-4 py-3 text-sm text-center text-blue-600">{d.asignados}</td>
                      <td className="px-4 py-3 text-sm text-center text-green-600">{d.disponibles}</td>
                      <td className="px-4 py-3 text-sm text-center text-red-600">{d.dañados}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">${d.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'location' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activos por Ubicación</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="asignados" fill="#3b82f6" name="Asignados" />
                <Bar dataKey="total" fill="#8b5cf6" name="Total" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationData.map(d => (
                <div key={d.name} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h4 className="font-semibold text-gray-800">{d.name}</h4>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total activos</span>
                    <span className="font-bold text-gray-900">{d.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Asignados</span>
                    <span className="font-bold text-blue-600">{d.asignados}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Valor total</span>
                    <span className="font-bold text-green-600">${d.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'value' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Valor de Activos por Departamento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#10b981" name="Valor ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Departamento</th>
                    <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Activos Asignados</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Valor Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departmentData.map(d => (
                    <tr key={d.name}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{d.count}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-green-600">${d.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">{departmentData.reduce((s, d) => s + d.count, 0)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-green-600">${departmentData.reduce((s, d) => s + d.value, 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {reportType === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Movimientos (últimos 50)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Acción</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Activo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allHistory.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{h.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{h.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{h.asset}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
