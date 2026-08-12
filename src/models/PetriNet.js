export class PetriNet {
    constructor(civilTotal = 20, vipTotal = 10) {
        this.places = {
            civilLibre: civilTotal,
            vipLibre: vipTotal,
            civilOccupe: 0,
            vipOccupe: 0,
            fileAttente: []
        };
        this.civilTotal = civilTotal;
        this.vipTotal = vipTotal;
        this.historique = [];

        // Suivi des véhicules stationnés
        this.vehicules = {
            civil: [], // [{id, placeId, heureEntree, dureeMax}]
            vip: []
        };
        this.vehicleCounter = 0;

        // Intervalles de vérification
        this.checkInterval = null;
        this.dureeMax = {
            civil: 8 * 60 * 60 * 1000, // 8 heures en millisecondes
            vip: 10 * 60 * 60 * 1000   // 10 heures en millisecondes
        };
    }

    // Transition T1: Entrée civil
    entrerCivil() {
        if (this.places.civilLibre > 0) {
            this.places.civilLibre--;
            this.places.civilOccupe++;

            const placeId = this.trouverPlaceLibre('civil');
            this.vehicules.civil.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.civil,
                type: 'civil'
            });

            this.ajouterHistorique('Entrée civil', `Place ${placeId + 1}`);
            return true;
        } else {
            this.places.fileAttente.push({ type: 'civil', timestamp: Date.now() });
            this.ajouterHistorique('Entrée civil', 'file d\'attente');
            return false;
        }
    }

    // Transition T2: Entrée VIP
    entrerVip() {
        if (this.places.vipLibre > 0) {
            this.places.vipLibre--;
            this.places.vipOccupe++;

            const placeId = this.trouverPlaceLibre('vip');
            this.vehicules.vip.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.vip,
                type: 'vip'
            });

            this.ajouterHistorique('Entrée VIP', `Place ${placeId + 1}`);
            return true;
        } else {
            this.places.fileAttente.push({ type: 'vip', timestamp: Date.now() });
            this.ajouterHistorique('Entrée VIP', 'file d\'attente');
            return false;
        }
    }

    // Trouver la première place libre
    trouverPlaceLibre(type) {
        if (type === 'civil') {
            const placesOccupees = this.vehicules.civil.map(v => v.placeId);
            for (let i = 0; i < this.civilTotal; i++) {
                if (!placesOccupees.includes(i)) {
                    return i;
                }
            }
        } else {
            const placesOccupees = this.vehicules.vip.map(v => v.placeId);
            for (let i = 0; i < this.vipTotal; i++) {
                if (!placesOccupees.includes(i)) {
                    return i;
                }
            }
        }
        return -1;
    }

    // Transition T3: Sortie civil - PEUT SORTIR DE N'IMPORTE QUELLE PLACE
    sortirCivil(placeId = null) {
        if (this.places.civilOccupe > 0) {
            let index = -1;

            // Si placeId spécifié, sortir de cette place spécifique
            if (placeId !== null) {
                index = this.vehicules.civil.findIndex(v => v.placeId === placeId);
            } else {
                // Sinon, sortir le premier véhicule trouvé
                if (this.vehicules.civil.length === 0) return false;
                index = 0; // Prendre le premier (n'importe lequel)
            }

            if (index !== -1) {
                const vehicule = this.vehicules.civil[index];
                const dureeStationnement = Date.now() - vehicule.heureEntree;
                const dureeHeures = (dureeStationnement / (1000 * 60 * 60)).toFixed(1);

                this.vehicules.civil.splice(index, 1);
                this.places.civilOccupe--;
                this.places.civilLibre++;

                this.ajouterHistorique(
                    'Sortie civil',
                    `Place ${vehicule.placeId + 1} - ${dureeHeures}h`
                );

                this.verifierFileAttente();
                return true;
            }
        }
        this.ajouterHistorique('Sortie civil', 'aucune voiture');
        return false;
    }

    // Transition T4: Sortie VIP - PEUT SORTIR DE N'IMPORTE QUELLE PLACE
    sortirVip(placeId = null) {
        if (this.places.vipOccupe > 0) {
            let index = -1;

            if (placeId !== null) {
                index = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            } else {
                if (this.vehicules.vip.length === 0) return false;
                index = 0; // Prendre le premier (n'importe lequel)
            }

            if (index !== -1) {
                const vehicule = this.vehicules.vip[index];
                const dureeStationnement = Date.now() - vehicule.heureEntree;
                const dureeHeures = (dureeStationnement / (1000 * 60 * 60)).toFixed(1);

                this.vehicules.vip.splice(index, 1);
                this.places.vipOccupe--;
                this.places.vipLibre++;

                this.ajouterHistorique(
                    'Sortie VIP',
                    `Place ${vehicule.placeId + 1} - ${dureeHeures}h`
                );

                this.verifierFileAttente();
                return true;
            }
        }
        this.ajouterHistorique('Sortie VIP', 'aucune voiture');
        return false;
    }

    // Vérifier les dépassements de durée
    verifierDepassementDuree() {
        const maintenant = Date.now();
        let depassements = [];

        // Vérifier les civils
        for (let i = this.vehicules.civil.length - 1; i >= 0; i--) {
            const v = this.vehicules.civil[i];
            const duree = maintenant - v.heureEntree;
            if (duree > this.dureeMax.civil) {
                depassements.push({
                    type: 'civil',
                    placeId: v.placeId,
                    vehiculeId: v.id,
                    duree: (duree / (1000 * 60 * 60)).toFixed(1)
                });
            }
        }

        // Vérifier les VIP
        for (let i = this.vehicules.vip.length - 1; i >= 0; i--) {
            const v = this.vehicules.vip[i];
            const duree = maintenant - v.heureEntree;
            if (duree > this.dureeMax.vip) {
                depassements.push({
                    type: 'vip',
                    placeId: v.placeId,
                    vehiculeId: v.id,
                    duree: (duree / (1000 * 60 * 60)).toFixed(1)
                });
            }
        }

        return depassements;
    }

    // Sortie forcée pour dépassement
    sortieForcee(type, placeId) {
        if (type === 'civil') {
            const index = this.vehicules.civil.findIndex(v => v.placeId === placeId);
            if (index !== -1) {
                this.vehicules.civil.splice(index, 1);
                this.places.civilOccupe--;
                this.places.civilLibre++;
                this.ajouterHistorique('⚠️ Sortie forcée', `Civil place ${placeId + 1} - dépassement`);
                this.verifierFileAttente();
                return true;
            }
        } else {
            const index = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            if (index !== -1) {
                this.vehicules.vip.splice(index, 1);
                this.places.vipOccupe--;
                this.places.vipLibre++;
                this.ajouterHistorique('⚠️ Sortie forcée', `VIP place ${placeId + 1} - dépassement`);
                this.verifierFileAttente();
                return true;
            }
        }
        return false;
    }

    // Vérifier la file d'attente
    verifierFileAttente() {
        if (this.places.fileAttente.length === 0) return;

        const file = this.places.fileAttente[0];
        if (file.type === 'civil' && this.places.civilLibre > 0) {
            this.places.fileAttente.shift();
            this.places.civilLibre--;
            this.places.civilOccupe++;

            const placeId = this.trouverPlaceLibre('civil');
            this.vehicules.civil.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.civil,
                type: 'civil',
                fromQueue: true
            });

            this.ajouterHistorique('File → Place', `Civil place ${placeId + 1}`);
            this.verifierFileAttente();
        } else if (file.type === 'vip' && this.places.vipLibre > 0) {
            this.places.fileAttente.shift();
            this.places.vipLibre--;
            this.places.vipOccupe++;

            const placeId = this.trouverPlaceLibre('vip');
            this.vehicules.vip.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.vip,
                type: 'vip',
                fromQueue: true
            });

            this.ajouterHistorique('File → Place', `VIP place ${placeId + 1}`);
            this.verifierFileAttente();
        }
    }

    // Modifier dynamiquement le nombre de places
    modifierPlaces(type, nouveauTotal) {
        if (type === 'civil') {
            const difference = nouveauTotal - this.civilTotal;
            if (difference > 0) {
                this.places.civilLibre += difference;
            } else if (difference < 0) {
                const placesALiberer = Math.abs(difference);
                if (this.places.civilOccupe > this.civilTotal + difference) {
                    return false;
                }
                this.places.civilLibre += difference;
            }
            this.civilTotal = nouveauTotal;
            this.ajouterHistorique('Modification', `civil: ${nouveauTotal}`);
            return true;
        } else if (type === 'vip') {
            const difference = nouveauTotal - this.vipTotal;
            if (difference > 0) {
                this.places.vipLibre += difference;
            } else if (difference < 0) {
                const placesALiberer = Math.abs(difference);
                if (this.places.vipOccupe > this.vipTotal + difference) {
                    return false;
                }
                this.places.vipLibre += difference;
            }
            this.vipTotal = nouveauTotal;
            this.ajouterHistorique('Modification', `VIP: ${nouveauTotal}`);
            return true;
        }
        return false;
    }

    // Démarrer la vérification automatique
    demarrerVerification() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        this.checkInterval = setInterval(() => {
            const depassements = this.verifierDepassementDuree();
            depassements.forEach(d => {
                this.sortieForcee(d.type, d.placeId);
            });
        }, 60000);
    }

    // Arrêter la vérification
    arreterVerification() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    ajouterHistorique(action, detail) {
        const timestamp = new Date().toLocaleTimeString();
        this.historique.unshift({ timestamp, action, detail });
        if (this.historique.length > 100) {
            this.historique.pop();
        }
    }

    getEtat() {
        const maintenant = Date.now();
        const vehiculesAvecTemps = {
            civil: this.vehicules.civil.map(v => ({
                ...v,
                tempsEcoule: ((maintenant - v.heureEntree) / (1000 * 60 * 60)).toFixed(1),
                tempsRestant: Math.max(0, ((v.dureeMax - (maintenant - v.heureEntree)) / (1000 * 60 * 60)).toFixed(1)),
                depasse: (maintenant - v.heureEntree) > v.dureeMax
            })),
            vip: this.vehicules.vip.map(v => ({
                ...v,
                tempsEcoule: ((maintenant - v.heureEntree) / (1000 * 60 * 60)).toFixed(1),
                tempsRestant: Math.max(0, ((v.dureeMax - (maintenant - v.heureEntree)) / (1000 * 60 * 60)).toFixed(1)),
                depasse: (maintenant - v.heureEntree) > v.dureeMax
            }))
        };

        return {
            civilLibre: this.places.civilLibre,
            vipLibre: this.places.vipLibre,
            civilOccupe: this.places.civilOccupe,
            vipOccupe: this.places.vipOccupe,
            fileAttente: this.places.fileAttente,
            civilTotal: this.civilTotal,
            vipTotal: this.vipTotal,
            totalPlaces: this.civilTotal + this.vipTotal,
            totalOccupe: this.places.civilOccupe + this.places.vipOccupe,
            totalLibre: this.places.civilLibre + this.places.vipLibre,
            vehicules: vehiculesAvecTemps,
            dureeMax: {
                civil: this.dureeMax.civil / (1000 * 60 * 60),
                vip: this.dureeMax.vip / (1000 * 60 * 60)
            }
        };
    }
}