<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page->title() ?> - Dokument</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <div class="document-container">
        <div class="document-header">
            <!-- Breadcrumb Navigation -->
            <div class="breadcrumb">
                <a href="<?= $site->url() ?>" class="breadcrumb-item">🏠 Start</a>
                <?php 
                $parents = $page->parents();
                foreach ($parents as $parent): ?>
                    <span class="breadcrumb-separator">/</span>
                    <a href="<?= $parent->url() ?>" class="breadcrumb-item"><?= $parent->title() ?></a>
                <?php endforeach; ?>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current"><?= $page->title() ?></span>
            </div>
            
            <h1 class="document-title">
                <span class="document-icon">📄</span>
                <?= $page->title() ?>
            </h1>
            
            <div class="document-meta">
                <?php if ($page->file_type()->isNotEmpty()): ?>
                    <strong>Typ:</strong> <?= $page->file_type() ?> • 
                <?php endif; ?>
                <strong>Erstellt:</strong> <?= $page->created()->toDate('d.m.Y H:i') ?>
                <?php if ($page->modified()->toDate() !== $page->created()->toDate()): ?>
                    • <strong>Geändert:</strong> <?= $page->modified()->toDate('d.m.Y H:i') ?>
                <?php endif; ?>
            </div>
            
            <?php if ($page->description()->isNotEmpty()): ?>
                <p><?= $page->description() ?></p>
            <?php endif; ?>
        </div>
        
        <div class="document-content">
            <?php if ($page->content()->isNotEmpty()): ?>
                <?= $page->content()->kt() ?>
            <?php else: ?>
                <p><em>Dieses Dokument hat noch keinen Inhalt.</em></p>
            <?php endif; ?>
            
            <?php if ($page->tags()->isNotEmpty()): ?>
                <div class="document-tags">
                    <strong>Tags:</strong><br>
                    <?php foreach ($page->tags()->split(',') as $tag): ?>
                        <span class="tag"><?= trim($tag) ?></span>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html> 