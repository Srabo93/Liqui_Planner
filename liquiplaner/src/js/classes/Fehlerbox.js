
/**
 * Das Modul 'Fehlerbox' stellt die Klasse 'Fehlerbox' zur Verfuegung
 * @module classes/Fehlerbox
 */

 /**
  * Die Klasse 'Fehler' stellt alle Methoden und Eigenschaften 
  * der Fehlerbox im Eingabeformular (inkl.HTML) zur Verfuegung.
  */
export default class Fehlerbox {

    /**
     * Der Konstruktor generiert bei Instantziierung der Klasse 'Fehler'
     * das HTML einer FEhlerbox anhand der u.g. Parameter und Eigenschaften.
     * @param {String} fehlertext - Einleitungstext der Fehlerbox
     * @param {Array} formular_fehler - Array mit den Namen ('Titel','Typ','Betrag,'Datum')
     * der fehlerhaft ausgefuellten Eingabefelder
     * @property {String} _fehlertext - Einleitungstext der Fehlerbox
     * @property {Array} _formular_fehler - Array mit den Namen ('Titel','Typ','Betrag,'Datum')
     * der fehlerhaft ausgefuellten Eingabefelder
     * @property {Element} _html - das HTML der Fehlerbox
     */
    constructor(fehlertext, formular_fehler) {
        this._fehlertext = fehlertext;
        this._formular_fehler = formular_fehler;
        this._html = this._html_generieren();
    }

    /**
     * Diese private Methode generiert die Fehlerbox HTML fuer das Eingabeformular.
     * @returns {Element} - das Fehlerbox-Element mit all seinen Kindelementen
     */
    _html_generieren() {
        let fehlerbox = document.createElement("div");
        fehlerbox.setAttribute("class", "fehlerbox");

        let fehlertext = document.createElement("span");
        fehlertext.textContent = this._fehlertext;
        fehlerbox.insertAdjacentElement("afterbegin", fehlertext);

        let fehlerliste = document.createElement("ul");
        this._formular_fehler.forEach(fehler => {
            let fehlerlistenpunkt = document.createElement("li");
            fehlerlistenpunkt.textContent = fehler;
            fehlerliste.insertAdjacentElement("beforeend", fehlerlistenpunkt);
        });
        fehlerbox.insertAdjacentElement("beforeend", fehlerliste);

        return fehlerbox;
    }

    /**
     * Diese private Methode entfernt bei Instanziierung einer neuen Fehlerbox eine eventuell bereits
     * bestehende Fehlerbox,
     * hauptsaechlich dafuer genutzt um ein 'stacking' der Fehlermeldung zu vermeiden.
     * Wird in der anzeigen () Methode eingebunden 
     */
    _entfernen() {
        let bestehende_fehlerbox = document.querySelector(".fehlerbox");
        if (bestehende_fehlerbox !== null) {
            bestehende_fehlerbox.remove();
        }
    }

    /**
     * Diese Methode fuegt HTML Element an der richtigen Stelle im Eingabeformular ein 
     * zeigt die Fehlerbox an und aktualisiert oder entfernt bestehende Fehlerboxen
     * mithilfe von this._entfernen()
     */
    anzeigen() {
        this._entfernen();
        let eingabeformular_container = document.querySelector("#eingabeformular-container");
        if (eingabeformular_container !== null) {
            eingabeformular_container.insertAdjacentElement("afterbegin", this._html);
        }
    }

    
}