<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page->title() ?> - Link</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <div class="link-container">
        <div class="link-header">
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
            
            <h1 class="link-title">
                <span class="link-icon">🔗</span>
                <?= $page->title() ?>
            </h1>
            
            <div class="link-meta">
                <?php if ($page->link_type()->isNotEmpty()): ?>
                    <strong>Typ:</strong> <?= $page->link_type() ?> • 
                <?php endif; ?>
                <strong>Erstellt:</strong> <?= $page->created()->toDate('d.m.Y H:i') ?>
                <?php if ($page->modified()->toDate() !== $page->created()->toDate()): ?>
                    • <strong>Geändert:</strong> <?= $page->modified()->toDate('d.m.Y H:i') ?>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="link-content">
            <?php if ($page->url()->isNotEmpty()): ?>
                <div class="link-display">
                    <a href="<?= $page->url() ?>" 
                       class="link-button"
                       <?= $page->open_in_new_tab()->isTrue() ? 'target="_blank"' : '' ?>>
                        🔗 Link öffnen
                    </a>
                    <div class="link-url"><?= $page->url() ?></div>
                </div>
                
                <div class="link-info">
                    <?php if ($page->description()->isNotEmpty()): ?>
                        <div class="link-description">
                            <strong>Beschreibung:</strong><br>
                            <?= $page->description() ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="link-description">
                        <strong>Einstellungen:</strong><br>
                        <?= $page->open_in_new_tab()->isTrue() ? 'Öffnet in neuem Tab' : 'Öffnet im gleichen Tab' ?>
                    </div>
                    
                    <?php if ($page->tags()->isNotEmpty()): ?>
                        <div class="link-tags">
                            <strong>Tags:</strong><br>
                            <?php foreach ($page->tags()->split(',') as $tag): ?>
                                <span class="tag"><?= trim($tag) ?></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <div class="link-display">
                    <p><em>Keine URL angegeben.</em></p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html> 