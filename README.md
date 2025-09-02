# Mathis Neuhaus Portfolio - Finder Interface (Version 3)

Ein hochentwickeltes Portfolio-Interface im Stil des macOS Finders, das Mathis Neuhaus' Arbeiten präsentiert. Die dritte Version wurde erheblich erweitert und verfeinert.

## 🚀 Technologien

### Frontend
- **Vanilla JavaScript (ES6+)** - 1288 Zeilen hochoptimierter Code ohne Frameworks
- **CSS3** - Erweiterte Skeuomorphismus-Effekte mit Schatten und Inset-Borders
- **HTML5** - Semantisches Markup mit Overlay-System

### Backend
- **Kirby CMS 5.0** - File-basiertes Content Management System (neueste Version)
- **PHP 8.1+** - Server-side Logic mit erweiterten Memory-Settings
- **Composer** - Dependency Management

### APIs
- **REST API** - Kirby's eingebaute API mit umfangreichen Custom Endpoints

## 📁 Projektstruktur

```
mathisneuhaus_03/
├── assets/
│   ├── css/
│   │   └── main.css (Skeuomorphismus-Design)
│   ├── js/
│   │   └── finder.js (1288 Zeilen)
│   ├── fonts/
│   │   └── KarlST_Regular.* (Custom Font)
│   └── icons/ (SVG Icon-Set)
├── content/
│   ├── 1_copywriting/ bis 9_about/ (Strukturierte Inhaltsbereiche)
│   └── _desktop-images/ (Hidden Desktop Backgrounds)
├── kirby/ (CMS Core v5.0)
└── site/
    ├── blueprints/ (Content-Struktur Definitionen)
    ├── config/config.php (Erweiterte API-Routen)
    ├── plugins/ (Custom Plugins)
    ├── snippets/finder.php (Haupt-HTML-Struktur)
    └── templates/default.php (Minimales Template)
```

## 🔧 Wie es funktioniert

### 1. **Content Management (Kirby CMS 5.0)**
- Strukturierte Content-Verwaltung über Ordner und Textdateien
- **Blueprints** definieren Feldstrukturen und Workflows
- **Templates** für verschiedene Content-Typen (folder, textfile, externallink, about, desktop-images)
- **Hover-Images** für Ordner mit Vererbungsfunktion
- **Panel-Interface** für einfache Content-Bearbeitung

### 2. **API Layer (PHP)**
Erweiterte API-Endpunkte in `config.php`:
- `/api/content` - Hauptnavigation (Root-Level)
- `/api/content/(:all)` - Dynamische Ordnerstruktur
- `/api/about` - About-Seite mit Kontaktdaten
- `/api/desktop-images` - Zufällige Desktop-Hintergründe
- `/api/textfile-content/(:all)` - Volltext-Content für Overlays

### 3. **Frontend (Vanilla JavaScript)**
Das komplexe Herzstück mit 1288 Zeilen Code:

#### **State Management**
- `columns[]` - Aktuelle Spalten-Struktur
- `clickedPath[]` - Navigation-Pfad
- `activeColumnIndex/activeItemIndex` - Keyboard Navigation
- `currentOverlayItems[]` - Overlay-Navigation

#### **Navigation & Routing**
- **Browser History API** (`pushState`, `popstate`) für Deep-Linking
- **Multi-Column Navigation** wie macOS Finder
- **Keyboard Navigation** (Pfeiltasten, Enter, ESC)
- **Mobile Scroll-Snapping** für Touch-Geräte

#### **Hover-System**
- **Cross-Fade Hover-Images** mit dualen Layern
- **Verzögertes Ausblenden** (50ms) für sanfte Übergänge
- **Mobile/Desktop Detection** - Hover nur auf Desktop
- **Preloading** von Folder-Images für Performance

#### **Overlay-System**
- **Image Overlay** mit Srcset-Unterstützung
- **Text Overlay** mit Kirby-Link-Syntax-Parsing
- **About Overlay** mit Slide-Down Animation
- **Cross-Overlay Navigation** (Pfeiltasten zwischen Bildern/Texten)

#### **Performance-Optimierungen**
- **Dynamische Textkürzung** basierend auf verfügbarer Breite
- **Intelligentes Preloading** von Bildern und Hover-Images
- **Responsive Image Loading** mit optimalen Größen pro Viewport
- **Anti-Flicker Navigation** - nahtlose Spalten-Übergänge
- **Optimierte Thumbnails** (80px für 40px Anzeige)
- **Debounced Window Resize** Events
- **Memory-optimierte DOM-Manipulation**

## 🎯 Features

### ✅ Neu Implementiert (Version 3)
- [x] **Skeuomorphismus Design** - Realistische Schatten und Inset-Borders
- [x] **Cross-Fade Hover-Images** - Sanfte Übergänge zwischen Hover-Bildern
- [x] **Erweiterte Keyboard Navigation** - Vollständige Tastatursteuerung
- [x] **Mobile Touch-Optimierung** - Snap-Scrolling und Touch-Events
- [x] **Overlay-Navigation** - Navigation zwischen Bildern/Texten mit Pfeiltasten
- [x] **Dynamische Textkürzung** - Intelligente Dateinamen-Anpassung
- [x] **Performance-Monitoring** - Optimierte Render-Performance
- [x] **Kirby 5.0 Integration** - Neueste CMS-Version
- [x] **Custom Font Integration** - Karl Font für einheitliches Design
- [x] **Enhanced API Routes** - Erweiterte Backend-Funktionalität

### ✅ Performance-Optimierungen (August 2025)
- [x] **Anti-Flicker Navigation** - Spalten-Wechsel ohne visuelles Flackern
- [x] **About-Scroll Reset** - Automatisches Zurücksetzen der Scroll-Position (on-open)
- [x] **Optimierte Thumbnails** - 80px statt 300px für 40px Anzeige (75% weniger Daten)
- [x] **Responsive Overlay-Images** - Intelligente Bildgrößen basierend auf Viewport
- [x] **Enhanced Hover-Preloading** - Vorwegnahme von Hover- und Overlay-Bildern (nur Desktop)
- [x] **Smart Item-Sortierung** - Textdateien oben, alphabetische Sortierung
- [x] **80% Inset Hover-Images** - Optional kleinere Hover-Bilder ohne Border
- [x] **Große Bild-Optimierung** - Automatische Größenanpassung für 5MB+ Dateien

### ✅ Bug-Fixes & Weitere Optimierungen (August 2025)
- [x] **Green Highlight Bug** - Korrekte active-path Verwaltung behoben
- [x] **Intelligentes Preloading** - Nur notwendige Bilder werden vorgeladen
- [x] **Asynchrones Loading** - UI öffnet sofort, Preloading erfolgt im Hintergrund
- [x] **4G Performance** - Gedrosseltes, gestaffeltes Laden für langsame Verbindungen
- [x] **Network Monitoring** - Debugging-Tools für Performance-Analyse
- [x] **Mobile Hover-Caching Fix** - Hover-Bilder werden auf Mobile nicht mehr geladen
- [x] **Text-Overlay Mobile Fix** - Sofortiges Loading und korrekte Größe
- [x] **Blueprint Cleanup** - Entfernung der inherit hover image Option

### ✅ Bestehende Features (Erweitert)
- [x] Multi-Column Finder Navigation
- [x] Dynamisches Laden von Inhalten via API
- [x] State Management mit Browser History API (URLs & Deep Linking)
- [x] "About"-Seite als Overlay mit Slide-Animation
- [x] Bild- und Text-Overlays mit verbesserter UX
- [x] Custom Hover-Effekte für Ordner mit Vererbung
- [x] Responsive Design mit Touch-Support
- [x] Kirby CMS Integration mit Panel-Workflow

## 🔄 Wesentliche Verbesserungen

### **Code-Qualität**
- **1288 Zeilen** hochoptimierter JavaScript-Code
- **Modulare Architektur** mit klarer Funktions-Trennung
- **Error Handling** und Fallback-Mechanismen
- **Cross-Browser Kompatibilität**

### **User Experience**
- **Sanfte Animationen** und Übergänge
- **Intelligente Hover-States** nur auf Desktop
- **Mobile-First Responsive Design**
- **Accessibility-Features** (Keyboard Navigation, ESC-Handling)

### **Performance**
- **Preloading-Strategien** für Bilder
- **Debounced Events** für bessere Performance
- **Memory-optimierte DOM-Updates**
- **Lazy Loading** von Content

## 📋 Installation & Setup

### Voraussetzungen
- PHP 8.1+ mit erweiterten Memory-Settings
- Composer
- Webserver (Apache/Nginx)

### Installation
```bash
# Repository klonen
git clone [repository-url] mathisneuhaus_03

# Dependencies installieren
composer install

# Webserver starten (für lokale Entwicklung)
composer start
```

### Konfiguration
- **Memory Settings** in `index.php` anpassen
- **API Routes** in `site/config/config.php` erweitern
- **Content Structure** über Kirby Panel verwalten

## 🛠 Entwicklung

### Dateistruktur für Entwickler
- **Hauptlogik**: `assets/js/finder.js` (1288 Zeilen)
- **Styling**: `assets/css/main.css` (Skeuomorphismus)
- **HTML-Struktur**: `site/snippets/finder.php`
- **API-Routen**: `site/config/config.php`
- **Content-Blueprints**: `site/blueprints/`

### Performance-Monitoring
- JavaScript Console für Debugging
- Memory Usage Tracking
- Image Preloading Status
- API Response Times

---

Die Website ist ein hochentwickeltes, production-ready Portfolio-System mit professionellen UX-Standards und optimaler Performance für alle Geräte.

## 🔄 Performance-Updates (August 2025)

### Behobene Probleme:
1. **Spalten-Flackern eliminiert** - Navigation erfolgt jetzt nahtlos ohne visuelle Unterbrechungen
2. **About-Seite Scroll-Reset** - Scroll-Position wird beim Öffnen automatisch zurückgesetzt
3. **Thumbnail-Optimierung** - 75% weniger Datenverbrauch durch 80px statt 300px Thumbnails
4. **Responsive Overlay-Images** - Bilder werden optimal für aktuelles Viewport geladen
5. **Enhanced Hover-Performance** - Proaktives Preloading von Hover-Images (nur Desktop)
6. **Intelligente Sortierung** - Textdateien werden priorisiert, alphabetische Ordnung
7. **Green Highlight Bug** - Mehrfache grüne Markierungen in derselben Ebene behoben
8. **4G Performance** - Massive Verbesserung durch intelligentes, gestaffeltes Preloading
9. **80% Inset Hover-Option** - Optionale kleinere Hover-Bilder ohne Border-Frame
10. **Große Datei-Optimierung** - Automatische Größenanpassung für Bilder >5MB
11. **Mobile Hover-Caching Fix** - Hover-Bilder werden auf Mobile nicht mehr unnötig geladen
12. **Text-Overlay Mobile Fixes** - Sofortiges Loading mit korrekter Container-Größe
13. **Mobile/iPad Zentrierung Fix** - Robuste vertikale Zentrierung für alle Bildschirmgrößen ≤1024px
14. **Spalten-Stabilität & Smart Ellipsis** - Verhindert ruckartige Verschiebungen, intelligente Mitte-Kürzung

### Technische Details:
- **Fetch-before-Remove Pattern** für flicker-freie Navigation
- **Viewport-basierte Bildgrößen** mit Device Pixel Ratio
- **Optimiertes Thumbnail-Srcset** für kleine Darstellungen
- **Smart Preloading-Strategien** für bessere Responsezeiten (Desktop-only)
- **Corrected State Management** für konsistente active-path Anzeige
- **Asynchronous Image Loading** mit priorisierten Batches
- **Network-Aware Loading** mit Connection API für optimale Performance
- **Throttled Preloading** (3+7 Bilder gestaffelt über 500ms+200ms)
- **Adaptive Image Loading** für große Dateien (800px/1200px/1920px je nach Viewport)
- **Mobile-First Optimizations** (keine Hover-Preloads, optimierte Container-Größen)

**Letzte Aktualisierung**: 28. August 2025
