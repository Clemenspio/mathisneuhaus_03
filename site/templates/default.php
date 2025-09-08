<?php
// site/templates/default.php
// Saubere Trennung von HTML, CSS und JavaScript
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mathis Neuhaus</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <?php snippet('finder') ?>
    
    <!-- Saubere JavaScript-Einbindung -->
    <script src="<?= url('assets/js/finder.js') ?>"></script>
</body>
</html> 