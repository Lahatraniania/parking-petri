import React from 'react';

function PetriNetGraph({ state }) {
    const placesData = {
        P0: { label: 'P0', value: state.voitureAttente || 0, total: 0 },
        P1: { label: 'P1', value: state.civilLibre || 0, total: state.civilTotal || 0 },
        P2: { label: 'P2', value: state.vipLibre || 0, total: state.vipTotal || 0 },
        P3: { label: 'P3', value: state.civilOccupe || 0, total: state.civilTotal || 0 },
        P4: { label: 'P4', value: state.vipOccupe || 0, total: state.vipTotal || 0 },
        P5: { label: 'P5', value: state.fileAttenteCivil?.length || 0, total: 0 },
        P6: { label: 'P6', value: state.fileAttenteVip?.length || 0, total: 0 },
    };

    const nodes = {
        T0: { x: 450, y: 40 },
        P0: { x: 450, y: 130 },
        T1: { x: 250, y: 280 },
        T2: { x: 650, y: 280 },
        P1: { x: 100, y: 280 },
        P2: { x: 800, y: 280 },
        P3: { x: 250, y: 450 },
        P4: { x: 650, y: 450 },
        T3: { x: 100, y: 450 },
        T4: { x: 800, y: 450 },
        P5: { x: 100, y: 580 },
        P6: { x: 800, y: 580 },
        T5: { x: 250, y: 580 },
        T6: { x: 650, y: 580 },
    };

    const arcs = [
        { from: 'T0', to: 'P0', curve: 0 },
        { from: 'P0', to: 'T1', curve: -60 },
        { from: 'P0', to: 'T2', curve: 60 },
        { from: 'P0', to: 'T5', curve: -180 },
        { from: 'P0', to: 'T6', curve: 180 },
        { from: 'P1', to: 'T1', curve: 0 },
        { from: 'P2', to: 'T2', curve: 0 },
        { from: 'T1', to: 'P3', curve: 0 },
        { from: 'T2', to: 'P4', curve: 0 },
        { from: 'P3', to: 'T3', curve: 0 },
        { from: 'P4', to: 'T4', curve: 0 },
        { from: 'T3', to: 'P1', curve: -120 },
        { from: 'T4', to: 'P2', curve: 120 },
        { from: 'P5', to: 'T5', curve: 0 },
        { from: 'P6', to: 'T6', curve: 0 },
        { from: 'T5', to: 'P3', curve: 0 },
        { from: 'T6', to: 'P4', curve: 0 },
    ];

    const getNode = (id) => nodes[id];
    const R = 38;
    const TH = 24;
    const TV = 16;

    // Calculer le chemin courbe + la position de la flèche
    const getCurvedPath = (from, to, fromId, toId, curveOffset = 0) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const isFromPlace = fromId.startsWith('P');
        const isToPlace = toId.startsWith('P');
        const startOffset = isFromPlace ? R : Math.max(TH, TV);
        const endOffset = isToPlace ? R : Math.max(TH, TV);

        const startX = from.x + (dx / dist) * startOffset;
        const startY = from.y + (dy / dist) * startOffset;
        const endX = to.x - (dx / dist) * endOffset;
        const endY = to.y - (dy / dist) * endOffset;

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        const perpX = -dy / dist;
        const perpY = dx / dist;

        const ctrlX = midX + perpX * curveOffset;
        const ctrlY = midY + perpY * curveOffset;

        // Point sur la courbe quadratique à t = 0.9 (proche de l'arrivée)
        const t = 0.9;
        const beforeX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
        const beforeY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

        // Angle de la tangente au point t
        const tx = 2 * (1 - t) * (ctrlX - startX) + 2 * t * (endX - ctrlX);
        const ty = 2 * (1 - t) * (ctrlY - startY) + 2 * t * (endY - ctrlY);
        const angle = Math.atan2(ty, tx);

        return {
            path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
            arrowX: endX,
            arrowY: endY,
            angle,
        };
    };

    const isTransitionFirable = (id) => {
        if (id === 'T0') return true;
        if (id === 'T1') return placesData.P0.value > 0 && placesData.P1.value > 0;
        if (id === 'T2') return placesData.P0.value > 0 && placesData.P2.value > 0;
        if (id === 'T3') return placesData.P3.value > 0;
        if (id === 'T4') return placesData.P4.value > 0;
        if (id === 'T5') return placesData.P5.value > 0 && placesData.P1.value > 0;
        if (id === 'T6') return placesData.P6.value > 0 && placesData.P2.value > 0;
        return false;
    };

    const renderTokens = (cx, cy, count) => {
        const tokens = [];
        const total = Math.min(count, 6);
        for (let i = 0; i < total; i++) {
            const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
            tokens.push({
                cx: cx + (R * 0.55) * Math.cos(angle),
                cy: cy + (R * 0.55) * Math.sin(angle)
            });
        }
        return tokens;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-200 h-full">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold text-black">Réseau de Pétri</h2>
                <div className="text-sm text-gray-500 font-semibold">Civil: 8h • VIP: 10h</div>
            </div>

            <div className="overflow-auto">
                <svg width="100%" height="680" viewBox="0 0 900 680" className="border border-gray-200 rounded-lg bg-white">
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="14"
                            markerHeight="12"
                            refX="12"
                            refY="6"
                            orient="auto"
                            markerUnits="userSpaceOnUse"
                        >
                            <polygon points="0 0, 14 6, 0 12" fill="#222" />
                        </marker>
                    </defs>

                    {/* Arcs courbes avec flèches */}
                    {arcs.map((arc, i) => {
                        const from = getNode(arc.from);
                        const to = getNode(arc.to);
                        if (!from || !to) return null;

                        const { path, arrowX, arrowY, angle } = getCurvedPath(
                            from, to, arc.from, arc.to, arc.curve || 0
                        );

                        // Position du triangle de flèche (manuelle pour bien orienter)
                        const arrowSize = 12;
                        const ax1 = arrowX - arrowSize * Math.cos(angle - Math.PI / 7);
                        const ay1 = arrowY - arrowSize * Math.sin(angle - Math.PI / 7);
                        const ax2 = arrowX - arrowSize * Math.cos(angle + Math.PI / 7);
                        const ay2 = arrowY - arrowSize * Math.sin(angle + Math.PI / 7);

                        return (
                            <g key={i}>
                                {/* Courbe sans marker */}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke="#222"
                                    strokeWidth="1.8"
                                />
                                {/* Flèche manuelle orientée */}
                                <polygon
                                    points={`${arrowX},${arrowY} ${ax1},${ay1} ${ax2},${ay2}`}
                                    fill="#222"
                                />
                            </g>
                        );
                    })}

                    {/* Places */}
                    {Object.keys(placesData).map((id) => {
                        const p = nodes[id];
                        const data = placesData[id];
                        const has = data.value > 0;
                        const color =
                            id === 'P5' ? '#E3F2FD' :
                                id === 'P6' ? '#FFF3E0' :
                                    id === 'P0' ? '#F3E5F5' : 'white';
                        const tokens = renderTokens(p.x, p.y, data.value);

                        return (
                            <g key={id}>
                                <circle
                                    cx={p.x} cy={p.y} r={R}
                                    fill={color}
                                    stroke={has ? 'black' : '#888'}
                                    strokeWidth={has ? "3" : "2"}
                                />
                                <text
                                    x={p.x} y={p.y + 8}
                                    fill="black" fontSize="22" fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>
                                {tokens.map((t, k) => (
                                    <circle key={k} cx={t.cx} cy={t.cy} r="5.5" fill="black" />
                                ))}
                                <text
                                    x={p.x} y={p.y + R + 24}
                                    fill="black" fontSize="20" fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {data.value}
                                    {(id === 'P1' || id === 'P2') && (
                                        <tspan fill="#888" fontSize="13">/{data.total}</tspan>
                                    )}
                                </text>
                            </g>
                        );
                    })}

                    {/* Transitions */}
                    {['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((id) => {
                        const t = nodes[id];
                        const firable = isTransitionFirable(id);

                        return (
                            <g key={id}>
                                <rect
                                    x={t.x - TH} y={t.y - TV}
                                    width={TH * 2} height={TV * 2}
                                    fill={firable ? '#C8E6C9' : 'white'}
                                    stroke="black" strokeWidth="2.2"
                                />
                                <text
                                    x={t.x} y={t.y + 6}
                                    fill="black" fontSize="16" fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {id}
                                </text>
                            </g>
                        );
                    })}

                    {/* Légende */}
                    <g transform="translate(20, 660)">
                        <circle cx="8" cy="8" r="7" fill="white" stroke="black" strokeWidth="1.5" />
                        <text x="22" y="12" fill="black" fontSize="12" fontWeight="bold">Place</text>

                        <rect x="90" y="1" width="14" height="14" fill="white" stroke="black" strokeWidth="1.5" />
                        <text x="112" y="12" fill="black" fontSize="12" fontWeight="bold">Transition</text>

                        <circle cx="200" cy="8" r="4.5" fill="black" />
                        <text x="212" y="12" fill="black" fontSize="12" fontWeight="bold">Jeton</text>

                        <rect x="280" y="1" width="14" height="14" fill="#F3E5F5" stroke="black" strokeWidth="0.8" />
                        <text x="300" y="12" fill="#333" fontSize="12" fontWeight="bold">P0 Arrivée</text>

                        <rect x="390" y="1" width="14" height="14" fill="#E3F2FD" stroke="black" strokeWidth="0.8" />
                        <text x="410" y="12" fill="#333" fontSize="12" fontWeight="bold">P5 File CIVIL</text>

                        <rect x="510" y="1" width="14" height="14" fill="#FFF3E0" stroke="black" strokeWidth="0.8" />
                        <text x="530" y="12" fill="#333" fontSize="12" fontWeight="bold">P6 File VIP</text>
                    </g>
                </svg>
            </div>

            {/* Légende textuelle */}
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-bold text-gray-700 mb-1">Places</h4>
                    <div className="space-y-0.5">
                        <div><b>P0</b> - Voiture en attente</div>
                        <div><b>P1</b> - Places Civiles Libres</div>
                        <div><b>P2</b> - Places VIP Libres</div>
                        <div><b>P3</b> - Places Civiles Occupées</div>
                        <div><b>P4</b> - Places VIP Occupées</div>
                        <div><b>P5</b> - File CIVIL</div>
                        <div><b>P6</b> - File VIP</div>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-700 mb-1">Transitions</h4>
                    <div className="space-y-0.5">
                        <div><b>T0</b> - Arrivée voiture</div>
                        <div><b>T1</b> - Choix Civil</div>
                        <div><b>T2</b> - Choix VIP</div>
                        <div><b>T3</b> - Sortie Civil</div>
                        <div><b>T4</b> - Sortie VIP</div>
                        <div><b>T5</b> - File CIVIL → P3</div>
                        <div><b>T6</b> - File VIP → P4</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetriNetGraph;