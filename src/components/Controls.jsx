function Controls({ actions }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4">Contrôles</h2>

            {/* T0 : Arrivée voiture */}
            <button
                onClick={actions.arriver}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors mb-4"
            >
                Arrivée Voiture
            </button>

            {/* T1 / T2 : Choix du type */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choix de la place (voiture en attente)
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={actions.choisirCivil}
                        className="py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Civil
                    </button>
                    <button
                        onClick={actions.choisirVip}
                        className="py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                    >
                        VIP
                    </button>
                </div>
            </div>

            {/* T3 / T4 : Sortie */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sortie
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => actions.sortirCivil()}
                        className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Sortie Civil
                    </button>
                    <button
                        onClick={() => actions.sortirVip()}
                        className="py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Sortie VIP
                    </button>
                </div>
            </div>

            <button
                onClick={actions.reinitialiser}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm mt-4"
            >
                Réinitialiser
            </button>
        </div>
    );
}

export default Controls;