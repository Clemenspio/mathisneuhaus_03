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

## 📁 3. UPLOAD VIA FTP/SFTP

### Option A: FileZilla (Empfohlen)
1. **Verbindung**: Server, Username, Passwort eingeben
2. **Lokaler Ordner**: Wähle dein mathisneuhaus_03 Verzeichnis
3. **Server-Ordner**: Navigiere zu deinem Webroot (meist `/` oder `/html/`)
4. **Upload**: Alle Dateien außer den ❌ markierten hochladen

### Option B: Terminal/Command Line
```bash
# Via SFTP
sftp username@mathisneuhaus.com

# Alle Dateien hochladen (ohne ausgeschlossene)
put -r assets/
put -r content/
put -r kirby/
put -r site/
put .htaccess
put composer.json
put index.php
put robots.txt
```

### ⏱️ Upload-Zeit
- **Geschätzte Dauer**: 15-30 Minuten
- **Größe**: Ca. 50-80 MB (abhängig von Content)

---

## 🔐 4. BERECHTIGUNGEN SETZEN

### Via SSH (falls verfügbar):
```bash
# Zum Webroot wechseln
cd /html/  # oder dein Webroot-Pfad

# Script ausführbar machen
chmod +x set-permissions.sh

# Berechtigungen setzen
./set-permissions.sh
```

### Via KAS (All-Inkl Panel):
1. **Dateimanager** aufrufen
2. **Ordner-Berechtigungen** auf 755 setzen:
   - `assets/`, `media/`, `site/accounts/`, `site/cache/`, `site/sessions/`
3. **Datei-Berechtigungen** auf 644 setzen:
   - `.htaccess`, `index.php`, `robots.txt`, `composer.json`

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

### Problem: "Panel nicht erreichbar"
```bash
# Berechtigungen prüfen
chmod 755 site/accounts/
chmod 755 site/sessions/
chmod 755 site/cache/

# Sessions leeren
rm -rf site/sessions/*
```

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
