import { useState } from 'react';
import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function History({ historique = [] }) {
    const [showHistory, setShowHistory] = useState(false);

    // Vérification de sécurité
    const historyArray = Array.isArray(historique) ? historique : [];
    const recentHistory = historyArray.slice(0, 15);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    <ClockIcon className="w-6 h-6" />
                    Historique
                </h2>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                >
                    {showHistory ? (
                        <><ChevronUpIcon className="w-4 h-4" /> Masquer</>
                    ) : (
                        <><ChevronDownIcon className="w-4 h-4" /> Afficher</>
                    )}
                </button>
            </div>

            {showHistory && (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                    {recentHistory.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">Aucune action</p>
                    ) : (
                        recentHistory.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <span className="text-gray-400 text-xs font-mono">{item.timestamp}</span>
                                <span className="font-medium text-black">{item.action}</span>
                                <span className="text-gray-500 text-xs">{item.detail}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default History;