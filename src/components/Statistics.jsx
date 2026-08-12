import {
    ChartBarIcon,
    Squares2X2Icon,
    UserGroupIcon,
    StarIcon
} from '@heroicons/react/24/outline';

function Statistics({ state }) {
    const tauxOccupation = state?.totalPlaces > 0
        ? Math.round((state.totalOccupe / state.totalPlaces) * 100)
        : 0;

    const getTauxColor = () => {
        if (tauxOccupation < 50) return 'bg-green-500';
        if (tauxOccupation < 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6" />
                Statistiques
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                        <Squares2X2Icon className="w-4 h-4" />
                        Total places
                    </span>
                    <span className="font-bold text-black">{state?.totalPlaces || 0}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Libres
                    </span>
                    <span className="font-bold text-black">{state?.totalLibre || 0}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Occupées
                    </span>
                    <span className="font-bold text-black">{state?.totalOccupe || 0}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                        <ChartBarIcon className="w-4 h-4" />
                        Taux d'occupation
                    </span>
                    <span className="font-bold text-black">{tauxOccupation}%</span>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`${getTauxColor()} h-full transition-all duration-500`}
                            style={{ width: `${tauxOccupation}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                                <UserGroupIcon className="w-4 h-4" />
                                Civil
                            </div>
                            <div className="font-bold text-black text-xl">{state?.civilTotal || 0}</div>
                            <div className="text-xs text-gray-400">places</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                                <StarIcon className="w-4 h-4" />
                                VIP
                            </div>
                            <div className="font-bold text-black text-xl">{state?.vipTotal || 0}</div>
                            <div className="text-xs text-gray-400">places</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;