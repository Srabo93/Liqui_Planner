/**
 * Das Modul 'Haushaltsbuch' stellt die Klasse 'Haushaltsbuch' zur Verfuegung
 * @module classes/Haushaltsbuch
 */

import Navigationsleiste from './Navigationsleiste.js';
import Eingabeformular from './Eingabeformular.js';
import Monatslistensammlung from './Monatslistensammlung.js';
import Gesamtbilanz from './Gesamtbilanz.js';
import Eintrag from './Eintrag.js';

/**
 * Die Klasse 'Haushaltsbuch' stellt alle Methoden und Eigenschaften
 * des Haushaltsbuchs zur Verfuegung. Das Haushaltsbuch enthaelt alle anderen
 * Objekte und fuegt diese zu einer funktionierenden Anwendung zusammen.
 */
export default class Haushaltsbuch {

    /**
     * Der Konstruktor generiert bei der Instanziierung der Klasse 'Haushaltsbuch'
     * alle u.g. Eigenschaften des Haushaltsbuch und instanziiert damit die Bestandteile
     * der Anwendung. Die this._wiederherstellen() Methode stellt bei Instanziierung den bisherigen
     * Zustand des Haushaltsbuches wieder her
     * @property {Array} _eintraege - ein Array mit den Eintrags-Objekten des Haushaltsbuchs
     * @property {Object} _navigationsleiste - Instanziiert die Navigationsleiste
     * @property {Object} _eingabeformular - Instanziiert das Eingabeformular
     * @property {Object} _monatslistensammlung - Instanziiert die Monatslistensammlung
     * @property {Object} _gesamtbilanz - Instanziiert die Gesamtbilanz
     */
    constructor() {
        this._eintraege = [];
        this._navigationsleiste = new Navigationsleiste();
        this._eingabeformular = new Eingabeformular();
        this._monatslistensammlung = new Monatslistensammlung();
        this._gesamtbilanz = new Gesamtbilanz();
        this._wiederherstellen();
    }

    /**
     * Diese Methode instanziiert anhand der im Eingabeformular eingegebenen Daten
     * einen neuen Eintrag und fuegt diesen zur SAmmlung aller Eintraege (this._eintraege) hinzu.
     * Anschliessend wird die Monatslistensammlung & Gesamtbilanz aktualisiert und gespeichert.
     * @param {Object} eintragsdaten - neues Objekt mit den Daten eines Eintrags
     */
    eintrag_hinzufuegen(eintragsdaten) {
        let neuer_eintrag = new Eintrag(
            eintragsdaten.titel, 
            eintragsdaten.betrag, 
            eintragsdaten.typ, 
            eintragsdaten.datum
        );
        this._eintraege.push(neuer_eintrag);
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
        this._speichern();
    }

    /**
     * Diese Methode entfernt Eintraege (this._eintraege) ueber den Timestamp und aktualisiert
     * die Monatslistensammlung und Gesamtbilanz. Das haushaltsbuch wird anschliessend gespeichert.
     * @param {Number} timestamp - der Unix Zeitstempel dient als ID
     */
    eintrag_entfernen(timestamp) {
        let start_index;
        for (let i = 0; i < this._eintraege.length; i++) {
            if (this._eintraege[i].timestamp() === parseInt(timestamp)) {
                start_index = i;
                break;
            }
        }
        this._eintraege.splice(start_index, 1);
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
        this._speichern();
    }

    /**
     * Diese private Methode speichert den aktuellen Zustand des Haushaltsbuchs, indem sie
     * die Sammlung aller Eintraege (this._eintraege) im LocalStorage des Browsers speichert.
     */
    _speichern(){
        localStorage.setItem('eintraege', JSON.stringify(this._eintraege));
    }

    /**
     * Diese private Methode stellt den letzten gespeicherten Zustand des Haushaltsbuchs
     * anhand der im LocalStorage gespeicherten Sammlung aller Eintraege wieder her. 
     * Dies geschieht bei Instanziierung des Haushaltsbuchs, also beim Oeffnen der 
     * Anwendung / Laden der Seite.
     */
    _wiederherstellen(){
        let gespeicherte_eintraege = localStorage.getItem('eintraege');
        if (gespeicherte_eintraege !== null){
            JSON.parse(gespeicherte_eintraege).forEach(eintrag =>{
                this.eintrag_hinzufuegen({
                    titel: eintrag._titel,
                    betrag: eintrag._titel,
                    betrag: eintrag._betrag,
                    typ: eintrag._typ,
                    datum: new Date (eintrag._datum)
                });
            });
        }
    }

    /**
     * Die Methode startet unser Programm und zeigt es im UI
     */
    start() {
        this._navigationsleiste.anzeigen();
        this._eingabeformular.anzeigen();
        this._monatslistensammlung.anzeigen();
        this._gesamtbilanz.anzeigen();
    }

    
}