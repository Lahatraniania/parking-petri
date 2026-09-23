import React, { useState } from 'react';
import PlaceCell from './PlaceCell';
import { STATUS } from '../utils/constants';

function ParkingGrid({ state, onModifierPlaces, onSortie }) {
    const [civilInput, setCivilInput] = useState(state.civilTotal);
    const [vipInput, setVipInput] = useState(state.vipTotal);
    const [showControls, setShowControls] = useState(false);

    const generatePlaces = (total, type) => {
        const places = [];
        const vehicules = type === 'civil' ? state.vehicules.civil : state.vehicules.vip;

        for (let i = 0; i < total; i++) {
            const vehicule = vehicules.find(v => v.placeId === i);
            const status = vehicule ? STATUS.OCCUPE : STATUS.LIBRE;
            places.push({
                id: i,
                status,
                vehicule: vehicule || null
            });
        }
        return places;
    };

    const civilPlaces = generatePlaces(state.civilTotal, 'civil');
    const vipPlaces = generatePlaces(state.vipTotal, 'vip');

    const handleModifierCivil = () => {
        if (civilInput >= state.civilOccupe) {
            onModifierPlaces('civil', civilInput);
            setShowControls(false);
        } else {
            alert(`Impossible ! ${state.civilOccupe} places sont occupées.`);
        }
    };

    const handleModifierVip = () => {
        if (vipInput >= state.vipOccupe) {
            onModifierPlaces('vip', vipInput);
            setShowControls(false);
        } else {
            alert(`Impossible ! ${state.vipOccupe} places sont occupées.`);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Places de Parking</h2>
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    {showControls ? 'Masquer' : 'Modifier'}
                </button>
            </div>

            {/* Contrôles de modification - labels empilés pour OK visible */}
            {showControls && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-3 text-black">Modifier le nombre de places</h3>

                    {/* Civil - empilé verticalement */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Places Civils (actuel: {state.civilTotal})
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={state.civilOccupe}
                                value={civilInput}
                                onChange={(e) => setCivilInput(Number(e.target.value))}
                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleModifierCivil}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm whitespace-nowrap"
                            >
                                OK
                            </button>
                            <span className="text-xs text-gray-500">
                                min: {state.civilOccupe}
                            </span>
                        </div>
                    </div>

                    {/* VIP - empilé verticalement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Places VIP (actuel: {state.vipTotal})
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={state.vipOccupe}
                                value={vipInput}
                                onChange={(e) => setVipInput(Number(e.target.value))}
                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleModifierVip}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm whitespace-nowrap"
                            >
                                OK
                            </button>
                            <span className="text-xs text-gray-500">
                                min: {state.vipOccupe}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Info durée */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-2">
                <div className="text-sm text-gray-700 font-medium">
                    Durée max : Civil 8h | VIP 10h
                </div>
                <div className="text-sm flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {state.totalLibre} libres
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {state.totalOccupe} occupées
                    </span>
                </div>
            </div>

            {/* Places Civils */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-black">
                        Places Civils
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({state.civilOccupe}/{state.civilTotal})
                        </span>
                    </h3>
                    <span className="text-sm text-gray-500">
                        Libres: {state.civilLibre}
                    </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {civilPlaces.map((place) => (
                        <PlaceCell
                            key={`civil-${place.id}`}
                            id={place.id}
                            type="civil"
                            status={place.status}
                            vehicule={place.vehicule}
                            onSortie={onSortie}
                        />
                    ))}
                </div>
            </div>

            {/* Places VIP */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-black">
                        Places VIP
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({state.vipOccupe}/{state.vipTotal})
                        </span>
                    </h3>
                    <span className="text-sm text-gray-500">
                        Libres: {state.vipLibre}
                    </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {vipPlaces.map((place) => (
                        <PlaceCell
                            key={`vip-${place.id}`}
                            id={place.id}
                            type="vip"
                            status={place.status}
                            vehicule={place.vehicule}
                            onSortie={onSortie}
                        />
                    ))}
                </div>
            </div>

            {/* Légende */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Libre</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Occupé</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <span>Cliquer sur ✕ pour sortir</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParkingGrid;