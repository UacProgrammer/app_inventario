import React from 'react';
import { useStore } from '../store/StoreContext';
import { Users, Mail, Building, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Employees() {
  const { employees, assets } = useStore();

  const getEmployeeAssets = (empId: string) => assets.filter(a => a.assignedTo === empId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Empleados</h2>
          <p className="text-gray-500 mt-1">{employees.length} empleados registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => {
          const empAssets = getEmployeeAssets(emp.id);
          return (
            <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{emp.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-500">{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-500 truncate">{emp.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {empAssets.length} {empAssets.length === 1 ? 'activo' : 'activos'} asignados
                    </span>
                  </div>
                  {empAssets.length > 0 && (
                    <Link to={`/assets?status=asignado`} className="text-xs text-blue-600 hover:underline">
                      Ver detalles
                    </Link>
                  )}
                </div>
                {empAssets.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {empAssets.slice(0, 3).map(a => (
                      <Link key={a.id} to={`/assets/${a.id}`} className="block text-xs text-gray-500 hover:text-blue-600 truncate">
                        • {a.name} ({a.brand})
                      </Link>
                    ))}
                    {empAssets.length > 3 && (
                      <p className="text-xs text-gray-400">+{empAssets.length - 3} más</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
