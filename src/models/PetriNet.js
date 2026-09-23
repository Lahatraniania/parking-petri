export class PetriNet {
    constructor(civilTotal = 20, vipTotal = 10) {
        this.places = {
            voitureAttente: 0,        // P0 - Voiture arrivée en attente de choix
            civilLibre: civilTotal,   // P1
            vipLibre: vipTotal,       // P2
            civilOccupe: 0,           // P3
            vipOccupe: 0,             // P4
            fileAttenteCivil: [],     // P5
            fileAttenteVip: []        // P6
        };
        this.civilTotal = civilTotal;
        this.vipTotal = vipTotal;
        this.historique = [];
        this.vehicules = { civil: [], vip: [] };
        this.vehicleCounter = 0;
        this.reservationCounterCivil = 0;
        this.reservationCounterVip = 0;
        this.checkInterval = null;
        this.dureeMax = {
            civil: 8 * 60 * 60 * 1000,
            vip: 10 * 60 * 60 * 1000
        };
    }

    // ===== T0 : Arrivée voiture (source) =====
    arriverVoiture() {
        this.places.voitureAttente++;
        this.ajouterHistorique('Arrivée voiture', `En attente (${this.places.voitureAttente})`);
        return true;
    }

    // ===== T1 : Choix Civil =====
    choisirCivil() {
        if (this.places.voitureAttente <= 0) {
            this.ajouterHistorique('Choix Civil', 'Aucune voiture en attente');
            return false;
        }
        this.places.voitureAttente--;

        if (this.places.civilLibre > 0 && this.places.fileAttenteCivil.length === 0) {
            // Entre directement
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
            this.ajouterHistorique('Choix Civil', `Place ${placeId + 1}`);
            return true;
        } else {
            // Va dans la file CIVIL
            this.places.fileAttenteCivil.push({
                type: 'civil',
                timestamp: Date.now(),
                reservation: ++this.reservationCounterCivil
            });
            this.ajouterHistorique('Choix Civil', `File CIVIL #${this.reservationCounterCivil}`);
            return false;
        }
    }

    // ===== T2 : Choix VIP =====
    choisirVip() {
        if (this.places.voitureAttente <= 0) {
            this.ajouterHistorique('Choix VIP', 'Aucune voiture en attente');
            return false;
        }
        this.places.voitureAttente--;

        if (this.places.vipLibre > 0 && this.places.fileAttenteVip.length === 0) {
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
            this.ajouterHistorique('Choix VIP', `Place ${placeId + 1}`);
            return true;
        } else {
            this.places.fileAttenteVip.push({
                type: 'vip',
                timestamp: Date.now(),
                reservation: ++this.reservationCounterVip
            });
            this.ajouterHistorique('Choix VIP', `File VIP #${this.reservationCounterVip}`);
            return false;
        }
    }

    trouverPlaceLibre(type) {
        if (type === 'civil') {
            const occ = this.vehicules.civil.map(v => v.placeId);
            for (let i = 0; i < this.civilTotal; i++) if (!occ.includes(i)) return i;
        } else {
            const occ = this.vehicules.vip.map(v => v.placeId);
            for (let i = 0; i < this.vipTotal; i++) if (!occ.includes(i)) return i;
        }
        return -1;
    }

    // ===== T3 : Sortie Civil =====
    sortirCivil(placeId = null) {
        if (this.places.civilOccupe > 0) {
            let index = -1;
            if (placeId !== null) {
                index = this.vehicules.civil.findIndex(v => v.placeId === placeId);
            } else {
                index = 0;
            }
            if (index !== -1) {
                const v = this.vehicules.civil[index];
                const d = ((Date.now() - v.heureEntree) / (1000 * 60 * 60)).toFixed(1);
                this.vehicules.civil.splice(index, 1);
                this.places.civilOccupe--;
                this.places.civilLibre++;
                this.ajouterHistorique('Sortie Civil', `Place ${v.placeId + 1} - ${d}h`);
                this.verifierFileAttenteCivil();
                return true;
            }
        }
        return false;
    }

    // ===== T4 : Sortie VIP =====
    sortirVip(placeId = null) {
        if (this.places.vipOccupe > 0) {
            let index = -1;
            if (placeId !== null) {
                index = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            } else {
                index = 0;
            }
            if (index !== -1) {
                const v = this.vehicules.vip[index];
                const d = ((Date.now() - v.heureEntree) / (1000 * 60 * 60)).toFixed(1);
                this.vehicules.vip.splice(index, 1);
                this.places.vipOccupe--;
                this.places.vipLibre++;
                this.ajouterHistorique('Sortie VIP', `Place ${v.placeId + 1} - ${d}h`);
                this.verifierFileAttenteVip();
                return true;
            }
        }
        return false;
    }

    // ===== T5 : File CIVIL → Place =====
    verifierFileAttenteCivil() {
        if (this.places.fileAttenteCivil.length === 0) return;
        const file = this.places.fileAttenteCivil[0];
        if (this.places.civilLibre > 0) {
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
                fromQueue: true
            });
            this.ajouterHistorique('File CIVIL → Place', `#${file.reservation} place ${placeId + 1}`);
            this.verifierFileAttenteCivil();
        }
    }

    // ===== T6 : File VIP → Place =====
    verifierFileAttenteVip() {
        if (this.places.fileAttenteVip.length === 0) return;
        const file = this.places.fileAttenteVip[0];
        if (this.places.vipLibre > 0) {
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
                fromQueue: true
            });
            this.ajouterHistorique('File VIP → Place', `#${file.reservation} place ${placeId + 1}`);
            this.verifierFileAttenteVip();
        }
    }

    verifierDepassementDuree() {
        const now = Date.now();
        const dep = [];
        for (let i = this.vehicules.civil.length - 1; i >= 0; i--) {
            const v = this.vehicules.civil[i];
            if (now - v.heureEntree > this.dureeMax.civil) dep.push({ type: 'civil', placeId: v.placeId });
        }
        for (let i = this.vehicules.vip.length - 1; i >= 0; i--) {
            const v = this.vehicules.vip[i];
            if (now - v.heureEntree > this.dureeMax.vip) dep.push({ type: 'vip', placeId: v.placeId });
        }
        return dep;
    }

    sortieForcee(type, placeId) {
        if (type === 'civil') {
            const idx = this.vehicules.civil.findIndex(v => v.placeId === placeId);
            if (idx !== -1) {
                this.vehicules.civil.splice(idx, 1);
                this.places.civilOccupe--;
                this.places.civilLibre++;
                this.ajouterHistorique('Sortie forcée', `Civil place ${placeId + 1}`);
                this.verifierFileAttenteCivil();
            }
        } else {
            const idx = this.vehicules.vip.findIndex(v => v.placeId === placeId);
            if (idx !== -1) {
                this.vehicules.vip.splice(idx, 1);
                this.places.vipOccupe--;
                this.places.vipLibre++;
                this.ajouterHistorique('Sortie forcée', `VIP place ${placeId + 1}`);
                this.verifierFileAttenteVip();
            }
        }
    }

    modifierPlaces(type, nouveauTotal) {
        if (type === 'civil') {
            const diff = nouveauTotal - this.civilTotal;
            if (diff > 0) this.places.civilLibre += diff;
            else if (diff < 0) {
                if (this.places.civilOccupe > this.civilTotal + diff) return false;
                this.places.civilLibre += diff;
            }
            this.civilTotal = nouveauTotal;
            this.ajouterHistorique('Modification', `civil: ${nouveauTotal}`);
            return true;
        } else if (type === 'vip') {
            const diff = nouveauTotal - this.vipTotal;
            if (diff > 0) this.places.vipLibre += diff;
            else if (diff < 0) {
                if (this.places.vipOccupe > this.vipTotal + diff) return false;
                this.places.vipLibre += diff;
            }
            this.vipTotal = nouveauTotal;
            this.ajouterHistorique('Modification', `VIP: ${nouveauTotal}`);
            return true;
        }
        return false;
    }

    demarrerVerification() {
        if (this.checkInterval) clearInterval(this.checkInterval);
        this.checkInterval = setInterval(() => {
            this.verifierDepassementDuree().forEach(d => this.sortieForcee(d.type, d.placeId));
        }, 60000);
    }

    arreterVerification() {
        if (this.checkInterval) { clearInterval(this.checkInterval); this.checkInterval = null; }
    }

    ajouterHistorique(action, detail) {
        const timestamp = new Date().toLocaleTimeString();
        this.historique.unshift({ timestamp, action, detail });
        if (this.historique.length > 100) this.historique.pop();
    }

    getEtat() {
        const now = Date.now();
        const enrich = (arr) => arr.map(v => ({
            ...v,
            tempsEcoule: ((now - v.heureEntree) / (1000 * 60 * 60)).toFixed(1),
            tempsRestant: Math.max(0, ((v.dureeMax - (now - v.heureEntree)) / (1000 * 60 * 60)).toFixed(1)),
            depasse: (now - v.heureEntree) > v.dureeMax
        }));

        const fileAttente = [
            ...this.places.fileAttenteCivil.map(i => ({ ...i, file: 'civil' })),
            ...this.places.fileAttenteVip.map(i => ({ ...i, file: 'vip' }))
        ];

        return {
            voitureAttente: this.places.voitureAttente,
            civilLibre: this.places.civilLibre,
            vipLibre: this.places.vipLibre,
            civilOccupe: this.places.civilOccupe,
            vipOccupe: this.places.vipOccupe,
            fileAttente,
            fileAttenteCivil: this.places.fileAttenteCivil,
            fileAttenteVip: this.places.fileAttenteVip,
            civilTotal: this.civilTotal,
            vipTotal: this.vipTotal,
            totalPlaces: this.civilTotal + this.vipTotal,
            totalOccupe: this.places.civilOccupe + this.places.vipOccupe,
            totalLibre: this.places.civilLibre + this.places.vipLibre,
            vehicules: { civil: enrich(this.vehicules.civil), vip: enrich(this.vehicules.vip) },
            dureeMax: {
                civil: this.dureeMax.civil / (1000 * 60 * 60),
                vip: this.dureeMax.vip / (1000 * 60 * 60)
            }
        };
    }
}