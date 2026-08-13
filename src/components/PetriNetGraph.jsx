import React from 'react';

function PetriNetGraph({ state }) {
    // Récupération des valeurs depuis l'état du parking
    const placesData = {
        P1: {
            label: 'P1',
            desc: 'Places Civiles Libres',
            value: state.civilLibre || 0,
            total: state.civilTotal || 0
        },
        P2: {
            label: 'P2',
            desc: 'Places VIP Libres',
            value: state.vipLibre || 0,
            total: state.vipTotal || 0
        },
        P3: {
            label: 'P3',
            desc: 'Places Civiles Occupées',
            value: state.civilOccupe || 0,
            total: state.civilTotal || 0
        },
        P4: {
            label: 'P4',
            desc: 'Places VIP Occupées',
            value: state.vipOccupe || 0,
            total: state.vipTotal || 0
        },
        P5: {
            label: 'P5',
            desc: "File d'attente CIVIL",
            value: state.fileAttenteCivil?.length || 0,
            total: 0
        },
        P6: {
            label: 'P6',
            desc: "File d'attente VIP",
            value: state.fileAttenteVip?.length || 0,
            total: 0
        },
    };

    // Positions des éléments - Séparés correctement
    const nodes = {
        // Places
        P1: { x: 100, y: 70 },
        P2: { x: 100, y: 180 },
        P3: { x: 340, y: 70 },
        P4: { x: 340, y: 180 },
        P5: { x: 170, y: 290 },    // P5 décalé à gauche
        P6: { x: 290, y: 290 },    // P6 décalé à droite
        // Transitions
        T1: { x: 220, y: 70 },
        T2: { x: 220, y: 180 },
        T3: { x: 440, y: 70 },
        T4: { x: 440, y: 180 },
        T5: { x: 220, y: 290 },    // T5 entre P5 et T6 (en dessous)
        T6: { x: 360, y: 290 },    // T6 à droite de T5
    };

    // Arcs du réseau - Mise à jour des connexions
    const arcs = [
        { from: 'P1', to: 'T1' },
        { from: 'P2', to: 'T2' },
        { from: 'T1', to: 'P3' },
        { from: 'T2', to: 'P4' },
        { from: 'P3', to: 'T3' },
        { from: 'P4', to: 'T4' },
        { from: 'T3', to: 'P1' },
        { from: 'T4', to: 'P2' },
        // P5 -> T5 (P5 à gauche de T5)
        { from: 'P5', to: 'T5' },
        // T5 -> P1
        { from: 'T5', to: 'P1' },
        // P6 -> T6 (P6 à droite de T6)
        { from: 'P6', to: 'T6' },
        // T6 -> P2
        { from: 'T6', to: 'P2' },
    ];

    const getNode = (id) => nodes[id];

    // Générer les positions des jetons
    const getTokenPositions = (cx, cy, count) => {
        const positions = [];
        const total = Math.min(count, 6);
        if (total === 0) return positions;

        const radius = 26;
        if (total === 1) {
            positions.push({ x: cx + radius * 0.8, y: cy - radius * 0.6 });
        } else if (total === 2) {
            positions.push({ x: cx + radius * 0.7, y: cy - radius * 0.5 });
            positions.push({ x: cx + radius * 0.9, y: cy + radius * 0.3 });
        } else {
            for (let i = 0; i < Math.min(total, 6); i++) {
                const angle = -Math.PI / 2 + (i / Math.min(total, 6)) * Math.PI * 1.5;
                positions.push({
                    x: cx + radius * 0.8 * Math.cos(angle),
                    y: cy + radius * 0.8 * Math.sin(angle) - 5,
                });
            }
        }
        return positions;
    };

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

    // Noms des transitions
    const transitionNames = {
        T1: 'Entrée Civil',
        T2: 'Entrée VIP',
        T3: 'Sortie Civil',
        T4: 'Sortie VIP',
        T5: 'Sortie file CIVIL',
        T6: 'Sortie file VIP'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200 h-full">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                    <span className="text-xl"></span> Réseau de Pétri
                </h2>
                <div className="text-xs text-gray-400">
                    ⏱️ Civil: 8h • VIP: 10h
                </div>
            </div>

            <div className="overflow-auto">
                <svg
                    width="100%"
                    height="400"
                    viewBox="0 0 580 380"
                    className="border border-gray-200 rounded-lg bg-white"
                >
                    {/* Définition des flèches */}
                    <defs>
                        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#333" />
                        </marker>
                    </defs>

                    {/* Arcs */}
                    {arcs.map((arc, index) => {
                        const from = getNode(arc.from);
                        const to = getNode(arc.to);
                        if (!from || !to) return null;

                        const dx = to.x - from.x;
                        const dy = to.y - from.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const offset = 28;
                        const startX = from.x + (dx / dist) * offset;
                        const startY = from.y + (dy / dist) * offset;
                        const endX = to.x - (dx / dist) * offset;
                        const endY = to.y - (dy / dist) * offset;

                        return (
                            <line
                                key={index}
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke="#333"
                                strokeWidth="1.2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}

                    {/* Places (cercles) */}
                    {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map((id) => {
                        const p = nodes[id];
                        const data = placesData[id];
                        const hasTokens = data.value > 0;
                        const isP5 = id === 'P5';
                        const isP6 = id === 'P6';
                        const tokenPositions = getTokenPositions(p.x, p.y, data.value);

                        let fillColor = 'white';
                        if (isP5) fillColor = '#E3F2FD';   // Bleu clair pour P5
                        if (isP6) fillColor = '#FFF3E0';   // Orange clair pour P6

                        return (
                            <g key={id}>
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="28"
                                    fill={fillColor}
                                    stroke={hasTokens ? 'black' : '#999'}
                                    strokeWidth={hasTokens ? "2.5" : "1.5"}
                                    className="transition-all duration-300"
                                />

                                <text
                                    x={p.x}
                                    y={p.y - 3}
                                    fill="black"
                                    fontSize="12"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>

                                <text
                                    x={p.x}
                                    y={p.y + 16}
                                    fill="#666"
                                    fontSize="6.5"
                                    textAnchor="middle"
                                >
                                    {data.desc}
                                </text>

                                {/* Jetons */}
                                {tokenPositions.map((pos, i) => (
                                    <circle
                                        key={i}
                                        cx={pos.x}
                                        cy={pos.y}
                                        r="4.5"
                                        fill="black"
                                        stroke="black"
                                        strokeWidth="0.5"
                                        className="transition-all duration-500"
                                    />
                                ))}

                                <text
                                    x={p.x}
                                    y={p.y + 42}
                                    fill="black"
                                    fontSize="13"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {data.value}
                                </text>

                                {(id === 'P1' || id === 'P2') && (
                                    <text
                                        x={p.x + 28}
                                        y={p.y + 42}
                                        fill="#999"
                                        fontSize="7"
                                        textAnchor="middle"
                                    >
                                        /{data.total}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Transitions (petits rectangles) */}
                    {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((id) => {
                        const t = nodes[id];
                        const firable = isTransitionFirable(id);

                        return (
                            <g key={id}>
                                <rect
                                    x={t.x - 16}
                                    y={t.y - 10}
                                    width="32"
                                    height="20"
                                    fill={firable ? '#E8F5E9' : 'white'}
                                    stroke="black"
                                    strokeWidth="1.8"
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={t.x}
                                    y={t.y + 3}
                                    fill="black"
                                    fontSize="9"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>
                                <text
                                    x={t.x}
                                    y={t.y + 20}
                                    fill="#666"
                                    fontSize="6"
                                    textAnchor="middle"
                                >
                                    {transitionNames[id]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Légende */}
                    <g transform="translate(10, 360)">
                        <circle cx="6" cy="6" r="5" fill="white" stroke="black" strokeWidth="1.5" />
                        <text x="16" y="9" fill="black" fontSize="7">Place</text>

                        <rect x="65" y="1" width="10" height="6" fill="white" stroke="black" strokeWidth="1.5" />
                        <text x="80" y="9" fill="black" fontSize="7">Transition</text>

                        <circle cx="130" cy="6" r="3" fill="black" />
                        <text x="138" y="9" fill="black" fontSize="7">Jeton</text>

                        <text x="195" y="9" fill="#666" fontSize="7">
                            ● {state.totalOccupe || 0} voitures
                        </text>

                        <rect x="270" y="1" width="10" height="6" fill="#E3F2FD" stroke="black" strokeWidth="0.5" />
                        <text x="285" y="9" fill="#666" fontSize="7">P5 Civil</text>

                        <rect x="340" y="1" width="10" height="6" fill="#FFF3E0" stroke="black" strokeWidth="0.5" />
                        <text x="355" y="9" fill="#666" fontSize="7">P6 VIP</text>
                    </g>
                </svg>
            </div>

            {/* Liste des noms des Places et Transitions */}
            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs">
                    {/* Places */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-1 text-sm">Places</h4>
                        <div className="space-y-0.5">
                            <div><span className="font-bold">P1</span> - Places Civiles Libres</div>
                            <div><span className="font-bold">P2</span> - Places VIP Libres</div>
                            <div><span className="font-bold">P3</span> - Places Civiles Occupées</div>
                            <div><span className="font-bold">P4</span> - Places VIP Occupées</div>
                            <div><span className="font-bold">P5</span> - File d'attente CIVIL</div>
                            <div><span className="font-bold">P6</span> - File d'attente VIP</div>
                        </div>
                    </div>

                    {/* Transitions */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-1 text-sm">Transitions</h4>
                        <div className="space-y-0.5">
                            <div><span className="font-bold">T1</span> - Entrée Civil</div>
                            <div><span className="font-bold">T2</span> - Entrée VIP</div>
                            <div><span className="font-bold">T3</span> - Sortie Civil</div>
                            <div><span className="font-bold">T4</span> - Sortie VIP</div>
                            <div><span className="font-bold">T5</span> - Sortie file CIVIL</div>
                            <div><span className="font-bold">T6</span> - Sortie file VIP</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetriNetGraph;