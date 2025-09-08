<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $page->title() ?> - Bild</title>
    <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
</head>
<body>
    <div class="image-container">
        <div class="image-header">
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
            
            <h1 class="image-title">
                <span class="image-icon">🖼️</span>
                <?= $page->title() ?>
            </h1>
            
            <div class="image-meta">
                <?php if ($page->image_type()->isNotEmpty()): ?>
                    <strong>Typ:</strong> <?= $page->image_type() ?> • 
                <?php endif; ?>
                <strong>Erstellt:</strong> <?= $page->created()->toDate('d.m.Y H:i') ?>
                <?php if ($page->modified()->toDate() !== $page->created()->toDate()): ?>
                    • <strong>Geändert:</strong> <?= $page->modified()->toDate('d.m.Y H:i') ?>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="image-content">
            <?php if ($page->image()->isNotEmpty()): ?>
                <div class="image-display">
                    <?php $image = $page->image()->toFile(); ?>
                    <img src="<?= $image->url() ?>" 
                         srcset="<?= $image->srcset([320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560]) ?>"
                         alt="<?= $page->alt_text()->isNotEmpty() ? $page->alt_text() : $page->title() ?>"
                         title="<?= $page->title() ?>"
                         loading="lazy">
                </div>
                
                <div class="image-info">
                    <?php if ($page->description()->isNotEmpty()): ?>
                        <div class="image-description">
                            <strong>Beschreibung:</strong><br>
                            <?= $page->description() ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($page->alt_text()->isNotEmpty()): ?>
                        <div class="image-description">
                            <strong>Alt-Text:</strong><br>
                            <?= $page->alt_text() ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="image-description">
                        <strong>Datei:</strong> <?= $image->name() ?><br>
                        <strong>Größe:</strong> <?= $image->niceSize() ?><br>
                        <strong>Dimensionen:</strong> <?= $image->width() ?> × <?= $image->height() ?> px
                    </div>
                    
                    <?php if ($page->tags()->isNotEmpty()): ?>
                        <div class="image-tags">
                            <strong>Tags:</strong><br>
                            <?php foreach ($page->tags()->split(',') as $tag): ?>
                                <span class="tag"><?= trim($tag) ?></span>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <div class="image-display">
                    <p><em>Kein Bild zugewiesen.</em></p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html> 