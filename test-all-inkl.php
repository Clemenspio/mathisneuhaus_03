<?php
echo "<h1>All-Inkl Kompatibilitätstest</h1>";

echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Kirby kompatibel:</strong> " . (version_compare(phpversion(), '8.0.0', '>=') ? '✅ JA' : '❌ NEIN') . "</p>";

// Test ob Kirby Ordner existiert
echo "<p><strong>Kirby Ordner:</strong> " . (is_dir('kirby') ? '✅ Vorhanden' : '❌ Fehlt') . "</p>";
echo "<p><strong>Index.php:</strong> " . (file_exists('index.php') ? '✅ Vorhanden' : '❌ Fehlt') . "</p>";

// Test ob mod_rewrite funktioniert
echo "<p><strong>mod_rewrite:</strong> ";
if (function_exists('apache_get_modules')) {
    echo in_array('mod_rewrite', apache_get_modules()) ? '✅ Aktiv' : '❌ Inaktiv';
} else {
    echo "Unbekannt (Shared Hosting)";
}
echo "</p>";

// Memory Limit
echo "<p><strong>Memory Limit:</strong> " . ini_get('memory_limit') . "</p>";

// Versuche Kirby zu laden
echo "<p><strong>Kirby Test:</strong> ";
try {
    if (file_exists('kirby/bootstrap.php')) {
        include 'kirby/bootstrap.php';
        echo "✅ Kirby Bootstrap erfolgreich";
    } else {
        echo "❌ kirby/bootstrap.php fehlt";
    }
} catch (Exception $e) {
    echo "❌ Fehler: " . $e->getMessage();
}
echo "</p>";
?>
