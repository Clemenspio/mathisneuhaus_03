<?php
// site/templates/textfile.php
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page->title() ?> - Textdatei</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <div class="document-container">
        <div class="document-header">
            <h1 class="document-title">
                <span class="document-icon">📄</span>
                <?= $page->title() ?>
            </h1>
        </div>
        
        <div class="document-content">
            <?php if ($page->content()->isNotEmpty()): ?>
                <?= $page->content()->kt() ?>
            <?php else: ?>
                <p><em>Diese Textdatei hat noch keinen Inhalt.</em></p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>