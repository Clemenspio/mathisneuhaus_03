<?php
/**
 * Project Template
 * 
 * Dieses Template zeigt einzelne Projekte an.
 * Die Hover Background Images werden hier aus der Dateiliste gefiltert,
 * damit sie nicht im Finder angezeigt werden.
 */
?>

<?php snippet('header') ?>

<main class="project-page">
    <div class="project-content">
        <?php 
        // Filtere die Hover Background Images aus der Dateiliste
        // Diese Bilder haben das Template 'hover-background-image' und sollen
        // nicht in der regulären Dateiliste erscheinen
        $visibleFiles = $page->files()->filter(function($file) {
            return $file->template() !== 'hover-background-image';
        });
        ?>

        <!-- Project Title -->
        <h1><?= $page->title() ?></h1>

        <!-- Project Info -->
        <?php if($page->year()->isNotEmpty()): ?>
            <div class="project-meta">
                <span class="year"><?= $page->year() ?></span>
            </div>
        <?php endif ?>

        <!-- Project Description -->
        <?php if($page->text()->isNotEmpty()): ?>
            <div class="project-text">
                <?= $page->text()->kt() ?>
            </div>
        <?php endif ?>

        <!-- Project Files/Images -->
        <?php if($visibleFiles->count() > 0): ?>
            <div class="project-files">
                <?php foreach($visibleFiles as $file): ?>
                    <div class="file-item" data-filename="<?= $file->filename() ?>">
                        <?php if($file->type() == 'image'): ?>
                            <figure>
                                <img src="<?= $file->url() ?>" alt="<?= $file->alt() ?>">
                                <?php if($file->caption()->isNotEmpty()): ?>
                                    <figcaption><?= $file->caption() ?></figcaption>
                                <?php endif ?>
                            </figure>
                        <?php elseif($file->type() == 'video'): ?>
                            <video controls>
                                <source src="<?= $file->url() ?>" type="<?= $file->mime() ?>">
                            </video>
                        <?php else: ?>
                            <a href="<?= $file->url() ?>" class="file-link">
                                <span class="file-icon"><?= $file->extension() ?></span>
                                <span class="file-name"><?= $file->filename() ?></span>
                            </a>
                        <?php endif ?>
                    </div>
                <?php endforeach ?>
            </div>
        <?php endif ?>
    </div>
</main>

<?php snippet('footer') ?>