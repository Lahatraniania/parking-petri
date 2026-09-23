import React from 'react';

function PetriNetGraph({ state }) {
    // Récupération des valeurs depuis l'état du parking
    const placesData = {
        P1: { label: 'P1', value: state.civilLibre || 0, total: state.civilTotal || 0 },
        P2: { label: 'P2', value: state.vipLibre || 0, total: state.vipTotal || 0 },
        P3: { label: 'P3', value: state.civilOccupe || 0, total: state.civilTotal || 0 },
        P4: { label: 'P4', value: state.vipOccupe || 0, total: state.vipTotal || 0 },
        P5: { label: 'P5', value: state.fileAttenteCivil?.length || 0, total: 0 },
        P6: { label: 'P6', value: state.fileAttenteVip?.length || 0, total: 0 },
    };

    // Positions des éléments - Alignement propre sans croisement
    const nodes = {
        // Places - Ligne 1 (Civils)
        P5: { x: 70, y: 100 },
        P1: { x: 300, y: 100 },
        P3: { x: 530, y: 100 },
        // Places - Ligne 2 (VIP)
        P6: { x: 70, y: 270 },
        P2: { x: 300, y: 270 },
        P4: { x: 530, y: 270 },
        // Transitions - Ligne 1
        T5: { x: 185, y: 100 },
        T1: { x: 415, y: 100 },
        T3: { x: 645, y: 100 },
        // Transitions - Ligne 2
        T6: { x: 185, y: 270 },
        T2: { x: 415, y: 270 },
        T4: { x: 645, y: 270 },
    };

    // Arcs horizontaux (lignes droites) - AUCUN CROISEMENT
    const straightArcs = [
        // Ligne 1 (Civil)
        { from: 'P5', to: 'T5' },
        { from: 'T5', to: 'P1' },
        { from: 'P1', to: 'T1' },
        { from: 'T1', to: 'P3' },
        { from: 'P3', to: 'T3' },
        // Ligne 2 (VIP)
        { from: 'P6', to: 'T6' },
        { from: 'T6', to: 'P2' },
        { from: 'P2', to: 'T2' },
        { from: 'T2', to: 'P4' },
        { from: 'P4', to: 'T4' },
    ];

    // Vérifier si une transition est franchissable
    const isTransitionFirable = (id) => {
        if (id === 'T1') return placesData.P1.value > 0 && placesData.P5.value === 0;
        if (id === 'T2') return placesData.P2.value > 0 && placesData.P6.value === 0;
        if (id === 'T3') return placesData.P3.value > 0;
        if (id === 'T4') return placesData.P4.value > 0;
        if (id === 'T5') return placesData.P5.value > 0;
        if (id === 'T6') return placesData.P6.value > 0;
        return false;
    };

    // Rayon des places
    const R = 45;
    // Demi-largeur des transitions
    const TH = 28;
    const TV = 18;

    return (
        <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200 h-full">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold text-black">Réseau de Pétri</h2>
                <div className="text-sm text-gray-500 font-semibold">Civil: 8h • VIP: 10h</div>
            </div>

            <div className="overflow-auto">
                <svg
                    width="100%"
                    height="520"
                    viewBox="0 0 760 520"
                    className="border border-gray-200 rounded-lg bg-white"
                >
                    {/* Définition des flèches */}
                    <defs>
                        <marker id="arrowhead" markerWidth="12" markerHeight="10" refX="10" refY="5" orient="auto">
                            <polygon points="0 0, 12 5, 0 10" fill="#222" />
                        </marker>
                    </defs>

                    {/* ===== ARCS COURBES (retour) ===== */}

                    {/* T3 → P1 : passe AU-DESSUS de tout */}
                    <path
                        d={`M ${nodes.T3.x} ${nodes.T3.y - TV} C ${nodes.T3.x} 15, ${nodes.P1.x} 15, ${nodes.P1.x} ${nodes.P1.y - R}`}
                        fill="none"
                        stroke="#222"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />

                    {/* T4 → P2 : passe EN DESSOUS de tout */}
                    <path
                        d={`M ${nodes.T4.x} ${nodes.T4.y + TV} C ${nodes.T4.x} 410, ${nodes.P2.x} 410, ${nodes.P2.x} ${nodes.P2.y + R}`}
                        fill="none"
                        stroke="#222"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />

                    {/* ===== ARCS HORIZONTAUX (droits) ===== */}
                    {straightArcs.map((arc, index) => {
                        const from = nodes[arc.from];
                        const to = nodes[arc.to];
                        if (!from || !to) return null;

                        const isFromPlace = arc.from.startsWith('P');
                        const isToPlace = arc.to.startsWith('P');

                        const startX = from.x + (isFromPlace ? R : TH);
                        const endX = to.x - (isToPlace ? R : TH);
                        const y = from.y;

                        return (
                            <line
                                key={index}
                                x1={startX}
                                y1={y}
                                x2={endX}
                                y2={y}
                                stroke="#222"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}

                    {/* ===== PLACES (cercles) ===== */}
                    {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((id) => {
                        const p = nodes[id];
                        const data = placesData[id];
                        const hasTokens = data.value > 0;
                        const isP5 = id === 'P5';
                        const isP6 = id === 'P6';

                        let fillColor = 'white';
                        if (isP5) fillColor = '#E3F2FD';
                        if (isP6) fillColor = '#FFF3E0';

                        // Jetons en cercle autour de la place
                        const tokens = [];
                        const total = Math.min(data.value, 6);
                        if (total > 0) {
                            for (let i = 0; i < total; i++) {
                                const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
                                tokens.push({
                                    cx: p.x + (R * 0.55) * Math.cos(angle),
                                    cy: p.y + (R * 0.55) * Math.sin(angle)
                                });
                            }
                        }

                        return (
                            <g key={id}>
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={R}
                                    fill={fillColor}
                                    stroke={hasTokens ? 'black' : '#888'}
                                    strokeWidth={hasTokens ? "3.5" : "2"}
                                />
                                {/* Nom de la place - TRÈS GRAND */}
                                <text
                                    x={p.x}
                                    y={p.y + 8}
                                    fill="black"
                                    fontSize="28"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>
                                {/* Jetons */}
                                {tokens.map((t, i) => (
                                    <circle key={i} cx={t.cx} cy={t.cy} r="6.5" fill="black" />
                                ))}
                                {/* Valeur - TRÈS GRAND */}
                                <text
                                    x={p.x}
                                    y={p.y + R + 30}
                                    fill="black"
                                    fontSize="26"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {data.value}
                                    {(id === 'P1' || id === 'P2') && (
                                        <tspan fill="#888" fontSize="16">/{data.total}</tspan>
                                    )}
                                </text>
                            </g>
                        );
                    })}

                    {/* ===== TRANSITIONS (rectangles) ===== */}
                    {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((id) => {
                        const t = nodes[id];
                        const firable = isTransitionFirable(id);

                        return (
                            <g key={id}>
                                <rect
                                    x={t.x - TH}
                                    y={t.y - TV}
                                    width={TH * 2}
                                    height={TV * 2}
                                    fill={firable ? '#C8E6C9' : 'white'}
                                    stroke="black"
                                    strokeWidth="2.5"
                                />
                                {/* Nom transition - TRÈS GRAND */}
                                <text
                                    x={t.x}
                                    y={t.y + 8}
                                    fill="black"
                                    fontSize="22"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>
                            </g>
                        );
                    })}

                    {/* ===== LÉGENDE ===== */}
                    <g transform="translate(20, 470)">
                        <circle cx="10" cy="10" r="9" fill="white" stroke="black" strokeWidth="2" />
                        <text x="28" y="15" fill="black" fontSize="14" fontWeight="bold">Place</text>

                        <rect x="115" y="1" width="18" height="18" fill="white" stroke="black" strokeWidth="2" />
                        <text x="142" y="15" fill="black" fontSize="14" fontWeight="bold">Transition</text>

                        <circle cx="265" cy="10" r="6" fill="black" />
                        <text x="280" y="15" fill="black" fontSize="14" fontWeight="bold">Jeton</text>

                        <text x="365" y="15" fill="#333" fontSize="14" fontWeight="bold">
                            {state.totalOccupe || 0} voitures
                        </text>

                        <rect x="510" y="1" width="18" height="18" fill="#C8E6C9" stroke="black" strokeWidth="1.5" />
                        <text x="537" y="15" fill="#333" fontSize="14" fontWeight="bold">Franchissable</text>
                    </g>
                </svg>
            </div>

            {/* Liste des noms des Places et Transitions */}
            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-bold text-gray-700 mb-1">Places</h4>
                        <div className="space-y-0.5">
                            <div><span className="font-bold">P1</span> - Places Civiles Libres</div>
                            <div><span className="font-bold">P2</span> - Places VIP Libres</div>
                            <div><span className="font-bold">P3</span> - Places Civiles Occupées</div>
                            <div><span className="font-bold">P4</span> - Places VIP Occupées</div>
                            <div><span className="font-bold">P5</span> - File d'attente CIVIL</div>
                            <div><span className="font-bold">P6</span> - File d'attente VIP</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-700 mb-1">Transitions</h4>
                        <div className="space-y-0.5">
                            <div><span className="font-bold">T1</span> - Entrée Civil</div>
                            <div><span className="font-bold">T2</span> - Entrée VIP</div>
                            <div><span className="font-bold">T3</span> - Sortie Civil</div>
                            <div><span className="font-bold">T4</span> - Sortie VIP</div>
                            <div><span className="font-bold">T5</span> - File CIVIL → P1</div>
                            <div><span className="font-bold">T6</span> - File VIP → P2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetriNetGraph;