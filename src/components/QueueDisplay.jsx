function QueueDisplay({ queue }) {
    const queueCount = queue.length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                File d'attente
            </h2>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-black">{queueCount}</span>
                    <span className="text-gray-500">voitures</span>
                </div>

                {queueCount > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {queue.map((item, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 ${item.type === 'civil' ? 'bg-black' : 'bg-yellow-600'
                                    }`}
                            >
                                {item.type === 'civil' ? '🚗' : '🏎️'}
                                <span className="ml-0.5">{index + 1}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {queueCount === 0 && (
                <p className="text-gray-400 text-sm mt-2">Aucune voiture en attente</p>
            )}

            {queueCount > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="font-medium">⏳ {queueCount}</span>
                        voiture{queueCount > 1 ? 's' : ''} en attente
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        Prochaine:
                        {queue[0].type === 'civil' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white rounded text-xs font-bold">
                                🚗 Civil
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-600 text-white rounded text-xs font-bold">
                                🏎️ VIP
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

export default QueueDisplay;