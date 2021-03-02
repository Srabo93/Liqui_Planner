/**
 * Das Modul 'Eingabeformular' ist fuer das Eingabeformular der Anwendung zustaendig.
 * @module classes/Eingabeformular
 */

import Fehlerbox from './Fehlerbox.js';
import liqui_planner from '../liqui-planner.js';

/**
 * Die Klasse 'Eingabeformular' stellt alle Eigenschaften und Methoden
 * des Eingabeformulars (inkl. HTML und Events) zur Verfuegung.
 */
export default class Eingabeformular {
    
    /**
     * Der Konstruktor generiert bei Instanziierung der Klasse 'Eingabeformular'
     * das HTML des Eingabeformulars.
     * @property {Element} _html - das HTML des Eingabeformulars
     */
    constructor() {
        this._html = this._html_generieren();
    }
    /**
     * Diese private Methode extrahiert die im Eingabeformular eingegebenen Daten aus
     * dem Submit-Event des Eingabeformulars.
     * @param {Event} submit_event  -  das Submit-Event des Eingabeformulars
     * @returns {Object} - einfaches Objekt mit den Rohdaten des Eingabeformulars
     */
    _formulardaten_holen(submit_event) {
        return {
            titel: submit_event.target.elements.titel.value,
            betrag: submit_event.target.elements.betrag.value,
            einnahme: submit_event.target.elements.einnahme.checked,
            datum: submit_event.target.elements.datum.valueAsDate
        }
    }
    /**
     * Diese private Methode verarbeitet die durch this._formulardaten_holen() zur
     * Verfuegung gestellten Formulardaten.
     * @param {Object} formulardaten - einfaches Objekt mit den rohen Formulardaten
     * @returns {Object} - einfaches Objekt mit verarbeiteten Formulardaten.
     */
    _formulardaten_verarbeiten(formulardaten) {
        return {
            titel: formulardaten.titel.trim(),
            typ: formulardaten.einnahme === false ? "ausgabe" : "einnahme",
            betrag: parseFloat(formulardaten.betrag) * 100,
            datum: formulardaten.datum
        }
    }
    /**
     * Diese private Methode validiert die durch this._formulardaten_verarbeiten() 
     * zur Verfuegung gestellten Formulardaten.
     * @param {Object} formulardaten - einfaches Objekt mit den verarbeiteten Formulardaten 
     * @returns - ein Array mit den Namen der Eingabefelder fuer die Validierungsfehler
     */
    _formulardaten_validieren(formulardaten) {
        let fehler = [];
        if (formulardaten.titel === "") {
            fehler.push("Titel");
        }
        if (isNaN(formulardaten.betrag)) {
            fehler.push("Betrag");
        }
        if (formulardaten.datum === null) {
            fehler.push("Datum");
        }
        return fehler;
    }
    /**
     * Diese private Methode aktualisiert das Datum des Date-Inputs im Eingabeformular
     * (z.B. beim oeffnen der Seite / oder nach erfolgreichem Hinzufuegen eines Eintrags zum Haushaltsbuch)
     * und wird dementsprechend in this._absenden_event_hinzufuegen() und this._html_generieren() genutzt.
     */
    _datum_aktualisieren() {
        let datums_input = document.querySelector("#datum");
        if (datums_input !== null) {
            datums_input.valueAsDate = new Date();
        }
    }
    /**
     * Diese private Methode definiert das Submit-Event fuer das Eingabeformular und handhabt
     * die gesamte Logik.
     * beim Absenden des Eingabeformulars (inkl. Verarbeitung und Validierung der Formulardaten)
     * @param {Element} eingabeformular - das Eingabeformular-Element, fuer welches das Submit-Event
     * hinzugefuegt wird
     */
    _absenden_event_hinzufuegen(eingabeformular) {
        eingabeformular.querySelector("#eingabeformular").addEventListener("submit", event => {
            event.preventDefault();
            let formulardaten = this._formulardaten_verarbeiten(this._formulardaten_holen(event));
            let formular_fehler = this._formulardaten_validieren(formulardaten);
            if (formular_fehler.length === 0) {
                liqui_planner.eintrag_hinzufuegen(formulardaten);
                let bestehende_fehlerbox = document.querySelector(".fehlerbox");
                if (bestehende_fehlerbox !== null) {
                    bestehende_fehlerbox.remove();
                }
                event.target.reset();
                this._datum_aktualisieren();
            } else {
                let fehler = new Fehlerbox("Folgende Felder wurden nicht korrekt ausgefüllt:", formular_fehler);
                fehler.anzeigen();
            }   
        });
    }

    /**
     * Diese private Methode generiert das HTML des Eingabeformulars und setzt das 
     * Submit-Event mithilfe der Methode this._absenden_event_hinzufuegen().
     * @returns {Element} - das Eingabeformular-Element mit all seinen Kindelementen und dem Submit-Event.
     */
    _html_generieren() {
        let eingabeformular = document.createElement("section");
        eingabeformular.setAttribute("id", "eingabeformular-container");
        eingabeformular.innerHTML = `<form id="eingabeformular" action="#" method="get"></form>
        <div class="eingabeformular-zeile">
            <h1>Neue Einnahme / Ausgabe hinzufügen</h1>
        </div>
        <div class="eingabeformular-zeile">
            <div class="titel-typ-eingabe-gruppe">
                <label for="titel">Titel</label>
                <input type="text" id="titel" form="eingabeformular" name="titel" placeholder="z.B. Einkaufen" size="10" title="Titel des Eintrags">
                <input type="radio" id="einnahme" name="typ" value="einnahme" form="eingabeformular" title="Typ des Eintrags">
                <label for="einnahme" title="Typ des Eintrags">Einnahme</label>
                <input type="radio" id="ausgabe" name="typ" value="ausgabe" form="eingabeformular" title="Typ des Eintrags" checked>
                <label for="ausgabe" title="Typ des Eintrags">Ausgabe</label>
            </div>
        </div>
        <div class="eingabeformular-zeile">
            <div class="betrag-datum-eingabe-gruppe">
                <label for="betrag">Betrag</label>
                <input type="number" id="betrag" name="betrag" form="eingabeformular" placeholder="z.B. 10,42" size="10" step="0.01" min="0" title="Betrag des Eintrags (max. zwei Nachkommastellen, kein €-Zeichen)">
                <label for="datum">Datum</label>
                <input type="date" id="datum" name="datum" form="eingabeformular" size="10" title="Datum des Eintrags">
            </div>
        </div>
        <div class="eingabeformular-zeile">
            <button class="standard" type="submit" form="eingabeformular">Hinzufügen</button>
        </div>`;

        this._absenden_event_hinzufuegen(eingabeformular);

        return eingabeformular;
    }
    
    /**
     * Diese Methode zeigt das generierte Eingabeformular an der richtigen Stelle im User Interface an.
     */
    anzeigen() {
        let navigationsleiste = document.querySelector("#navigationsleiste");
        if (navigationsleiste !== null) {
            navigationsleiste.insertAdjacentElement("afterend", this._html);
            this._datum_aktualisieren();
        }      
    }

    
}