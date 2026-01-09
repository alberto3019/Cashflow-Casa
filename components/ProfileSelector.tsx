'use client';

import { User } from '@/types';

interface ProfileSelectorProps {
  onSelect: (user: User) => void;
}

export default function ProfileSelector({ onSelect }: ProfileSelectorProps) {
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
      </div>
    </div>
  );
}

