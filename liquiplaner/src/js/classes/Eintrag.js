/**
 * Das Modul 'Eintrag' ist fuer den Eintrag der Anwendung zustaendig.
 * @module classes/Eintrag 
 */

import liqui_planner from '../liqui-planner.js';

/**
 * Die Klasse 'Eintrag' stellt alle Methoden und Eigenschaften zur Verfuegung fuer den Eintrag
 * inklusive HTML generierung 
 */

export default class Eintrag {

    /**
     * Der Konstruktor generiert bei Instanziierung der Klasse 'Eintrag'
     * anhand der u.g. Parameter ein Eintrags-Objekt mit den u.g. Eigescnhaften.
     * @param {String} titel - der Titel des Eintrags
     * @param {Number} betrag - der Betrag des Eintrags / ganzzahlig & in cent
     * @param {String} typ - der Typ 'Einnahme' oder 'Ausgabe' 
     * @param {Date} datum - Das Datum des Eintrags
     * @property {String} _titel - der Titel des Eintrags
     * @property {Number} _betrag - der Betrag des Eintrags / ganzzahlig & in cent
     * @property {String} _typ - der Typ 'Einnahme' oder 'Ausgabe' 
     * @property {Date} _datum - Das Datum des Eintrags
     * @property {Number} _timestamp - der Unix-Zeitstempel der Instanziierung des Eintrags (dient als ID)
     * @property {Element} _html - das HTML des Eintrags
     */
    constructor(titel, betrag, typ, datum) {
        this._titel = titel;
        this._betrag = betrag;
        this._typ = typ;
        this._datum = datum;
        this._timestamp = Date.now();
        this._html = this._html_generieren();
    }
    /**
     * Getter Methode fuer den Titel des Eintrags
     * @returns {String} - der Titel des Eintrags.
     */
    titel() {
        return this._titel;
    }
    /**
     * Getter Methode fuer den Betrag des Eintrags
     * @returns {Number} - der Betrag des Eintrags
     */
    betrag() {
        return this._betrag;
    }
    /**
     * Getter Methode fuer den Typ des Eintrags
     * @returns {String} - der Typ des Eintrags
     */
    typ() {
        return this._typ;
    }
    /**
     * Getter Methode fuer das Datum des Eintrags
     * @returns {Date} - das Datum des Eintrags
     */
    datum() {
        return this._datum;
    }
    /**
     * Getter Methode fuer den Unix Zeitstempel timestamp
     * @returns {Number} - timestamp des Eintrags
     */
    timestamp() {
        return this._timestamp;
    }
    /**
     * Getter Methode fuer das HTML Element des Eintrags
     * @returns {Element} - HTML Element des Eintrags
     */
    html() {
        return this._html;
    }

    /**
     * Diese private Methode definiert das Click-Event fuer den Eintrag-Entfernen-Button der Eintragselemente
     * und loest damit das Entfernen eines Eintrags aus dem Haushaltsbuch aus.
     * Sie wird in this._html_generieren() genutzt.
     * @param {Element} listenpunkt 
     */
    _eintrag_entfernen_event_hinzufuegen(listenpunkt) {
        listenpunkt.querySelector(".entfernen-button").addEventListener("click", e => {
            let timestamp = e.target.parentElement.getAttribute("data-timestamp");
            liqui_planner.eintrag_entfernen(timestamp);
        });
    }

    /**
     * Diese private Methode generiert das HTML Element und beinhaltet
     * das Click-Event this._eintrag_entfernen_event_hinzufuegen() per Eintrag Entffernen 'Button'
     * @returns {Element} - Listenpunkt wird im User Interface angezeigt mit Eventfunktion
     */

    _html_generieren() {
        let listenpunkt = document.createElement("li");
        this._typ === "einnahme" ? listenpunkt.setAttribute("class", "einnahme") : listenpunkt.setAttribute("class", "ausgabe");
        listenpunkt.setAttribute("data-timestamp", this._timestamp);

        let datum = document.createElement("span");
        datum.setAttribute("class", "datum");
        datum.textContent = this._datum.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        listenpunkt.insertAdjacentElement("afterbegin", datum);

        let titel = document.createElement("span");
        titel.setAttribute("class", "titel");
        titel.textContent = this._titel;
        datum.insertAdjacentElement("afterend", titel);

        let betrag = document.createElement("span");
        betrag.setAttribute("class", "betrag");
        betrag.textContent = `${(this._betrag / 100).toFixed(2).replace(/\./, ",")} €`;
        titel.insertAdjacentElement("afterend", betrag);

        let button = document.createElement("button");
        button.setAttribute("class", "entfernen-button");
        betrag.insertAdjacentElement("afterend", button);

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-trash");
        button.insertAdjacentElement("afterbegin", icon);

        this._eintrag_entfernen_event_hinzufuegen(listenpunkt);

        return listenpunkt;
    }



}