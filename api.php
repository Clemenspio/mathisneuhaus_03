<?php
/**
 * NOTFALL API für All-Inkl
 * Falls .htaccess mod_rewrite nicht funktioniert
 */

// Definiere REQUEST_URI falls nicht gesetzt
if (!isset($_SERVER['REQUEST_URI'])) {
    $_SERVER['REQUEST_URI'] = $_SERVER['SCRIPT_NAME'];
    if (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING']) {
        $_SERVER['REQUEST_URI'] .= '?' . $_SERVER['QUERY_STRING'];
    }
}

// Kirby laden
require_once 'kirby/bootstrap.php';

// API-Pfad aus Query-Parameter extrahieren
$apiPath = $_GET['path'] ?? '';

// Erstelle künstliche REQUEST_URI für Kirby API
$_SERVER['REQUEST_URI'] = '/api/' . $apiPath;

// Kirby App starten
$kirby = kirby();

// API-Response
try {
    $response = $kirby->api()->render($_SERVER['REQUEST_URI'], 'GET');
    
    header('Content-Type: application/json');
    echo $response;
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
