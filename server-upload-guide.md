# 🚀 Server Upload Guide - Mathis Neuhaus Portfolio

## 📋 Checkliste vor dem Upload

### 1. Dateien und Konfiguration
- [ ] ✅ `.htaccess` wurde erstellt
- [ ] ✅ `robots.txt` wurde optimiert  
- [ ] ✅ `config-production.php` wurde erstellt
- [ ] ⚠️ `site/config/config.php` durch `config-production.php` ersetzen
- [ ] 🔐 Ordnerberechtigungen setzen (siehe unten)

### 2. Wichtige Sicherheitsmaßnahmen
- [ ] Debug-Modus deaktivieren (`debug => false`)
- [ ] Whoops deaktivieren (`whoops => false`) 
- [ ] Sensible Dateien vor Upload entfernen

---

## 📂 Ordnerberechtigungen (CHMOD)

### 🔒 Sichere Berechtigungen für alle Ordner:

```bash
# Root-Verzeichnis
chmod 755 /

# Öffentliche Ordner (Web-zugänglich)
chmod 755 assets/
chmod 755 assets/css/
chmod 755 assets/js/
chmod 755 assets/fonts/
chmod 755 assets/icons/
chmod 755 media/
chmod 755 media/pages/
chmod 755 media/site/

# Kirby System (NICHT web-zugänglich)
chmod 644 kirby/
chmod 644 site/
chmod 644 content/

# Schreibbare Ordner für Kirby
chmod 755 site/accounts/
chmod 755 site/cache/
chmod 755 site/sessions/
chmod 766 site/logs/

# Media-Upload Ordner
chmod 755 media/pages/

# Wichtige Dateien
chmod 644 index.php
chmod 644 .htaccess
chmod 644 robots.txt
chmod 644 composer.json
```

### 🛡️ Zusätzliche Sicherheit:

```bash
# Alle .txt Dateien in content/ schützen
find content/ -name "*.txt" -exec chmod 644 {} \;

# Alle .md Dateien schützen  
find . -name "*.md" -exec chmod 644 {} \;

# PHP-Dateien in site/ schützen
find site/ -name "*.php" -exec chmod 644 {} \;
```

---

## 🚨 WICHTIG: Vor dem Upload entfernen

### Dateien die NICHT auf den Server gehören:
```
❌ .git/                    # Git Repository
❌ .gitignore              # Git Ignore Datei
❌ README.md               # Development Dokumentation
❌ composer.lock           # Composer Lock (kann Pfade preisgeben)
❌ site/config/config.php  # Development Config (enthält debug=true)
❌ node_modules/           # Falls vorhanden
❌ .env                    # Umgebungsvariablen
❌ *.log                   # Log-Dateien
```

### Nach Upload umbenennen:
```
✅ config-production.php → config.php
```

---

## 🌐 Server-Upload Schritte

### 1. FTP/SFTP Upload
```bash
# Via SFTP/FTP alle Dateien hochladen AUSSER:
# - .git/, README.md, composer.lock, etc.

# Nach Upload:
mv site/config/config-production.php site/config/config.php
```

### 2. Berechtigungen setzen
```bash
# Über SSH oder Hosting-Panel:
chmod -R 755 assets/ media/
chmod -R 644 kirby/ site/ content/
chmod 755 site/accounts/ site/cache/ site/sessions/
chmod 766 site/logs/
```

### 3. URLs anpassen
```bash
# In robots.txt die Domain aktualisieren:
# Sitemap: https://DEINE-DOMAIN.com/sitemap.xml
```

---

## 🔍 SEO und Auffindbarkeit

### robots.txt ✅
```
User-agent: *
Allow: /

# Blockiert sensible Bereiche  
Disallow: /kirby/
Disallow: /site/
Disallow: /content/
# ...

# Erlaubt wichtige Assets
Allow: /assets/
Allow: /media/pages/
Allow: /media/site/
```

### Zusätzliche SEO-Maßnahmen:
- [ ] Sitemap erstellen (optional)
- [ ] Google Search Console einrichten
- [ ] SSL-Zertifikat aktivieren
- [ ] Performance-Tests durchführen

---

## 🚀 Performance-Optimierungen

### Bereits aktiviert in .htaccess:
- ✅ Gzip-Komprimierung
- ✅ Browser-Caching
- ✅ Bildoptimierung
- ✅ CSS/JS Caching

### Weitere Optimierungen:
- [ ] CDN einrichten (optional)
- [ ] WebP-Bildformat testen
- [ ] Caching überwachen

---

## 🔧 Nach dem Upload testen

### Funktionstest:
1. **Homepage laden**: `https://deine-domain.com`
2. **API testen**: `https://deine-domain.com/api/test`
3. **Navigation testen**: Ordner öffnen/schließen
4. **Bilder testen**: Hover-Effekte und Overlay
5. **Mobile testen**: Responsive Design

### Sicherheitstest:
1. **Kirby-Ordner**: `https://deine-domain.com/kirby/` → Sollte 403/404 zeigen
2. **Site-Ordner**: `https://deine-domain.com/site/` → Sollte 403/404 zeigen  
3. **Content-Dateien**: `https://deine-domain.com/content/home/home.txt` → Sollte 403/404 zeigen

---

## 🆘 Troubleshooting

### Problem: "Internal Server Error"
- [ ] `.htaccess` Syntaxfehler → Datei temporär umbenennen
- [ ] PHP-Version prüfen (mind. 8.0)
- [ ] Ordnerberechtigungen prüfen

### Problem: "Kirby Panel nicht erreichbar"
- [ ] `site/accounts/` Berechtigungen (755)
- [ ] `site/sessions/` Berechtigungen (755)
- [ ] Panel-URL: `https://deine-domain.com/panel`

### Problem: "Bilder werden nicht angezeigt"
- [ ] `media/` Ordner Berechtigungen (755)
- [ ] `.htaccess` Thumbnail-Regeln prüfen
- [ ] GD-Library auf Server aktiviert

---

## 📞 Support

Bei Problemen:
1. Server-Logs prüfen (`site/logs/`)
2. Browser-Konsole auf Fehler prüfen
3. `.htaccess` temporär deaktivieren zum Testen

**Wichtig**: Nach erfolgreichem Upload die Development-Dateien lokal behalten für zukünftige Updates!
