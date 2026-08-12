import { useState } from 'react';
import {
    ArrowRightIcon,
    ArrowLeftIcon,
    ArrowPathIcon,
    UserIcon,
    StarIcon
} from '@heroicons/react/24/outline';

function Controls({ actions }) {
    const [selectedType, setSelectedType] = useState('civil');

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4">Contrôles</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de véhicule
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${selectedType === 'civil'
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedType('civil')}
                        >
                            <UserIcon className="w-4 h-4" />
                            Civil
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${selectedType === 'vip'
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedType('vip')}
                        >
                            <StarIcon className="w-4 h-4" />
                            VIP
                        </button>
                    </div>
                </div>

                {/* Bouton ENTRER - VERT */}
                <button
                    onClick={() => actions.entrer(selectedType)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                    <ArrowRightIcon className="w-5 h-5" />
                    Entrer
                </button>

                {/* Bouton SORTIR - BLEU */}
                <button
                    onClick={() => actions.sortir(selectedType)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Sortir
                </button>

                {/* Bouton RÉINITIALISER - GRIS */}
                <button
                    onClick={() => actions.reinitialiser()}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Réinitialiser
                </button>
            </div>
        </div>
    );
}

export default Controls;