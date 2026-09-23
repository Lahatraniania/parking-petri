import { useState, useEffect, useRef } from 'react';
import { PetriNet } from '../models/PetriNet';

export function usePetriNet() {
    const [petriNet, setPetriNet] = useState(() => {
        const net = new PetriNet(20, 10);
        net.demarrerVerification();
        return net;
    });

    const [state, setState] = useState(() => petriNet.getEtat());
    const [historique, setHistorique] = useState([]);
    const updateInterval = useRef(null);

    const updateState = () => {
        setState(petriNet.getEtat());
        setHistorique([...petriNet.historique]);
    };

    useEffect(() => {
        updateInterval.current = setInterval(updateState, 5000);
        return () => {
            if (updateInterval.current) clearInterval(updateInterval.current);
            petriNet.arreterVerification();
        };
    }, [petriNet]);

    const actions = {
        // T0 : Arrivée d'une voiture
        arriver: () => { petriNet.arriverVoiture(); updateState(); },
        // T1 : Choix Civil
        choisirCivil: () => { petriNet.choisirCivil(); updateState(); },
        // T2 : Choix VIP
        choisirVip: () => { petriNet.choisirVip(); updateState(); },
        // T3 : Sortie Civil
        sortirCivil: (placeId = null) => { petriNet.sortirCivil(placeId); updateState(); },
        // T4 : Sortie VIP
        sortirVip: (placeId = null) => { petriNet.sortirVip(placeId); updateState(); },
        modifierPlaces: (type, n) => { const ok = petriNet.modifierPlaces(type, n); if (ok) updateState(); return ok; },
        reinitialiser: () => {
            const tc = petriNet.civilTotal, tv = petriNet.vipTotal;
            const newNet = new PetriNet(tc, tv);
            newNet.demarrerVerification();
            setPetriNet(newNet);
            updateState();
        }
    };

    return { state, actions, historique };
}