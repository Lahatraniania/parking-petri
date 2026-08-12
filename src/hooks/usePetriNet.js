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

    // Mettre à jour automatiquement toutes les 5 secondes
    useEffect(() => {
        updateInterval.current = setInterval(() => {
            updateState();
        }, 5000);

        return () => {
            if (updateInterval.current) {
                clearInterval(updateInterval.current);
            }
            petriNet.arreterVerification();
        };
    }, [petriNet]);

    const actions = {
        entrer: (type) => {
            if (type === 'civil') {
                petriNet.entrerCivil();
            } else {
                petriNet.entrerVip();
            }
            updateState();
        },

        sortir: (type, placeId = null) => {
            if (type === 'civil') {
                petriNet.sortirCivil(placeId);
            } else {
                petriNet.sortirVip(placeId);
            }
            updateState();
        },

        modifierPlaces: (type, nouveauTotal) => {
            const success = petriNet.modifierPlaces(type, nouveauTotal);
            if (success) updateState();
            return success;
        },

        reinitialiser: () => {
            const totalCivil = petriNet.civilTotal;
            const totalVip = petriNet.vipTotal;
            const newNet = new PetriNet(totalCivil, totalVip);
            newNet.demarrerVerification();
            setPetriNet(newNet);
            updateState();
        },

        verifierDepassements: () => {
            const depassements = petriNet.verifierDepassementDuree();
            depassements.forEach(d => {
                petriNet.sortieForcee(d.type, d.placeId);
            });
            updateState();
            return depassements;
        }
    };

    return { state, actions, historique };
}