export class PetriNet {
    constructor(civilTotal = 20, vipTotal = 10) {
        this.places = {
            civilLibre: civilTotal,
            vipLibre: vipTotal,
            civilOccupe: 0,
            vipOccupe: 0,
            // Deux files d'attente séparées
            fileAttenteCivil: [],
            fileAttenteVip: []
        };
        this.civilTotal = civilTotal;
        this.vipTotal = vipTotal;
        this.historique = [];

        // Suivi des véhicules stationnés
        this.vehicules = {
            civil: [],
            vip: []
        };
        this.vehicleCounter = 0;
        this.reservationCounterCivil = 0;
        this.reservationCounterVip = 0;

        // Intervalles de vérification
        this.checkInterval = null;
        this.dureeMax = {
            civil: 4 * 60 * 60 * 1000,
            vip: 5 * 60 * 60 * 1000
        };
    }

    // Vérifier si la file d'attente Civil est vide
    isFileAttenteCivilVide() {
        return this.places.fileAttenteCivil.length === 0;
    }

    // Vérifier si la file d'attente VIP est vide
    isFileAttenteVipVide() {
        return this.places.fileAttenteVip.length === 0;
    }

    // Transition T1: Entrée civil - NE DEPEND QUE DE LA FILE CIVIL
    entrerCivil() {
        // Une voiture civile ne peut entrer que si la file d'attente CIVIL est vide
        if (this.places.civilLibre > 0 && this.isFileAttenteCivilVide()) {
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
            // Ajouter à la file d'attente CIVIL
            this.places.fileAttenteCivil.push({
                type: 'civil',
                timestamp: Date.now(),
                reservation: ++this.reservationCounterCivil
            });
            this.ajouterHistorique('Entrée civil', `file CIVIL #${this.reservationCounterCivil}`);
            return false;
        }
    }

    // Transition T2: Entrée VIP - NE DEPEND QUE DE LA FILE VIP
    entrerVip() {
        // Une voiture VIP ne peut entrer que si la file d'attente VIP est vide
        if (this.places.vipLibre > 0 && this.isFileAttenteVipVide()) {
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
            // Ajouter à la file d'attente VIP
            this.places.fileAttenteVip.push({
                type: 'vip',
                timestamp: Date.now(),
                reservation: ++this.reservationCounterVip
            });
            this.ajouterHistorique('Entrée VIP', `file VIP #${this.reservationCounterVip}`);
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

    // Transition T3: Sortie civil
    sortirCivil(placeId = null) {
        if (this.places.civilOccupe > 0) {
            let index = -1;

            if (placeId !== null) {
                index = this.vehicules.civil.findIndex(v => v.placeId === placeId);
            } else {
                if (this.vehicules.civil.length === 0) return false;
                let plusAncien = 0;
                for (let i = 1; i < this.vehicules.civil.length; i++) {
                    if (this.vehicules.civil[i].heureEntree < this.vehicules.civil[plusAncien].heureEntree) {
                        plusAncien = i;
                    }
                }
                index = plusAncien;
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

                // Vérifier uniquement la file CIVIL
                this.verifierFileAttenteCivil();
                return true;
            }
        }
        this.ajouterHistorique('Sortie civil', 'aucune voiture');
        return false;
    }

    // Transition T4: Sortie VIP
    sortirVip(placeId = null) {
        if (this.places.vipOccupe > 0) {
            let index = -1;

            if (placeId !== null) {
                index = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            } else {
                if (this.vehicules.vip.length === 0) return false;
                let plusAncien = 0;
                for (let i = 1; i < this.vehicules.vip.length; i++) {
                    if (this.vehicules.vip[i].heureEntree < this.vehicules.vip[plusAncien].heureEntree) {
                        plusAncien = i;
                    }
                }
                index = plusAncien;
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

                // Vérifier uniquement la file VIP
                this.verifierFileAttenteVip();
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
                this.verifierFileAttenteCivil();
                return true;
            }
        } else {
            const index = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            if (index !== -1) {
                this.vehicules.vip.splice(index, 1);
                this.places.vipOccupe--;
                this.places.vipLibre++;
                this.ajouterHistorique('⚠️ Sortie forcée', `VIP place ${placeId + 1} - dépassement`);
                this.verifierFileAttenteVip();
                return true;
            }
        }
        return false;
    }

    // Vérifier la file d'attente CIVIL uniquement
    verifierFileAttenteCivil() {
        if (this.places.fileAttenteCivil.length === 0) return;

        const file = this.places.fileAttenteCivil[0];

        if (file.type === 'civil' && this.places.civilLibre > 0) {
            this.places.fileAttenteCivil.shift();
            this.places.civilLibre--;
            this.places.civilOccupe++;

            const placeId = this.trouverPlaceLibre('civil');
            this.vehicules.civil.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.civil,
                type: 'civil',
                fromQueue: true,
                reservation: file.reservation
            });

            this.ajouterHistorique('File CIVIL → Place', `Civil #${file.reservation} place ${placeId + 1}`);
            // Continuer à vérifier la file CIVIL
            this.verifierFileAttenteCivil();
        }
    }

    // Vérifier la file d'attente VIP uniquement
    verifierFileAttenteVip() {
        if (this.places.fileAttenteVip.length === 0) return;

        const file = this.places.fileAttenteVip[0];

        if (file.type === 'vip' && this.places.vipLibre > 0) {
            this.places.fileAttenteVip.shift();
            this.places.vipLibre--;
            this.places.vipOccupe++;

            const placeId = this.trouverPlaceLibre('vip');
            this.vehicules.vip.push({
                id: ++this.vehicleCounter,
                placeId: placeId,
                heureEntree: Date.now(),
                dureeMax: this.dureeMax.vip,
                type: 'vip',
                fromQueue: true,
                reservation: file.reservation
            });

            this.ajouterHistorique('File VIP → Place', `VIP #${file.reservation} place ${placeId + 1}`);
            this.verifierFileAttenteVip();
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

        // Fusionner les deux files d'attente pour l'affichage
        const fileAttente = [
            ...this.places.fileAttenteCivil.map(item => ({ ...item, file: 'civil' })),
            ...this.places.fileAttenteVip.map(item => ({ ...item, file: 'vip' }))
        ];

        return {
            civilLibre: this.places.civilLibre,
            vipLibre: this.places.vipLibre,
            civilOccupe: this.places.civilOccupe,
            vipOccupe: this.places.vipOccupe,
            fileAttente: fileAttente,
            fileAttenteCivil: this.places.fileAttenteCivil,
            fileAttenteVip: this.places.fileAttenteVip,
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