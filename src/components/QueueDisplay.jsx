import React from 'react';

function QueueDisplay({ queue }) {
    // Séparer les files par type
    const civilQueue = queue.filter(item => item.file === 'civil' || item.type === 'civil');
    const vipQueue = queue.filter(item => item.file === 'vip' || item.type === 'vip');

    const totalQueue = queue.length;
    const civilCount = civilQueue.length;
    const vipCount = vipQueue.length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                File d'attente
            </h2>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-black">{totalQueue}</span>
                    <span className="text-gray-500">voitures</span>
                </div>

                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-black text-white rounded">🚗 {civilCount}</span>
                    <span className="px-2 py-1 bg-yellow-600 text-white rounded">🏎️ {vipCount}</span>
                </div>
            </div>

            {totalQueue === 0 && (
                <p className="text-gray-400 text-sm mt-2">Aucune voiture en attente</p>
            )}

            {totalQueue > 0 && (
                <div className="mt-3 space-y-3">
                    {/* File Civile */}
                    {civilCount > 0 && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-bold text-black flex items-center gap-2">
                                🚗 File Civile ({civilCount})
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {civilQueue.map((item, index) => (
                                    <span
                                        key={`civil-${index}`}
                                        className="px-2 py-1 bg-black text-white rounded text-xs font-bold flex items-center gap-1"
                                    >
                                        {item.reservation || index + 1}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Prochaine: Civil {civilQueue[0]?.reservation || 1}
                            </p>
                        </div>
                    )}

                    {/* File VIP */}
                    {vipCount > 0 && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-bold text-black flex items-center gap-2">
                                🏎️ File VIP ({vipCount})
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {vipQueue.map((item, index) => (
                                    <span
                                        key={`vip-${index}`}
                                        className="px-2 py-1 bg-yellow-600 text-white rounded text-xs font-bold flex items-center gap-1"
                                    >
                                        {item.reservation || index + 1}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Prochaine: VIP {vipQueue[0]?.reservation || 1}
                            </p>
                        </div>
                    )}

                    <p className="text-[10px] text-gray-400 mt-1">
                        ⚠️ Files indépendantes : Civil attend place civile, VIP attend place VIP
                    </p>
                </div>
            )}
        </div>
    );
}

export default QueueDisplay;