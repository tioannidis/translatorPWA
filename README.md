# 🌍 Puter Translator - PWA

Ein modernes, KI-gestütztes Übersetzungs- und Textkorrektur-Tool als Progressive Web App (PWA). Die Anwendung nutzt die [Puter.com](https://puter.com) API für KI-Funktionen und läuft außerhalb von puter.com als eigenständige Web-App mit Offline-Unterstützung.

## ✨ Features

### 🔤 Übersetzung
- **Multi-Language Support**: Unterstützt über 40 Sprachen inklusive Deutsch, Englisch, Spanisch, Französisch, Italienisch, Chinesisch, Japanisch, Russisch und viele mehr
- **Bidirektionale Übersetzung**: Einfacher Sprachwechsel mit einem Klick
- **Auto-Übersetzung**: Automatische Übersetzung während der Eingabe mit konfigurierbarer Verzögerung
- **Streaming-Übersetzung**: Live-Anzeige der Übersetzungsergebnisse während der Generierung

### ✏️ Text-Editor (Writer Mode)
- **Grammatik-Korrektur**: Intelligente Korrektur von Grammatik und Stil
- **Text-Umformulierung**: Professionelle Neuformulierung von Texten
- **Sprachspezifische Korrektur**: Angepasste Korrektur für verschiedene Sprachen

### 🎨 Benutzeroberfläche
- **Dark/Light Mode**: Umschaltbare Themes für verschiedene Lichtverhältnisse
- **Responsive Design**: Optimiert für Desktop und mobile Geräte
- **Erweiterte Editoren**: Popup-Editoren für längere Texte
- **Zeichenzähler**: Live-Anzeige der Textlänge
- **Elegant Design**: Moderne Glasmorphismus-Ästhetik mit Farbverläufen

### 💾 Persistenz & Verwaltung
- **Favoriten-System**: Speichern und Verwalten häufig genutzter Übersetzungen
- **Suchfunktion**: Durchsuchen der gespeicherten Favoriten
- **Einstellungen-Persistenz**: Automatisches Speichern aller Benutzereinstellungen
- **KI-Modell Auswahl**: Verschiedene KI-Modelle für optimale Ergebnisse

### ⚡ Benutzerfreundlichkeit
- **Keyboard Shortcuts**: 
  - `Ctrl + Enter`: Übersetzung/Korrektur starten
  - `Ctrl + V`: Automatisches Einfügen mit Auto-Übersetzung
- **Ein-Klick Aktionen**: Schnelles Kopieren, Löschen und Einfügen
- **Zwischenablage Integration**: Nahtlose Integration mit der System-Zwischenablage
- **Visual Feedback**: Animationen und Status-Indikatoren für alle Aktionen

## 🛠️ Technologie Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS mit Flexbox/Grid
- **KI-Backend**: Puter.js AI API
- **Persistenz**: Puter.js File System API
- **Icons**: Unicode Emojis & Custom SVG
- **Styling**: CSS Custom Properties, Gradients, Backdrop Filters

## 🚀 Installation & Setup

### Progressive Web App (PWA) Installation

Die App kann wie eine native App auf deinem Gerät installiert werden:

#### Desktop (Chrome, Edge, etc.)
1. Öffne die App im Browser
2. Klicke auf das Install-Icon in der Adressleiste (⊕) oder
3. Browser-Menü → "App installieren" / "Zur Startseite hinzufügen"
4. Die App erscheint als eigenständige Anwendung

#### Mobile (iOS Safari)
1. Öffne die App in Safari
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Home-Bildschirm"
4. Bestätige mit "Hinzufügen"

#### Mobile (Android Chrome)
1. Öffne die App in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle "App installieren" oder "Zum Startbildschirm hinzufügen"
4. Bestätige die Installation

### Voraussetzungen
- Moderne Browser mit ES6+ und PWA-Support
- Internetverbindung für KI-API Calls (über Puter.com)
- Optional: Puter.com Account für Cloud-Speicherung

### Lokale Entwicklung & Deployment

```bash
# Repository klonen
git clone <repository-url>
cd putertranslator

# Lokalen Server starten (HTTPS für PWA empfohlen)
python -m http.server 8000
# oder
npx serve .

# Im Browser öffnen
open http://localhost:8000
```

### Deployment auf einem Webserver
1. Lade alle Dateien auf deinen Webserver hoch:
   - `index.html`
   - `manifest.json`
   - `sw.js` (Service Worker)
   - `icon.svg`
2. Stelle sicher, dass HTTPS aktiviert ist (erforderlich für PWA)
3. Öffne die URL im Browser
4. Die App kann nun installiert werden

### Puter.com Integration

Die App nutzt die Puter.com API, aber läuft eigenständig:
- Beim ersten Start wirst du gefragt, ob du dich bei Puter.com anmelden möchtest
- Mit Anmeldung: Cloud-Speicherung für Einstellungen und Favoriten
- Ohne Anmeldung: Lokale Speicherung im Browser (localStorage)
- KI-Übersetzungen funktionieren in beiden Modi über die Puter API

## 📁 Projektstruktur

```
putertranslator/
├── index.html          # Haupt-HTML Datei mit eingebettetem CSS/JS
├── manifest.json       # PWA Manifest (App-Metadaten, Icons)
├── sw.js              # Service Worker (Offline-Funktionalität, Caching)
├── icon.svg           # Anwendungs-Icon (SVG für alle Größen)
└── README.md          # Projekt-Dokumentation
```

### PWA Features
- **Service Worker**: Ermöglicht Offline-Zugriff auf die UI
- **Manifest**: Definiert App-Name, Icons und Display-Modus
- **Caching-Strategie**:
  - Cache-first für lokale Assets (HTML, CSS, JS)
  - Network-first für Puter API-Calls
  - Automatische Cache-Verwaltung und Updates

### Code-Organisation (in index.html)
```
├── CSS Styles (~1200 Zeilen)
│   ├── Base Styles & Responsive Layout
│   ├── Component Styles (Buttons, Panels, Popups)
│   ├── Dark Mode Theming
│   └── Animations & Transitions
├── HTML Structure (~400 Zeilen)
│   ├── Header mit Sprachauswahl
│   ├── Translator Panel
│   ├── Writer Panel
│   └── Modal Popups (Favoriten, Editor, Viewer)
└── JavaScript Logic (~500 Zeilen)
    ├── App Initialization
    ├── Settings & Persistence Management
    ├── Translation Engine (Puter AI Integration)
    ├── Writer Functions (Korrektur/Umformulierung)
    ├── UI Management & Event Handling
    └── Favorites System
```

## 🔧 Konfiguration

### Unterstützte Sprachen
Die App unterstützt folgende Sprachen:
- **Europäische Sprachen**: DE, EN, ES, FR, IT, PT, NL, SV, NO, DA, FI, PL, CS, SK, HU, RO, BG, HR, SL, ET, LV, LT
- **Asiatische Sprachen**: ZH, JA, KO, TH, VI, HI, UR, AR, FA
- **Weitere**: RU, UK, TR, HE, SW, AF, MS, TL

### KI-Modelle
Die Anwendung kann verschiedene KI-Modelle verwenden:
- Automatische Modellauswahl basierend auf Puter.js verfügbaren Modellen
- Streaming-Unterstützung für Live-Übersetzungen
- Konfigurierbare Modellpersistenz

### Persistierte Daten
- **Settings**: `translator-settings.json`
  - Gewählte Sprachen
  - Theme-Präferenz
  - Auto-Translate Status
  - Ausgewähltes KI-Modell
- **Favorites**: `translation-favorites.json`
  - Gespeicherte Übersetzungspaare
  - Metadaten (Datum, Sprachen)
  - Suchbare Inhalte

## 💡 Verwendung

### Übersetzung
1. **Sprachen wählen**: Quell- und Zielsprache in den Dropdown-Menüs auswählen
2. **Text eingeben**: Text in das linke Eingabefeld eingeben
3. **Übersetzen**: 
   - Automatisch (bei aktivierter Auto-Übersetzung)
   - Manuell mit "Übersetzen"-Button oder `Ctrl + Enter`
4. **Ergebnis verwenden**: 
   - Text kopieren mit "Kopieren"-Button
   - Als Favorit speichern mit dem Stern-Symbol

### Text-Korrektur (Writer Mode)
1. **Writer Tab wählen**: Auf "Writer" in der Tab-Leiste klicken
2. **Sprache auswählen**: Sprache für die Korrektur festlegen
3. **Text eingeben**: Zu korrigierenden Text eingeben
4. **Korrigieren/Umformulieren**:
   - "Korrigieren" für grammatikalische Korrekturen
   - "Umformulieren" für stilistische Verbesserungen

### Erweiterte Features
- **Großer Editor**: 🔍-Symbol für erweiterte Eingabe verwenden
- **Favoriten**: ⭐-Button zum Verwalten gespeicherter Übersetzungen
- **Theme wechseln**: 🌙/☀️-Button für Dark/Light Mode
- **Zwischenablage**: 📋-Button zum schnellen Einfügen

## 🎯 Anwendungsfälle

- **Professionelle Übersetzung**: Business-Dokumente und E-Mails
- **Sprachlernen**: Übersetzung unbekannter Texte
- **Content Creation**: Mehrsprachige Inhalte erstellen
- **Textverbesserung**: Grammatik und Stil korrigieren
- **Internationale Kommunikation**: Schnelle Übersetzungen im Chat

## 🔒 Sicherheit & Datenschutz

- **Hybride Speicherung**:
  - Mit Puter-Login: Cloud-Speicherung über Puter.js File System
  - Ohne Login: Lokale Speicherung im Browser (localStorage)
- **Keine externe Datenübertragung**: Nur KI-API Calls für Übersetzungen an Puter.com
- **Temporäre Verarbeitung**: Texte werden nur für die Übersetzung verarbeitet
- **Benutzer-Kontrolle**: Vollständige Kontrolle über gespeicherte Favoriten
- **Offline-Fähigkeit**: UI funktioniert offline, nur KI-Features benötigen Internet

## 🐛 Troubleshooting

### Häufige Probleme
- **Übersetzung funktioniert nicht**: Internetverbindung und Puter.js API Status prüfen
- **Einstellungen werden nicht gespeichert**: Browser-Berechtigungen für lokale Speicherung prüfen
- **Dark Mode bleibt nicht aktiv**: Lokale Storage-Berechtigung überprüfen

### Browser-Unterstützung
- **Chrome/Edge**: Vollständig unterstützt
- **Firefox**: Vollständig unterstützt
- **Safari**: Vollständig unterstützt (iOS 12+)
- **Mobile Browser**: Responsive Design optimiert

## 🤝 Beitragen

Dieses Projekt ist offen für Beiträge:

1. **Issues**: Bugs und Feature-Requests über GitHub Issues melden
2. **Pull Requests**: Verbesserungen und neue Features einreichen
3. **Übersetzungen**: Zusätzliche Sprachen hinzufügen
4. **UI/UX**: Design-Verbesserungen vorschlagen

## 📄 Lizenz

Dieses Projekt steht unter einer offenen Lizenz. Details siehe Lizenz-Datei im Repository.

## 🙏 Danksagungen

- **Puter.js**: Für die großartige Cloud-Computing-Plattform
- **KI-Models**: Für leistungsstarke Übersetzungsfähigkeiten
- **Community**: Für Feedback und Verbesserungsvorschläge

---

**Version**: 1.0.0 | **Status**: Aktiv entwickelt | **Sprache**: Deutsch

Entwickelt mit ❤️ für die Puter.js Community