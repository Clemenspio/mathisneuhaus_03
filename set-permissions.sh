#!/bin/bash

# ================================================
# MATHIS NEUHAUS PORTFOLIO - BERECHTIGUNGEN SETZEN
# ================================================
# 
# Dieses Script setzt die korrekten Berechtigungen
# für das Kirby CMS auf dem Live-Server
#
# VERWENDUNG:
# 1. Script auf Server hochladen
# 2. Ausführbar machen: chmod +x set-permissions.sh  
# 3. Ausführen: ./set-permissions.sh
#
# ================================================

echo "🚀 Setze Berechtigungen für Mathis Neuhaus Portfolio..."

# Überprüfe ob wir im richtigen Verzeichnis sind
if [ ! -f "index.php" ] || [ ! -d "kirby" ]; then
    echo "❌ FEHLER: Bitte das Script im Root-Verzeichnis der Website ausführen!"
    echo "   (Dort wo sich index.php und der kirby/ Ordner befinden)"
    exit 1
fi

echo "✅ Root-Verzeichnis gefunden"

# ================================================
# HAUPTVERZEICHNIS
# ================================================
echo "📁 Setze Root-Verzeichnis Berechtigungen..."
chmod 755 .

# ================================================
# ÖFFENTLICHE ORDNER (Web-zugänglich)
# ================================================
echo "🌐 Setze öffentliche Ordner..."

# Assets Ordner
if [ -d "assets" ]; then
    chmod -R 755 assets/
    echo "✅ assets/ → 755"
fi

# Media Ordner  
if [ -d "media" ]; then
    chmod -R 755 media/
    echo "✅ media/ → 755"
fi

# ================================================
# KIRBY SYSTEM (NICHT web-zugänglich)
# ================================================
echo "🔒 Sichere Kirby System-Ordner..."

# Kirby Core
if [ -d "kirby" ]; then
    chmod -R 644 kirby/
    echo "✅ kirby/ → 644 (geschützt)"
fi

# Site Ordner (grundsätzlich geschützt)
if [ -d "site" ]; then
    chmod -R 644 site/
    echo "✅ site/ → 644 (geschützt)"
fi

# Content Ordner
if [ -d "content" ]; then
    chmod -R 644 content/
    echo "✅ content/ → 644 (geschützt)"
fi

# ================================================
# SCHREIBBARE ORDNER für Kirby
# ================================================
echo "✏️ Setze schreibbare Ordner für Kirby..."

# Accounts (Panel-Login)
if [ -d "site/accounts" ]; then
    chmod 755 site/accounts/
    echo "✅ site/accounts/ → 755 (schreibbar)"
fi

# Cache
if [ -d "site/cache" ]; then
    chmod -R 755 site/cache/
    echo "✅ site/cache/ → 755 (schreibbar)"
fi

# Sessions
if [ -d "site/sessions" ]; then
    chmod 755 site/sessions/
    echo "✅ site/sessions/ → 755 (schreibbar)"
fi

# Logs (vollschreibbar)
if [ -d "site/logs" ]; then
    chmod 766 site/logs/
    echo "✅ site/logs/ → 766 (vollschreibbar)"
fi

# ================================================
# WICHTIGE DATEIEN
# ================================================
echo "📄 Setze Dateiberechtigungen..."

# PHP-Eingangsdate
if [ -f "index.php" ]; then
    chmod 644 index.php
    echo "✅ index.php → 644"
fi

# Webserver-Konfiguration
if [ -f ".htaccess" ]; then
    chmod 644 .htaccess
    echo "✅ .htaccess → 644"
fi

# Robots.txt
if [ -f "robots.txt" ]; then
    chmod 644 robots.txt
    echo "✅ robots.txt → 644"
fi

# Composer
if [ -f "composer.json" ]; then
    chmod 644 composer.json
    echo "✅ composer.json → 644"
fi

# ================================================
# SPEZIELLE SICHERHEITSREGELN
# ================================================
echo "🛡️ Wende spezielle Sicherheitsregeln an..."

# Alle .txt Dateien in content/ schützen
if [ -d "content" ]; then
    find content/ -name "*.txt" -exec chmod 644 {} \; 2>/dev/null
    echo "✅ Alle .txt Dateien in content/ geschützt"
fi

# Alle .md Dateien schützen
find . -name "*.md" -exec chmod 644 {} \; 2>/dev/null
echo "✅ Alle .md Dateien geschützt"

# PHP-Dateien in site/ schützen  
if [ -d "site" ]; then
    find site/ -name "*.php" -exec chmod 644 {} \; 2>/dev/null
    echo "✅ Alle .php Dateien in site/ geschützt"
fi

# ================================================
# ZUSAMMENFASSUNG
# ================================================
echo ""
echo "🎉 BERECHTIGUNGEN ERFOLGREICH GESETZT!"
echo ""
echo "📋 Zusammenfassung:"
echo "   🌐 Öffentlich zugänglich: assets/, media/"
echo "   🔒 Geschützt: kirby/, site/, content/"  
echo "   ✏️ Schreibbar für Kirby: accounts/, cache/, sessions/, logs/"
echo ""
echo "🔍 Nächste Schritte:"
echo "   1. Website im Browser testen"
echo "   2. API-Endpoint testen: /api/test"
echo "   3. Kirby Panel testen (falls benötigt): /panel"
echo ""
echo "🆘 Bei Problemen:"
echo "   - Server-Logs prüfen"
echo "   - Browser-Konsole auf Fehler prüfen"
echo "   - .htaccess temporär deaktivieren"
echo ""
echo "✅ Setup abgeschlossen!"
