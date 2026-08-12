import React from 'react';
import ParkingGrid from './components/ParkingGrid';
import Controls from './components/Controls';
import QueueDisplay from './components/QueueDisplay';
import Statistics from './components/Statistics';
import History from './components/History';
import PetriNetGraph from './components/PetriNetGraph';
import { usePetriNet } from './hooks/usePetriNet';

function App() {
  const { state, actions, historique } = usePetriNet();

  const safeHistorique = Array.isArray(historique) ? historique : [];
  const safeFileAttente = Array.isArray(state?.fileAttente) ? state.fileAttente : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Gestion de Parking - Réseau de Pétri
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex flex-wrap items-center gap-3">
            <span>{state?.totalPlaces || 0} places</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{state?.totalOccupe || 0} occupées</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-sm">⏱️ Civil: 8h • VIP: 10h</span>
          </p>
        </div>

        {/* LIGNE 1 : Parking + Graphe + Contrôles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Parking - 4/12 */}
          <div className="lg:col-span-4">
            <ParkingGrid
              state={state || {}}
              onModifierPlaces={actions.modifierPlaces}
              onSortie={(type, placeId) => actions.sortir(type, placeId)}
            />
          </div>

          {/* Graphe RDP - 5/12 (plus grand) */}
          <div className="lg:col-span-5">
            <PetriNetGraph state={state || {}} />
          </div>

          {/* Contrôles - 3/12 */}
          <div className="lg:col-span-3">
            <Controls actions={actions} />
          </div>
        </div>

        {/* LIGNE 2 : File d'attente + Statistiques + Historique */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <QueueDisplay queue={safeFileAttente} />
          </div>
          <div>
            <Statistics state={state || {}} />
          </div>
          <div>
            <History historique={safeHistorique} />
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-3">
          Projet Réseau de Pétri • Gestion de parking dynamique
        </div>
      </div>
    </div>
  );
}

export default App;