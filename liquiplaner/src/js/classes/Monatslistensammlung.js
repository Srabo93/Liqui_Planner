/**
 * Das Modul 'Monatslistensammlung' stellt die Klasse 'Monatslistensammlung' zur
 * Verfuegung.
 * @module classes/Monatslistensammlung
 */
import Monatsliste from './Monatsliste.js';

/**
 * Die Klasse 'Monatslistensammlung' stellt die Eigenschaften und Methoden der 
 * Monatslistensammlung (inkl. HTML) zur Verfuegung und verwaltet dabei die
 * einzelnen Monatslisten.
 */

export default class Monatslistensammlung {

    /**
     * Der Konstruktor generiert bei der Instanziierung der klasse 'Monatslistensammlung'
     * einen Monatslistensammlungs-Objekt mit den u.g. Eigenschaften
     * @property {Array} - Sammlung aller Monatslisten
     * @property {Element} - das HTML der Monatslistensammlung
     */
    constructor() {
        this._monatslisten = [];
        this._html = this._html_generieren();
    }

    /**
     * Diese private Methode prueft anhand von Monat und Jahr des Eintrags, ob fuer den 
     * hinzufuegenden Eintrag bereits eine passende Monatsliste in der Monatslistensammlung
     * enthalten ist. Wenn ja, wird der Eitnrag zur entsprechenden Monatsliste hinzugefuegt.
     * Wenn nein, wird mit Hilfe von this._monatsliste_hinzufuegen() eine neue Monatsliste instanziiert,
     * der Eintrag wird zur Monatsliste hinzugefuegt und die Monatsliste wird zur Monatslistensammlung
     * hinzugefuegt.
     * @param {Object} eintrag - ein Eintrags-Objekt 
     */
    _eintrag_hinzufuegen(eintrag) {
        let eintragsmonat = eintrag.datum().toLocaleString("de-DE", {
            month: "numeric"
        });
        let eintragsjahr = eintrag.datum().toLocaleString("de-DE", {
            year: "numeric"
        });
        let monatsliste_vorhanden = false;
        this._monatslisten.forEach(monatsliste => {
            if (eintragsmonat === monatsliste.monat() && eintragsjahr === monatsliste.jahr()) {
                monatsliste.eintrag_hinzufuegen(eintrag);
                monatsliste_vorhanden = true;
            }
        });
        if (!monatsliste_vorhanden) {
            this._monatsliste_hinzufuegen(eintragsjahr, eintragsmonat, eintrag);
        }
    }

    /**
     * Diese private Methode instanziiert anhand von Jahr und Monat eine neue Monatsliste
     * und fuegt den uebergebenen Eintrag zur Monatsliste hinzu. Anschliessend wird die
     * Monatsliste zur Monatslistensammlung (this._monatslisten) hinzugefuegt.
     * @param {Number} jahr - das Jahr zudem die Monatsliste gehoeren soll (z.b. 2020) 
     * @param {*} monat - der Monat zu dem die Monatsliste gehoeren soll (als Zahl, 1-12)
     * @param {*} eintrag - der Eintrag der zur Monatsliste hinzugefuegt werden soll
     */
    _monatsliste_hinzufuegen(jahr, monat, eintrag) {
        let neue_monatsliste = new Monatsliste(jahr, monat);
        neue_monatsliste.eintrag_hinzufuegen(eintrag);
        this._monatslisten.push(neue_monatsliste);
    }

    /**
     * Diese private Methode sortiert die Monatslistensammlung (this._monatslisten) absteigend
     * nach dem Jahr der Monatslisten und innerhalb des Jahres absteigend nach dem Monat der Monatslisten.
     */
    _monatslisten_sortieren() {
        this._monatslisten.sort((monatsliste_a, monatsliste_b) => {
            if (monatsliste_a.jahr() < monatsliste_b.jahr()) {
                return 1;
            } else if (monatsliste_a.jahr() > monatsliste_b.jahr()) {
                return -1;
            } else {
                if (monatsliste_a.monat() < monatsliste_b.monat()) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
    }

    /**
     * Diese private Methode generiert das HTML der Monatslistensammlung.
     * @returns {Element} - das MonatslistenSammlung-Element mit all seinen Kindelementen
     */
    _html_generieren() {
        let monatslisten = document.createElement("section");
        monatslisten.setAttribute("id", "monatslisten");

        this._monatslisten.forEach(monatsliste => {
            monatslisten.insertAdjacentElement("beforeend", monatsliste.html());
        });

        return monatslisten;
    }

    /**
     * Diese Methode aktualisiert die Monatslistensammlung anhand der sich im Haushaltsbuch
     * befindenden Eintraege und zeigt die neu generierte Monatslistensammlung an.
     * @param {Array} eintraege - die Eintraege des Haushaltsbuchs
     */
    aktualisieren(eintraege) {
        this._monatslisten = [];
        eintraege.forEach(eintrag => this._eintrag_hinzufuegen(eintrag));
        this._monatslisten_sortieren();
        this._html = this._html_generieren();
        this.anzeigen();
    }

    /**
     * Diese private Methode entfernt eine bereits bestehende Monatslistensammlung, wenn vorhanden.
     */
    _entfernen(){ 
        let monatslistensammlung = document.querySelector("#monatslisten");
        if (monatslistensammlung !== null) {
                monatslistensammlung.remove();
            }
    }

    /**
     * Diese Methode zeigt die generierte Monatslistensammlung an der richtigen Stelle inder UI an.
     */
    anzeigen() {
        let eingabeformular_container = document.querySelector("#eingabeformular-container");
        if (eingabeformular_container !== null) {
            this._entfernen();
            eingabeformular_container.insertAdjacentElement("afterend", this._html);
        }
    }


}