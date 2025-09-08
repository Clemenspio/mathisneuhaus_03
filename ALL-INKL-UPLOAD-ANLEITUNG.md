# 🚀 All-Inkl Upload Anleitung - Mathis Neuhaus Portfolio

## ✅ Vorbereitung abgeschlossen

Die folgenden Dateien wurden bereits für All-Inkl optimiert:
- ✅ `.htaccess` - optimiert für Shared Hosting
- ✅ `robots.txt` - Crawl-Delay und Domain angepasst
- ✅ `config.php` - Debug deaktiviert, Performance optimiert

---

## 📋 1. FINALE VORBEREITUNG

### Diese Dateien NICHT hochladen:
```
❌ .git/                    # Git Repository
❌ .gitignore              # Git Ignore
❌ .htaccess-all-inkl      # Alte Test-Datei (bereits gelöscht)
❌ .htaccess-minimal       # Alte Test-Datei (bereits gelöscht)  
❌ api.php                 # Alte Test-Datei (bereits gelöscht)
❌ test-all-inkl.php       # Alte Test-Datei (bereits gelöscht)
❌ composer.lock           # Kann Pfade preisgeben
❌ ALL-INKL-UPLOAD-ANLEITUNG.md  # Diese Anleitung
❌ server-upload-guide.md  # Development-Anleitung
```

### Diese Dateien/Ordner hochladen:
```
✅ assets/                 # CSS, JS, Fonts, Icons
✅ content/                # Alle Inhalte
✅ kirby/                  # Kirby CMS System
✅ media/                  # Generierte Thumbnails (leer am Anfang)
✅ site/                   # Templates, Blueprints, Config
✅ .htaccess               # Optimierte Version
✅ composer.json           # Abhängigkeiten
✅ index.php               # Hauptdatei
✅ robots.txt              # SEO-optimiert
✅ set-permissions.sh      # Berechtigungs-Script
```

---

## 🌐 2. ALL-INKL VORBEREITUNG

### Domain & Hosting prüfen:
1. **All-Inkl KAS Login**: https://kas.all-inkl.com/
2. **Domain konfigurieren**: mathisneuhaus.com → /
3. **PHP Version**: Mind. PHP 8.0 einstellen
4. **SSL**: Aktivieren (Let's Encrypt)

### FTP-Zugangsdaten notieren:
- **Server**: mathisneuhaus.com (oder FTP-Server von All-Inkl)
- **Benutzername**: Dein FTP-Username
- **Passwort**: Dein FTP-Passwort
- **Port**: 21 (FTP) oder 22 (SFTP)

---

## 📁 3. UPLOAD VIA CYBERDUCK 🦆

### Cyberduck Setup:
1. **Cyberduck öffnen**
2. **"Neue Verbindung"** (+ Symbol oben links)
3. **Verbindungstyp**: FTP oder SFTP wählen
4. **Server**: `mathisneuhaus.com` (oder FTP-Server von All-Inkl)
5. **Benutzername**: Dein All-Inkl FTP-Username
6. **Passwort**: Dein All-Inkl FTP-Passwort
7. **Verbinden** klicken

### Upload-Prozess:
1. **Server-Seite**: Navigiere zu deinem Webroot (meist `/` oder `/html/`)
2. **Lokale Dateien**: 
   - **Drag & Drop** aus Finder in Cyberduck ODER
   - **"Hochladen"** Button → Ordner auswählen
3. **Alle Ordner/Dateien hochladen** (außer ❌ markierte):
   ```
   ✅ assets/         ← Drag & Drop
   ✅ content/        ← Drag & Drop  
   ✅ kirby/          ← Drag & Drop
   ✅ site/           ← Drag & Drop
   ✅ .htaccess       ← Einzeln hochladen
   ✅ index.php       ← Einzeln hochladen
   ✅ robots.txt      ← Einzeln hochladen
   ✅ composer.json   ← Einzeln hochladen
   ```

### 💡 Cyberduck Tipps:
- **Transfer-Fenster**: Zeigt Upload-Fortschritt
- **Gleichzeitige Uploads**: Mehrere Ordner gleichzeitig ziehen
- **Versteckte Dateien**: Menü → Darstellung → "Versteckte Dateien anzeigen"
- **Wieder hochladen**: Automatisch nachfragen bei Duplikaten

### Alternative: Andere FTP-Programme
- **FileZilla**: Kostenlos, für Windows/Mac/Linux
- **Terminal/Command Line**: Für Fortgeschrittene

### ⏱️ Upload-Zeit
- **Geschätzte Dauer**: 15-30 Minuten
- **Größe**: Ca. 50-80 MB (abhängig von Content)

---

## 🔐 4. BERECHTIGUNGEN SETZEN

### 🦆 Mit Cyberduck + Script (EMPFOHLEN):

#### **Methode 1: Automatisches Script (EINFACH)**

1. **Script hochladen**: `set-permissions.sh` mit Cyberduck hochladen
2. **Script ausführbar machen**:
   - **Rechtsklick** auf `set-permissions.sh` → **"Info"**
   - **Berechtigung**: `755` eingeben (damit es ausführbar wird)
3. **All-Inkl SSH aktivieren** (im KAS unter "SSH-Zugänge")
4. **Terminal öffnen** (Mac: Programme → Terminal)
5. **SSH-Verbindung**:
   ```bash
   ssh dein-username@mathisneuhaus.com
   # Passwort eingeben
   ```
6. **Script ausführen**:
   ```bash
   cd /html/                    # Zum Website-Ordner
   ./set-permissions.sh         # Script starten
   ```
7. **Fertig!** 🎉 Alle Berechtigungen sind automatisch richtig gesetzt

#### **Methode 2: Manuell in Cyberduck (ohne SSH)**

**🎯 GENAU DIESE SCHRITTE (Kirby Community Empfehlung):**

1. **Nach Upload** in Cyberduck bleiben - Server-Seite zeigt deine Website
2. **Zuerst diese 4 kritischen Ordner finden und auf 755 setzen:**

   **📁 site/accounts/** ← KRITISCH für Panel-Login!
   - **Rechtsklick** → **"Info"** 
   - **Berechtigung**: `755` eingeben
   - **OK** klicken

   **📁 site/cache/** ← Für Website-Performance
   - **Rechtsklick** → **"Info"**
   - **Berechtigung**: `755` eingeben  
   - **OK** klicken

   **📁 site/sessions/** ← Für Panel bleiben eingeloggt
   - **Rechtsklick** → **"Info"**
   - **Berechtigung**: `755` eingeben
   - **OK** klicken

   **📁 media/** ← Für Thumbnail-Generierung  
   - **Rechtsklick** → **"Info"**
   - **Berechtigung**: `755` eingeben
   - **OK** klicken

3. **Dateien prüfen** (sollten automatisch 644 sein):
   - `.htaccess`, `index.php`, `robots.txt` → Falls nicht 644, ändern

4. **Sicherheits-Check** - Diese auf 644 lassen:
   - **Ganze kirby/ Ordner** → 644 (schreibgeschützt)
   - **Ganze site/ Ordner** → 644 (außer accounts, cache, sessions)
   - **Ganze content/ Ordner** → 644 (schreibgeschützt)

### Alternative: Via KAS (All-Inkl Panel):
1. **Dateimanager** im All-Inkl KAS aufrufen
2. **Rechtsklick** auf Ordner → **"Eigenschaften"**
3. **Chmod** auf `755` für Ordner, `644` für Dateien

### Kritische Berechtigungen:
```
755 - site/accounts/     # Panel-Login
755 - site/cache/        # Caching
755 - site/sessions/     # Panel-Sessions
755 - site/logs/         # Error-Logs
755 - media/             # Thumbnail-Generierung
644 - .htaccess          # Sicherheit
```

---

## 🧪 5. FUNKTIONSTEST

### 1. Website-Test:
```
✅ https://mathisneuhaus.com
   → Homepage sollte laden
   → Navigation funktioniert
   → Bilder werden angezeigt
```

### 2. API-Test:
```
✅ https://mathisneuhaus.com/api/test
   → JSON Response mit "status": "ok"
   → PHP- und Kirby-Version angezeigt
```

### 3. Panel-Test:
```
✅ https://mathisneuhaus.com/panel
   → Login-Maske erscheint
   → Mit vorhandenen Zugangsdaten einloggen
```

### 4. Sicherheits-Test:
```
❌ https://mathisneuhaus.com/kirby/        → 403 Forbidden
❌ https://mathisneuhaus.com/site/         → 403 Forbidden  
❌ https://mathisneuhaus.com/content/      → 403 Forbidden
❌ https://mathisneuhaus.com/.htaccess     → 403 Forbidden
```

---

## 📱 6. RESPONSIVE & PERFORMANCE TEST

### Mobile Test:
- **iPhone**: Safari, Chrome
- **Android**: Chrome, Firefox
- **Navigation**: Touch-Gesten funktionieren
- **Bilder**: Lazy Loading aktiv

### Performance Test:
- **Google PageSpeed**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **Pingdom**: https://tools.pingdom.com/

### Erwartete Werte:
- **Ladezeit**: < 3 Sekunden
- **PageSpeed Score**: > 80
- **Gzip**: Aktiv (durch .htaccess)

---

## 🚨 7. TROUBLESHOOTING

### Problem: "Internal Server Error" (500)
```bash
# .htaccess temporär deaktivieren
mv .htaccess .htaccess.bak

# Teste Website → funktioniert?
# Dann .htaccess Zeile für Zeile aktivieren
```

### Problem: "Panel nicht erreichbar" 🚨

**HÄUFIGSTE URSACHEN (in Reihenfolge):**

#### **1. Berechtigungen falsch (90% der Fälle)**
**Cyberduck-Fix:**
- **site/accounts/** → Rechtsklick → Info → `755` eingeben
- **site/sessions/** → Rechtsklick → Info → `755` eingeben  
- **site/cache/** → Rechtsklick → Info → `755` eingeben

#### **2. .htaccess blockiert Panel**
**Schneller Test:**
- **.htaccess temporär umbenennen** in `.htaccess-backup`
- **Panel testen**: `/panel` → Funktioniert jetzt?
- **Falls ja**: .htaccess Zeile für Zeile testen
- **Falls nein**: Berechtigungen sind das Problem

#### **3. Panel-Route blockiert**
**URL direkt testen:**
- `https://deine-domain.com/kirby/router.php` 
- **Falls Error 404**: Routing-Problem in .htaccess
- **Falls Error 403**: Berechtigungs-Problem

#### **4. Sessions-Ordner voll**
**Cyberduck-Fix:**
- **site/sessions/** öffnen
- **Alle Dateien löschen** (außer `index.html`)
- **Panel nochmal testen**

### Problem: "Bilder werden nicht angezeigt"
```bash
# Media-Ordner Berechtigungen
chmod 755 media/
chmod -R 755 media/pages/

# GD-Library in All-Inkl Panel aktivieren
```

### Problem: "API funktioniert nicht"
```bash
# URL Rewriting testen
curl -I https://mathisneuhaus.com/api/test

# Sollte 200 OK zurückgeben, nicht 404
```

---

## 📊 8. NACH DEM UPLOAD

### SEO & Analytics:
1. **Google Search Console**: Domain hinzufügen
2. **robots.txt**: Domain in Sitemap-URL anpassen (falls Sitemap erstellt)
3. **Analytics**: Code einfügen (falls gewünscht)

### Wartung:
- **Updates**: Kirby-Updates lokal testen, dann hochladen
- **Backups**: Regelmäßige Sicherungen erstellen
- **Content**: Über Panel bearbeiten oder FTP

### Performance-Monitoring:
- **Error-Logs**: `site/logs/` regelmäßig prüfen
- **Cache**: Bei Änderungen Cache leeren (`site/cache/`)
- **Thumbnails**: Bei Bildproblemen `media/` leeren

---

## 🎯 9. GO-LIVE CHECKLISTE

- [ ] ✅ Alle Dateien hochgeladen (außer Development-Files)
- [ ] ✅ Berechtigungen korrekt gesetzt
- [ ] ✅ Homepage lädt ohne Fehler
- [ ] ✅ Navigation funktioniert (alle Ordner öffnen)
- [ ] ✅ API-Endpoint antwortet (`/api/test`)
- [ ] ✅ Panel ist erreichbar (`/panel`)
- [ ] ✅ Sicherheits-Endpoints blockiert (403/404)
- [ ] ✅ Mobile Version funktioniert
- [ ] ✅ Bilder laden und Hover-Effekte funktionieren
- [ ] ✅ Performance ist akzeptabel (< 3s)
- [ ] ✅ SSL-Zertifikat aktiv (https://)
- [ ] ✅ robots.txt mit korrekter Domain

---

## 📞 10. SUPPORT

### All-Inkl Support:
- **Hotline**: 02641 91811-0
- **E-Mail**: support@all-inkl.com
- **Hilfe**: https://all-inkl.com/hilfe/

### Häufige All-Inkl spezifische Probleme:
1. **PHP-Version**: Im KAS auf mind. 8.0 einstellen
2. **Memory Limit**: Meist 512MB, sollte reichen
3. **Execution Time**: 30s Standard, bei großen Uploads erhöhen
4. **File Permissions**: Über Dateimanager im KAS einstellbar

---

## 🎉 FERTIG!

Nach erfolgreichem Upload ist deine Website unter **https://mathisneuhaus.com** live!

**Wichtiger Hinweis**: Behalte deine lokalen Dateien für zukünftige Updates und Änderungen.

---

*Diese Anleitung wurde speziell für das Mathis Neuhaus Portfolio (Version 3) mit Kirby CMS 5.0 auf All-Inkl Shared Hosting erstellt.*
