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
    <div
      className="min-h-screen bg-gray-50"
      style={{ paddingLeft: '1.5cm', paddingRight: '1.5cm', paddingTop: '1rem', paddingBottom: '1rem' }}
    >
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
          <span className="text-sm">Civil: 8h • VIP: 10h</span>
        </p>
      </div>

      {/* ===== LIGNE 1 : Graphe (grand à gauche) + Parking & Contrôles (à droite empilés) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Graphe RDP - GRAND - 8/12 à GAUCHE */}
        <div className="lg:col-span-8">
          <PetriNetGraph state={state || {}} />
        </div>

        {/* Colonne de droite : Parking + Contrôles empilés - 4/12 */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Parking - en haut */}
          <div className="flex-1">
            <ParkingGrid
              state={state || {}}
              onModifierPlaces={actions.modifierPlaces}
              onSortie={(type, placeId) => actions.sortir(type, placeId)}
            />
          </div>

          {/* Contrôles - en bas */}
          <div className="flex-1">
            <Controls actions={actions} />
          </div>
        </div>
      </div>

      {/* ===== LIGNE 2 : File d'attente + Statistiques + Historique ===== */}
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
  );
}

export default App;