'use client';

import { useState } from 'react';
import { User } from '@/types';
import { importTransactions } from '@/lib/storage';

interface ProfileSelectorProps {
  onSelect: (user: User) => void;
}

export default function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Pagos de la Casa
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Selecciona tu perfil para continuar
        </p>
        
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => onSelect('Alberto')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                A
              </div>
              <span className="text-lg sm:text-xl">Alberto</span>
            </div>
          </button>

          <button
            onClick={() => onSelect('Victoria')}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
                V
              </div>
              <span className="text-lg sm:text-xl">Victoria</span>
            </div>
          </button>
        </div>

        {/* Botón para importar datos */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowImport(!showImport)}
            className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showImport ? 'Ocultar' : '📥 Importar datos desde otro dominio'}
          </button>

          {showImport && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Importar Transacciones</h3>
              <p className="text-xs text-gray-600 mb-3">
                Pega aquí el JSON de tus transacciones del dominio anterior:
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='Pega el JSON aquí...'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs font-mono bg-white text-gray-900"
                rows={6}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    if (!importData.trim()) {
                      setImportStatus({ success: false, message: 'Por favor ingresa los datos JSON' });
                      return;
                    }
                    const result = importTransactions(importData, false); // false = reemplazar, true = combinar
                    if (result.success) {
                      setImportStatus({ 
                        success: true, 
                        message: `✓ ${result.count} transacciones importadas correctamente${result.error ? '. ' + result.error : ''}` 
                      });
                      setImportData('');
                      setTimeout(() => {
                        setShowImport(false);
                        setImportStatus(null);
                        // Recargar la página para ver los datos
                        window.location.reload();
                      }, 2000);
                    } else {
                      setImportStatus({ success: false, message: `✗ Error: ${result.error || 'Error desconocido'}` });
                    }
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Importar (Reemplazar)
                </button>
                <button
                  onClick={() => {
                    if (!importData.trim()) {
                      setImportStatus({ success: false, message: 'Por favor ingresa los datos JSON' });
                      return;
                    }
                    const result = importTransactions(importData, true); // true = combinar
                    if (result.success) {
                      setImportStatus({ 
                        success: true, 
                        message: `✓ ${result.count} transacciones en total${result.error ? '. ' + result.error : ''}` 
                      });
                      setImportData('');
                      setTimeout(() => {
                        setShowImport(false);
                        setImportStatus(null);
                        window.location.reload();
                      }, 2000);
                    } else {
                      setImportStatus({ success: false, message: `✗ Error: ${result.error || 'Error desconocido'}` });
                    }
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Combinar
                </button>
              </div>
              {importStatus && (
                <div className={`mt-3 p-2 rounded text-xs ${
                  importStatus.success 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {importStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

